#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"

DEPLOY_SERVER="${DEPLOY_SERVER:-abramyang@47.101.66.250}"
REMOTE_BASE_DIR="${REMOTE_BASE_DIR:-shantec}"
REMOTE_REPO_DIR="${REMOTE_REPO_DIR:-$REMOTE_BASE_DIR/repo}"
REPO_URL="${REPO_URL:-$(git -C "$REPO_ROOT" remote get-url origin)}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-$(git -C "$REPO_ROOT" branch --show-current)}"
INSTALL_ON_SERVER="${INSTALL_ON_SERVER:-true}"
UI_PM2_NAME="${UI_PM2_NAME:-shantec-ui}"
STRAPI_PM2_NAME="${STRAPI_PM2_NAME:-shantec-strapi}"
ENV_SOURCE_DIR="${ENV_SOURCE_DIR:-$HOME/.deploy-secrets/$REMOTE_BASE_DIR}"

TARGET="all"
SKIP_BUILD=false
SKIP_RESTART=false
SYNC_ENV=false
SHARED_BUILT=false

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

usage() {
  cat <<'EOF'
Usage:
  ./scripts/deploy-shantec.sh [ui|strapi|all] [--sync-env] [--skip-build] [--skip-restart] [--no-install]

Environment variables:
  DEPLOY_SERVER      SSH target, default: abramyang@47.101.66.250
  REMOTE_BASE_DIR    Remote folder under $HOME, default: shantec
  REMOTE_REPO_DIR    Remote repo path under $HOME, default: shantec/repo
  REPO_URL           Git remote URL cloned on server, default: local origin URL
  DEPLOY_BRANCH      Git branch deployed on server, default: current local branch
  INSTALL_ON_SERVER  true/false, default: true
  UI_PM2_NAME        PM2 process name for UI, default: shantec-ui
  STRAPI_PM2_NAME    PM2 process name for Strapi, default: shantec-strapi
  ENV_SOURCE_DIR     Local secrets root, default: ~/.deploy-secrets/shantec

Remote layout:
  ~/shantec/repo
  ~/shantec/repo/apps/ui
  ~/shantec/repo/apps/strapi

Notes:
  - Server keeps a full git checkout.
  - Source code sync happens via git on the server.
  - Build artifacts are produced locally and rsynced into the server repo.
  - Remote env files are preserved unless --sync-env is passed.
EOF
}

log_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

run_from_root() {
  (
    cd "$REPO_ROOT"
    "$@"
  )
}

sync_dir() {
  local source_dir="$1"
  local target_dir="$2"
  local label="$3"

  log_info "Syncing $label..."
  rsync -az --delete --progress --stats \
    "$source_dir" \
    "$DEPLOY_SERVER:$target_dir"
}

ui_env_file() {
  echo "$ENV_SOURCE_DIR/ui/.env.local"
}

strapi_env_file() {
  echo "$ENV_SOURCE_DIR/strapi/.env"
}

load_env_file() {
  local env_file="$1"

  if [[ ! -f "$env_file" ]]; then
    log_error "Env file not found: $env_file"
    exit 1
  fi

  set -a
  # shellcheck disable=SC1090
  source "$env_file"
  set +a
}

check_local_dependencies() {
  local required=(git pnpm rsync ssh)

  for command_name in "${required[@]}"; do
    if ! command -v "$command_name" >/dev/null 2>&1; then
      log_error "Missing required command: $command_name"
      exit 1
    fi
  done
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      ui|strapi|all)
        TARGET="$1"
        ;;
      --skip-build)
        SKIP_BUILD=true
        ;;
      --sync-env)
        SYNC_ENV=true
        ;;
      --skip-restart)
        SKIP_RESTART=true
        ;;
      --no-install)
        INSTALL_ON_SERVER=false
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        log_error "Unknown argument: $1"
        usage
        exit 1
        ;;
    esac
    shift
  done
}

build_shared_packages() {
  if [[ "$SHARED_BUILT" == true ]]; then
    return
  fi

  log_info "Building shared workspace packages..."
  run_from_root pnpm --filter @repo/shared-data build
  run_from_root pnpm --filter @repo/design-system build
  SHARED_BUILT=true
}

