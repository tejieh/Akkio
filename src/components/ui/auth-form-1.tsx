"use client";

import * as React from "react";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  authClient,
  authEndpointRequest,
  getAuthErrorMessage,
  getAuthErrorStatus,
} from "@/lib/auth-client";
import { authViews, type AuthView } from "@/lib/auth-views";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.boolean().refine((value) => value === true, {
    message: "You must agree to the terms",
  }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your new password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const verifyEmailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
type PasswordFieldName = "password" | "confirmPassword";

const viewToPath: Record<AuthView, string> = {
  [authViews.SIGN_IN]: "/sign-in",
  [authViews.SIGN_UP]: "/sign-up",
  [authViews.FORGOT_PASSWORD]: "/forgot-password",
  [authViews.RESET_PASSWORD]: "/reset-password",
  [authViews.VERIFY_EMAIL]: "/verify-email",
};

interface AuthProps extends React.ComponentProps<"div"> {
  callbackURL?: string | null;
  defaultEmail?: string | null;
  defaultView?: AuthView;
  resetToken?: string | null;
  verificationToken?: string | null;
}

interface FormState {
  error: string | null;
  isLoading: boolean;
  notice: string | null;
  showConfirmPassword?: boolean;
  showPassword: boolean;
}

function mergeFormState(state: FormState, updates: Partial<FormState>) {
  return { ...state, ...updates };
}

function buildAuthPath(
  view: AuthView,
  params?: Record<string, string | null | undefined>,
) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `${viewToPath[view]}?${query}` : viewToPath[view];
}

function AuthMessage({
  message,
  tone = "error",
}: {
  message: string | null;
  tone?: "error" | "notice";
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-lg border p-4 text-sm",
        tone === "error"
          ? "border-destructive/20 bg-destructive/10 text-destructive"
          : "border-primary/20 bg-primary/10 text-foreground",
      )}
    >
      {message}
    </div>
  );
}

