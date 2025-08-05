import { pool } from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createUser, findUserByEmail } from '../models/user.model.js'
import { AppError } from '../utils/AppError.js'  // 确保导入 AppError
import { generateTokenWithRSA } from '../utils/jwt.js'  // 确保导入 generateTokenWithRSA

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

export const getUsersFromDB = async () => {
  const [rows] = await pool.query('SELECT * FROM users')
  return rows
}

export const registerUser = async (username,email, password, role) => {
  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    throw new AppError('User already exists', 400, 'USER_EXISTS')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = {
    username,
    email,
    password_hash: hashedPassword,
    role: role || 'user', // 默认角色为'user'
    licenseType: 'trial', // 默认许可类型
    registrationDate: new Date(),
    licenseStartDate: new Date(),
    licenseExpirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 默认90天试用期
    licenseState: 'active', // 默认许可状态为'active'
  }
  const userId = await createUser(user)
  if (!userId) {
    throw new AppError('Failed to create user', 500, 'USER_CREATION_FAILED')
  }
  console.log('User created successfully:', userId)
  // 构建token载荷
  const tokenPayload = {
    email: email,
    password: hashedPassword,
    licenseType: user.licenseType || 'trial',
    licenseExpirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 默认30天试用期
    licenseState: user.licenseState || 'active',
    role: user.role || 'user',
    username: username,
  };
  //使用RSA私钥生成token
  const licenseToken = generateTokenWithRSA(tokenPayload);
  return userId
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
