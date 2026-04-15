"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Check, Menu, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { FadeIn } from "~/components/FadeIn";

function TextFluxUnveil({ text }: { text: string }) {
  const words = text.split(" ");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <div ref={containerRef} className="flex flex-wrap justify-center gap-x-2 gap-y-4">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
        
        return (
          <motion.span
            key={i}
            style={{ opacity }}
            className="text-2xl md:text-4xl lg:text-5xl font-medium text-white"
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}

// --- Main Page ---

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white text-[#171717] selection:bg-black selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden pt-20 pb-32">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <Image
            src="https://framerusercontent.com/images/EqTvMX987cRyoYGTSVcaTDhwgWM.jpg"
            alt="Hero Background"
            fill
            className="object-cover object-top"
            priority
          />
          {/* Gradient overlay to ensure text readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white" />
        </motion.div>
        
        <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center justify-center gap-10 px-6 text-center mt-20">
          <FadeIn className="flex max-w-[960px] flex-col items-center justify-center gap-6">
            <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] lg:text-[80px]">
              AI research and analysis for modern teams
            </h1>
            <p className="max-w-[600px] text-lg leading-[1.6] text-gray-700 md:text-xl">
              Analyze documents, generate reports, and produce executive-ready summaries — all in one tool.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.2} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="https://framer.link/amWMf0u"
              className="rounded-full bg-black px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:bg-gray-900 shadow-xl shadow-black/10"
            >
              Try for Free
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Product Section */}
      <section id="product" className="flex w-full flex-col items-center justify-center py-32 bg-white">
        <div className="flex w-full max-w-[1200px] flex-col items-center justify-center gap-24 px-6 md:px-8">
          <FadeIn className="flex max-w-[820px] flex-col items-center justify-center gap-6 text-center">
            <h2 className="font-serif text-4xl leading-[1.1] tracking-[-0.02em] md:text-5xl lg:text-6xl">
              Deep research for modern work
            </h2>
            <p className="text-lg leading-[1.6] text-gray-600 md:text-xl">
              Transform complex research into clear insights and confident decision-making.
            </p>
          </FadeIn>

          <div className="flex w-full flex-col gap-32">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <FadeIn className="w-full md:w-1/2 flex flex-col gap-6">
                <div className="inline-flex w-fit items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-800">
                  Linked Sources
                </div>
                <h3 className="font-serif text-3xl md:text-4xl tracking-tight">Source Correlation</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Explore reports and complex documents with structured extraction, section-level comparison, and clear highlights so teams can review key findings without reading.
                </p>
                <Link href="#pricing" className="group mt-2 inline-flex items-center gap-2 font-medium text-black">
                  View Pricing & Plans 
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </FadeIn>
              <FadeIn delay={0.2} className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] w-full rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 shadow-sm">
                  <Image
                    src="https://framerusercontent.com/images/1UyOioRjb1fRESCEjuhMJUErAlA.jpg"
                    alt="Source Correlation UI Mockup"
                    fill
                    className="object-cover"
                  />
                </div>
              </FadeIn>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
              <FadeIn className="w-full md:w-1/2 flex flex-col gap-6">
                <div className="inline-flex w-fit items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-800">
                  Report Builder
                </div>
                <h3 className="font-serif text-3xl md:text-4xl tracking-tight">Report Generation</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Examine lengthy reports and dense docs with guided parsing, side-by-side comparison, and clear highlights so teams can surface key insights without manual review.
                </p>
                <Link href="#pricing" className="group mt-2 inline-flex items-center gap-2 font-medium text-black">
                  View Pricing & Plans 
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </FadeIn>
              <FadeIn delay={0.2} className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] w-full rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 shadow-sm">
                  <Image
                    src="https://framerusercontent.com/images/2S9MZkkrhQhX1BXE7eQesdMNEk.jpg"
                    alt="Report Generation UI Mockup"
                    fill
                    className="object-cover"
                  />
                </div>
              </FadeIn>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <FadeIn className="w-full md:w-1/2 flex flex-col gap-6">
                <div className="inline-flex w-fit items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-800">
                  Search Insights
                </div>
                <h3 className="font-serif text-3xl md:text-4xl tracking-tight">Research Analysis</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Interpret large reports and detailed documents using automated function, cross-section comparison, and clear highlights so teams can spot what matters without manual review.
                </p>
                <Link href="#pricing" className="group mt-2 inline-flex items-center gap-2 font-medium text-black">
                  View Pricing & Plans 
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </FadeIn>
              <FadeIn delay={0.2} className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] w-full rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 shadow-sm">
                  <Image
                    src="https://framerusercontent.com/images/89dxBkhlY82YRVjvzzxceldnL0.jpg"
                    alt="Research Analysis UI Mockup"
                    fill
                    className="object-cover"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="flex w-full flex-col items-center justify-center bg-[#FAFAFA] py-32">
        <div className="flex w-full max-w-[1200px] flex-col items-center justify-center gap-20 px-6 md:px-8">
          <FadeIn className="flex max-w-[820px] flex-col items-center justify-center gap-6 text-center">
            <h2 className="font-serif text-4xl leading-[1.1] tracking-[-0.02em] md:text-5xl lg:text-6xl">
              Hear from customers like you
            </h2>
            <p className="text-lg leading-[1.6] text-gray-600 md:text-xl">
              Discover what brought them to us, what they tried before, and how they work today.
            </p>
          </FadeIn>
          
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
            <FadeIn delay={0.1}>
              <div className="flex h-full flex-col justify-between rounded-[32px] bg-white p-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <p className="text-xl md:text-2xl leading-relaxed text-gray-800 font-medium">
                  &quot;This tool transformed how we do research. We can scan sources, generate summaries, and deliver insights in a fraction of the time.&quot;
                </p>
                <div className="mt-12 flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                    <Image
                      src="https://framerusercontent.com/images/xOeofCFdYTCvctAM7dTQu3f0oXU.jpg"
                      alt="James Gawley Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-black">James Gawley</div>
                    <div className="text-sm text-gray-500">CEO NeoRick</div>
                  </div>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="flex h-full flex-col justify-between rounded-[32px] bg-white p-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <p className="text-xl md:text-2xl leading-relaxed text-gray-800 font-medium">
                  &quot;The AI research analyst helps our team scan complex information quickly and accurately, making strategic decisions easier and far more data-driven.&quot;
                </p>
                <div className="mt-12 flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                    <Image
                      src="https://framerusercontent.com/images/xOeofCFdYTCvctAM7dTQu3f0oXU.jpg"
                      alt="Sophia Kunz Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-black">Sophia Kunz</div>
                    <div className="text-sm text-gray-500">CTO Analyx</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="flex w-full flex-col items-center justify-center py-32">
        <div className="flex w-full max-w-[1200px] flex-col items-center justify-center gap-20 px-6 md:px-8">
          <FadeIn className="flex max-w-[820px] flex-col items-center justify-center gap-6 text-center">
            <h2 className="font-serif text-4xl leading-[1.1] tracking-[-0.02em] md:text-5xl lg:text-6xl">
              Simple, scalable pricing
            </h2>
          </FadeIn>

          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
            {/* Starter */}
            <FadeIn delay={0.1} className="flex flex-col rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Start</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">$79</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">For teams getting started.<br/>Billed Yearly</p>
              </div>
              <div className="mb-8 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Features</p>
                <ul className="flex flex-col gap-3 text-sm text-gray-700">
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Core AI research</li>
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Multi-source comparison</li>
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Key insight extraction</li>
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Structured research workspace</li>
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Export to PDF and Markdown</li>
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Email support</li>
                </ul>
              </div>
              <Link href="/contact" aria-label="Get started with Start plan" className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-center font-medium transition-colors hover:bg-gray-50">
                Get Started
              </Link>
            </FadeIn>

            {/* Plus */}
            <FadeIn delay={0.2} className="flex flex-col rounded-[32px] border-2 border-black bg-white p-8 shadow-lg relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-1 text-xs font-medium text-white">
                Most Popular
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Plus</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">$149</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">For teams running research.<br/>Billed Yearly</p>
              </div>
              <div className="mb-8 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Features</p>
                <ul className="flex flex-col gap-3 text-sm text-gray-700">
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Everything in Start, plus:</li>
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Advanced source synthesis</li>
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Comparison and analysis</li>
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Collaboration and workspaces</li>
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Priority processing for docs</li>
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Priority support</li>
                </ul>
              </div>
              <Link href="/contact" aria-label="Get started with Plus plan" className="w-full rounded-full bg-black px-6 py-3 text-center font-medium text-white transition-colors hover:bg-gray-800">
                Get Started
              </Link>
            </FadeIn>

            {/* Ultra */}
            <FadeIn delay={0.3} className="flex flex-col rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Ultra</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">$229</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">For teams with ultra needs.<br/>Billed Yearly</p>
              </div>
              <div className="mb-8 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Features</p>
                <ul className="flex flex-col gap-3 text-sm text-gray-700">
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Everything in Plus, plus:</li>
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Large-scale docs processing</li>
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Advanced insight and detection</li>
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Custom templates and workflows</li>
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> API access for internal tools</li>
                  <li className="flex items-center gap-3"><Check size={16} className="text-black" /> Dedicated support</li>
                </ul>
              </div>
              <Link href="/contact" aria-label="Get started with Ultra plan" className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-center font-medium transition-colors hover:bg-gray-50">
                Get Started
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features Section (Dark) */}
      <section className="flex w-full flex-col items-center justify-center bg-[#0A0A0A] py-32 text-white overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://framerusercontent.com/images/fXKzJM5bPeKWaaOvAOhRYJz3aa8.png"
            alt="Feature Illustration"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center justify-center gap-20 px-6 md:px-8">
          <div className="flex w-full max-w-[900px] flex-col items-center justify-center text-center">
            <TextFluxUnveil text="From market research to internal reviews, we bring all your research into one place so you can go deeper without juggling docs, tabs, and disconnected tools." />
          </div>
          
          <FadeIn delay={0.3} className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-[800px]">
            <div className="flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 py-6 text-sm font-medium backdrop-blur-sm">Enterprise</div>
            <div className="flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 py-6 text-sm font-medium backdrop-blur-sm">Marketing</div>
            <div className="flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 py-6 text-sm font-medium backdrop-blur-sm">Leadership</div>
            <div className="flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 py-6 text-sm font-medium backdrop-blur-sm">Product & IT</div>
          </FadeIn>
          
          <FadeIn delay={0.4} className="flex flex-col gap-6 w-full max-w-[800px] mt-12">
            <div className="flex flex-col md:flex-row gap-6 border-t border-white/10 pt-6">
              <div className="w-full md:w-1/3 text-xl font-medium text-white">Research Views</div>
              <div className="w-full md:w-2/3 text-gray-400">A unified view of all documents, sources, and research input</div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 border-t border-white/10 pt-6">
              <div className="w-full md:w-1/3 text-xl font-medium text-white">Source Reviews</div>
              <div className="w-full md:w-2/3 text-gray-400">Analyze and compare information across multiple trusted sources.</div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 border-t border-white/10 pt-6">
              <div className="w-full md:w-1/3 text-xl font-medium text-white">Live Highlight</div>
              <div className="w-full md:w-2/3 text-gray-400">Identify overlaps and contradictions between key links.</div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 border-t border-white/10 pt-6">
              <div className="w-full md:w-1/3 text-xl font-medium text-white">Auto Summaries</div>
              <div className="w-full md:w-2/3 text-gray-400">Generate clear structured summaries from complex research.</div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 border-t border-white/10 pt-6">
              <div className="w-full md:w-1/3 text-xl font-medium text-white">Insight Finder</div>
              <div className="w-full md:w-2/3 text-gray-400">Surface key findings, patterns, and signals without review.</div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 border-t border-white/10 pt-6">
              <div className="w-full md:w-1/3 text-xl font-medium text-white">Leader Reports</div>
              <div className="w-full md:w-2/3 text-gray-400">Create structured, decision-ready reports for teams and exec.</div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Blog Section */}
      <section className="flex w-full flex-col items-center justify-center py-32 bg-white">
        <div className="flex w-full max-w-[1200px] flex-col items-center justify-center gap-16 px-6 md:px-8">
          <FadeIn className="flex w-full flex-col items-start justify-center gap-4">
            <h2 className="font-serif text-4xl leading-[1.1] tracking-[-0.02em] md:text-5xl">
              Our most recent articles
            </h2>
          </FadeIn>
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
            <FadeIn delay={0.1}>
              <Link href="/blog/kero-raises-24m" className="group flex flex-col gap-6">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gray-100">
                  <Image
                    src="https://framerusercontent.com/images/oJMn0JMIXRyu0NZ9cSstBe6B9Q.jpg"
                    alt="Kero Raises $24M Series A to Redefine AI Research"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-2xl font-medium leading-snug group-hover:underline">
                    Kero Raises $24M Series A to Redefine AI Research
                  </h3>
                  <div className="text-sm text-gray-500">Mary McDonald ・ Jan 22, 2026</div>
                </div>
              </Link>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Link href="/blog/smarter-research" className="group flex flex-col gap-6">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gray-100">
                  <Image
                    src="https://framerusercontent.com/images/s8GPxlDcxupng4c3ToZpTaaLQ.jpg"
                    alt="Smarter Research with AI for Modern Teams"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-2xl font-medium leading-snug group-hover:underline">
                    Smarter Research with AI for Modern Teams
                  </h3>
                  <div className="text-sm text-gray-500">Jozef Robinson ・ Jan 20, 2026</div>
                </div>
              </Link>
            </FadeIn>
            <FadeIn delay={0.3}>
              <Link href="/blog/january-review" className="group flex flex-col gap-6">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gray-100">
                  <Image
                    src="https://framerusercontent.com/images/gdn7G7rY1qzcykNXS1rYUKGlGM.jpg"
                    alt="January, In Review: Report Generation, Smart Research & More"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-2xl font-medium leading-snug group-hover:underline">
                    January, In Review: Report Generation, Smart Research & More
                  </h3>
                  <div className="text-sm text-gray-500">Willow Stewart ・ Jan 2, 2026</div>
                </div>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden py-40 bg-[#FAFAFA]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://framerusercontent.com/images/6XAOzotgA94ghguFV7rRw826kyo.png"
            alt="CTA Background"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center justify-center gap-10 px-6 text-center">
          <FadeIn className="flex max-w-[820px] flex-col items-center justify-center gap-6">
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.1] tracking-[-0.02em] lg:text-7xl">
              Turn research into insight
            </h2>
            <p className="max-w-[600px] text-lg leading-[1.6] text-gray-700 md:text-xl">
              A professional workspace designed to support complex research, structured analysis, and reliable insight generation.
            </p>
          </FadeIn>
          <FadeIn delay={0.2} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="https://framer.link/amWMf0u"
              className="rounded-full bg-black px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:bg-gray-900 shadow-xl shadow-black/10"
            >
              Try for Free
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-gray-200 bg-white px-8 py-4 text-base font-medium text-black transition-all hover:bg-gray-50 hover:scale-105"
            >
              Contact Us
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}
