import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { createUser, findUserByEmail, findUserByUsername } from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { generateTokenWithRSA } from "../utils/jwt.js";
import { sendVerificationEmail } from "../utils/emailService.js"; // 需要创建邮件服务
import { generateCouponCode } from "../utils/common.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const getUsersFromDB = async () => {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
};

export const registerUser = async (username, email, password, role) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AppError("User already exists", 400, "USER_EXISTS");
  }
  const existingUserByName = await findUserByUsername(username);
  if (existingUserByName) {
    throw new AppError("User already exists", 400, "USER_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // 生成邮箱验证token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1小时后过期
  // 生成优惠码
  const couponCode = generateCouponCode();
  console.log("Generated coupon code for new user:", couponCode);

  const user = {
    username,
    email,
    password_hash: hashedPassword,
    role: role || "user",
    licenseType: "trial",
    registrationDate: new Date(),
    licenseStartDate: new Date(),
    licenseExpirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    licenseState: "suspended", // 邮箱验证前设为 suspended
    emailVerified: false, // 添加邮箱验证状态
    verificationToken: verificationToken,
    verificationTokenExpires: verificationTokenExpires,
    couponCode: couponCode, // 保存优惠码
  };

  const userId = await createUser(user);
  if (!userId) {
    throw new AppError("Failed to create user", 500, "USER_CREATION_FAILED");
  }

  // 发送验证邮件
  // try {
  //   const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`

  //   await sendVerificationEmail(email, username, verificationUrl)

  //   console.log('User created successfully, verification email sent:', userId)
  // } catch (emailError) {
  //   console.error('Failed to send verification email:', emailError.message)
  //   // 邮件发送失败不应该阻止用户注册，但要记录错误
  //   console.warn('User created but verification email failed to send')
  // }

  console.log("User created successfully", userId);

  return {
    userId,
    message: "Registration successful",
  };
};

// 新增邮箱验证函数
export const verifyEmail = async (token) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE verificationToken = ? AND verificationTokenExpires > ?", [
    token,
    new Date(),
  ]);

  if (rows.length === 0) {
    throw new AppError("Invalid or expired verification token", 400, "INVALID_TOKEN");
  }

  const user = rows[0];

  // 更新用户状态
  await pool.query(
    "UPDATE users SET emailVerified = ?, license_state = ?, verificationToken = NULL, verificationTokenExpires = NULL WHERE email = ?",
    [true, "active", user.email]
  );

  // 构建token载荷
  // const tokenPayload = {
  //   email: user.email,
  //   password: user.password_hash,
  //   licenseType: user.licenseType || 'trial',
  //   licenseStartDate: user.license_start_date,
  //   licenseExpirationDate: user.licenseExpirationDate,
  //   licenseState: user.license_state,
  //   role: user.role || "user",
  //   username: user.user_name,
  // }
  let expiration = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 默认30天试用期
  if (expiration > new Date(user.license_expiration_date).getTime()) {
    expiration = new Date(user.license_expiration_date); // 如果传入的许可过期时间更早，则使用它
  }
  console.log(expiration); // 2026-01-03
  expiration = new Date(user.license_expiration_date);

  const typeDict = {
    trial: "1",
    silver: "2",
    gold: "3",
    platinum: "4",
  };
  const expirationShort =
    expiration.getFullYear().toString().slice(-2) +
    (expiration.getMonth() + 1).toString().padStart(2, "0") +
    expiration.getDate().toString().padStart(2, "0"); // 格式: 260125
  const tokenPayload = expirationShort + "|" + user.user_name + "|" + typeDict[user.license_type]; // 260125|391052034@qq.com|platinum

  // 使用RSA私钥生成token
  const licenseToken = await generateTokenWithRSA(tokenPayload);
  console.log("Generated license token verify email:", licenseToken);
  // 更新用户状态
  await pool.query("UPDATE users SET license_token = ? WHERE email = ?", [licenseToken, user.email]);
  return {
    message: "Email verified successfully",
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
    },
    licenseToken,
  };
};

