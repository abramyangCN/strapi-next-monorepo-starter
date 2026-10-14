#!/bin/bash

# UI 前端部署脚本
# 使用方法: ./scripts/deploy-ui.sh

set -e

# Configuration
SERVER="abramyang@47.101.66.250"
REMOTE_PATH="~/strapi-next-monorepo-starter/apps/ui"
LOCAL_BUILD_PATH="./apps/ui/.next"
LOCAL_PUBLIC_PATH="./apps/ui/public"

GREEN='\033[0;32m'
NC='\033[0m'

echo "🚀 Starting deployment of UI build to $SERVER..."

# 构建项目
echo "🔨 Building UI project..."
pnpm --filter ui build

# 上传 .next 构建目录
echo "📦 Uploading .next build directory..."
rsync -avz --delete \
  "$LOCAL_BUILD_PATH/" \
  "$SERVER:$REMOTE_PATH/.next/"

# 上传 public 目录
echo "📁 Uploading public directory..."
rsync -avz --delete \
  "$LOCAL_PUBLIC_PATH/" \
  "$SERVER:$REMOTE_PATH/public/"

# 在服务器上重启 PM2
echo "🔄 Restarting PM2 on server..."
ssh "$SERVER" << 'ENDSSH'
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  cd ~/strapi-next-monorepo-starter/apps/ui
  pm2 restart ui || pm2 start --name ui pnpm -- start
  pm2 save
ENDSSH

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "📝 后续操作:"
echo "  - 查看日志: ssh $SERVER 'source ~/.nvm/nvm.sh && pm2 logs ui'"
echo "  - 查看状态: ssh $SERVER 'source ~/.nvm/nvm.sh && pm2 status'"
