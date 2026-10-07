# fintech-backend

NestJS + TypeScript starter for a fintech backend.

- **Clean architecture**: `domain` → `application` → `infrastructure` / `presentation`, with dependencies pointing inward
- **MySQL** via TypeORM, `synchronize` permanently off
- **Migrations**: TypeORM CLI, written in plain SQL if you like
- **Raw SQL**: `RawQueryService` (queries, inserts, transactions with isolation levels)
- **Logging**: Winston + `winston-daily-rotate-file` (combined, error, exceptions, rejections), with sensitive-key redaction
- **Redis**: ioredis client, key prefixing, cache-aside helper, simple lock

## Quick start

```bash
cp .env.example .env        # fill in MySQL + Redis details
npm install
npm run migration:run       # creates wallets + ledger_entries
npm run start:dev
curl localhost:3000/health
```

## Structure

```
src/
  main.ts / app.module.ts
  shared/
    config/        env validation (Joi) + app config
    logger/        winston factory, AppLogger (Nest LoggerService), module
  infrastructure/
    database/      typeorm options, data-source (CLI), RawQueryService, migrations/
    cache/         redis config, client module, RedisService
  modules/
    wallet/        example feature, one folder per layer
      domain/          entity + repository port (no framework imports)
      application/     use cases
      infrastructure/  raw-SQL repository adapter
      presentation/    controller
    health/        MySQL + Redis health check
```

Add a new feature by copying the `wallet/` layout. Keep `domain/` free of Nest and TypeORM imports.

## Migrations

```bash
npm run migration:create   src/infrastructure/database/migrations/AddKycTable   # empty file, write your own SQL
npm run migration:generate src/infrastructure/database/migrations/AddKycTable   # diff from *.orm-entity.ts files
npm run migration:run
npm run migration:revert
npm run migration:show
```

Migrations are plain classes with `up`/`down` calling `queryRunner.query(...)`, so any MySQL feature works.
ORM entities (if you use them) must be named `*.orm-entity.ts` to be auto-discovered.

## Raw SQL

```ts
constructor(private readonly db: RawQueryService) {}

const row = await this.db.queryOne('SELECT * FROM wallets WHERE id = ?', [id]);

await this.db.transaction(async (tx) => {
  const w = await tx.queryOne('SELECT balance FROM wallets WHERE id = ? FOR UPDATE', [id]);
  await tx.execute('UPDATE wallets SET balance = balance - ? WHERE id = ?', [amount, id]);
});
```

Always use `?` placeholders for values. Never build SQL strings from user input.
DECIMAL columns come back as **strings** on purpose: use a decimal library (e.g. `decimal.js`) for arithmetic in code.

## Logging

Logs go to `LOG_DIR` (default `logs/`), rotated daily:
`combined-YYYY-MM-DD.log`, `error-YYYY-MM-DD.log`, `exceptions-*`, `rejections-*`.
Size and retention are set by `LOG_MAX_SIZE` and `LOG_MAX_FILES`. Console output is pretty in dev, JSON in production.
Keys such as `password`, `token`, `pin`, `cvv`, `bvn` are redacted automatically. Extend `REDACTED_KEYS` in `winston.factory.ts`.

## Redis

`RedisService` wraps ioredis: `get/set/getJson/setJson/del/incr/expire`, `remember()` (cache-aside), `acquireLock()`, and `client` for the raw ioredis API.
