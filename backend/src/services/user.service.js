import { pool } from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createUser, findUserByEmail } from '../models/user.model.js'
import { AppError } from '../utils/AppError.js'  // 确保导入 AppError

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
  const userId = await createUser(username, email, hashedPassword, role)
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
