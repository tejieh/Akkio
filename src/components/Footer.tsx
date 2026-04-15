import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-white py-12 border-t border-gray-100">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-8 px-6 md:flex-row md:px-8">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none">K</span>
          </div>
          <span className="font-semibold text-xl tracking-tight">Kero</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <Link href="/blog" className="hover:text-black transition-colors">Blog / News</Link>
          <Link href="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-black transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <Link href="https://x.com" className="hover:text-black transition-colors">X / Twitter</Link>
          <Link href="https://tiktok.com" className="hover:text-black transition-colors">TikTok</Link>
          <Link href="https://linkedin.com" className="hover:text-black transition-colors">LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
}
