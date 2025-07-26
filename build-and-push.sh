#!/bin/bash

# AiForus Docker 镜像构建和推送脚本

set -e

# 配置变量 - 请修改为您的 Docker Hub 用户名
DOCKER_USERNAME="maozain"  # 请修改为您的 Docker Hub 用户名
IMAGE_PREFIX="aiforus"

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    log_error "Docker 未安装，请先安装 Docker"
    exit 1
fi

log_info "开始构建 AiForus 镜像..."

# 构建后端镜像
log_info "构建后端镜像..."
docker build -t ${DOCKER_USERNAME}/${IMAGE_PREFIX}-backend:latest ./backend

# 构建前端镜像
log_info "构建前端镜像..."
docker build -t ${DOCKER_USERNAME}/${IMAGE_PREFIX}-frontend:latest ./frontend

log_success "镜像构建完成！"

# 询问是否推送到 Docker Hub
read -p "是否要推送镜像到 Docker Hub? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "登录 Docker Hub..."
    docker login
    
    log_info "推送后端镜像..."
    docker push ${DOCKER_USERNAME}/${IMAGE_PREFIX}-backend:latest
    
    log_info "推送前端镜像..."
    docker push ${DOCKER_USERNAME}/${IMAGE_PREFIX}-frontend:latest
    
    log_success "镜像推送完成！"
    
    echo ""
    echo "🎉 构建和推送完成！"
    echo "后端镜像: ${DOCKER_USERNAME}/${IMAGE_PREFIX}-backend:latest"
    echo "前端镜像: ${DOCKER_USERNAME}/${IMAGE_PREFIX}-frontend:latest"
    echo ""
    echo "现在您可以将 docker-compose.prod.yml 和相关配置文件上传到服务器进行部署。"
else
    log_info "跳过推送步骤"
    echo ""
    echo "🎉 本地构建完成！"
    echo "后端镜像: ${DOCKER_USERNAME}/${IMAGE_PREFIX}-backend:latest"
    echo "前端镜像: ${DOCKER_USERNAME}/${IMAGE_PREFIX}-frontend:latest"
fi
