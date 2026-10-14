#!/bin/bash

# Strapi 后端部署脚本
# 使用方法: ./scripts/deploy-strapi.sh [环境]
# 环境选项: production (默认)

set -e

# ============================================
# 配置区域 - 根据实际情况修改
# ============================================

ENVIRONMENT="${1:-production}"

SERVER="abramyang@47.101.66.250"
REMOTE_PATH="~/strapi-next-monorepo-starter/apps/strapi"
REMOTE_ROOT="~/strapi-next-monorepo-starter"

LOCAL_STRAPI_PATH="./apps/strapi"
BACKUP_DIR="./backups/deploy-$(date +%Y%m%d_%H%M%S)"

BACKUP_BEFORE_DEPLOY=true
BUILD_LOCALLY=true
RESTART_METHOD="pm2"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ============================================
# 函数定义
# ============================================

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_dependencies() {
    log_info "检查依赖..."
    if ! command -v rsync &> /dev/null; then
        log_error "rsync 未安装，请安装: brew install rsync"
        exit 1
    fi
    if ! command -v ssh &> /dev/null; then
        log_error "ssh 未安装"
        exit 1
    fi
    log_info "依赖检查完成"
}

build_locally() {
    if [ "$BUILD_LOCALLY" = true ]; then
        log_info "构建 @repo/shared-data..."
        cd "./packages/shared-data"
        pnpm build
        cd - > /dev/null

        log_info "开始本地构建 Strapi..."
        cd "$LOCAL_STRAPI_PATH"
        if [ ! -d "node_modules" ]; then
            log_info "安装依赖..."
            pnpm install
        fi
        log_info "构建中..."
        pnpm build
        cd - > /dev/null
        log_info "本地构建完成"
    fi
}

create_backup() {
    if [ "$BACKUP_BEFORE_DEPLOY" = true ]; then
        log_info "创建部署前备份..."
        mkdir -p "$BACKUP_DIR"
        if [ -f "$LOCAL_STRAPI_PATH/.env" ]; then
            cp "$LOCAL_STRAPI_PATH/.env" "$BACKUP_DIR/.env.backup"
        fi
        log_info "备份保存在: $BACKUP_DIR"
    fi
}

upload_files() {
    log_info "上传文件到服务器..."

    if [ -d "$LOCAL_STRAPI_PATH/dist" ]; then
        log_info "上传 dist 目录..."
        rsync -avz --delete \
            --exclude 'node_modules' \
            --exclude '.env*' \
            --exclude 'database' \
            --exclude '*.log' \
            "$LOCAL_STRAPI_PATH/dist/" \
            "$SERVER:$REMOTE_PATH/dist/"
    else
        log_error "构建产物 dist 目录不存在！"
        exit 1
    fi

    if [ -d "$LOCAL_STRAPI_PATH/.strapi" ]; then
        log_info "上传 .strapi 目录..."
        rsync -avz --delete \
            "$LOCAL_STRAPI_PATH/.strapi/" \
            "$SERVER:$REMOTE_PATH/.strapi/"
    fi

    log_info "上传 @repo/shared-data dist..."
    rsync -avz --delete \
        "./packages/shared-data/dist/" \
        "$SERVER:$REMOTE_ROOT/packages/shared-data/dist/"

    log_info "上传配置文件..."
    rsync -avz \
        "$LOCAL_STRAPI_PATH/package.json" \
        "$LOCAL_STRAPI_PATH/tsconfig.json" \
        "$SERVER:$REMOTE_PATH/"

    log_info "上传 config 和源代码..."
    rsync -avz --delete \
        "$LOCAL_STRAPI_PATH/config/" \
        "$SERVER:$REMOTE_PATH/config/"

    rsync -avz --delete \
        --exclude '*.test.ts' \
        --exclude '*.test.js' \
        "$LOCAL_STRAPI_PATH/src/" \
        "$SERVER:$REMOTE_PATH/src/"

    rsync -avz --delete \
        "$LOCAL_STRAPI_PATH/types/" \
        "$SERVER:$REMOTE_PATH/types/"

    log_info "上传 public 目录..."
    rsync -avz \
        --exclude 'uploads' \
        "$LOCAL_STRAPI_PATH/public/" \
        "$SERVER:$REMOTE_PATH/public/"

    log_info "文件上传完成"
}

deploy_on_server() {
    log_info "在服务器上执行部署..."

    ssh "$SERVER" << ENDSSH
        set -e

        export NVM_DIR="\$HOME/.nvm"
        [ -s "\$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh"

        cd $REMOTE_PATH

        echo " 重启 PM2 服务..."
        pm2 restart strapi || pm2 start --name strapi pnpm -- start
        pm2 save
        echo "✅ PM2 重启完成"

        echo "✅ 服务器部署完成"
ENDSSH
}

verify_deployment() {
    log_info "验证部署状态..."
    ssh "$SERVER" << ENDSSH
        export NVM_DIR="\$HOME/.nvm"
        [ -s "\$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh"
        pm2 list | grep strapi
ENDSSH
    log_info "部署验证完成"
}

# ============================================
# 主流程
# ============================================

main() {
    echo "========================================"
    echo "🚀 Strapi 后端部署脚本"
    echo "========================================"
    echo "环境: $ENVIRONMENT"
    echo "服务器: $SERVER"
    echo "目标路径: $REMOTE_PATH"
    echo "重启方式: $RESTART_METHOD"
    echo "========================================"
    echo ""

    read -p "确认要部署到 $ENVIRONMENT 环境吗? (yes/no): " CONFIRM
    if [ "$CONFIRM" != "yes" ]; then
        log_warn "部署已取消"
        exit 0
    fi

    check_dependencies
    create_backup
    build_locally
    upload_files
    deploy_on_server
    verify_deployment

    echo ""
    echo "========================================"
    log_info "✅ 部署完成!"
    echo "========================================"
    echo ""
    echo "📝 后续操作:"
    echo "  - 查看日志: ssh $SERVER 'source ~/.nvm/nvm.sh && pm2 logs strapi'"
    echo "  - 查看状态: ssh $SERVER 'source ~/.nvm/nvm.sh && pm2 status'"
}

main "$@"
