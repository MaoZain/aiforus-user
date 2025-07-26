# 使用官方 Node.js 运行时作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用源代码
COPY . .

# 暴露端口（根据你的应用配置调整）
EXPOSE 3000

# 创建日志目录
RUN mkdir -p logs

# 启动应用
CMD ["npm", "run", "dev"]
