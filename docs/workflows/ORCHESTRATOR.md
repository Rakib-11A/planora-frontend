# Orchestrator Dashboard (lightweight)

This file is a **human-maintained** status board for Planora backend work. Keep it short; detailed specs belong in PR descriptions or issue trackers.

## Current focus

- **Active feature**:
- **Owner**:
- **Branch**:

## Agent pipeline (recommended order)

```text
ARCHITECT → DATABASE → BACKEND → SECURITY → (TEST) → DOCS
```

Links:

- `docs/agents/ARCHITECT.md`
- `docs/agents/DATABASE.md`
- `docs/agents/BACKEND.md`
- `docs/agents/SECURITY.md`
- `docs/agents/TEST.md`

## Checklist template

### Architecture

- [ ] Routes match `src/app.ts` mounting conventions
- [ ] Authorization matrix written

### Database

- [ ] Prisma schema updated (multi-file)
- [ ] indexes/constraints justified

### Backend

- [ ] Module files follow `src/modules/<domain>/` conventions
- [ ] No business logic in controllers
- [ ] Errors use `ApiError`

### Security

- [ ] Admin routes gated
- [ ] No sensitive fields returned

### Docs

- [ ] `docs/architecture/API_CONTRACTS.md` updated
- [ ] `docs/architecture/CURRENT_STATE.md` updated

## Blockers

- Blocker:
- Next action:

## Daily log (optional)

### YYYY-MM-DD

- Done:
- Next:
