## Setup

Install dependencies with Bun:

```bash
bun install
```

Create a `.env` file from `.env.example` and set:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `RESEND_API_KEY`
- `AUTH_EMAIL_FROM`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

Start the development server:

```bash
bun dev
```

## Prisma

Generate the Prisma client:

```bash
bun run db:generate
```

Validate the Prisma schema:

```bash
bun run db:validate
```

Deploy committed migrations:

```bash
bun run db:migrate:deploy
```

The Prisma baseline migration in `prisma/migrations` is now the source of truth for Better Auth tables and the database-backed rate limiter.

## Auth and Email

Auth uses Better Auth with the Prisma adapter and requires verified email before the first session is created.

Supported flows:

- sign up with email/password
- sign in with email/password
- resend verification email
- request password reset
- reset password from emailed token

Emails are sent through Resend using `RESEND_API_KEY` and `AUTH_EMAIL_FROM`.

## Vercel

Recommended deployment shape:

- use separate `DATABASE_URL` values for local, preview, and production
- run `bunx prisma migrate deploy` during deployment
- keep auth and Prisma routes on the Node runtime
- only enable preview auth flows when `BETTER_AUTH_ALLOW_VERCEL_PREVIEW=true`

This repo does not use `npm` or `npx`. Use `bun` and `bunx` only.
