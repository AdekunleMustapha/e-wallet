# fintech-backend: Structure, Usage and How It Works

A NestJS + TypeScript base for a fintech backend. This guide covers what each part is, how a request flows through it, and how to build on it.

---

## 1. The big picture

```
                 ┌────────────────────────────────────────────┐
HTTP request ──▶ │ presentation   (controllers, DTOs)         │
                 └───────────────┬────────────────────────────┘
                                 ▼
                 ┌────────────────────────────────────────────┐
                 │ application    (use cases / orchestration) │
                 └───────────────┬────────────────────────────┘
                                 ▼
                 ┌────────────────────────────────────────────┐
                 │ domain         (entities, repository ports)│  ◀── no framework imports
                 └───────────────▲────────────────────────────┘
                                 │ implements
                 ┌───────────────┴────────────────────────────┐
                 │ infrastructure (MySQL, Redis, adapters)    │
                 └────────────────────────────────────────────┘
```

**The dependency rule:** arrows point inward. `domain` knows nothing about Nest, TypeORM, MySQL or Redis. `application` depends only on `domain` (plus cross-cutting services like Redis). `infrastructure` implements the interfaces (ports) that `domain` defines. This is what lets you swap a raw-SQL repository for a TypeORM one, or MySQL for something else, without touching business rules.

---

## 2. Folder structure

```
fintech-backend/
├── package.json              scripts + dependencies
├── tsconfig.json             strict TypeScript, decorators on
├── nest-cli.json
├── .env.example              copy to .env
├── ARCHITECTURE.md           this file
├── README.md                 quick start
└── src/
    ├── main.ts               bootstrap: logger, validation pipe, listen
    ├── app.module.ts         root module, wires everything together
    │
    ├── shared/               cross-cutting, framework-level code
    │   ├── config/
    │   │   ├── app.config.ts         `app.*` config namespace
    │   │   └── env.validation.ts     Joi schema; app won't boot on bad env
    │   └── logger/
    │       ├── logger.config.ts      `logger.*` config namespace
    │       ├── winston.factory.ts    builds the winston logger + rotation + redaction
    │       ├── app-logger.service.ts Nest LoggerService backed by winston
    │       └── logger.module.ts      global module
    │
    ├── infrastructure/       technical plumbing shared by all features
    │   ├── database/
    │   │   ├── typeorm.options.ts    ONE place that defines DB options
    │   │   ├── data-source.ts        entry point for the migration CLI
    │   │   ├── database.config.ts    `database.*` config namespace
    │   │   ├── database.module.ts    global module (TypeORM + RawQueryService)
    │   │   ├── raw-query.service.ts  raw SQL + transactions
    │   │   └── migrations/           your migrations live here
    │   └── cache/
    │       ├── redis.config.ts       `redis.*` config namespace
    │       ├── redis.module.ts       builds the ioredis client
    │       └── redis.service.ts      get/set/json/remember/lock helpers
    │
    └── modules/              features, one folder each
        ├── health/           GET /health (MySQL + Redis check)
        └── wallet/           example feature showing the layering
            ├── domain/           wallet.entity.ts, wallet.repository.ts (port)
            ├── application/      get-wallet.use-case.ts
            ├── infrastructure/   wallet.sql.repository.ts (adapter, raw SQL)
            ├── presentation/     wallet.controller.ts
            └── wallet.module.ts  DI wiring for this feature
```

**Rule of thumb for where code goes:**

| If it is... | It goes in... |
|---|---|
| A business concept or rule (Wallet, Money, Transfer rules) | `modules/<feature>/domain` |
| A "do this thing" flow (transfer funds, fund wallet) | `modules/<feature>/application` |
| SQL, Redis calls, third-party APIs for one feature | `modules/<feature>/infrastructure` |
| HTTP controllers, request/response shapes | `modules/<feature>/presentation` |
| Used by every feature (DB, cache, logging, config) | `shared/` or `infrastructure/` |

---

## 3. How it works

### 3.1 Boot sequence

1. `main.ts` creates the Nest app with `bufferLogs: true`, so early logs are held until the winston logger is ready.
2. `AppModule` loads `ConfigModule` globally. It loads four namespaced configs (`app`, `database`, `redis`, `logger`) and validates `process.env` against the Joi schema. If a required variable is missing or invalid, the app refuses to start and lists every problem (`abortEarly: false`).
3. `LoggerModule`, `DatabaseModule` and `RedisModule` are `@Global()`, so any provider anywhere can inject `AppLogger`, `RawQueryService` or `RedisService` without importing the module.
4. `main.ts` calls `app.useLogger(AppLogger)`, so Nest's own logs also go through winston. It also enables shutdown hooks (Redis closes cleanly on SIGTERM) and a global `ValidationPipe` (`whitelist` and `transform` on).
5. The app listens on `PORT`.

