"use client";

import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { FadeIn } from "~/components/FadeIn";
import Image from "next/image";
import { useParams } from "next/navigation";

const blogData = {
  "kero-raises-24m": {
    title: "Kero Raises $24M Series A to Redefine AI Research",
    date: "Jan 22, 2026",
    author: "Mary McDonald",
    image: "https://framerusercontent.com/images/oJMn0JMIXRyu0NZ9cSstBe6B9Q.jpg"
  },
  "smarter-research": {
    title: "Smarter Research with AI for Modern Teams",
    date: "Jan 20, 2026",
    author: "Jozef Robinson",
    image: "https://framerusercontent.com/images/s8GPxlDcxupng4c3ToZpTaaLQ.jpg"
  },
  "january-review": {
    title: "January, In Review: Report Generation, Smart Research & More",
    date: "Jan 2, 2026",
    author: "Willow Stewart",
    image: "https://framerusercontent.com/images/gdn7G7rY1qzcykNXS1rYUKGlGM.jpg"
  }
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogData[slug as keyof typeof blogData];

  if (!post) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-start bg-white text-[#171717] selection:bg-black selection:text-white">
        <Navbar />
        <section className="flex flex-1 w-full flex-col items-center justify-center py-32">
          <h1 className="font-serif text-4xl">Post not found</h1>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white text-[#171717] selection:bg-black selection:text-white">
      <Navbar />
      
      <section className="flex w-full flex-col items-center justify-center py-32 pt-40 bg-white">
        <div className="flex w-full max-w-[800px] flex-col items-start justify-center gap-16 px-6 md:px-8">
          <FadeIn className="w-full">
            <div className="text-sm text-gray-500 mb-6">{post.author} ・ {post.date}</div>
            <h1 className="font-serif text-4xl leading-[1.1] tracking-[-0.02em] md:text-5xl lg:text-6xl">
              {post.title}
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.1} className="w-full">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-gray-100">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="prose prose-lg prose-gray max-w-none w-full">
            <p className="text-gray-700 leading-relaxed text-xl mb-8">
              We are thrilled to announce our $24M Series A funding round, enabling us to accelerate our mission of bringing deep, AI-powered research capabilities to modern teams worldwide.
            </p>
            <h2 className="font-serif text-3xl mt-12 mb-6">The Future of Research</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              For too long, research teams have been bogged down by the manual process of reading, extracting, and synthesizing information across dozens of tabs and disconnected documents. With Kero, we&apos;ve built a unified workspace where AI handles the heavy lifting of source correlation and report generation.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              This new funding will allow us to expand our engineering team, deepen our AI models&apos; contextual understanding, and roll out new enterprise features designed specifically for large-scale document processing.
            </p>
            <blockquote className="border-l-4 border-black pl-6 my-8 italic text-gray-600 text-2xl font-serif">
              &quot;Our goal is to give every knowledge worker an AI research analyst that never sleeps, never misses a detail, and always delivers executive-ready insights.&quot;
            </blockquote>
            <p className="text-gray-700 leading-relaxed mb-6">
              Thank you to our early customers, investors, and the entire Kero team for making this milestone possible. We&apos;re just getting started.
            </p>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}
