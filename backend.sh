#!/bin/bash

# 创建项目目录
mkdir backend && cd backend

# 初始化 package.json
npm init -y

# 安装核心依赖
npm install express mysql2 cors dotenv

# 创建目录结构
mkdir -p src/{config,controllers,services,models,routes,middlewares,utils}

# 创建基本文件
touch .env
cat <<EOT > .env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=testdb
EOT

# db.js
cat <<EOT > src/config/db.js
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
})
EOT

# user.route.js
cat <<EOT > src/routes/user.route.js
import express from 'express'
import { getAllUsers } from '../controllers/user.controller.js'

const router = express.Router()
router.get('/', getAllUsers)
export default router
EOT

# user.controller.js
cat <<EOT > src/controllers/user.controller.js
import { getUsersFromDB } from '../services/user.service.js'

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getUsersFromDB()
    res.json(users)
  } catch (error) {
    next(error)
  }
}
EOT

# user.service.js
cat <<EOT > src/services/user.service.js
import { pool } from '../config/db.js'

export const getUsersFromDB = async () => {
  const [rows] = await pool.query('SELECT * FROM users')
  return rows
}
EOT

# error.middleware.js
cat <<EOT > src/middlewares/error.middleware.js
export const errorHandler = (err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal Server Error' })
}
EOT

# app.js
cat <<EOT > src/app.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import { errorHandler } from './middlewares/error.middleware.js'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', userRoutes)
app.use(errorHandler)

export default app
EOT

# server.js
cat <<EOT > src/server.js
import app from './app.js'

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(\`🚀 Server running at http://localhost:\${PORT}\`)
})
EOT

# 修改 package.json 启动脚本
npx json -I -f package.json -e 'this.type="module"; this.scripts={"dev":"node src/server.js"}'

echo "✅ 后端项目初始化完成，运行："
echo "   cd backend && npm run dev"
