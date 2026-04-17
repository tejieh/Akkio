import * as React from "react";

interface AuthPageShellProps {
  children: React.ReactNode;
}

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="min-h-dvh overflow-hidden bg-background lg:grid lg:grid-cols-2">
      <div className="flex min-h-dvh items-center justify-center px-4 py-6 sm:px-6 lg:border-r lg:border-border lg:px-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
      <div className="hidden bg-muted lg:block" />
    </div>
  );
}
