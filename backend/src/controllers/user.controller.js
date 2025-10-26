// controllers/user.controller.js
import {
  getUsersFromDB,
  registerUser,
  loginUser,
  loginUserByUsername,
  getUserInfoByEmail,
  updateUserInfoByEmail,
  verifyEmail,
  resendVerificationEmail,
  getUserCredits,
  extendLicenseExpiration,
} from "../services/user.service.js";
import { pool } from "../config/db.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { findUserByEmail, findUserByUsername } from "../models/user.model.js";
import { generateTokenWithRSA, verifyTokenWithRSA, generateToken } from "../utils/jwt.js"; // 确保导入 generateTokenWithRSA

// 获取所有用户
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getUsersFromDB();
  res.success(users, "User list fetched successfully");
});

// 获取用户详细信息
export const getUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.params;

  const userInfo = await getUserInfoByEmail(email);
  if (!userInfo) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  // 移除敏感信息
  const { password_hash, ...safeUserInfo } = userInfo;

  res.success(safeUserInfo, "User information fetched successfully");
});

export const getLicenseByEmail = asyncHandler(async (req, res) => {
  const { email } = req.params;

  const userInfo = await findUserByEmail(email);
  if (!userInfo) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  // 处理 license_token，删除 JWT header 部分
  let processedLicenseCode = null;
  if (userInfo.license_token) {
    processedLicenseCode = userInfo.license_token.split('.').slice(1).join('.');
  }

  // 返回license相关信息
  const license = {
    licenseType: userInfo.license_type || "trial",
    licenseStart: userInfo.license_start_date || null,
    licenseExpire: userInfo.license_expiration_date || null,
    licenseState: userInfo.license_state || null,
    licenseCode: processedLicenseCode,
  };

  res.success(license, "license information fetched successfully");
});

export const updateProfileByEmail = asyncHandler(async (req, res) => {
  const { email, age_range, education, first_name, last_name, occupation } = req.body;

  // 更新用户信息
  const updatedUser = await updateUserInfoByEmail(email, { first_name, last_name, age_range, occupation, education });

  if (!updatedUser) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  res.success(updatedUser, "User profile updated successfully");
});

// 注册新用户
export const register = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    throw new AppError("Username, email and password are required", 400, "MISSING_CREDENTIALS");
  }

  const userId = await registerUser(username, email, password, role || "user");
  res.success({ userId }, "User registered successfully");
});

// 登录
export const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  ``;
  if (!username) {
    const { token, role, returnedUsername } = await loginUser(username, email, password);
    res.success({ token, role, username: returnedUsername, email }, "Login successful");
  } else {
    const { token, role, useremail } = await loginUserByUsername(username, email, password);
    res.success({ token, role, username, email: useremail }, "Login successful");
  }
});

// update license code
export const updateLicenseCode = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log("Updating license code for:", email);
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }
  // console.log(user);
  let expiration = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 默认30天试用期
  if (expiration > new Date(user.license_expiration_date).getTime()) {
    expiration = new Date(user.license_expiration_date); // 如果传入的许可过期时间更早，则使用它
  }
  console.log(expiration); // 2026-01-03
  expiration = new Date(user.license_expiration_date);
  // const tokenPayload = {
  //   email: user.email,
  //   // password: user.password_hash, // 注意：这里使用的是密码哈希值，实际应用中请确保安全性
  //   licenseStartDate: user.license_start_date,
  //   licenseType: user.license_type,
  //   licenseExpirationDate: expiration,
  //   licenseState: user.license_state,
  //   // role: user.role || "user",
  //   username: user.user_name,
  // };
  const typeDict = {
    trial: "1",
    silver: "2",
    gold: "3",
    platinum: "4"
  }
  const expirationShort = expiration.getFullYear().toString().slice(-2) + 
                         (expiration.getMonth() + 1).toString().padStart(2, '0') + 
                         expiration.getDate().toString().padStart(2, '0'); // 格式: 260125
  const tokenPayload = expirationShort + "|" + user.user_name + "|" + typeDict[user.license_type]; // 260125|391052034@qq.com|platinum
  
  console.log(tokenPayload);
  //使用RSA私钥生成token
  const licenseToken = await generateTokenWithRSA(tokenPayload);
  console.log("Generated license token update code:", licenseToken);
  await pool.query("UPDATE users SET license_token = ? WHERE email = ?", [licenseToken, user.email]);
  
  // 删除JWT header部分 - 使用正确的方法
  const tokenWithoutHeader = licenseToken.split('.').slice(1).join('.');
  console.log("License token without header:", tokenWithoutHeader);
  res.success(tokenWithoutHeader, "License code updated successfully");
});

export const verifyEmailToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError("No token provided", 400, "TOKEN_REQUIRED");
  }
  try {
    const result = await verifyEmail(token);
    res.success(result, "Email verified successfully");
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500, error.code || "EMAIL_VERIFICATION_FAILED");
  }
});

// 重发验证邮件
export const resendVerificationEmailToken = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required", 400, "EMAIL_REQUIRED");
  }

  const result = await resendVerificationEmail(email);
  res.success(result, "Verification email resent successfully");
});

