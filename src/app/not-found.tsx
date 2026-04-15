"use client";

import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { FadeIn } from "~/components/FadeIn";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white text-[#171717] selection:bg-black selection:text-white">
      <Navbar />
      
      <section className="flex flex-1 w-full flex-col items-center justify-center py-32 pt-40 bg-white">
        <div className="flex w-full max-w-[1200px] flex-col items-center justify-center gap-16 px-6 md:px-8 text-center">
          <FadeIn className="flex flex-col items-center justify-center gap-6">
            <h1 className="font-serif text-[120px] leading-[1] tracking-[-0.02em] md:text-[180px] lg:text-[240px] text-gray-100 font-bold">
              404
            </h1>
            <h2 className="font-serif text-4xl leading-[1.1] tracking-[-0.02em] md:text-5xl lg:text-6xl mt-[-40px] md:mt-[-60px] z-10">
              Page not found
            </h2>
            <p className="max-w-[600px] text-lg leading-[1.6] text-gray-600 md:text-xl">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:bg-gray-900 shadow-xl shadow-black/10"
            >
              <ArrowLeft size={20} /> Back to Home
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}
