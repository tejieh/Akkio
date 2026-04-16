import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[#111] text-white pt-16 pb-8 px-4 md:px-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-16">
        <div className="col-span-1 md:col-span-2 pr-8">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-6 cursor-pointer group">
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#111] transition-colors overflow-hidden">
               <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                 <path d="M12 4L3 19H21L12 4Z" fill="currentColor" />
                 <circle cx="12" cy="10" r="1.5" fill="#111" className="group-hover:fill-white transition-colors" />
                 <circle cx="8" cy="16" r="1.5" fill="#111" className="group-hover:fill-white transition-colors" />
                 <circle cx="16" cy="16" r="1.5" fill="#111" className="group-hover:fill-white transition-colors" />
               </svg>
            </div>
            <span className="text-2xl font-playfair tracking-tight text-white">heylow</span>
          </Link>
          <p className="text-white/60 mb-6 max-w-xs text-[15px] leading-relaxed">
            A design studio crafting lightweight, low-carbon digital experiences for a sustainable future.
          </p>
          {/* Socials */}
          <div className="flex items-center gap-4 mb-8 text-white/40">
            <a href="#" className="hover:text-white transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
               <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
          {/* System Status */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded-md shadow-sm bg-white/5">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-white/80">0.12g CO2/page</span>
          </div>
        </div>
        
        <div className="col-span-1">
          <h3 className="font-playfair text-xl text-white mb-5">Capabilities</h3>
          <ul className="space-y-4 text-[14px] text-white/60 mb-10">
            <li><Link href="#" className="hover:text-white transition-colors">Digital Design</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Green Development</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Brand Identity</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Carbon Auditing</Link></li>
          </ul>
        </div>

        <div className="col-span-1">
          <h3 className="font-playfair text-xl text-white mb-5">Work</h3>
          <ul className="space-y-4 text-[14px] text-white/60 mb-10">
            <li><Link href="#" className="hover:text-white transition-colors">Selected Projects</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Case Studies</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors inline-flex items-center gap-2">Open Source <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] rounded-full font-medium tracking-wide uppercase">New</span></Link></li>
          </ul>
          
          <h3 className="font-playfair text-xl text-white mb-5">Company</h3>
          <ul className="space-y-4 text-[14px] text-white/60">
            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Manifesto</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div className="col-span-1">
          <h3 className="font-playfair text-xl text-white mb-5">Resources</h3>
          <ul className="space-y-4 text-[14px] text-white/60 mb-10">
            <li><Link href="#" className="hover:text-white transition-colors">Articles</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Carbon Calculator</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Green Hosting Guide</Link></li>
          </ul>
          
          <h3 className="font-playfair text-xl text-white mb-5">Legal</h3>
          <ul className="space-y-4 text-[14px] text-white/60 mb-10">
            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/40 border-t border-white/10">
        <p>© 2024 Heylow Design Studio. Building a low-carbon future.</p>
        <div className="flex gap-6 mt-4 md:mt-0 font-medium tracking-wide">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
