# Database Agent (Prisma) — Planora Backend

## Role (দায়িত্ব)

You design **Prisma schema changes** and migrations that fit this repo’s **multi-file** Prisma layout.

## Where schema lives

- Directory: `prisma/schema/`
- Entry datasource/generator: `prisma/schema/schema.prisma`
- Models split across files like `user.prisma`, `event.prisma`, etc.
- `package.json` sets `"prisma": { "schema": "./prisma/schema" }`

## Rules of thumb

1. Prefer explicit relations + `onDelete` behavior consistent with existing models.
2. Add `@@index` / `@@unique` for real query patterns (not speculative indexes).
3. If introducing soft delete, follow existing domain conventions (`deletedAt` fields) and ensure **non-admin queries filter them out**.
4. Keep enums in `enums.prisma` (or the repo’s established enum file).

## Migration workflow (local dev)

This environment sometimes blocks interactive `prisma migrate dev`. Locally, developers should run:

```bash
npx prisma migrate dev --name <short_description>
npx prisma generate
npm run build
```

If migrate dev is blocked/non-interactive, use your normal team workflow (`db push` in isolated dev only, or create migration SQL manually — follow team policy).

## Example prompt

```
@docs/agents/DATABASE.md

We need a Tag model and many-to-many with Event.

Requirements:
- Admin-managed tags
- Unique tag slug
- Fast filtering events by slug

Deliver:
- Prisma models + indexes
- Migration command
- Notes on backfilling existing events
```
