export const authViews = {
  SIGN_IN: "sign-in",
  SIGN_UP: "sign-up",
  FORGOT_PASSWORD: "forgot-password",
  RESET_PASSWORD: "reset-password",
  VERIFY_EMAIL: "verify-email",
} as const;

export type AuthView = (typeof authViews)[keyof typeof authViews];
