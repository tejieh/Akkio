"use client";

import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { FadeIn } from "~/components/FadeIn";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white text-[#171717] selection:bg-black selection:text-white">
      <Navbar />
      
      <section className="flex w-full flex-col items-center justify-center py-32 pt-40 bg-white">
        <div className="flex w-full max-w-[1200px] flex-col items-center justify-center gap-16 px-6 md:px-8">
          <div className="flex w-full flex-col md:flex-row gap-16 md:gap-24">
            
            <div className="w-full md:w-1/2 flex flex-col gap-8">
              <FadeIn>
                <h1 className="font-serif text-5xl leading-[1.1] tracking-[-0.02em] md:text-6xl lg:text-7xl">
                  Contact Us
                </h1>
                <p className="mt-6 text-lg leading-[1.6] text-gray-600 md:text-xl">
                  Have questions about Kero? We&apos;re here to help. Reach out to our team and we&apos;ll get back to you as soon as possible.
                </p>
              </FadeIn>
              
              <FadeIn delay={0.1} className="flex flex-col gap-6 mt-8">
                <div>
                  <h3 className="text-xl font-medium mb-2">Sales</h3>
                  <p className="text-gray-600 mb-2">Interested in enterprise plans or custom solutions?</p>
                  <a href="mailto:sales@kero.ai" className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1">
                    sales@kero.ai <ArrowRight size={16} />
                  </a>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Support</h3>
                  <p className="text-gray-600 mb-2">Need help with your account or have a technical issue?</p>
                  <a href="mailto:support@kero.ai" className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1">
                    support@kero.ai <ArrowRight size={16} />
                  </a>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.2} className="w-full md:w-1/2">
              <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
                <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="name" className="rounded-xl border border-gray-300 px-4 py-3 focus:border-black focus:outline-none focus:ring-1 focus:ring-black" placeholder="Jane Doe" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Work Email</label>
                    <input type="email" id="email" className="rounded-xl border border-gray-300 px-4 py-3 focus:border-black focus:outline-none focus:ring-1 focus:ring-black" placeholder="jane@company.com" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                    <textarea id="message" rows={4} className="rounded-xl border border-gray-300 px-4 py-3 focus:border-black focus:outline-none focus:ring-1 focus:ring-black" placeholder="How can we help you?"></textarea>
                  </div>
                  <button type="submit" className="mt-2 w-full rounded-full bg-black px-6 py-4 text-center font-medium text-white transition-colors hover:bg-gray-800">
                    Send Message
                  </button>
                </form>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