// 新增重发验证邮件函数
export const resendVerificationEmail = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  if (user.emailVerified) {
    throw new AppError("Email already verified", 400, "EMAIL_ALREADY_VERIFIED");
  }

  // 生成新的验证token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

  await pool.query("UPDATE users SET verificationToken = ?, verificationTokenExpires = ? WHERE email = ?", [
    verificationToken,
    verificationTokenExpires,
    email,
  ]);

  // 发送验证邮件
  //  const verificationUrl = `${ 'http://localhost:3000'}/verify-email?token=${verificationToken}`
  const verificationUrl = `${
    process.env.FRONTEND_URL || "http://localhost:3000"
  }/verify-email?token=${verificationToken}`;
  await sendVerificationEmail(email, user.username, verificationUrl);

  return { message: "Verification email resent successfully" };
};

export const loginUser = async (username, email, password) => {
  // console.log("loginUser called with username:", username);
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("User not found", 400, "USER_NOT_FOUND");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 400, "INVALID_CREDENTIALS");
  }

  const token = jwt.sign({ username: user.user_name, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  return { token, role: user.role, returnedUsername: user.user_name, email: user.email };
};

export const loginUserByUsername = async (username, email, password) => {
  console.log("loginUser called with username:", username);
  const user = await findUserByUsername(username);
  if (!user) {
    throw new AppError("User not found", 400, "USER_NOT_FOUND");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 400, "INVALID_CREDENTIALS");
  }

  const token = jwt.sign({ username: username, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  console.log(user.email);
  return { token, role: user.role, username: username, useremail: user.email };
};

export const getUserInfoByEmail = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }
  // 移除敏感信息
  const { password_hash, ...safeUserInfo } = user;
  return safeUserInfo;
};

export const updateUserInfoByEmail = async (email, updateData) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  // 更新用户信息
  const updatedUser = { ...user, ...updateData };
  const [result] = await pool.query("UPDATE users SET ? WHERE email = ?", [updatedUser, email]);

  if (result.affectedRows === 0) {
    throw new AppError("Failed to update user information", 500, "UPDATE_FAILED");
  }

  return updatedUser;
};

// 添加用户积分
export const addUserCredits = async (email, inviteeEmail, credits, reason = "manual") => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const currentCredits = user.credits || 0;
    const newCredits = currentCredits + credits;

    // 更新用户积分
    await pool.execute("UPDATE users SET credits = ? WHERE email = ?", [newCredits, email]);

    const inviteeUser = await findUserByEmail(inviteeEmail);
    if (!inviteeUser) {
      throw new Error("Invitee not found");
    }
    const currentInviteeCredits = inviteeUser.credits || 0;
    const newInviteeCredits = currentInviteeCredits + credits;

    // 更新被邀请人积分
    await pool.execute("UPDATE users SET credits = ? WHERE email = ?", [newInviteeCredits, inviteeEmail]);

    // 记录积分变动日志（可选）
    // await pool.execute(
    //   `INSERT INTO credit_logs (user_email, credit_change, reason, created_at)
    //    VALUES (?, ?, ?, NOW())`,
    //   [email, credits, reason]
    // )

    console.log(`Added ${credits} credits to user ${email}. New balance: ${newCredits}`);

    return {
      email,
      previousCredits: currentCredits,
      addedCredits: credits,
      newCredits: newCredits,
      reason,
    };
  } catch (error) {
    console.error("Error adding user credits:", error);
    throw error;
  }
};

// 获取用户积分
export const getUserCredits = async (email) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return {
      email,
      totalPoints: user.credits || 0,
      lastUpdated: user.updated_at || user.registration_date,
      couponCode: user.couponCode || null,
    };
  } catch (error) {
    console.error("Error fetching user credits:", error);
    throw error;
  }
};

// 延长用户许可证有效期
export const extendLicenseExpiration = async (email, extensionData) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    const { license_expiration_date } = extensionData;

    // 格式化日期为 YYYY-MM-DD 格式
    const formattedDate = license_expiration_date.toISOString().split("T")[0];

    // 更新用户的许可证过期时间
    const result = await pool.execute("UPDATE users SET license_expiration_date = ? WHERE email = ?", [
      formattedDate,
      email,
    ]);

    console.log(`Extended license expiration for user ${email} to ${formattedDate}`);

    return {
      email,
      newExpirationDate: formattedDate,
      previousExpirationDate: user.license_expiration_date,
    };
  } catch (error) {
    console.error("Error extending license expiration:", error);
    throw error;
  }
};
