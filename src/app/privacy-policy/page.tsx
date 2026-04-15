"use client";

import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { FadeIn } from "~/components/FadeIn";

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white text-[#171717] selection:bg-black selection:text-white">
      <Navbar />
      
      <section className="flex w-full flex-col items-center justify-center py-32 pt-40 bg-white">
        <div className="flex w-full max-w-[800px] flex-col items-start justify-center gap-16 px-6 md:px-8">
          <FadeIn>
            <h1 className="font-serif text-5xl leading-[1.1] tracking-[-0.02em] md:text-6xl lg:text-7xl">
              Privacy Policy
            </h1>
            <p className="mt-6 text-lg leading-[1.6] text-gray-600 md:text-xl">
              Last updated: April 14, 2026
            </p>
          </FadeIn>
          
          <FadeIn delay={0.1} className="prose prose-lg prose-gray max-w-none">
            <h2 className="font-serif text-3xl mt-12 mb-6">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Welcome to Kero. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>
            
            <h2 className="font-serif text-3xl mt-12 mb-6">2. The data we collect about you</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).
            </p>
            <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6 space-y-2">
              <li><strong>Identity Data</strong> includes first name, maiden name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
              <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">3. How we use your personal data</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}
