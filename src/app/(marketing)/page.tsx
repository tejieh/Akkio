import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Leaf,
  Zap,
  Globe,
  ArrowUpRight,
  Check,
} from "lucide-react";

export const metadata = {
  title: "Hey a Low Carbon Future",
  description:
    "A low-carbon design studio building sustainable brands and websites.",
};

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center">
      {/* Hero Container */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center">
        {/* Hero Image Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/HeroImage.png"
            alt="Sustainable future hero"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
        </div>

        {/* Hero Section */}
        <div className="flex-grow flex flex-col items-center justify-center px-4 z-10 py-4 md:py-8 w-full max-h-full">
          <h1 className="font-playfair text-[clamp(2rem,min(10vw,15vh),8rem)] leading-[0.9] tracking-[-0.03em] text-center max-w-[1200px] mx-auto flex flex-col items-center">
            <span className="text-[#111] block mb-1 drop-shadow-sm">
              Hey <span className="italic font-normal text-gray-700">a</span>{" "}
              Low
            </span>
            <span className="text-white block drop-shadow-2xl">
              Carbon Future
            </span>
            <span className="text-white block drop-shadow-2xl">
              is Possible
            </span>
          </h1>

          <p className="mt-4 md:mt-8 text-sm md:text-base text-gray-800 font-medium max-w-2xl mx-auto text-center">
            We are a design studio building low-carbon brands and websites.
          </p>

          <Button
            variant="outline"
            className="mt-6 md:mt-8 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full px-6 py-6 text-[14px] font-medium hover:bg-white transition-colors shadow-sm border-white/20"
          >
            <ArrowRight className="w-4 h-4 mr-2 text-gray-500" />
            Explore our work
          </Button>
        </div>
      </div>

      {/* Fake Section for Scrolling */}
      <section className="w-full bg-[#fcfcfc] py-32 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <h2 className="font-playfair text-4xl md:text-6xl text-[#111]">
            Our Philosophy
          </h2>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            As the urgency of the climate crisis becomes undeniable, our
            approach focuses on systematic changes in design and development.
            The visual noise of modern web design is often accompanied by
            bloated code, high energy consumption, and unnecessary server loads.
            We aim to craft digital experiences that are lightweight, fast, and
            visually striking, while minimizing carbon emissions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white p-8 rounded-2xl md:min-h-[300px] shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <Zap className="w-8 h-8 text-[#111] mb-6" strokeWidth={1.5} />
                <h3 className="font-playfair text-2xl text-[#111] mb-3">
                  Performance is Design
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  A fast website is not just a technical requirement, it is a
                  core aspect of an elegant user experience. We optimize every
                  asset and line of code to reduce payload and power demand.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl md:min-h-[300px] shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <Leaf className="w-8 h-8 text-[#111] mb-6" strokeWidth={1.5} />
                <h3 className="font-playfair text-2xl text-[#111] mb-3">
                  Sustainable Infrastructure
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We partner with green web hosts, utilizing data centers
                  powered entirely by renewable energy to ensure your digital
                  footprint is as small as possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Works Section */}
      <section className="w-full bg-[#f4f6f3] py-32 px-4 md:px-8 border-t border-[#e2e8e0]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <h2 className="font-playfair text-4xl md:text-6xl text-[#111]">
              Selected
              <br />
              Works
            </h2>
            <p className="text-gray-600 text-lg max-w-md">
              Proof that sustainability doesn&apos;t mean compromising on
              aesthetics. Explore some of our recent lightweight collaborations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group cursor-pointer">
              <div className="relative w-full aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ece9e6] to-[#ffffff] opacity-70"></div>
                <Globe
                  className="w-16 h-16 text-gray-300 relative z-10"
                  strokeWidth={1}
                />
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-medium text-[#111]">
                    EcoSphere Network
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Website & Branding · 0.12g CO2/page
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#111] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="group cursor-pointer md:mt-16">
              <div className="relative w-full aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-bl from-[#f0ebd8] to-[#ffffff] opacity-70"></div>
                <Leaf
                  className="w-16 h-16 text-gray-300 relative z-10"
                  strokeWidth={1}
                />
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-medium text-[#111]">
                    Verdant Architecture
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Portfolio Design · 0.08g CO2/page
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#111] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="w-full bg-[#111] text-white py-32 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 gap-y-16">
          <div className="lg:col-span-5">
            <h2 className="font-playfair text-4xl md:text-6xl text-white sticky top-12">
              Our
              <br className="hidden md:block" />
              Capabilities
            </h2>
          </div>
          <div className="lg:col-span-7 flex flex-col gap-12">
            {[
              {
                title: "Digital Design",
                desc: "Crafting beautiful, accessible, and intuitive interfaces that leave a lasting impression while consuming minimal resources. We prioritize vector graphics over raster images and employ efficient rendering paths.",
              },
              {
                title: "Green Development",
                desc: "Writing semantic HTML, modern CSS, and vanilla JS where possible. We avoid heavy frameworks when unnecessary, aiming for lightning-fast load times and drastically reduced server loads.",
              },
              {
                title: "Brand Identity",
                desc: "Designing visual systems that work seamlessly across digital and physical mediums. Our branding guidelines explicitly tackle carbon footprints, from color choices to typography weights.",
              },
              {
                title: "Carbon Auditing",
                desc: "Analyzing your existing digital touchpoints to find inefficiencies, bloated code, and unoptimized assets, providing a strict roadmap to slash your digital emissions.",
              },
            ].map((cap, i) => (
              <div
                key={cap.title}
                className="group border-b border-white/20 pb-12"
              >
                <div className="flex items-baseline gap-6 mb-4">
                  <span className="text-white/40 font-mono text-sm">
                    0{i + 1}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-playfair tracking-wide">
                    {cap.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed pl-11">
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full bg-[#fcfcfc] py-32 px-4 md:px-8 border-t border-gray-100 relative overflow-hidden">
        {/* Subtle decorative background blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#e8efdf]/40 to-transparent blur-3xl -z-10 rounded-full opacity-60"></div>

        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="text-center mb-16 max-w-2xl">
            <h2 className="font-playfair text-4xl md:text-5xl text-[#111] mb-6">
              Transparent Pricing
            </h2>
            <p className="text-gray-600 text-lg">
              Partner with us on your journey to a sustainable web. Choose a
              plan that aligns with your digital ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl items-center">
            {/* Pro Plan */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-xl font-medium text-[#111] mb-2">Pro</h3>
                <p className="text-gray-500 text-sm h-10">
                  Essential tools to jumpstart your eco-friendly digital
                  presence.
                </p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-semibold text-[#111]">
                    $2,500
                  </span>
                  <span className="text-gray-500 ml-2">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {[
                  "Complete Brand Audit",
                  "Low-Carbon Web Design",
                  "Monthly Energy Report",
                  "Basic SEO Optimization",
                  "Standard Support",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center text-gray-700 text-sm"
                  >
                    <Check className="w-4 h-4 text-green-600 mr-3 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-[#111] text-white hover:bg-black/80 rounded-full py-6">
                Get Started
              </Button>
            </div>

            {/* Max Plan */}
            <div className="bg-[#111] text-white rounded-3xl p-8 border border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 relative transform md:-translate-y-4 flex flex-col h-[calc(100%+2rem)]">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-[#f0ebd8] text-[#111] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-medium text-white mb-2">Max</h3>
                <p className="text-gray-400 text-sm h-10">
                  Comprehensive scaling with maximum sustainability impact.
                </p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-semibold text-white">
                    $4,800
                  </span>
                  <span className="text-gray-400 ml-2">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {[
                  "Everything in Pro",
                  "Custom Vector Illustrations",
                  "Advanced Performance Tuning",
                  "Headless CMS Integration",
                  "Quarterly Strategy Sessions",
                  "Priority Support",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center text-gray-300 text-sm"
                  >
                    <Check className="w-4 h-4 text-[#f0ebd8] mr-3 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-white text-[#111] hover:bg-gray-100 rounded-full py-6 border-0">
                Go Max
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-xl font-medium text-[#111] mb-2">
                  Enterprise
                </h3>
                <p className="text-gray-500 text-sm h-10">
                  Bespoke solutions for large organizations and complex
                  architectures.
                </p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-semibold text-[#111]">
                    Custom
                  </span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {[
                  "Dedicated Green Architecture",
                  "Multi-regional Deployment",
                  "Whitelabeling Options",
                  "Custom SLA & Uptime Guarantee",
                  "24/7 Dedicated Support",
                  "On-site Carbon Workshops",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center text-gray-700 text-sm"
                  >
                    <Check className="w-4 h-4 text-green-600 mr-3 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full bg-white text-[#111] hover:bg-gray-50 border-gray-200 rounded-full py-6"
              >
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
