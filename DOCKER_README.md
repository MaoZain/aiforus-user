# AiForus Docker 部署指南

这个项目包含了完整的 Docker 容器化解决方案，包括前端、后端和数据库。

## 📋 系统要求

- Docker Engine 20.10 或更高版本
- Docker Compose 2.0 或更高版本
- 至少 2GB 可用磁盘空间

## 🚀 快速开始

### 1. 克隆项目并进入目录
```bash
cd /Users/maozain/projects/aiforus/aiforus_user
```

### 2. 配置环境变量
编辑 `backend/.env` 文件，设置你的实际配置：
```bash
# 生产环境建议修改这些值
JWT_SECRET=your_secure_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 3. 一键部署
```bash
chmod +x deploy.sh
# 首次部署或需要重建时
./deploy.sh --build

# 后续运行（使用缓存，更快）
./deploy.sh
```

或者手动执行：
```bash
# 首次构建
docker-compose up --build -d

# 后续运行（使用缓存）
docker-compose up -d
```

## 🌐 服务访问

部署完成后，你可以通过以下地址访问各个服务：

- **前端应用**: http://localhost
- **后端API**: http://localhost:3001
- **MySQL数据库**: localhost:3306

## 📊 服务架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │     MySQL       │
│   (Vue.js)      │◄──►│   (Node.js)     │◄──►│   (Database)    │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠 常用命令

### 查看容器状态
```bash
docker-compose ps
```

### 查看服务日志
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### 重启服务
```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart backend
```

### 停止服务
```bash
docker-compose down
```

### 重新构建并启动
```bash
docker-compose up --build -d
```

### 进入容器
```bash
# 进入后端容器
docker-compose exec backend sh

# 进入数据库容器
docker-compose exec mysql mysql -u aiforus -p aiforusdb
```

## 🗄 数据库配置

### 连接信息
- **主机**: localhost (容器间通信使用 `mysql`)
- **端口**: 3306
- **数据库**: aiforusdb
- **用户名**: aiforus
- **密码**: pass1234
- **Root密码**: rootpassword123

### 数据持久化
数据库数据存储在 Docker volume `mysql_data` 中，即使容器重启也不会丢失数据。

## � 构建优化

### 构建缓存
Docker 会智能缓存构建层，避免不必要的重复构建：

- **首次构建**：使用 `./deploy.sh --build` 或 `docker-compose up --build -d`
- **后续运行**：使用 `./deploy.sh` 或 `docker-compose up -d`（更快，使用缓存）

### 强制重建
如果代码或依赖发生变化，需要重建：
```bash
# 重建所有服务
./deploy.sh --build

# 重建特定服务
docker-compose build backend
docker-compose up -d
```

## �🔧 开发模式

如果你想在开发模式下运行（代码热重载），可以使用以下配置：

### 后端开发模式
```bash
# 仅启动数据库
docker-compose up mysql -d

# 在本地运行后端
cd backend
npm install
npm run dev
```

### 前端开发模式
```bash
cd frontend
npm install
npm run dev
```

## 📝 环境变量说明

### 后端环境变量 (`backend/.env`)
```env
NODE_ENV=production          # 运行环境
DB_HOST=mysql               # 数据库主机
DB_USER=aiforus             # 数据库用户
DB_PASSWORD=pass1234        # 数据库密码
DB_NAME=aiforusdb           # 数据库名
JWT_SECRET=your_jwt_secret   # JWT密钥
STRIPE_SECRET_KEY=sk_xxx     # Stripe密钥
PORT=3001                   # 后端端口
```

## 🔒 安全建议

1. **生产环境部署前**：
   - 修改所有默认密码
   - 使用强JWT密钥
   - 配置HTTPS
   - 设置防火墙规则

2. **数据库安全**：
   - 修改默认密码
   - 限制访问IP
   - 定期备份数据

## 🐛 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :80
   lsof -i :3001
   lsof -i :3306
   ```

2. **权限问题**
   ```bash
   # 确保deploy.sh有执行权限
   chmod +x deploy.sh
   ```

3. **容器启动失败**
   ```bash
   # 查看详细错误信息
   docker-compose logs
   ```

4. **数据库连接失败**
   ```bash
   # 检查数据库容器状态
   docker-compose exec mysql mysql -u root -p -e "SHOW DATABASES;"
   ```

### 清理和重置

```bash
# 停止并删除所有容器
docker-compose down

# 删除所有镜像
docker-compose down --rmi all

# 删除数据卷（注意：这会删除所有数据）
docker-compose down -v
```

## 📞 支持

如果遇到问题，请检查：
1. Docker 和 docker-compose 版本
2. 系统资源使用情况
3. 网络连接状态
4. 日志文件中的错误信息
