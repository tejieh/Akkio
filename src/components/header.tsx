"use client";

import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  isAuthenticated?: boolean;
}

export function Header({ isAuthenticated = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };

    // Check immediately on mount/route change for fast back/forward navigation sync
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isScrolled ? "pt-4 px-2" : "pt-0 px-0",
      )}
    >
      <div
        className={cn(
          "mx-auto relative flex justify-between items-center w-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isScrolled
            ? "max-w-2xl rounded-full bg-white/65 border-gray-200 backdrop-blur-md shadow-lg py-2 px-6"
            : "max-w-full rounded-none bg-transparent border-transparent shadow-none py-4 px-4 md:px-8",
        )}
      >
        {/* Logo block */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Icon */}
          <button className="md:hidden text-[#111] p-1 -ml-1">
            <Menu className="w-5 h-5" />
          </button>

          <Link
            href="/"
            className="flex items-center justify-center w-6 h-6 z-10"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <path d="M12 4L3 19H21L12 4Z" fill="#111" />
              <circle cx="12" cy="10" r="1.5" fill="white" />
              <circle cx="8" cy="16" r="1.5" fill="white" />
              <circle cx="16" cy="16" r="1.5" fill="white" />
            </svg>
          </Link>
        </div>

        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex gap-8 text-[12px] font-medium text-gray-800 uppercase tracking-wider">
          <Link href="/#" className="hover:text-black transition-colors">
            Blog
          </Link>
          <Link href="/#" className="hover:text-black transition-colors">
            Pricing
          </Link>
          <Link href="/#" className="hover:text-black transition-colors">
            Placeholder
          </Link>
        </nav>

        {/* Contact block */}
        <div className="flex-1 flex justify-end z-10">
          <Link
            href={isAuthenticated ? "/chat" : "/sign-in"}
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-[#1a1a1a] text-white rounded-full px-4 py-2 h-8 text-[12px] font-medium hover:bg-black transition-colors",
            )}
          >
            <ArrowRight className="w-3.5 h-3.5 mr-1" />
            {isAuthenticated ? "Go to Chat" : "Sign In"}
          </Link>
        </div>
      </div>
    </header>
  );
}
