#!/bin/bash

# AiForus Docker 部署脚本

echo "🚀 开始部署 AiForus 应用..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 docker-compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose 未安装，请先安装 docker-compose"
    exit 1
fi

# 停止并删除现有容器
echo "🛑 停止现有容器..."
docker-compose down

# 检查是否需要重建
if [ "$1" = "--build" ] || [ "$1" = "-b" ]; then
    echo "🔨 构建并启动容器..."
    docker-compose up --build -d
else
    echo "🚀 启动容器（使用缓存）..."
    docker-compose up -d
fi

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 检查容器状态
echo "📊 检查容器状态..."
docker-compose ps

echo "✅ 部署完成！"
echo ""
echo "🌐 服务访问地址："
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:3001"
echo ""
echo "📝 数据库连接信息："
echo "   主机: localhost:3306"
echo "   用户名: aiforus"
echo "   密码: pass1234"
echo "   数据库: aiforusdb"
echo ""
echo "🔧 常用命令："
echo "   查看日志: docker-compose logs -f [service_name]"
echo "   重启服务: docker-compose restart [service_name]"
echo "   停止服务: docker-compose down"
echo "   重新构建: docker-compose up --build -d"
