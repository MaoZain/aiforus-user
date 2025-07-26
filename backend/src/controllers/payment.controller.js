import Stripe from "stripe";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { updateUserLicenseType } from "../models/user.model.js"; // 假设您有用户模型

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // 确保在 .env 文件中配置 STRIPE_SECRET_KEY

// 定义产品类型及其价格
const productCatalog = {
  Gold: { name: "Gold Membership", price: 5000 }, // 价格以美分为单位
  Silver: { name: "Silver Membership", price: 3000 },
  Platinum: { name: "Platinum Membership", price: 1000 },
};

export const createCheckoutSession = asyncHandler(async (req, res) => {
  console.log("createCheckoutSession");
  const { type, successUrl, cancelUrl, email } = req.body;

  // 验证 type 和 userId 是否存在并有效
  if (!type || !productCatalog[type]) {
    throw new AppError("Invalid or missing product type", 400, "INVALID_PRODUCT_TYPE");
  }
  if (!email) {
    throw new AppError("email is required", 400, "MISSING_EMAIL");
  }

  // 根据 type 构建 line_items
  const product = productCatalog[type];
  const lineItems = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price, // Stripe 以最小货币单位（如美分）计价
      },
      quantity: 1,
    },
  ];

  // 创建 Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: successUrl || "http://localhost:3000/success",
    cancel_url: cancelUrl || "http://localhost:3000/cancel",
    metadata: {
      email, // 将用户 ID 存储到 metadata
      licenseType: type, // 将 license type 存储到 metadata
    },
  });

  res.success({ sessionId: session.id, url: session.url }, "Checkout session created successfully");
});

export const verifySession = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  // 验证 sessionId 是否存在
  if (!sessionId) {
    throw new AppError("Session ID is required", 400, "MISSING_SESSION_ID");
  }

  // 调用 Stripe API 获取会话详情
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  console.log("payment session", session);
  const email = session.metadata.email;
  const licenseType = session.metadata.licenseType;
  // 更新数据库中的 license type
  const updateSuccess = await updateUserLicenseType(email, licenseType);
  if (!updateSuccess) {
    throw new AppError("Failed to update license type", 500, "UPDATE_FAILED");
  }

  // 检查支付状态
  if (session.payment_status === "paid") {
    res.success({ status: "success", session }, "Payment was successful");
  } else {
    res.success({ status: "pending", session }, "Payment is not completed yet");
  }
});
