#!/bin/bash

# AiForus Docker Compose v2 部署脚本

echo "🚀 开始部署 AiForus 应用（Docker Compose v2）..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose v2 是否安装
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose v2 未安装或未启用，请先安装或启用 Docker Compose v2"
    echo "💡 提示：Docker Compose v2 通常包含在 Docker Desktop 中"
    echo "   或者运行: docker compose version 检查版本"
    exit 1
fi

echo "ℹ️  使用的 Docker Compose 版本："
docker compose version

# 停止并删除现有容器
echo "🛑 停止现有容器..."
docker compose down

# 检查是否需要重建
if [ "$1" = "--build" ] || [ "$1" = "-b" ]; then
    echo "🔨 构建并启动容器..."
    docker compose up --build -d
else
    echo "🚀 启动容器（使用缓存）..."
    docker compose up -d
fi

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 检查容器状态
echo "📊 检查容器状态..."
docker compose ps

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
echo "🔧 常用命令（Docker Compose v2）："
echo "   查看日志: docker compose logs -f [service_name]"
echo "   重启服务: docker compose restart [service_name]"
echo "   停止服务: docker compose down"
echo "   重新构建: docker compose up --build -d"
echo "   查看状态: docker compose ps"
echo "   进入容器: docker compose exec [service_name] /bin/bash"
echo ""
echo "💡 使用方法："
echo "   普通启动: ./deploy-docker2.sh"
echo "   重新构建: ./deploy-docker2.sh --build"