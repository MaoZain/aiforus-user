#!/bin/bash

# AiForus 服务器端部署脚本

set -e

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
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

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# 检查必要工具
check_requirements() {
    log_info "检查部署环境..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    if ! docker compose version &> /dev/null; then
        log_error "docker compose 未安装，请先安装 docker compose"
        exit 1
    fi
    
    log_success "环境检查通过"
}

# 检查配置文件
check_config() {
    if [ ! -f ".env.prod" ]; then
        log_warning "未找到 .env.prod 文件，将使用默认配置"
        log_warning "强烈建议创建 .env.prod 文件并配置安全的密码"
    else
        log_info "使用 .env.prod 配置文件"
        export $(cat .env.prod | grep -v '#' | xargs)
    fi
}

# 部署函数
deploy() {
    log_info "开始部署 AiForus 到生产环境..."
    
    # 停止现有服务
    log_info "停止现有服务..."
    docker compose -f docker-compose.prod.yml down || true
    
    # 拉取最新镜像
    log_info "拉取最新镜像..."
    docker compose -f docker-compose.prod.yml pull
    
    # 启动服务
    log_info "启动服务..."
    docker compose -f docker-compose.prod.yml up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 30
    
    # 检查服务状态
    log_info "检查服务状态..."
    docker compose -f docker-compose.prod.yml ps
    
    # 显示访问信息
    echo ""
    log_success "部署完成！"
    echo "🌐 服务访问地址："
    echo "   前端: http://$(hostname -I | awk '{print $1}') 或 http://your-domain.com"
    echo "   后端: http://$(hostname -I | awk '{print $1}'):3001"
    echo ""
    echo "📝 查看日志："
    echo "   docker compose -f docker-compose.prod.yml logs -f"
}

# 更新函数
update() {
    log_info "更新 AiForus 应用..."
    
    # 拉取最新镜像
    log_info "拉取最新镜像..."
    docker compose -f docker-compose.prod.yml pull
    
    # 重启服务
    log_info "重启服务..."
    docker compose -f docker-compose.prod.yml up -d
    
    log_success "更新完成！"
}

# 停止函数
stop() {
    log_info "停止 AiForus 服务..."
    docker-compose -f docker-compose.prod.yml down
    log_success "服务已停止"
}

# 显示状态
status() {
    echo "=== AiForus 服务状态 ==="
    docker-compose -f docker-compose.prod.yml ps
}

# 显示日志
logs() {
    docker-compose -f docker-compose.prod.yml logs -f
}

# 显示帮助
show_help() {
    cat << EOF
AiForus 生产环境部署脚本

用法:
    $0 [命令]

命令:
    deploy      部署应用（首次部署）
    update      更新应用（拉取最新镜像并重启）
    stop        停止所有服务
    status      查看服务状态
    logs        查看服务日志
    help        显示帮助信息

示例:
    # 首次部署
    $0 deploy

    # 更新应用
    $0 update

    # 查看状态
    $0 status
EOF
}

# 主函数
main() {
    case "${1:-deploy}" in
        deploy)
            check_config
            deploy
            ;;
        update)
            check_config
            update
            ;;
        stop)
            stop
            ;;
        status)
            status
            ;;
        logs)
            logs
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
