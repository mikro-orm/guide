# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MikroORM Getting Started guide — a blog API built with Fastify, MikroORM v7 (SQLite driver), and TypeScript. ESM-only (`"type": "module"` in package.json).

## Commands

- **Build:** `npm run build` (runs `tsc`)
- **Bundle:** `npm run bundle` (Vite SSR build → `dist/`)
- **Dev server:** `npm run start` (runs `tsx src/server.ts` on port 3001)
- **Run all tests:** `npm test` (runs `vitest`)
- **Run a single test:** `npx vitest run test/user.test.ts`
- **MikroORM CLI:** `npx mikro-orm` (config at `src/mikro-orm.config.ts`)
- **Create migration:** `npx mikro-orm migration:create`

## Architecture

### Entity Definition Pattern (v7 `defineEntity` API)

Entities use MikroORM v7's `defineEntity()` + `p.*` property builder pattern, **not** decorators:

```ts
export const ArticleSchema = defineEntity({
  name: 'Article',
  extends: BaseSchema,
  properties: {
    title: p.string().index(),
    author: () => p.manyToOne(UserSchema).ref(),  // arrow function for circular refs
  },
});
export type IArticle = InferEntity<typeof ArticleSchema>;
```

Key conventions:
- Schema objects are exported (e.g., `ArticleSchema`) and registered in `mikro-orm.config.ts`
- Types are inferred with `InferEntity<typeof Schema>` (e.g., `IArticle`, `ITag`, `IComment`)
- Only `User` has a custom class (via `setClass`) for `verifyPassword()` method
- `BaseSchema` (in `src/modules/common/base.entity.ts`) provides `id`, `createdAt`, `updatedAt`
- Relations use arrow-function property definitions to handle circular imports
- Entity imports use `@mikro-orm/core`; driver-specific imports (`@mikro-orm/sqlite`) are used only in `db.ts` and custom repositories

### Module Structure

Code is organized in `src/modules/{module}/`:
- **user/** — `User` entity (with custom class), `UserRepository`, routes (sign-up, sign-in, profile)
- **article/** — `Article`, `Comment`, `Tag` schemas + `ArticleListing` virtual entity, `ArticleRepository`, routes
- **common/** — `BaseSchema`, `AuthError`, helper functions, `SoftDeleteSubscriber`

### ORM Service Layer (`src/db.ts`)

`initORM()` synchronously initializes MikroORM (via `new MikroORM()`) and returns a cached `Services` object with typed repository accessors (`db.user`, `db.article`, `db.comment`, `db.tag`). Both app code and tests call this — tests pass overrides (`:memory:` DB, debug off).

### App Bootstrap (`src/app.ts`)

`bootstrap()` creates the Fastify app with:
1. JWT plugin for auth
2. `RequestContext` hook (per-request MikroORM identity map)
3. Auth hook (decodes JWT, loads `request.user`)
4. Error handler mapping `NotFoundError` → 404, `AuthError` → 401
5. Route registration with `/user` and `/article` prefixes

### Testing

Tests use in-memory SQLite (`:memory:`) with schema created fresh + `TestSeeder` for fixtures. Each test file uses a different port for parallel execution. Tests use Fastify's `app.inject()` for HTTP assertions without a real server.

### Notable Patterns

- **Soft delete:** `SoftDeleteSubscriber` intercepts DELETE change sets and converts them to UPDATE with `deletedAt` timestamp. `Comment` entity has a `softDelete` filter enabled by default.
- **Virtual entity:** `ArticleListing` uses an expression callback (returns QueryBuilder) instead of a database table.
- **Lazy properties:** `User.password` and `Article.text` are lazy-loaded (not fetched unless explicitly populated).
- **Ref wrapper:** Foreign keys use `.ref()` for type-safe references without loading the full entity.
- **Zod validation:** Route handlers use Zod schemas for request body validation.
