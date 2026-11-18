# Auto-generated Swagger for the Users Module (NestJS)

Goal: **write your code normally; Swagger updates itself.** No `@ApiProperty()` on every field, no hand-edited docs.

How it works: the `@nestjs/swagger` **CLI plugin** runs at build time, reads your TypeScript types, class-validator decorators and comments, and injects the Swagger metadata for you. You only hand-write the few things TypeScript can't express (see Step 5).

---

## 0. What the plugin can and cannot see

| Source in your code | Plugin sees it? | Becomes |
|---|---|---|
| `firstName!: string` in a **class** | Yes | `type: string`, required |
| `addressId?: string` | Yes | optional |
| `@IsUUID()`, `@IsEmail()`, `@MaxLength(255)`, `@Min(1)`, `@IsIn([...])` | Yes | `format: uuid`, `format: email`, `maxLength`, `minimum`, `enum` |
| `page?: number = 1` | Yes | `default: 1` |
| `/** comment */` above a property | Yes (if enabled) | `description` |
| `export type PersonOutput = {...}` | **No** (types/interfaces vanish at runtime) | nothing |
| `Promise<PaginationResult<T>>` (generic) | **No** | needs a helper (Step 6) |

That table drives the whole design: **request DTOs are already classes → free. Response shapes are `type`s → convert them to classes.**

---

## 1. Install

```bash
npm i @nestjs/swagger
```

(`class-validator` and `class-transformer` are already installed.)

---

## 2. Enable the plugin: `nest-cli.json`

Your DTO files end in `.request.ts`. The plugin defaults to `.dto.ts` / `.entity.ts`, so **you must tell it your suffixes** or nothing will be generated. This is the most common reason "the plugin doesn't work".

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "plugins": [
      {
        "name": "@nestjs/swagger",
        "options": {
          "dtoFileNameSuffix": [".request.ts", ".response.ts"],
          "controllerFileNameSuffix": [".controller.ts"],
          "classValidatorShim": true,
          "introspectComments": true
        }
      }
    ]
  }
}
```

- `dtoFileNameSuffix`: which files are scanned for DTO classes. Any file ending in these gets processed.
- `controllerFileNameSuffix`: which files are scanned for routes.
- `classValidatorShim`: turns class-validator decorators into schema constraints.
- `introspectComments`: turns `/** ... */` comments into descriptions.

**Rule to remember:** a new DTO file must end in one of these suffixes. Name it `foo.request.ts` or `foo.response.ts` and it's picked up.

> The plugin only runs through the **Nest CLI** (`nest start`, `nest start --watch`, `nest build`). It does **not** run under plain `ts-node`, `tsx`, or `ts-jest`. Make sure your `start:dev` script is `nest start --watch`.

---

## 3. Bootstrap Swagger: `src/main.ts`

Add this after `useGlobalPipes` and before `app.listen`:

```ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UsersModule } from './modules/users/users.module';

// ...
const config = new DocumentBuilder()
  .setTitle('Users API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config, {
  include: [UsersModule],   // only document this module. Delete this line to document everything
});
SwaggerModule.setup('docs', app, document);
```

Run the app and open `http://localhost:<port>/docs`. Raw JSON is at `/docs-json`, which is what you inspect when debugging.

To hide docs in production:

```ts
if (process.env.NODE_ENV !== 'production') {
  SwaggerModule.setup('docs', app, document);
}
```

---

## 4. Request DTOs: do nothing

`CreatePersonRequest`, `SearchPersonRequest`, `PaginationRequest`, etc. need **no changes**. Example:

```ts
export class CreatePersonRequest {
    @IsString() @IsNotEmpty() @MaxLength(255)
    firstName!: string;          // string, required, maxLength 255

    @IsEmail()
    email!: string;              // string, format: email

    @IsUUID() @IsNotEmpty()
    genderId!: string;           // string, format: uuid
}
```

`SearchPersonRequest extends PaginationRequest` works too. Inherited fields are included.

To add a description, write a comment. That's all:

```ts
/** Date of birth in YYYY-MM-DD format */
@Matches(DOB_PATTERN)
dob!: string;
```

**Check:** after `nest start`, open `/docs-json` → `components.schemas.CreatePersonRequest`. You should see your fields.

---

## 5. Response DTOs: the one thing you create by hand (once per shape)

`PersonOutput` is a `type`, so Swagger can't see it. Create a **class** in the presentation layer. This keeps `@nestjs/swagger` out of your application/domain layers, which matters for your hexagonal setup.

`src/modules/users/presentation/dto/person.response.ts`

```ts
import { PersonOutput } from '../../application/dtos';
import { GenderResponse } from './gender.response';
import { AddressResponse } from './address.response';

export class PersonResponse implements PersonOutput {
    id!: string;
    firstName!: string;
    lastName!: string;
    dob!: string;
    email!: string;
    gender!: GenderResponse;
    address?: AddressResponse;
    createdAt!: Date;
}
```

Why `implements PersonOutput` is the trick that stops drift: if you later add `phone` to `PersonOutput` and forget the response class, **TypeScript fails the build**. The compiler tells you what to update, not Swagger being silently wrong.

Do the same for `GenderOutput` → `GenderResponse`, `AddressOutput` → `AddressResponse`, and so on. Export them from `dto/index.ts`.

> Nested classes (`gender!: GenderResponse`) are discovered automatically by the plugin. You don't need `@ApiProperty({ type: ... })`.

---

