import { betterAuth } from "better-auth";
import { Pool } from "pg";

declare global {
  var __akkioAuthPool: Pool | undefined;
}

const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.SUPABASE_DATABASE_URL ??
  "";

const authSecret =
  process.env.BETTER_AUTH_SECRET ??
  "change-me-before-deploying-change-me-before-deploying";

const authBaseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export const isAuthConfigured = databaseUrl.length > 0;

const pool =
  globalThis.__akkioAuthPool ??
  new Pool({
    connectionString:
      databaseUrl || "postgresql://postgres:postgres@127.0.0.1:5432/postgres",
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__akkioAuthPool = pool;
}

export const auth = betterAuth({
  appName: "Akkio",
  baseURL: authBaseUrl,
  secret: authSecret,
  database: pool,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    modelName: "auth_users",
  },
  session: {
    modelName: "auth_sessions",
  },
  account: {
    modelName: "auth_accounts",
  },
  verification: {
    modelName: "auth_verifications",
  },
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
});

export type Session = typeof auth.$Infer.Session;