function AuthCard({
  children,
  description,
  footer,
  title,
}: {
  children: React.ReactNode;
  description: string;
  footer?: React.ReactNode;
  title: string;
}) {
  return (
    <>
      <div className="mb-8 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Akkio
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
      {footer ? (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </>
  );
}

function PasswordInput<TFieldValues extends FieldValues>({
  autoComplete,
  disabled,
  error,
  id,
  label,
  onToggle,
  placeholder,
  register,
  showPassword,
}: {
  autoComplete: string;
  disabled: boolean;
  error?: string;
  id: Path<TFieldValues> & PasswordFieldName;
  label: string;
  onToggle: () => void;
  placeholder: string;
  register: UseFormRegister<TFieldValues>;
  showPassword: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={cn(error && "border-destructive")}
          {...register(id)}
        />
        <Button
          aria-label={
            showPassword
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
          onClick={onToggle}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function AuthSignIn({
  defaultEmail,
  onViewChange,
}: {
  defaultEmail?: string | null;
  onViewChange: (view: AuthView, params?: Record<string, string>) => void;
}) {
  const router = useRouter();
  const [formState, setFormState] = React.useState<FormState>({
    error: null,
    notice: null,
    isLoading: false,
    showPassword: false,
  });
  const [verificationEmail, setVerificationEmail] = React.useState(
    defaultEmail ?? "",
  );

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: defaultEmail ?? "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setFormState((current) => ({
      ...current,
      error: null,
      notice: null,
      isLoading: true,
    }));

    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/chat",
    });

    if (error) {
      const message = getAuthErrorMessage(error, "Unable to sign in.");
      const requiresVerification =
        getAuthErrorStatus(error) === 403 &&
        message.toLowerCase().includes("verify");

      setVerificationEmail(requiresVerification ? data.email : "");
      setFormState((current) => ({
        ...current,
        error: requiresVerification
          ? "Your email is not verified yet. A fresh verification link has been sent."
          : message,
        isLoading: false,
      }));
      return;
    }

    startTransition(() => {
      router.push("/chat");
      router.refresh();
    });
  });

  return (
    <m.div
      key="sign-in"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="p-8"
    >
      <AuthCard
        title="Welcome back"
        description="Sign in to continue into your workspace."
        footer={
          <>
            No account?{" "}
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-sm"
              onClick={() => onViewChange(authViews.SIGN_UP)}
              disabled={formState.isLoading}
            >
              Create one
            </Button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <AuthMessage message={formState.error} />
          <AuthMessage message={formState.notice} tone="notice" />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              disabled={formState.isLoading}
              className={cn(errors.email && "border-destructive")}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <PasswordInput<SignInFormValues>
            autoComplete="current-password"
            disabled={formState.isLoading}
            error={errors.password?.message}
            id="password"
            label="Password"
            onToggle={() =>
              setFormState((current) => ({
                ...current,
                showPassword: !current.showPassword,
              }))
            }
            placeholder="••••••••"
            register={register}
            showPassword={formState.showPassword}
          />

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-sm text-muted-foreground"
              onClick={() => onViewChange(authViews.FORGOT_PASSWORD)}
              disabled={formState.isLoading}
            >
              Forgot password?
            </Button>
            {verificationEmail ? (
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-sm"
                onClick={() =>
                  onViewChange(authViews.VERIFY_EMAIL, {
                    email: verificationEmail,
                  })
                }
                disabled={formState.isLoading}
              >
                Verify email
              </Button>
            ) : null}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={formState.isLoading}
          >
            {formState.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </AuthCard>
    </m.div>
  );
}

function AuthSignUp({
  onViewChange,
  onOtpRequired,
}: {
  onViewChange: (view: AuthView, params?: Record<string, string>) => void;
  onOtpRequired: (email: string, password: string) => void;
}) {
  const [formState, setFormState] = React.useState<FormState>({
    error: null,
    notice: null,
    isLoading: false,
    showPassword: false,
  });
  const [terms, setTerms] = React.useState(false);
  const termsLabelId = React.useId();
  const termsDescriptionId = React.useId();

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setFormState((current) => ({
      ...current,
      error: null,
      notice: null,
      isLoading: true,
    }));

    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: "/chat",
    });

    if (error) {
      setFormState((current) => ({
        ...current,
        error: getAuthErrorMessage(error, "Unable to create your account."),
        isLoading: false,
      }));
      return;
    }

    // Send OTP verification code
    const otpResponse = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    });

    if (!otpResponse.ok) {
      setFormState((current) => ({
        ...current,
        error:
          "Account created but we couldn't send a verification code. Try signing in to request one.",
        isLoading: false,
      }));
      return;
    }

    onOtpRequired(data.email, data.password);
  });

  return (
    <m.div
      key="sign-up"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="p-8"
    >
      <AuthCard
        title="Create account"
        description="Create your workspace, then verify your email before the first session starts."
        footer={
          <>
            Have an account?{" "}
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-sm"
              onClick={() => onViewChange(authViews.SIGN_IN)}
              disabled={formState.isLoading}
            >
              Sign in
            </Button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <AuthMessage message={formState.error} />

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              disabled={formState.isLoading}
              className={cn(errors.name && "border-destructive")}
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              disabled={formState.isLoading}
              className={cn(errors.email && "border-destructive")}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <PasswordInput<SignUpFormValues>
            autoComplete="new-password"
            disabled={formState.isLoading}
            error={errors.password?.message}
            id="password"
            label="Password"
            onToggle={() =>
              setFormState((current) => ({
                ...current,
                showPassword: !current.showPassword,
              }))
            }
            placeholder="Choose a strong password"
            register={register}
            showPassword={formState.showPassword}
          />

          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              aria-labelledby={termsLabelId}
              aria-describedby={termsDescriptionId}
              checked={terms}
              onCheckedChange={(checked) => {
                const nextValue = checked === true;
                setTerms(nextValue);
                setValue("terms", nextValue, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              disabled={formState.isLoading}
            />
            <div className="space-y-1">
              <Label id={termsLabelId} htmlFor="terms" className="text-sm">
                I agree to the terms
              </Label>
              <p
                id={termsDescriptionId}
                className="text-xs text-muted-foreground"
              >
                Sign-up uses email and password only. Sessions start after email
                verification.
              </p>
            </div>
          </div>
          {errors.terms ? (
            <p className="text-xs text-destructive">{errors.terms.message}</p>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={formState.isLoading}
          >
            {formState.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </AuthCard>
    </m.div>
  );
}

function AuthForgotPassword({
  defaultEmail,
  onViewChange,
}: {
  defaultEmail?: string | null;
  onViewChange: (view: AuthView, params?: Record<string, string>) => void;
}) {
  const [formState, setFormState] = React.useState<FormState>({
    error: null,
    notice: null,
    isLoading: false,
    showPassword: false,
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: defaultEmail ?? "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setFormState((current) => ({
      ...current,
      error: null,
      notice: null,
      isLoading: true,
    }));

    try {
      await authEndpointRequest({
        method: "POST",
        path: "/request-password-reset",
        body: {
          email: data.email,
          redirectTo: "/reset-password",
        },
      });

      setFormState((current) => ({
        ...current,
        notice:
          "If an account exists for that email, a password reset link has been sent.",
        isLoading: false,
      }));
    } catch (error) {
      setFormState((current) => ({
        ...current,
        error: getAuthErrorMessage(
          error as Parameters<typeof getAuthErrorMessage>[0],
          "Unable to start password reset.",
        ),
        isLoading: false,
      }));
    }
  });

  return (
    <m.div
      key="forgot-password"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="p-8"
    >
      <AuthCard
        title="Reset password"
        description="Request a reset link without exposing whether the email exists."
        footer={
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-sm"
            onClick={() => onViewChange(authViews.SIGN_IN)}
            disabled={formState.isLoading}
          >
            Back to sign in
          </Button>
        }
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <AuthMessage message={formState.error} />
          <AuthMessage message={formState.notice} tone="notice" />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              disabled={formState.isLoading}
              className={cn(errors.email && "border-destructive")}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={formState.isLoading}
          >
            {formState.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      </AuthCard>
    </m.div>
  );
}

function AuthResetPassword({
  onViewChange,
  resetToken,
}: {
  onViewChange: (view: AuthView, params?: Record<string, string>) => void;
  resetToken?: string | null;
}) {
  const [formState, setFormState] = React.useState<FormState>({
    error: null,
    notice: null,
    isLoading: false,
    showConfirmPassword: false,
    showPassword: false,
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!resetToken) {
      setFormState((current) => ({
        ...current,
        error: "This password reset link is invalid or missing.",
      }));
      return;
    }

    setFormState((current) => ({
      ...current,
      error: null,
      notice: null,
      isLoading: true,
    }));

    try {
      await authEndpointRequest({
        method: "POST",
        path: "/reset-password",
        body: {
          newPassword: data.password,
          token: resetToken,
        },
      });

      setFormState((current) => ({
        ...current,
        notice: "Password updated. You can sign in with your new password now.",
        isLoading: false,
      }));
    } catch (error) {
      setFormState((current) => ({
        ...current,
        error: getAuthErrorMessage(
          error as Parameters<typeof getAuthErrorMessage>[0],
          "This reset link is invalid, expired, or has already been used.",
        ),
        isLoading: false,
      }));
    }
  });

  return (
    <m.div
      key="reset-password"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="p-8"
    >
      <AuthCard
        title="Choose a new password"
        description="Reset the password, then sign back in with a fresh session."
        footer={
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-sm"
            onClick={() => onViewChange(authViews.SIGN_IN)}
            disabled={formState.isLoading}
          >
            Back to sign in
          </Button>
        }
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <AuthMessage message={formState.error} />
          <AuthMessage message={formState.notice} tone="notice" />

          {!resetToken ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              This password reset link is missing or malformed. Request a fresh
              link.
            </div>
          ) : null}

          <PasswordInput<ResetPasswordFormValues>
            autoComplete="new-password"
            disabled={formState.isLoading || !resetToken}
            error={errors.password?.message}
            id="password"
            label="New password"
            onToggle={() =>
              setFormState((current) => ({
                ...current,
                showPassword: !current.showPassword,
              }))
            }
            placeholder="Choose a strong password"
            register={register}
            showPassword={formState.showPassword}
          />

          <PasswordInput<ResetPasswordFormValues>
            autoComplete="new-password"
            disabled={formState.isLoading || !resetToken}
            error={errors.confirmPassword?.message}
            id="confirmPassword"
            label="Confirm password"
            onToggle={() =>
              setFormState((current) => ({
                ...current,
                showConfirmPassword: !current.showConfirmPassword,
              }))
            }
            placeholder="Repeat your new password"
            register={register}
            showPassword={Boolean(formState.showConfirmPassword)}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={formState.isLoading || !resetToken}
          >
            {formState.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating password...
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      </AuthCard>
    </m.div>
  );
}

function AuthVerifyEmail({
  callbackURL,
  defaultEmail,
  onViewChange,
  verificationToken,
}: {
  callbackURL?: string | null;
  defaultEmail?: string | null;
  onViewChange: (view: AuthView, params?: Record<string, string>) => void;
  verificationToken?: string | null;
}) {
  const [formState, updateFormState] = React.useReducer(mergeFormState, {
    error: null,
    notice: defaultEmail
      ? "Verification email pending. Check your inbox or send a fresh link."
      : null,
    isLoading: false,
    showPassword: false,
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: defaultEmail ?? "",
    },
  });

  React.useEffect(() => {
    if (!verificationToken) {
      return;
    }

    let cancelled = false;

    const verifyEmail = async () => {
      updateFormState({
        error: null,
        notice: "Verifying your email...",
        isLoading: true,
      });

      try {
        const response = await authEndpointRequest({
          method: "GET",
          path: "/verify-email",
          query: {
            token: verificationToken,
            callbackURL: callbackURL ?? "/chat",
          },
        });

        if (cancelled) {
          return;
        }

        if (response.redirectedTo) {
          const redirectedUrl = new URL(response.redirectedTo);
          if (redirectedUrl.pathname === "/sign-in") {
            throw new Error(
              "This verification link is invalid, expired, or already used.",
            );
          }
        }

        updateFormState({
          notice: "Email verified. Redirecting to your workspace...",
          isLoading: false,
        });

        window.location.assign(response.redirectedTo ?? callbackURL ?? "/chat");
      } catch (error) {
        if (cancelled) {
          return;
        }

        updateFormState({
          error: getAuthErrorMessage(
            error as Parameters<typeof getAuthErrorMessage>[0],
            "This verification link is invalid, expired, or already used.",
          ),
          notice: null,
          isLoading: false,
        });
      }
    };

    void verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [callbackURL, verificationToken]);

  const onSubmit = handleSubmit(async (data) => {
    updateFormState({
      error: null,
      notice: null,
      isLoading: true,
    });

    try {
      await authEndpointRequest({
        method: "POST",
        path: "/send-verification-email",
        body: {
          email: data.email,
          callbackURL: callbackURL ?? "/chat",
        },
      });

      updateFormState({
        notice:
          "If that address exists and needs verification, a new link has been sent.",
        isLoading: false,
      });
    } catch (error) {
      updateFormState({
        error: getAuthErrorMessage(
          error as Parameters<typeof getAuthErrorMessage>[0],
          "Unable to resend verification email.",
        ),
        isLoading: false,
      });
    }
  });

  return (
    <m.div
      key="verify-email"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="p-8"
    >
      <AuthCard
        title="Verify email"
        description="Use the emailed link to activate your first trusted session."
        footer={
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-sm"
            onClick={() => onViewChange(authViews.SIGN_IN)}
            disabled={formState.isLoading}
          >
            Back to sign in
          </Button>
        }
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <AuthMessage message={formState.error} />
          <AuthMessage message={formState.notice} tone="notice" />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              disabled={formState.isLoading}
              className={cn(errors.email && "border-destructive")}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={formState.isLoading}
          >
            {formState.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Resend verification email"
            )}
          </Button>
        </form>
      </AuthCard>
    </m.div>
  );
}

function AuthVerifyOtp({
  email,
  password,
  onViewChange,
}: {
  email: string;
  password: string;
  onViewChange: (view: AuthView, params?: Record<string, string>) => void;
}) {
  const router = useRouter();
  const [digits, setDigits] = React.useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const code = digits.join("");

  const focusIndex = (i: number) => {
    inputRefs.current[i]?.focus();
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) {
      focusIndex(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
      focusIndex(index - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill("") as string[];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    focusIndex(Math.min(pasted.length, 5));
  };

  const verify = async (otp: string) => {
    setIsLoading(true);
    setError(null);
    setNotice(null);

    const response = await fetch("/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: otp }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setError(data.error ?? "Invalid or expired code. Try again.");
      setIsLoading(false);
      setDigits(["", "", "", "", "", ""]);
      setTimeout(() => focusIndex(0), 0);
      return;
    }

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/chat",
    });

    if (signInError) {
      setError("Verified! But sign-in failed — try signing in manually.");
      setIsLoading(false);
      return;
    }

    startTransition(() => {
      router.push("/chat");
      router.refresh();
    });
  };

  // Auto-submit once all 6 digits are filled
  React.useEffect(() => {
    if (code.length === 6 && !isLoading) {
      void verify(code);
    }
  }, [code, isLoading, verify]);

  // Focus first input on mount
  React.useEffect(() => {
    focusIndex(0);
  }, []);

  const resend = async () => {
    setIsResending(true);
    setError(null);
    setDigits(["", "", "", "", "", ""]);
    await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setNotice("A new code has been sent.");
    setIsResending(false);
    setTimeout(() => focusIndex(0), 0);
  };

  const displayEmail = email.length > 28 ? `${email.slice(0, 25)}…` : email;

  return (
    <m.div
      key="verify-otp"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="p-8"
    >
      <AuthCard
        title="Check your email"
        description={`Enter the 6-digit code sent to ${displayEmail}.`}
        footer={
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-sm"
            onClick={() => onViewChange(authViews.SIGN_IN)}
            disabled={isLoading}
          >
            Back to sign in
          </Button>
        }
      >
        <div className="space-y-6">
          <AuthMessage message={error} />
          <AuthMessage message={notice} tone="notice" />

          <div className="flex justify-center gap-2">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                disabled={isLoading}
                aria-label={`Digit ${i + 1} of 6`}
                className={cn(
                  "h-14 w-11 rounded-lg border bg-background text-center text-xl font-semibold",
                  "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  digit ? "border-primary" : "border-input",
                  isLoading && "cursor-not-allowed opacity-50",
                )}
              />
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying…
            </div>
          ) : null}

          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive it?{" "}
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-sm"
              onClick={resend}
              disabled={isResending || isLoading}
            >
              {isResending ? "Sending…" : "Resend code"}
            </Button>
          </p>
        </div>
      </AuthCard>
    </m.div>
  );
}

