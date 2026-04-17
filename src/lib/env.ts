import { z } from "zod";

const rawEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().trim().optional(),
  BETTER_AUTH_SECRET: z.string().trim().optional(),
  BETTER_AUTH_URL: z.string().trim().optional(),
  BETTER_AUTH_TRUSTED_ORIGINS: z.string().trim().optional(),
  BETTER_AUTH_ALLOW_VERCEL_PREVIEW: z.string().trim().optional(),
  VERCEL_URL: z.string().trim().optional(),
  RESEND_API_KEY: z.string().trim().optional(),
  AUTH_EMAIL_FROM: z.string().trim().optional(),
  AUTH_EMAIL_REPLY_TO: z.string().trim().optional(),
  CLOUDFLARE_ACCOUNT_ID: z.string().trim().optional(),
  CLOUDFLARE_API_TOKEN: z.string().trim().optional(),
});

const rawEnv = rawEnvSchema.parse(process.env);

const localDevelopmentOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

function parseOptionalBoolean(value?: string) {
  if (!value) {
    return false;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function requiredWhenAuthConfigured(
  name: keyof typeof rawEnv,
  value: string | undefined,
) {
  if (!value) {
    throw new Error(`${name} must be set when DATABASE_URL is configured.`);
  }

  return value;
}

function parseUrl(name: string, value: string) {
  const result = z.string().url().safeParse(value);

  if (!result.success) {
    throw new Error(`${name} must be a valid URL.`);
  }

  return new URL(result.data);
}

function dedupe(values: Array<string | undefined | null>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

function parseCsv(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export const nodeEnv = rawEnv.NODE_ENV;
export const isProduction = nodeEnv === "production";
export const isAuthConfigured = Boolean(rawEnv.DATABASE_URL);
export const isWorkersAIConfigured = Boolean(
  rawEnv.CLOUDFLARE_ACCOUNT_ID && rawEnv.CLOUDFLARE_API_TOKEN,
);

let authEnvCache:
  | {
      databaseUrl: string;
      secret: string;
      fallbackBaseUrl: string;
      baseUrlConfig: {
        allowedHosts: string[];
        fallback: string;
        protocol: "http" | "auto";
      };
      trustedOrigins: string[];
    }
  | null = null;

let authEmailEnvCache:
  | {
      resendApiKey: string;
      from: string;
      replyTo?: string;
    }
  | null = null;

export function getAuthEnv() {
  if (!isAuthConfigured) {
    return null;
  }

  if (authEnvCache) {
    return authEnvCache;
  }

  const databaseUrl = requiredWhenAuthConfigured("DATABASE_URL", rawEnv.DATABASE_URL);
  const secret = requiredWhenAuthConfigured(
    "BETTER_AUTH_SECRET",
    rawEnv.BETTER_AUTH_SECRET,
  );

  if (secret.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must be at least 32 characters long.");
  }

  const fallbackBaseUrl = requiredWhenAuthConfigured(
    "BETTER_AUTH_URL",
    rawEnv.BETTER_AUTH_URL,
  );
  const fallbackUrl = parseUrl("BETTER_AUTH_URL", fallbackBaseUrl);
  const allowVercelPreview = parseOptionalBoolean(
    rawEnv.BETTER_AUTH_ALLOW_VERCEL_PREVIEW,
  );
  const previewHost = allowVercelPreview ? rawEnv.VERCEL_URL : undefined;
  const previewOrigin = previewHost ? `https://${previewHost}` : undefined;
  const extraTrustedOrigins = parseCsv(rawEnv.BETTER_AUTH_TRUSTED_ORIGINS);

  authEnvCache = {
    databaseUrl,
    secret,
    fallbackBaseUrl: fallbackUrl.toString(),
    baseUrlConfig: {
      allowedHosts: dedupe([
        fallbackUrl.host,
        previewHost,
        !isProduction ? "localhost:3000" : undefined,
        !isProduction ? "127.0.0.1:3000" : undefined,
      ]),
      fallback: fallbackUrl.toString(),
      protocol: isProduction ? "auto" : "http",
    },
    trustedOrigins: dedupe([
      fallbackUrl.origin,
      !isProduction ? localDevelopmentOrigins[0] : undefined,
      !isProduction ? localDevelopmentOrigins[1] : undefined,
      previewOrigin,
      ...extraTrustedOrigins,
    ]),
  };

  return authEnvCache;
}

export function getAuthEmailEnv() {
  if (!isAuthConfigured) {
    return null;
  }

  if (authEmailEnvCache) {
    return authEmailEnvCache;
  }

  const resendApiKey = requiredWhenAuthConfigured("RESEND_API_KEY", rawEnv.RESEND_API_KEY);
  const from = requiredWhenAuthConfigured("AUTH_EMAIL_FROM", rawEnv.AUTH_EMAIL_FROM);
  const fromAddress = z.string().email().safeParse(from);

  if (!fromAddress.success) {
    throw new Error("AUTH_EMAIL_FROM must be a valid email address.");
  }

  authEmailEnvCache = {
    resendApiKey,
    from: fromAddress.data,
    replyTo: rawEnv.AUTH_EMAIL_REPLY_TO || undefined,
  };

  return authEmailEnvCache;
}

export function getWorkersAIEnv() {
  if (!rawEnv.CLOUDFLARE_ACCOUNT_ID || !rawEnv.CLOUDFLARE_API_TOKEN) {
    return null;
  }

  return {
    accountId: rawEnv.CLOUDFLARE_ACCOUNT_ID,
    apiToken: rawEnv.CLOUDFLARE_API_TOKEN,
  };
}