export const generateInviteLink = asyncHandler(async (req, res) => {
  const { inviteeEmail, inviterEmail } = req.body;

  if (!inviteeEmail || !inviterEmail) {
    throw new AppError("Both invitee email and inviter email are required", 400, "EMAIL_REQUIRED");
  }

  // 检查被邀请人是否已经注册
  const existingInvitee = await findUserByEmail(inviteeEmail);
  if (existingInvitee) {
    throw new AppError("User already registered", 400, "USER_ALREADY_EXISTS");
  }

  // 创建邀请令牌，包含邀请人和被邀请人信息
  const invitePayload = {
    inviterEmail,
    inviteeEmail,
    timestamp: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天过期
    type: "invite",
  };

  // 使用RSA加密生成令牌
  const inviteToken = await generateToken(invitePayload);
  console.log("Generated invite token:", inviteToken);

  // 生成邀请链接
  const inviteUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/register?invite=${inviteToken}`;
  console.log("Generated invite URL:", inviteUrl);

  // 新增：写入 coupon_history 表
  try {
    await pool.query("INSERT INTO coupon_history (inviterEmail, inviteeEmail, state, memo) VALUES (?, ?, ?, ?)", [
      inviterEmail,
      inviteeEmail,
      "inactive",
      "",
    ]);
    console.log("Inserted coupon_history record:", inviterEmail, inviteeEmail);
  } catch (e) {
    console.error("Failed to insert coupon_history record", e);
  }

  res.success(
    {
      inviteUrl,
      inviterEmail,
      inviteeEmail,
      expiresAt: new Date(invitePayload.expiresAt).toISOString(),
    },
    "Invite link generated successfully"
  );
});

export const handleInviteRegistration = asyncHandler(async (req, res) => {
  const { inviteToken, username, email, password } = req.body;

  if (!inviteToken || !username || !email || !password) {
    throw new AppError("Invite token, username, email and password are required", 400, "MISSING_REQUIRED_FIELDS");
  }

  try {
    // 解密邀请令牌
    const inviteData = await verifyTokenWithRSA(inviteToken);
    console.log("Invite data:", inviteData);

    if (!inviteData) {
      throw new AppError("Invalid invite token", 400, "INVALID_INVITE_TOKEN");
    }

    // 检查令牌是否过期
    if (Date.now() > inviteData.expiresAt) {
      throw new AppError("Invite link has expired", 400, "INVITE_EXPIRED");
    }

    const { inviterEmail, inviteeEmail } = inviteData;

    // 验证邀请人仍然存在
    const inviter = await findUserByEmail(inviterEmail);
    if (!inviter) {
      throw new AppError("Inviter not found", 404, "INVITER_NOT_FOUND");
    }

    // 检查被邀请人是否已经注册
    const existingInvitee = await findUserByEmail(inviteeEmail);
    if (existingInvitee) {
      throw new AppError("User already registered", 400, "USER_ALREADY_EXISTS");
    }
    if (inviteeEmail !== email) {
      throw new AppError("Email does not match the invited email", 400, "EMAIL_MISMATCH");
    }
    // 注册新用户
    const newUserId = await registerUser(username, inviteeEmail, password, "user");

    // 给邀请人有效期延长30天
    const inviterCurrentExpiration = inviter.license_expiration_date
      ? new Date(inviter.license_expiration_date)
      : new Date();
    const inviterBaseDate = Math.max(inviterCurrentExpiration.getTime(), Date.now());
    const inviterNewExpiration = new Date(inviterBaseDate + 30 * 24 * 60 * 60 * 1000);

    await extendLicenseExpiration(inviterEmail, { license_expiration_date: inviterNewExpiration });

    // 给被邀请人也延长30天许可证
    const newInvitee = await findUserByEmail(inviteeEmail);
    let inviteeNewExpirationDate = null;

    if (newInvitee) {
      const inviteeCurrentExpiration = newInvitee.license_expiration_date
        ? new Date(newInvitee.license_expiration_date)
        : new Date();
      const inviteeBaseDate = Math.max(inviteeCurrentExpiration.getTime(), Date.now());
      const inviteeNewExpiration = new Date(inviteeBaseDate + 30 * 24 * 60 * 60 * 1000);

      await extendLicenseExpiration(inviteeEmail, { license_expiration_date: inviteeNewExpiration });
      inviteeNewExpirationDate = inviteeNewExpiration.toISOString().split("T")[0];
    }

    // 新增：将该邀请记录状态更新为 active 并写入 memo
    try {
      await pool.query(
        "UPDATE coupon_history SET state = ?, memo = ? WHERE inviterEmail = ? AND inviteeEmail = ?",
        ["active", "Extended by one month", inviterEmail, inviteeEmail]
      );
      console.log("coupon_history state updated to active with memo:", inviterEmail, inviteeEmail);
    } catch (e) {
      console.error("Failed to update coupon_history state/memo", e);
    }

    res.success(
      {
        userId: newUserId,
        inviterEmail,
        inviteeEmail,
        licenseExtended: true,
        inviterNewExpirationDate: inviterNewExpiration.toISOString().split("T")[0],
        inviteeNewExpirationDate: inviteeNewExpirationDate,
      },
      "Registration successful, both inviter and invitee license extended by 30 days"
    );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to process invite registration", 500, "INVITE_REGISTRATION_FAILED");
  }
});

// 获取用户积分
export const getUserPoints = asyncHandler(async (req, res) => {
  const { email } = req.params;

  if (!email) {
    throw new AppError("Email is required", 400, "EMAIL_REQUIRED");
  }

  try {
    const pointsData = await getUserCredits(email);
    res.success(pointsData, "User points fetched successfully");
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to fetch user points", 500, "POINTS_FETCH_FAILED");
  }
});

export const getCouponHistoryByEmail = asyncHandler(async (req, res) => {
  const { email }  = req.params
  console.log(email);

  if (!email) {
    throw new AppError("Email is required", 400, "EMAIL_REQUIRED");
  }

  try {
    const [rows] = await pool.query(
      "SELECT inviterEmail, inviteeEmail, state, memo FROM coupon_history WHERE inviterEmail = ?",
      [email]
    );
    res.success(rows, "Coupon history fetched successfully");
  } catch (err) {
    throw new AppError("Failed to fetch coupon history", 500, "COUPON_HISTORY_FETCH_FAILED");
  }
});

export const transferPoints = asyncHandler(async (req, res) => {
  const { senderEmail, recipientEmail, amount } = req.body;
  console.log("Transfer Points:", { senderEmail, recipientEmail, amount });
  if (!senderEmail || !recipientEmail || !amount) {
    throw new AppError("Sender email, recipient email and amount are required", 400, "MISSING_REQUIRED_FIELDS");
  }
  if (amount <= 0) {
    throw new AppError("Transfer amount must be greater than zero", 400, "INVALID_AMOUNT");
  }
  if (senderEmail === recipientEmail) {
    throw new AppError("Cannot transfer points to yourself", 400, "SAME_SENDER_RECIPIENT");
  }

  try {
    // 检查发送者和接收者是否存在
    const sender = await findUserByEmail(senderEmail);
    const recipient = await findUserByEmail(recipientEmail);
    if (!sender) {
      throw new AppError("Sender not found", 404, "SENDER_NOT_FOUND");
    }
    if (!recipient) {
      throw new AppError("Recipient not found", 404, "RECIPIENT_NOT_FOUND");
    }

    // 检查发送者积分是否足够
    const senderCredits = sender.credits || 0;
    if (senderCredits < amount) {
      throw new AppError("Insufficient points", 400, "INSUFFICIENT_POINTS");
    }

    // 执行积分转账
    await pool.query("UPDATE users SET credits = credits - ? WHERE email = ?", [amount, senderEmail]);
    await pool.query("UPDATE users SET credits = COALESCE(credits, 0) + ? WHERE email = ?", [amount, recipientEmail]);

    // 记录转账历史
    await pool.query(
      "INSERT INTO coupon_history (inviterEmail, inviteeEmail, state, memo) VALUES (?, ?, ?,?)",
      [senderEmail, recipientEmail, "active", `Transferred ${amount} points`]
    );

    res.success(null, `Successfully transferred ${amount} points to ${recipientEmail}`);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error("Transfer points error:", error);
    throw new AppError("Failed to transfer points", 500, "POINTS_TRANSFER_FAILED");
  }
});

export const getStatistics = asyncHandler(async (req, res) => {
  try {
    // 获取用户总数
    const [totalUsersRows] = await pool.query("SELECT COUNT(*) AS totalUsers FROM users");
    const totalUsers = totalUsersRows[0]?.totalUsers || 0;

    // 获取活跃许可证数量 (license_state = 'active')
    const [activeLicensesRows] = await pool.query("SELECT COUNT(*) AS activeLicenses FROM users WHERE license_state = 'active'");
    const activeLicenses = activeLicensesRows[0]?.activeLicenses || 0;

    // 获取付费许可证数量 (license_type != 'Trial')
    const [paidLicensesRows] = await pool.query("SELECT COUNT(*) AS paidLicenses FROM users WHERE license_type != 'Trial' AND license_type IS NOT NULL");
    const paidLicenses = paidLicensesRows[0]?.paidLicenses || 0;

    // 获取所有用户数据
    const [usersRows] = await pool.query(`
      SELECT 
        user_name as username,
        email,
        license_type as licenseType,
        license_expiration_date as expireDate,
        registration_date as registrationDate,
        license_state as licenseState,
        credits
      FROM users 
      ORDER BY registration_date DESC
    `);

    res.success({ 
      totalUsers, 
      activeLicenses, 
      paidLicenses,
      users: usersRows || []
    }, "Statistics and user data fetched successfully");
  } catch (error) {
    console.error("Failed to fetch statistics:", error);
    throw new AppError("Failed to fetch statistics", 500, "STATS_FETCH_FAILED");
  }
});