export function Auth({
  callbackURL,
  className,
  defaultEmail,
  defaultView = authViews.SIGN_IN,
  resetToken,
  verificationToken,
  ...props
}: AuthProps) {
  const router = useRouter();
  const [otpContext, setOtpContext] = React.useState<{
    email: string;
    password: string;
  } | null>(null);

  const handleViewChange = React.useCallback(
    (nextView: AuthView, params?: Record<string, string>) => {
      setOtpContext(null);
      router.replace(buildAuthPath(nextView, params));
    },
    [router],
  );

  const handleOtpRequired = React.useCallback(
    (email: string, password: string) => {
      setOtpContext({ email, password });
    },
    [],
  );

  const showPrimaryTabs =
    !otpContext &&
    (defaultView === authViews.SIGN_IN || defaultView === authViews.SIGN_UP);

  return (
    <div
      data-slot="auth"
      className={cn("mx-auto w-full max-w-md", className)}
      {...props}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/90 shadow-xl backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
        <div className="relative z-10">
          {showPrimaryTabs ? (
            <div className="flex items-center justify-center gap-2 border-b border-border/60 p-3">
              <Button
                type="button"
                variant={
                  defaultView === authViews.SIGN_IN ? "default" : "ghost"
                }
                className="rounded-full"
                onClick={() => handleViewChange(authViews.SIGN_IN)}
              >
                Sign in
              </Button>
              <Button
                type="button"
                variant={
                  defaultView === authViews.SIGN_UP ? "default" : "ghost"
                }
                className="rounded-full"
                onClick={() => handleViewChange(authViews.SIGN_UP)}
              >
                Sign up
              </Button>
            </div>
          ) : null}

          <LazyMotion features={domAnimation}>
            <AnimatePresence initial={false} mode="wait">
              {otpContext ? (
                <AuthVerifyOtp
                  key="verify-otp"
                  email={otpContext.email}
                  password={otpContext.password}
                  onViewChange={handleViewChange}
                />
              ) : defaultView === authViews.SIGN_IN ? (
                <AuthSignIn
                  defaultEmail={defaultEmail}
                  onViewChange={handleViewChange}
                />
              ) : defaultView === authViews.SIGN_UP ? (
                <AuthSignUp
                  onViewChange={handleViewChange}
                  onOtpRequired={handleOtpRequired}
                />
              ) : defaultView === authViews.FORGOT_PASSWORD ? (
                <AuthForgotPassword
                  defaultEmail={defaultEmail}
                  onViewChange={handleViewChange}
                />
              ) : defaultView === authViews.RESET_PASSWORD ? (
                <AuthResetPassword
                  onViewChange={handleViewChange}
                  resetToken={resetToken}
                />
              ) : defaultView === authViews.VERIFY_EMAIL ? (
                <AuthVerifyEmail
                  callbackURL={callbackURL}
                  defaultEmail={defaultEmail}
                  onViewChange={handleViewChange}
                  verificationToken={verificationToken}
                />
              ) : null}
            </AnimatePresence>
          </LazyMotion>
        </div>
      </div>
    </div>
  );
}
