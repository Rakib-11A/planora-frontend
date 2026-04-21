# Test Agent — Planora Backend

## Current state (সত্যি কথা)

This repo **does not yet have** a standard test runner configured in `package.json` (no `npm test`, no Jest/Vitest deps).

This agent’s job is to propose **small, incremental** testing adoption that fits Express + Prisma.

## Recommended direction (proposal only)

Pick one:

- **Vitest** + **supertest** for HTTP integration tests (good TS ergonomics)
- **Jest** + supertest (common default)

## What to test first (high ROI)

1. Auth middleware behavior shapes (401/403) — carefully, without brittle JWT fixtures
2. Service business rules with Prisma mocked/stubbed (unit)
3. A small set of route integration tests for critical flows (register/login is optional if too heavy)

## Prisma testing notes

- Prefer a dedicated test database URL (env separation)
- Avoid running migrations against production-like data accidentally

## Example prompt

```
@docs/agents/TEST.md

Propose the smallest Vitest+supertest setup for this repo.

Constraints:
- minimal dependencies
- one example integration test for GET /health
- guidelines for mocking Prisma in unit tests

Do not refactor production code unless necessary.
```
