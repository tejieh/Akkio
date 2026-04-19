"use client";

export default function Template({ children }: { children: React.ReactNode }) {
  // Next.js automatically creates a unique key for templates on navigation,
  // remounting the component natively to prevent bf-cache bugs.
  // No wrapper div is needed (which was breaking flex layouts and page scrolling).
  return <>{children}</>;
}
