"use client";

import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { FadeIn } from "~/components/FadeIn";
import Link from "next/link";
import Image from "next/image";

export default function BlogPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white text-[#171717] selection:bg-black selection:text-white">
      <Navbar />
      
      <section className="flex w-full flex-col items-center justify-center py-32 pt-40 bg-white">
        <div className="flex w-full max-w-[1200px] flex-col items-center justify-center gap-16 px-6 md:px-8">
          <div className="flex w-full flex-col items-start justify-center gap-4">
            <FadeIn>
              <h1 className="font-serif text-5xl leading-[1.1] tracking-[-0.02em] md:text-6xl lg:text-7xl">
                Blog & News
              </h1>
              <p className="mt-6 text-lg leading-[1.6] text-gray-600 md:text-xl max-w-[600px]">
                The latest insights, updates, and thoughts from the Kero team on AI research and analysis.
              </p>
            </FadeIn>
          </div>
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

      <Footer />
    </main>
  );
}