### 3.2 Configuration

Each concern has a `registerAs('<namespace>', ...)` file. Read values with a dotted path:

```ts
config.getOrThrow<string>('database.host');
config.getOrThrow<number>('redis.port');
```

The Joi schema in `env.validation.ts` is the contract for `.env`. Add a variable to the schema, the matching `*.config.ts` and `.env.example` together.

### 3.3 Database layer (MySQL)

- **`typeorm.options.ts`** is the single source of truth for connection settings. Both the running app (`DatabaseModule`) and the migration CLI (`data-source.ts`) call `buildTypeOrmOptions()`, so they can't drift apart.
- **`synchronize` is permanently off.** The schema changes only through migrations.
- Settings aimed at money safety: UTC timezone, `utf8mb4`, big-number support, and `DECIMAL` columns returned as strings (never floats).
- **Entity discovery:** any file named `*.orm-entity.ts` under `src/` is picked up automatically. Migrations are discovered from `src/infrastructure/database/migrations/`.
- **`RawQueryService`** is your raw SQL escape hatch (see 4.2).

### 3.4 Logging (winston + daily rotate)

`createWinstonLogger()` builds one winston logger with these outputs:

| Output | File / target | Contains |
|---|---|---|
| `combined` | `logs/combined-YYYY-MM-DD.log` | everything at or above `LOG_LEVEL` |
| `error` | `logs/error-YYYY-MM-DD.log` | errors only, for easy alerting |
| `exceptions` | `logs/exceptions-YYYY-MM-DD.log` | uncaught exceptions |
| `rejections` | `logs/rejections-YYYY-MM-DD.log` | unhandled promise rejections |
| console | stdout | pretty in development, JSON in production |

Files rotate daily and by size (`LOG_MAX_SIZE`), are kept for `LOG_MAX_FILES` (for example `14d`), and are gzipped when `LOG_ZIPPED_ARCHIVE=true`.

**Redaction:** a log format scrubs sensitive keys at any depth (up to 6 levels) before anything is written: `password`, `pin`, `token`, `accessToken`, `refreshToken`, `authorization`, `cvv`, `cardNumber`, `pan`, `secret`, `apiKey`, `bvn`, `nin`. Extend the `REDACTED_KEYS` set in `winston.factory.ts`. Redaction works on **keys**, so a secret embedded inside a free-text message string is not caught.

Example output line:

```json
{"context":"Smoke","level":"info","message":"hello","nested":{"ok":1,"token":"[REDACTED]"},"password":"[REDACTED]","service":"fintech-backend","timestamp":"2026-10-06 15:52:56.227"}
```

### 3.5 Redis layer

- `RedisModule` builds one ioredis client from the `redis.*` config: key prefix, optional TLS, retry backoff (`min(attempt × 200, 3000)` ms), `maxRetriesPerRequest: 3`. Connect, error and reconnect events are logged via `AppLogger`.
- `RedisService` wraps the common operations and exposes the raw client as `redis.client`.
- **Key prefixing is automatic.** With `REDIS_KEY_PREFIX=fintech:`, calling `get('wallet:1')` reads `fintech:wallet:1`. Pass bare keys.

### 3.6 Request flow: `GET /wallets/:id`

```
WalletController.findOne(id)
   └─▶ GetWalletUseCase.execute(id)
          ├─ RedisService.remember('wallet:<id>', 30s, loader)
          │     ├─ cache hit  → return cached JSON
          │     └─ cache miss → loader():
          │            WalletRepository.findById(id)        ← port (domain)
          │               └─ WalletSqlRepository            ← adapter (infrastructure)
          │                     └─ RawQueryService.queryOne('SELECT ... WHERE id = ?', [id])
          └─ not found → NotFoundException (404)
```

The use case depends on the `WALLET_REPOSITORY` token, not on the SQL class. `wallet.module.ts` binds the token to `WalletSqlRepository`; that single line is where you'd switch implementations.

---

## 4. How to use it

### 4.1 First run

Prerequisites: Node 20+, a MySQL server, a Redis server.

```bash
# 1. create the database (once)
mysql -u root -p -e "CREATE DATABASE fintech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. configure
cp .env.example .env          # edit DB_* and REDIS_*

# 3. install, migrate, run
npm install
npm run migration:run         # creates wallets + ledger_entries
npm run start:dev

# 4. check
curl localhost:3000/health
# {"status":"ok","mysql":"up","redis":"up","uptimeSeconds":3}
```

