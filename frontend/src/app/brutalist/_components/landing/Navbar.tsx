"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b-4 border-black bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/brutalist"
          className="text-2xl font-black uppercase tracking-widest"
        >
          VEILPAY
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-bold uppercase tracking-wider text-black/60 transition-colors hover:text-black"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-bold uppercase tracking-wider text-black/60 transition-colors hover:text-black"
          >
            How It Works
          </Link>
          <Link href="/brutalist/app" className="neo-button text-xs">
            Launch App
          </Link>
        </div>
      </div>
    </nav>
  );
}
