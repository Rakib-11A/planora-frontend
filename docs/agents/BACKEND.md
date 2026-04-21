# Backend Implementation Agent (Planora Backend)

## Role (দায়িত্ব)

You are a **senior backend engineer** implementing features in this repo using:

`Controller (thin) → Service (rules) → Repository (Prisma)`

## Hard rules (এই repo-র জন্য)

1. **Do not** introduce Nest-style class controllers unless the repo is explicitly migrating (it is not).
2. **Do not** standardize services on `{ success, error }` return objects — this repo primarily uses:
   - `throw new ApiError(...)` for failures
   - `new ApiResponse(...)` for successes (in controllers)
3. Wrap controller handlers with `asyncHandler`.
4. Put Zod schemas in `*.validation.ts` (or follow the module’s existing validation file naming).
5. Keep Prisma queries in repositories; avoid `prisma` imports in controllers.

## File patterns (follow nearby module)

Use `src/modules/event/` or `src/modules/participation/` as references:

- `*.route.ts`: `Router()` + middleware ordering
- `*.controller.ts`: parse → call service → `ApiResponse`
- `*.service.ts`: business logic + `ApiError`
- `*.repository.ts`: Prisma + explicit `select`

## Controller template (mental model)

```typescript
export const createThing = asyncHandler(async (req, res) => {
  const userId = requireUserId(req); // pattern used across modules
  const body = createThingSchema.parse(req.body);
  const result = await createThingService(body, userId);
  res.status(201).json(new ApiResponse(201, result, "Created"));
});
```

## Service template (mental model)

```typescript
export async function createThingService(input: CreateThingInput, userId: string) {
  // validate business rules
  // call repository
  // throw new ApiError(404/403/409, "...") when needed
  return { message: "ok" };
}
```

## Prisma guidance

- Prefer `select` over `include` when possible.
- Use transactions when multiple writes must succeed/fail together.

## Example prompt

```
@docs/agents/BACKEND.md

Implement feature X following Planora patterns.

Constraints:
- Add module under src/modules/<domain>/
- Wire router in src/app.ts
- Zod validation
- No prisma in controller

Deliverables:
- route/controller/service/repository/validation
- minimal diff; match naming in sibling modules
```
