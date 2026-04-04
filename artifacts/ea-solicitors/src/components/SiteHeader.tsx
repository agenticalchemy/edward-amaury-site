import { Link } from "wouter";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/wills-and-probate" className="text-xl font-bold text-[#1a3a4a] tracking-tight hover:opacity-80 transition-opacity">
          Edward & Amaury
        </Link>
        <a
          href="tel:01228272395"
          data-testid="header-phone"
          className="flex items-center gap-2 text-[#0e7490] font-semibold text-sm sm:text-base hover:text-[#0a5a70] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.25 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          01228 272395
        </a>
      </div>
    </header>
  );
}
