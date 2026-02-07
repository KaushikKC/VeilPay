"use client";

import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b-4 border-black bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-black uppercase tracking-widest"
        >
          <Image
            src="/character.svg"
            alt="VeilPay character"
            width={48}
            height={48}
            className="h-12 w-auto"
          />
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
          <Link href="/app" className="neo-button text-xs">
            Launch App
          </Link>
        </div>
      </div>
    </nav>
  );
}
