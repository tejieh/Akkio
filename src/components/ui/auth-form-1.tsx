"use client";

import * as React from "react";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
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

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

interface AuthProps extends React.ComponentProps<"div"> {
  defaultView?: AuthView;
}

interface FormState {
  error: string | null;
  isLoading: boolean;
  showPassword: boolean;
}

function AuthError({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
      {message}
    </div>
  );
}

function PasswordField({
  autoComplete,
  disabled,
  error,
  id,
  label,
  placeholder,
  register,
  showPassword,
  toggleShowPassword,
}: {
  autoComplete: string;
  disabled: boolean;
  error?: string;
  id: string;
  label: string;
  placeholder: string;
  register: ReturnType<typeof useForm<SignInFormValues | SignUpFormValues>>["register"];
  showPassword: boolean;
  toggleShowPassword: () => void;
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
          {...register("password")}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
          onClick={toggleShowPassword}
          disabled={disabled}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function AuthSignIn({ onSignUp }: { onSignUp: () => void }) {
  const router = useRouter();
  const [formState, setFormState] = React.useState<FormState>({
    error: null,
    isLoading: false,
    showPassword: false,
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setFormState((current) => ({ ...current, error: null, isLoading: true }));

    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/chat",
    });

    if (error) {
      setFormState((current) => ({
        ...current,
        error: error.message || "Unable to sign in.",
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
    <motion.div
      key="sign-in"
      data-slot="auth-sign-in"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="p-8"
    >
      <div className="mb-8 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Akkio
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to continue into your workspace.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <AuthError message={formState.error} />

        <div className="space-y-2">
          <Label htmlFor="sign-in-email">Email</Label>
          <Input
            id="sign-in-email"
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

        <PasswordField
          autoComplete="current-password"
          disabled={formState.isLoading}
          error={errors.password?.message}
          id="sign-in-password"
          label="Password"
          placeholder="••••••••"
          register={register as ReturnType<typeof useForm<SignInFormValues | SignUpFormValues>>["register"]}
          showPassword={formState.showPassword}
          toggleShowPassword={() =>
            setFormState((current) => ({
              ...current,
              showPassword: !current.showPassword,
            }))
          }
        />

        <Button type="submit" className="w-full" disabled={formState.isLoading}>
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

      <p className="mt-8 text-center text-sm text-muted-foreground">
        No account?{" "}
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-sm"
          onClick={onSignUp}
          disabled={formState.isLoading}
        >
          Create one
        </Button>
      </p>
    </motion.div>
  );
}

function AuthSignUp({ onSignIn }: { onSignIn: () => void }) {
  const router = useRouter();
  const [formState, setFormState] = React.useState<FormState>({
    error: null,
    isLoading: false,
    showPassword: false,
  });

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

  const [terms, setTerms] = React.useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setFormState((current) => ({ ...current, error: null, isLoading: true }));

    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: "/chat",
    });

    if (error) {
      setFormState((current) => ({
        ...current,
        error: error.message || "Unable to create your account.",
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
    <motion.div
      key="sign-up"
      data-slot="auth-sign-up"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="p-8"
    >
      <div className="mb-8 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Akkio
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">Create account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start your SaaS workspace with email and password.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <AuthError message={formState.error} />

        <div className="space-y-2">
          <Label htmlFor="sign-up-name">Name</Label>
          <Input
            id="sign-up-name"
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
          <Label htmlFor="sign-up-email">Email</Label>
          <Input
            id="sign-up-email"
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

        <PasswordField
          autoComplete="new-password"
          disabled={formState.isLoading}
          error={errors.password?.message}
          id="sign-up-password"
          label="Password"
          placeholder="Choose a strong password"
          register={register as ReturnType<typeof useForm<SignInFormValues | SignUpFormValues>>["register"]}
          showPassword={formState.showPassword}
          toggleShowPassword={() =>
            setFormState((current) => ({
              ...current,
              showPassword: !current.showPassword,
            }))
          }
        />

        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
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
            <Label htmlFor="terms" className="text-sm">
              I agree to the terms
            </Label>
            <p className="text-xs text-muted-foreground">
              Account creation is enabled with email and password only. Google OAuth is intentionally disabled.
            </p>
          </div>
        </div>
        {errors.terms ? (
          <p className="text-xs text-destructive">{errors.terms.message}</p>
        ) : null}

        <Button type="submit" className="w-full" disabled={formState.isLoading}>
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

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Have an account?{" "}
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-sm"
          onClick={onSignIn}
          disabled={formState.isLoading}
        >
          Sign in
        </Button>
      </p>
    </motion.div>
  );
}

export function Auth({
  className,
  defaultView = authViews.SIGN_IN,
  ...props
}: AuthProps) {
  const router = useRouter();

  const handleViewChange = (nextView: AuthView) => {
    router.replace(nextView === authViews.SIGN_IN ? "/sign-in" : "/sign-up");
  };

  return (
    <div
      data-slot="auth"
      className={cn("mx-auto w-full max-w-md", className)}
      {...props}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/90 shadow-xl backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 border-b border-border/60 p-3">
            <Button
              type="button"
              variant={defaultView === authViews.SIGN_IN ? "default" : "ghost"}
              className="rounded-full"
              onClick={() => handleViewChange(authViews.SIGN_IN)}
            >
              Sign in
            </Button>
            <Button
              type="button"
              variant={defaultView === authViews.SIGN_UP ? "default" : "ghost"}
              className="rounded-full"
              onClick={() => handleViewChange(authViews.SIGN_UP)}
            >
              Sign up
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {defaultView === authViews.SIGN_IN ? (
              <AuthSignIn onSignUp={() => handleViewChange(authViews.SIGN_UP)} />
            ) : (
              <AuthSignUp onSignIn={() => handleViewChange(authViews.SIGN_IN)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