build_ui() {
  build_shared_packages
  log_info "Building Next.js UI locally..."
  (
    if [[ "$SYNC_ENV" == true ]]; then
      load_env_file "$(ui_env_file)"
    fi
    cd "$REPO_ROOT"
    pnpm --filter @repo/ui build
  )
}

build_strapi() {
  build_shared_packages
  log_info "Building Strapi locally..."
  (
    if [[ "$SYNC_ENV" == true ]]; then
      load_env_file "$(strapi_env_file)"
    fi
    cd "$REPO_ROOT"
    pnpm --filter @repo/strapi build
  )
}

prepare_remote_repo() {
  log_info "Syncing git repository on server..."

  ssh "$DEPLOY_SERVER" "set -euo pipefail
    export NVM_DIR=\"\$HOME/.nvm\"
    if [ -s \"\$NVM_DIR/nvm.sh\" ]; then
      . \"\$NVM_DIR/nvm.sh\"
    fi
    mkdir -p \"\$HOME/$REMOTE_BASE_DIR\"
    if [ ! -d \"\$HOME/$REMOTE_REPO_DIR/.git\" ]; then
      git clone --branch \"$DEPLOY_BRANCH\" \"$REPO_URL\" \"\$HOME/$REMOTE_REPO_DIR\"
    else
      cd \"\$HOME/$REMOTE_REPO_DIR\"
      git remote set-url origin \"$REPO_URL\"
      git fetch origin \"$DEPLOY_BRANCH\"
      git checkout \"$DEPLOY_BRANCH\" || git checkout -b \"$DEPLOY_BRANCH\" \"origin/$DEPLOY_BRANCH\"
      git pull --ff-only origin \"$DEPLOY_BRANCH\"
    fi"
}

sync_build_artifacts() {
  log_info "Syncing local build artifacts into remote repo..."

  case "$TARGET" in
    ui)
      sync_dir \
        "$REPO_ROOT/apps/ui/.next/" \
        "~/$REMOTE_REPO_DIR/apps/ui/.next/" \
        "UI .next"
      ;;
    strapi)
      sync_dir \
        "$REPO_ROOT/apps/strapi/dist/" \
        "~/$REMOTE_REPO_DIR/apps/strapi/dist/" \
        "Strapi dist"
      if [[ -d "$REPO_ROOT/apps/strapi/.strapi" ]]; then
        sync_dir \
          "$REPO_ROOT/apps/strapi/.strapi/" \
          "~/$REMOTE_REPO_DIR/apps/strapi/.strapi/" \
          "Strapi .strapi"
      fi
      ;;
    all)
      sync_dir \
        "$REPO_ROOT/apps/ui/.next/" \
        "~/$REMOTE_REPO_DIR/apps/ui/.next/" \
        "UI .next"
      sync_dir \
        "$REPO_ROOT/apps/strapi/dist/" \
        "~/$REMOTE_REPO_DIR/apps/strapi/dist/" \
        "Strapi dist"
      if [[ -d "$REPO_ROOT/apps/strapi/.strapi" ]]; then
        sync_dir \
          "$REPO_ROOT/apps/strapi/.strapi/" \
          "~/$REMOTE_REPO_DIR/apps/strapi/.strapi/" \
          "Strapi .strapi"
      fi
      ;;
  esac

  sync_dir \
    "$REPO_ROOT/packages/shared-data/dist/" \
    "~/$REMOTE_REPO_DIR/packages/shared-data/dist/" \
    "shared-data dist"

  sync_dir \
    "$REPO_ROOT/packages/design-system/dist/" \
    "~/$REMOTE_REPO_DIR/packages/design-system/dist/" \
    "design-system dist"
}