### 4.2 Raw SQL

Inject `RawQueryService` anywhere:

```ts
constructor(private readonly db: RawQueryService) {}

// many rows
const rows = await this.db.query<{ id: string; balance: string }>(
  'SELECT id, balance FROM wallets WHERE owner_id = ?', [ownerId]);

// one row or null
const wallet = await this.db.queryOne('SELECT * FROM wallets WHERE id = ?', [id]);

// insert / update / delete
const { affectedRows, insertId } = await this.db.execute(
  'UPDATE wallets SET status = ? WHERE id = ?', ['FROZEN', id]);
```

**Always use `?` placeholders for values.** Never concatenate user input into SQL.

### 4.3 Transactions (money movement)

```ts
await this.db.transaction(async (tx) => {
  // lock rows (always lock in a consistent order, e.g. sorted by id, to avoid deadlocks)
  const from = await tx.queryOne<{ balance: string }>(
    'SELECT balance FROM wallets WHERE id = ? FOR UPDATE', [fromId]);
  if (!from) throw new Error('wallet not found');

  await tx.execute('UPDATE wallets SET balance = balance - ? WHERE id = ?', [amount, fromId]);
  await tx.execute('UPDATE wallets SET balance = balance + ? WHERE id = ?', [amount, toId]);
  await tx.execute(
    'INSERT INTO ledger_entries (wallet_id, reference, direction, amount, balance_after) VALUES (?, ?, ?, ?, ?)',
    [fromId, reference, 'DEBIT', amount, newBalance]);
});
```

- Anything thrown inside the callback rolls everything back.
- The default isolation level is `REPEATABLE READ`; pass a second argument (`'READ COMMITTED'` or `'SERIALIZABLE'`) to change it.
- Inside the callback use `tx`, not `this.db`, or the statements won't be part of the transaction.
- The `UNIQUE (reference, wallet_id)` constraint in the sample schema gives you idempotency: replaying the same `reference` fails instead of double-posting.
- For amounts, use a decimal library such as `decimal.js`. `DECIMAL` values arrive as strings precisely so you don't use JS floats.

### 4.4 Migrations

| Command | What it does |
|---|---|
| `npm run migration:create src/infrastructure/database/migrations/AddKycTable` | creates an empty migration; write your own SQL |
| `npm run migration:generate src/infrastructure/database/migrations/AddKycTable` | diffs your `*.orm-entity.ts` files against the DB and writes SQL for you |
| `npm run migration:run` | applies pending migrations |
| `npm run migration:revert` | rolls back the last applied migration |
| `npm run migration:show` | lists applied and pending migrations |

A migration is just a class:

```ts
export class AddKycTable1761000000000 implements MigrationInterface {
  async up(q: QueryRunner)   { await q.query(`CREATE TABLE kyc (...) ENGINE=InnoDB`); }
  async down(q: QueryRunner) { await q.query('DROP TABLE kyc'); }
}
```

Anything MySQL supports (triggers, views, generated columns, check constraints, partitions) works because you write the SQL. Always write a real `down`. Never edit a migration that has already run in a shared environment; add a new one instead.

### 4.5 Logging

```ts
constructor(private readonly logger: AppLogger) {}

this.logger.log('Wallet funded', 'WalletService', { walletId, amount });
this.logger.warn('Retrying provider call', 'PaymentService', { attempt });
this.logger.error('Transfer failed', err.stack, 'TransferService', { reference });
this.logger.debug('Computed fee', 'FeeService', { fee });
```

Signature: `log/warn/debug/verbose(message, context?, meta?)` and `error(message, stack?, context?, meta?)`. Put structured data in `meta` rather than the message string, so the JSON logs stay searchable and redaction applies.

### 4.6 Redis

```ts
constructor(private readonly redis: RedisService) {}

await this.redis.setJson('session:42', { userId: 42 }, 3600);   // with TTL (seconds)
const s = await this.redis.getJson<{ userId: number }>('session:42');

// cache-aside
const rate = await this.redis.remember('fx:NGN:USD', 60, () => fetchRate());

// rate-limit style counter
const hits = await this.redis.incr(`rl:${userId}`);
if (hits === 1) await this.redis.expire(`rl:${userId}`, 60);

// lock (idempotency guard / cron de-dup)
const release = await this.redis.acquireLock(`transfer:${reference}`, 10_000);
if (!release) throw new ConflictException('Already in progress');
try { /* work */ } finally { await release(); }
```

`acquireLock` is a single-node lock (`SET NX PX` with a safe release script). Use Redlock if you need guarantees across multiple Redis nodes.

