// controllers/user.controller.js
import { getUsersFromDB, registerUser, loginUser, getUserInfoByEmail, updateUserInfoByEmail } from '../services/user.service.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { findUserByEmail } from '../models/user.model.js'


// 获取所有用户
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getUsersFromDB()
  res.success(users, 'User list fetched successfully')
})

// 获取用户详细信息
export const getUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.params

  const userInfo = await getUserInfoByEmail(email)
  if (!userInfo) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND')
  }

  // 移除敏感信息
  const { password_hash, ...safeUserInfo } = userInfo
  
  res.success(safeUserInfo, 'User information fetched successfully')
})


export const getLicenseByEmail = asyncHandler(async (req, res) => {
  const { email } = req.params

  const userInfo = await findUserByEmail(email)
  if (!userInfo) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND')
  }

  // 返回license相关信息
  const license = {
    licenseType: userInfo.license_type || 'free',
    licenseStart: userInfo.license_start_date || null,
    licenseExpire: userInfo.license_expiration_date || null,
    licenseState: userInfo.license_state || null,
  }
  
  res.success(license, 'license information fetched successfully')
})


export const updateProfileByEmail = asyncHandler(async (req, res) => {
  const {email, age_range, education, first_name,last_name,occupation } = req.body

  // 更新用户信息
  const updatedUser = await updateUserInfoByEmail(email, { first_name,last_name,age_range, occupation, education })
  
  if (!updatedUser) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND')
  }

  res.success(updatedUser, 'User profile updated successfully')
})


// 注册新用户
export const register = asyncHandler(async (req, res) => {
  const { username, email ,password, role } = req.body

  if (!username || !email || !password) {
    throw new AppError('Username, email and password are required', 400, 'MISSING_CREDENTIALS')
  }

  const userId = await registerUser(username, email, password, role || 'user')
  res.success({ userId }, 'User registered successfully')
})

// 登录
export const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body

  const { token, role } = await loginUser(username, email, password)
  res.success({ token, role, username, email }, 'Login successful')
})