sync_env_files() {
  if [[ "$SYNC_ENV" != true ]]; then
    return
  fi

  log_info "Syncing env files from $ENV_SOURCE_DIR..."

  case "$TARGET" in
    ui)
      rsync -az \
        "$(ui_env_file)" \
        "$DEPLOY_SERVER:~/$REMOTE_REPO_DIR/apps/ui/.env.local"
      ;;
    strapi)
      rsync -az \
        "$(strapi_env_file)" \
        "$DEPLOY_SERVER:~/$REMOTE_REPO_DIR/apps/strapi/.env"
      ;;
    all)
      rsync -az \
        "$(ui_env_file)" \
        "$DEPLOY_SERVER:~/$REMOTE_REPO_DIR/apps/ui/.env.local"
      rsync -az \
        "$(strapi_env_file)" \
        "$DEPLOY_SERVER:~/$REMOTE_REPO_DIR/apps/strapi/.env"
      ;;
  esac
}

install_remote_dependencies() {
  if [[ "$INSTALL_ON_SERVER" != true ]]; then
    log_warn "Skipping remote pnpm install."
    return
  fi

  log_info "Installing server dependencies..."
  ssh "$DEPLOY_SERVER" "set -euo pipefail
    export NVM_DIR=\"\$HOME/.nvm\"
    if [ -s \"\$NVM_DIR/nvm.sh\" ]; then
      . \"\$NVM_DIR/nvm.sh\"
    fi
    cd \"\$HOME/$REMOTE_REPO_DIR\"
    CI=1 HUSKY=0 pnpm install --force --no-frozen-lockfile"
}

restart_ui() {
  if [[ "$SKIP_RESTART" == true ]]; then
    log_warn "Skipping UI restart."
    return
  fi

  log_info "Restarting UI with PM2..."
  ssh "$DEPLOY_SERVER" "set -euo pipefail
    export NVM_DIR=\"\$HOME/.nvm\"
    if [ -s \"\$NVM_DIR/nvm.sh\" ]; then
      . \"\$NVM_DIR/nvm.sh\"
    fi
    pm2 delete \"$UI_PM2_NAME\" || true
    pm2 start pnpm --name \"$UI_PM2_NAME\" --cwd \"\$HOME/$REMOTE_REPO_DIR/apps/ui\" -- start
    pm2 save"
}

restart_strapi() {
  if [[ "$SKIP_RESTART" == true ]]; then
    log_warn "Skipping Strapi restart."
    return
  fi

  log_info "Restarting Strapi with PM2..."
  ssh "$DEPLOY_SERVER" "set -euo pipefail
    export NVM_DIR=\"\$HOME/.nvm\"
    if [ -s \"\$NVM_DIR/nvm.sh\" ]; then
      . \"\$NVM_DIR/nvm.sh\"
    fi
    pm2 delete \"$STRAPI_PM2_NAME\" || true
    pm2 start pnpm --name \"$STRAPI_PM2_NAME\" --cwd \"\$HOME/$REMOTE_REPO_DIR/apps/strapi\" -- start
    pm2 save"
}

main() {
  parse_args "$@"
  check_local_dependencies

  log_info "Deploy target: $TARGET"
  log_info "Server: $DEPLOY_SERVER"
  log_info "Remote repo: ~/$REMOTE_REPO_DIR"
  log_info "Git branch: $DEPLOY_BRANCH"
  if [[ "$SYNC_ENV" == true ]]; then
    log_info "Env source: $ENV_SOURCE_DIR"
  fi

  if [[ "$SKIP_BUILD" == false ]]; then
    case "$TARGET" in
      ui)
        build_ui
        ;;
      strapi)
        build_strapi
        ;;
      all)
        build_ui
        build_strapi
        ;;
    esac
  else
    log_warn "Skipping local build."
  fi

  prepare_remote_repo
  sync_build_artifacts
  sync_env_files
  install_remote_dependencies

  case "$TARGET" in
    ui)
      restart_ui
      ;;
    strapi)
      restart_strapi
      ;;
    all)
      restart_ui
      restart_strapi
      ;;
  esac

  echo
  log_info "Deployment finished."
  echo "Repo path: ~/$REMOTE_REPO_DIR"
  echo "UI env file: ~/$REMOTE_REPO_DIR/apps/ui/.env.local"
  echo "Strapi env file: ~/$REMOTE_REPO_DIR/apps/strapi/.env"
}

main "$@"
