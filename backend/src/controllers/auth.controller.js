import jwt from 'jsonwebtoken';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import {findUserByEmail} from '../models/user.model.js'; // 假设您有用户模型

export const validateToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('No token provided', 400, 'TOKEN_REQUIRED');
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('Decoded token:', decoded);
    // 检查用户是否存在
    const user = await findUserByEmail(decoded.email);
    
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // 检查token是否过期 (可选，因为jwt.verify已经检查了)
    if (decoded.exp < Date.now() / 1000) {
      throw new AppError('Token has expired', 401, 'TOKEN_EXPIRED');
    }

    // 返回用户信息
    res.success({
      token: token,
      username: user.user_name,
      email: user.email,
      role: user.role || 'user',
    }, 'Token is valid');
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token', 401, 'INVALID_TOKEN');
    }
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token has expired', 401, 'TOKEN_EXPIRED');
    }
    throw error; // 抛出其他错误
  }
});