export const authViews = {
  SIGN_IN: "sign-in",
  SIGN_UP: "sign-up",
} as const;

export type AuthView = (typeof authViews)[keyof typeof authViews];
