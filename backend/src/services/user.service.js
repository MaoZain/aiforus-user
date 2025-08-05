import { pool } from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { createUser, findUserByEmail } from '../models/user.model.js'
import { AppError } from '../utils/AppError.js'
import { generateTokenWithRSA } from '../utils/jwt.js'
import { sendVerificationEmail } from '../utils/emailService.js'  // 需要创建邮件服务

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

export const getUsersFromDB = async () => {
  const [rows] = await pool.query('SELECT * FROM users')
  return rows
}

export const registerUser = async (username, email, password, role) => {
  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    throw new AppError('User already exists', 400, 'USER_EXISTS')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  
  // 生成邮箱验证token
  const verificationToken = crypto.randomBytes(32).toString('hex')
  const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000) // 1小时后过期
  
  const user = {
    username,
    email,
    password_hash: hashedPassword,
    role: role || 'user',
    licenseType: 'trial',
    registrationDate: new Date(),
    licenseStartDate: new Date(),
    licenseExpirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    licenseState: 'suspended', // 邮箱验证前设为 suspended
    emailVerified: false, // 添加邮箱验证状态
    verificationToken: verificationToken,
    verificationTokenExpires: verificationTokenExpires
  }
  
  const userId = await createUser(user)
  if (!userId) {
    throw new AppError('Failed to create user', 500, 'USER_CREATION_FAILED')
  }
  
  // 发送验证邮件
  try {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`
    
    // 根据环境选择发送方式
    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_USER) {
      await sendVerificationEmailDev(email, username, verificationUrl)
    } else {
      await sendVerificationEmail(email, username, verificationUrl)
    }
    
    console.log('User created successfully, verification email sent:', userId)
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError.message)
    // 邮件发送失败不应该阻止用户注册，但要记录错误
    console.warn('User created but verification email failed to send')
  }
  
  console.log('User created successfully, verification email sent:', userId)
  
  return { 
    userId, 
    message: 'Registration successful. Please check your email to verify your account.' 
  }
}

// 新增邮箱验证函数
export const verifyEmail = async (token) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE verificationToken = ? AND verificationTokenExpires > ?',
    [token, new Date()]
  )
  
  if (rows.length === 0) {
    throw new AppError('Invalid or expired verification token', 400, 'INVALID_TOKEN')
  }
  
  const user = rows[0]
  
  // 更新用户状态
  await pool.query(
    'UPDATE users SET emailVerified = ?, license_state = ?, verificationToken = NULL, verificationTokenExpires = NULL WHERE email = ?',
    [true, 'active', user.email]
  )
  
  // 构建token载荷
  const tokenPayload = {
    email: user.email,
    password: user.password_hash,
    licenseType: user.licenseType || 'trial',
    licenseExpirationDate: user.licenseExpirationDate,
    licenseState: 'active',
    role: user.role || 'user',
    username: user.username,
  }
  
  // 使用RSA私钥生成token
  const licenseToken = generateTokenWithRSA(tokenPayload)
  
  return { 
    message: 'Email verified successfully', 
    user: {
      username: user.username,
      email: user.email,
      role: user.role
    },
    licenseToken
  }
}

// 新增重发验证邮件函数
export const resendVerificationEmail = async (email) => {
  const user = await findUserByEmail(email)
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND')
  }
  
  if (user.emailVerified) {
    throw new AppError('Email already verified', 400, 'EMAIL_ALREADY_VERIFIED')
  }
  
  // 生成新的验证token
  const verificationToken = crypto.randomBytes(32).toString('hex')
  const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000)
  
  await pool.query(
    'UPDATE users SET verificationToken = ?, verificationTokenExpires = ? WHERE email = ?',
    [verificationToken, verificationTokenExpires, email]
  )
  
  // 发送验证邮件
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`
  await sendVerificationEmail(email, user.username, verificationUrl)
  
  return { message: 'Verification email resent successfully' }
}

export const loginUser = async (username, email, password) => {
  // console.log("loginUser called with username:", username);
  const user = await findUserByEmail(email)
  if (!user) {
    throw new AppError('User not found', 400, 'USER_NOT_FOUND')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash)
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 400, 'INVALID_CREDENTIALS')
  }

  const token = jwt.sign({ username:username, email:email}, JWT_SECRET, { expiresIn: '1h' })
  return { token, role: user.role, username:username, email:email }
}

export const getUserInfoByEmail = async (email) => {
  const user = await findUserByEmail(email)
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND')
  }
  // 移除敏感信息
  const { password_hash, ...safeUserInfo } = user
  return safeUserInfo
}

export const updateUserInfoByEmail = async (email, updateData) => {
  const user = await findUserByEmail(email)
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND')
  }

  // 更新用户信息
  const updatedUser = { ...user, ...updateData }
  const [result] = await pool.query('UPDATE users SET ? WHERE email = ?', [updatedUser, email])
  
  if (result.affectedRows === 0) {
    throw new AppError('Failed to update user information', 500, 'UPDATE_FAILED')
  }

  return updatedUser
}
