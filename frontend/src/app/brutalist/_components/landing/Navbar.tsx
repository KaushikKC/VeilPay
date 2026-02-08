"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
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

        {/* Hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col justify-center gap-[5px] md:hidden"
          aria-label="Toggle menu"
        >
          <span className="block h-[3px] w-6 bg-black" />
          <span className="block h-[3px] w-6 bg-black" />
          <span className="block h-[3px] w-6 bg-black" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t-4 border-black bg-white md:hidden">
          <Link
            href="#features"
            onClick={() => setMenuOpen(false)}
            className="block border-b-2 border-black px-6 py-4 text-sm font-bold uppercase tracking-wider text-black/60 transition-colors hover:bg-gray-100 hover:text-black"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            className="block border-b-2 border-black px-6 py-4 text-sm font-bold uppercase tracking-wider text-black/60 transition-colors hover:bg-gray-100 hover:text-black"
          >
            How It Works
          </Link>
          <Link
            href="/app"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4"
          >
            <span className="neo-button text-xs">Launch App</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
