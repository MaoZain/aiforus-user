import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Import routes
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import paymentRoutes from './routes/payment.route.js';
import dictRoutes from './routes/dict.route.js'

// Import middlewares
import { errorHandler } from './middlewares/error.middleware.js'
import { logger } from './middlewares/logger.js'
import { notFound } from './middlewares/notFound.js'
import { successHandler } from './middlewares/successResponse.js'
import { errorLogger } from './middlewares/errorLogger.js'

import { setupSwagger } from './config/swagger.js'

dotenv.config()
const app = express()

// 基础中间件
app.use(cors())
app.use(express.json())

// 日志中间件
app.use(logger)

// Swagger 文档
setupSwagger(app)

// 业务中间件
app.use(successHandler)

// 路由
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/payment', paymentRoutes) 
app.use('/api/dict', dictRoutes)

// 错误日志中间件
app.use(errorLogger);

// 错误处理中间件
app.use(errorHandler)
app.use(notFound)

export default app
