# CI/CD and Deployment Guide

This project ships with a GitHub Actions workflow at `.github/workflows/deploy.yml`.

## Workflow trigger

- Trigger: push to `develop`
- Workflow name: `Deploy Pipeline`

## What the CI job does

1. Checks out the repository.
2. Sets up Node.js 20.
3. Runs `npm ci`.
4. Runs `npm run build`.
5. Runs `npx prisma generate`.
6. Builds Docker image from the existing `Dockerfile`.
7. Optionally logs in and pushes image to Docker Hub when credentials are present.

## Required GitHub secrets

Application/runtime secrets (for deployment targets):

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

Optional registry/deploy secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `DEPLOY_HEALTHCHECK_URL` (example: `https://your-app-url/health`)

## Option A: Railway / Render (recommended first)

Use the CI job for validation and image build, then deploy using provider-native deployment:

- Configure all required app environment variables in Railway/Render dashboard.
- Set start command equivalent to:
  - `npx prisma migrate deploy && node dist/server.js`
- Ensure healthcheck path is `/health`.
- Add service URL to `DEPLOY_HEALTHCHECK_URL` if you want workflow post-deploy verification.

## Option B: VPS Docker deployment flow

Recommended basic deployment sequence:

1. CI builds and optionally pushes image to Docker Hub.
2. On VPS:
   - `docker pull <registry>/planora-backend:<tag>`
   - stop old container
   - start new container with updated image and env file
3. Validate:
   - `curl -f http://<host>:5000/health`

## Basic zero-downtime sequence

For single-node Docker (basic):

1. Pull new image.
2. Start new container candidate.
3. Validate `/health`.
4. Switch traffic and stop old container.

For compose-managed setup, keep `docker-compose.prod.yml` as source of truth and redeploy with:

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
```

If ports `5432` or `6379` are already in use on host, adjust mappings before deploy.
