# Commands Reference

All commands use pnpm and can be run from the repository root unless noted otherwise.

## Development

```bash
pnpm dev                    # Start both apps (Strapi needs Docker DB running)
pnpm dev:strapi             # Start Strapi only (auto-starts Docker DB)
pnpm dev:ui                 # Start Next.js only
```

## Build

```bash
pnpm build                  # Build all packages
pnpm build:ui               # Build Next.js
pnpm build:strapi           # Build Strapi
pnpm build:ui:static        # Next.js static export (output: 'export')
```

## Quality

```bash
pnpm lint                   # ESLint across all packages
pnpm format                 # Prettier format all
pnpm format:check           # Check formatting without writing
```

## Type Checking

```bash
cd apps/ui && pnpm typecheck    # Typecheck Next.js app
```

## Type Generation

After ANY Strapi schema change:

```bash
cd apps/strapi && pnpm generate:types
```

This updates `@repo/strapi-types`. Forgetting causes silent type mismatches.

## Testing

```bash
pnpm tests:playwright:e2e:test              # Playwright E2E tests
pnpm tests:playwright:e2e:test:interactive  # Playwright UI mode
pnpm tests:playwright:axe                   # Accessibility tests (axe-core)
```

## Deployment Helper

```bash
DEPLOY_SERVER=user@host ./scripts/deploy-shantec.sh all
```

This keeps a full git checkout on the server at `~/shantec/repo`, updates it from the configured branch, then syncs local build artifacts (`.next`, `dist`, shared package builds) into that repo before restarting the apps.

To build and deploy with env files stored outside the repository:

```bash
ENV_SOURCE_DIR=~/.deploy-secrets/shantec \
DEPLOY_SERVER=user@host \
./scripts/deploy-shantec.sh all --sync-env
```

Expected layout:

```bash
~/.deploy-secrets/shantec/ui/.env.local
~/.deploy-secrets/shantec/strapi/.env
```

Optional overrides:

```bash
REPO_URL=git@github.com:owner/repo.git
DEPLOY_BRANCH=develop
REMOTE_REPO_DIR=shantec/repo
```

Use `--skip-build`, `--skip-restart`, or `--no-install` when needed.
