import Stripe from "stripe";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { updateUserLicenseType } from "../models/user.model.js"; // 假设您有用户模型

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // 确保在 .env 文件中配置 STRIPE_SECRET_KEY

// 定义产品类型及其价格
const productCatalog = {
  Gold: { name: "Gold Membership", price: 49900 }, // 价格以美分为单位
  Silver: { name: "Silver Membership", price: 19900 },
  Platinum: { name: "Platinum Membership", price: 99900 },
};

export const createCheckoutSession = asyncHandler(async (req, res) => {
  console.log("createCheckoutSession");
  const { type, successUrl, cancelUrl, email, couponCode } = req.body;
  console.log({ type, successUrl, cancelUrl, email, couponCode });

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
      couponCode: couponCode || "", // 将优惠券代码存储到 metadata
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
  const couponCode = session.metadata.couponCode;
  const product = productCatalog[licenseType];
  // 检查支付状态
  if (session.payment_status === "paid") {
    res.success({ status: "success", session }, "Payment was successful");
    // 更新数据库中的 license type
    const updateSuccess = await updateUserLicenseType(email, licenseType, couponCode, product.price);
    if (!updateSuccess) {
      throw new AppError("Failed to update license type", 500, "UPDATE_FAILED");
    }
  } else {
    res.success({ status: "pending", session }, "Payment is not completed yet");
  }
});

// 新增：创建捐款 Checkout Session（固定每次捐款 0.01 USD）
export const createDonationSession = asyncHandler(async (req, res) => {
  const { successUrl, cancelUrl, email } = req.body;

  if (!email) {
    throw new AppError("email is required", 400, "MISSING_EMAIL");
  }

  // 固定捐款金额 0.01 USD => 1 美分
  const donationAmountCents = 50;

  const lineItems = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Donation",
          description: "Thank you for your support",
        },
        unit_amount: donationAmountCents,
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url:
      successUrl ||
      (process.env.FRONTEND_URL
        ? `${process.env.FRONTEND_URL}/donation-success`
        : "http://localhost:3000/donation-success"),
    cancel_url:
      cancelUrl ||
      (process.env.FRONTEND_URL
        ? `${process.env.FRONTEND_URL}/donation-cancel`
        : "http://localhost:3000/donation-cancel"),
    metadata: {
      email,
      donation: "true",
    },
  });

  res.success({ sessionId: session.id, url: session.url }, "Donation session created successfully");
});