## 6. Controllers: change the return type, skip the decorator

The plugin reads the return type of each route method. If it's a class, it documents the response for you. So:

```ts
// before
public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<PersonOutput> {

// after: only the type changes
public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<PersonResponse> {
    return unwrap(await this.getPersonByIdUseCase.execute({ id }));   // still compiles
}
```

It still compiles because `PersonOutput` and `PersonResponse` have the same shape. TypeScript is structural.

The plugin also reads `@HttpCode(...)` and `@Post()` (201 by default), so status codes follow your code.

Add one decorator per controller for grouping:

```ts
@ApiTags('person')
@Controller('person')
export class PersonController { ... }
```

### Paginated endpoints (the one case the plugin can't infer)

`PaginationResult<PersonOutput>` is generic, and generics are erased at runtime. Write this helper **once** and reuse it everywhere.

First look at your `PaginationResult` definition in `domain/repository/person.repository.interface.ts` and mirror its fields. Typically:

`src/shared/presentation/swagger/paginated.response.ts`

```ts
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export class PaginationMeta {
    page!: number;
    limit!: number;
    total!: number;
    // mirror the real fields of PaginationResult here
}

export const ApiPaginatedResponse = <T extends Type<unknown>>(model: T) =>
    applyDecorators(
        ApiExtraModels(PaginationMeta, model),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(PaginationMeta) },
                    {
                        properties: {
                            items: { type: 'array', items: { $ref: getSchemaPath(model) } },
                        },
                    },
                ],
            },
        }),
    );
```

> Match the property names (`items`, `data`, `results`…) to what `PaginationResult` really contains. Print one response from the running app and copy it.

Use it:

```ts
@Get()
@ApiPaginatedResponse(PersonResponse)
public async search(@Query() query: SearchPersonRequest) { ... }
```

---

## 7. Error responses: define once, reuse everywhere

Your `unwrap()` throws `{ statusCode, message }`. Document that shape once:

`src/shared/presentation/swagger/api-errors.ts`

```ts
import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiConflictResponse } from '@nestjs/swagger';

export class ErrorResponse {
    statusCode!: number;
    message!: string;
}

export const ApiStandardErrors = () =>
    applyDecorators(
        ApiBadRequestResponse({ type: ErrorResponse }),
        ApiNotFoundResponse({ type: ErrorResponse }),
        ApiConflictResponse({ type: ErrorResponse }),
    );
```

Put `@ApiStandardErrors()` on a controller class, or on single routes where it applies.

> Related bug: `unwrap-result.ts` imports `NotFoundError` from `rxjs`, not from your domain errors. Fix that import first, or your 404s will actually return 500 and the docs will lie.

---

## 8. Auth

If your routes sit behind a JWT guard, add this to the controller:

```ts
@ApiBearerAuth()
```

`addBearerAuth()` in `main.ts` (Step 3) gives you the "Authorize" button in `/docs`.

---

## 9. Your day-to-day workflow (what you do when things change)

| Change | What you do |
|---|---|
| Add/rename a field on a request DTO | Edit the class. **Nothing else.** |
| Change validation (`@MaxLength`, `@IsIn`...) | Edit the decorator. Docs follow. |
| Add a field to an output type | Add it to `PersonOutput`. TS errors on `PersonResponse` → add it there. Done. |
| New endpoint | Write the method with a typed return class. Done. |
| New paginated endpoint | Add `@ApiPaginatedResponse(XResponse)` |
| New DTO file | Name it `*.request.ts` or `*.response.ts` |

---

## 10. Troubleshooting

**Schemas are empty / fields missing**
1. Does the filename end in one of your `dtoFileNameSuffix` values?
2. Are you running via `nest start`? (not `ts-node` / `tsx`)
3. Stale build cache: `rm -rf dist tsconfig.build.tsbuildinfo` then restart. This is the #1 fix after changing plugin options.

**Field shows as `object` with no properties**
It's a `type` or `interface`, not a class. Convert it (Step 5).

**Circular dependency error between DTOs**
Use a lazy type on that one field: `@ApiProperty({ type: () => OtherResponse })`. This is the rare case where manual is needed.

**Path-alias imports (`src/shared/...`) fail at build**
Already used in your controllers. If the Swagger step complains, make sure `baseUrl`/`paths` are set in `tsconfig.json`.

**A validation mismatch you noticed:** in `CreatePersonRequest`, `addressId?` has `@IsUUID()` but no `@IsOptional()`. Validation will reject a missing `addressId` even though the docs show it as optional. Add `@IsOptional()` so the code and docs agree.

---

## 11. Optional: export the spec to a file (for CI, Postman, client generation)

In `main.ts`, after `createDocument`:

```ts
import { writeFileSync } from 'fs';
writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
```

Generate typed clients from it with tools like `openapi-typescript` or `orval`. The spec is always accurate because it comes from your code.

---

## Quick checklist to do it yourself

1. `npm i @nestjs/swagger`
2. Paste the plugin config into `nest-cli.json` (Step 2)
3. Add the setup block in `main.ts` (Step 3)
4. Create `*.response.ts` classes with `implements XOutput` (Step 5)
5. Change controller return types to the response classes; add `@ApiTags` (Step 6)
6. Add the `ApiPaginatedResponse` helper and use it on search routes (Step 6)
7. Add `ApiStandardErrors` (Step 7)
8. `rm -rf dist`, run `nest start --watch`, open `/docs` and `/docs-json`
