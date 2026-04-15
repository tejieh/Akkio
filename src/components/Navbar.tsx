"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
      )}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none">K</span>
          </div>
          <span className="font-semibold text-xl tracking-tight">Kero</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#product" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Product</Link>
          <Link href="/#testimonials" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Testimonials</Link>
          <Link href="/#pricing" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Pricing</Link>
          <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Blog / News</Link>
          <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Contact Us</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="https://framer.link/amWMf0u" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Log in</Link>
          <Link href="https://framer.link/amWMf0u" className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800">
            Try Free
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg p-6 flex flex-col gap-4 md:hidden">
          <Link href="/#product" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-800">Product</Link>
          <Link href="/#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-800">Testimonials</Link>
          <Link href="/#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-800">Pricing</Link>
          <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-800">Blog / News</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-800">Contact Us</Link>
          <hr className="my-2 border-gray-100" />
          <Link href="https://framer.link/amWMf0u" className="text-lg font-medium text-gray-800">Log in</Link>
          <Link href="https://framer.link/amWMf0u" className="rounded-full bg-black px-5 py-3 text-center text-base font-medium text-white">
            Try Free
          </Link>
        </div>
      )}
    </header>
  );
}