### 4.7 Adding a new feature (the recipe)

Say you're adding `kyc`:

1. Create `src/modules/kyc/{domain,application,infrastructure,presentation}`.
2. **domain:** `kyc-record.entity.ts` (plain class) and `kyc.repository.ts` (an interface plus a `KYC_REPOSITORY` Symbol).
3. **application:** `submit-kyc.use-case.ts`, which injects `@Inject(KYC_REPOSITORY)` and any services it needs.
4. **infrastructure:** `kyc.sql.repository.ts` implementing the interface with `RawQueryService`.
5. **presentation:** a controller plus DTOs with `class-validator` decorators; the global `ValidationPipe` enforces them.
6. `kyc.module.ts` binds `{ provide: KYC_REPOSITORY, useClass: KycSqlRepository }` and registers the use case and controller.
7. Add `KycModule` to `AppModule.imports`.
8. Add a migration for the tables.

To use TypeORM entities for a feature instead of raw SQL, name them `*.orm-entity.ts` (they're auto-discovered), call `TypeOrmModule.forFeature([...])` in that feature's module, and write the repository adapter against `Repository<T>`. The domain layer doesn't change.

---

## 5. Configuration reference

Required variables are marked ✔. The app won't start without them.

| Variable | Default | Purpose |
|---|---|---|
| `NODE_ENV` | `development` | `development`, `test`, `staging`, `production` (console logs are JSON in production) |
| `PORT` | `3000` | HTTP port |
| `APP_NAME` | `fintech-backend` | added to every log line as `service` |
| `DB_HOST` ✔ | | MySQL host |
| `DB_PORT` | `3306` | |
| `DB_USERNAME` ✔ | | |
| `DB_PASSWORD` ✔ | | may be empty |
| `DB_NAME` ✔ | | |
| `DB_POOL_SIZE` | `10` | connection pool size |
| `DB_LOGGING` | `false` | log every SQL query |
| `REDIS_HOST` ✔ | | |
| `REDIS_PORT` | `6379` | |
| `REDIS_PASSWORD` | empty | |
| `REDIS_DB` | `0` | |
| `REDIS_KEY_PREFIX` | `fintech:` | prepended to every key |
| `REDIS_TLS` | `false` | enable TLS |
| `LOG_LEVEL` | `info` | `error`, `warn`, `info`, `http`, `verbose`, `debug`, `silly` |
| `LOG_DIR` | `logs` | relative to the working directory |
| `LOG_MAX_SIZE` | `20m` | rotate when a file reaches this size |
| `LOG_MAX_FILES` | `14d` | retention (`14d` for days, or a number for file count) |
| `LOG_ZIPPED_ARCHIVE` | `true` | gzip rotated files |

## 6. npm scripts

| Script | Purpose |
|---|---|
| `npm run start:dev` | run with file watching |
| `npm run build` / `npm run start:prod` | compile to `dist/` and run it |
| `npm run lint` | type-check only (`tsc --noEmit`) |
| `npm run migration:*` | see 4.4 |

---

## 7. Known gaps and caveats

This is a base, so be aware of what it deliberately doesn't do yet:

- **The wallet example caches a balance for 30 seconds and never invalidates it.** That's fine to demonstrate `remember()`, but don't make money decisions from a cached balance. For debits and transfers, read inside a transaction with `FOR UPDATE`. If you cache wallets for display, delete the key (`redis.del('wallet:<id>')`) whenever a balance changes.
- **Cached objects lose their class.** `remember()` stores JSON, so a cache hit returns a plain object (dates become strings, methods like `wallet.isActive()` are gone). The sample controller only reads fields so it works, but rehydrate into the domain class (or cache a DTO) before calling domain methods.
- **No authentication or authorization**, rate limiting, request IDs / correlation IDs in logs, global exception filter, Swagger, or tests yet.
- **No Docker or docker-compose** for local MySQL and Redis.
- `acquireLock` is single-node only (see 4.6).
- Log redaction is key-based (see 3.4).
- Table definitions in the sample migration (`wallets`, `ledger_entries`) are a starting point. Review them (account types, double-entry design, audit columns) against your real domain before relying on them.

## 8. Suggested next steps

1. Add a transfer use case that debits and credits inside one `transaction()` and writes ledger entries (see 4.3).
2. Add an auth module (JWT or API keys) and a global guard.
3. Add a request-ID middleware and include the ID in every log line.
4. Add a global exception filter that logs errors and returns a consistent error shape.
5. Add `docker-compose.yml` for MySQL and Redis, plus integration tests against them.
