"use client";

import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { FadeIn } from "~/components/FadeIn";

export default function TermsOfServicePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white text-[#171717] selection:bg-black selection:text-white">
      <Navbar />
      
      <section className="flex w-full flex-col items-center justify-center py-32 pt-40 bg-white">
        <div className="flex w-full max-w-[800px] flex-col items-start justify-center gap-16 px-6 md:px-8">
          <FadeIn>
            <h1 className="font-serif text-5xl leading-[1.1] tracking-[-0.02em] md:text-6xl lg:text-7xl">
              Terms of Service
            </h1>
            <p className="mt-6 text-lg leading-[1.6] text-gray-600 md:text-xl">
              Last updated: April 14, 2026
            </p>
          </FadeIn>
          
          <FadeIn delay={0.1} className="prose prose-lg prose-gray max-w-none">
            <h2 className="font-serif text-3xl mt-12 mb-6">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              By accessing or using Kero&apos;s services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </p>
            
            <h2 className="font-serif text-3xl mt-12 mb-6">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Kero provides an AI-powered research and analysis platform designed for modern teams. We reserve the right to modify, suspend, or discontinue the service at any time without notice.
            </p>

            <h2 className="font-serif text-3xl mt-12 mb-6">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
            <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>You are responsible for safeguarding the password that you use to access the service.</li>
              <li>You agree not to disclose your password to any third party.</li>
              <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">4. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The service and its original content, features, and functionality are and will remain the exclusive property of Kero and its licensors. The service is protected by copyright, trademark, and other laws.
            </p>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}
