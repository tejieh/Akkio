import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { getAuthEnv, isAuthConfigured } from "@/lib/env";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { getPrisma } from "@/server/db/prisma";

function createConfiguredAuth() {
  const authEnv = getAuthEnv();

  if (!authEnv) {
    throw new Error("Auth is not configured.");
  }

  return betterAuth({
    appName: "Akkio",
    baseURL: authEnv.baseUrlConfig,
    secret: authEnv.secret,
    trustedOrigins: authEnv.trustedOrigins,
    trustedProxyHeaders: true,
    database: prismaAdapter(getPrisma(), {
      provider: "postgresql",
      transaction: true,
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      requireEmailVerification: true,
      resetPasswordTokenExpiresIn: 60 * 60,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        await sendPasswordResetEmail({
          email: user.email,
          url,
          userId: user.id,
        });
      },
      onPasswordReset: async ({ user }) => {
        logger.info("auth.password_reset.completed", {
          authRoute: "/reset-password",
          userId: user.id,
        });
      },
      onExistingUserSignUp: async ({ user }) => {
        logger.warn("auth.signup.duplicate_attempt", {
          authRoute: "/sign-up/email",
          userId: user.id,
        });
      },
    },
    emailVerification: {
      sendOnSignUp: false,
      sendOnSignIn: false,
      autoSignInAfterVerification: false,
      expiresIn: 60 * 60,
      sendVerificationEmail: async ({ user, url }) => {
        await sendVerificationEmail({
          email: user.email,
          url,
          userId: user.id,
        });
      },
      afterEmailVerification: async (user) => {
        logger.info("auth.email_verification.completed", {
          authRoute: "/verify-email",
          userId: user.id,
        });
      },
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
    rateLimit: {
      enabled: true,
      storage: "database",
      modelName: "rateLimit",
      customRules: {
        "/sign-in/email": {
          window: 60,
          max: 5,
        },
        "/sign-up/email": {
          window: 60,
          max: 5,
        },
        "/request-password-reset": {
          window: 60,
          max: 3,
        },
        "/send-verification-email": {
          window: 60,
          max: 3,
        },
      },
    },
    advanced: {
      database: {
        generateId: () => crypto.randomUUID(),
      },
    },
  });
}

type ConfiguredAuth = ReturnType<typeof createConfiguredAuth>;

let authInstance: ConfiguredAuth | null = null;

export function getAuth() {
  if (!isAuthConfigured) {
    throw new Error("Auth is not configured.");
  }

  authInstance ??= createConfiguredAuth();

  return authInstance;
}

export const auth = new Proxy({} as ConfiguredAuth, {
  get(_target, property) {
    return getAuth()[property as keyof ConfiguredAuth];
  },
});

export type Session = ConfiguredAuth["$Infer"]["Session"];
export { isAuthConfigured };
