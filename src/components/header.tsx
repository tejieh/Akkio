"use client";

import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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
    <motion.header
      key={pathname}
      initial={false}
      animate={{
        paddingTop: isScrolled ? "1rem" : "0rem",
        paddingLeft: isScrolled ? "0.5rem" : "0rem",
        paddingRight: isScrolled ? "0.5rem" : "0rem",
      }}
      transition={{
        type: "tween",
        ease: [0.22, 1, 0.36, 1],
        duration: 0.5,
      }}
      className="fixed top-0 left-0 w-full z-50 md:px-4"
    >
      <motion.div
        initial={false}
        animate={{
          borderRadius: isScrolled ? 9999 : 0,
          backgroundColor: isScrolled
            ? "rgba(255, 255, 255, 0.65)"
            : "rgba(255, 255, 255, 0)",
          borderColor: isScrolled
            ? "rgba(229, 231, 235, 1)"
            : "rgba(229, 231, 235, 0)",
          maxWidth: isScrolled ? "42rem" : "100%",
        }}
        transition={{
          type: "tween",
          ease: [0.22, 1, 0.36, 1],
          duration: 0.5,
        }}
        className={`mx-auto relative flex justify-between items-center w-full border ${
          isScrolled
            ? "max-w-2xl backdrop-blur-md shadow-lg py-2 px-6"
            : "max-w-full shadow-none py-4 px-4 md:px-8"
        }`}
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
      </motion.div>
    </motion.header>
  );
}
