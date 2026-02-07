"use client";

import Link from "next/link";
import { FloatingNavbar } from "~/app/_components/ui/FloatingNavbar";
import { MovingBorder } from "~/app/_components/ui/MovingBorder";

export function Navbar() {
  return (
    <FloatingNavbar>
      <div className="flex w-full items-center justify-between px-8 py-5">
        <Link href="/" className="font-display text-2xl tracking-wider text-white">
          VEILPAY
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm tracking-wide text-white/70 transition-colors hover:text-white"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm tracking-wide text-white/70 transition-colors hover:text-white"
          >
            How It Works
          </Link>
          <MovingBorder
            as="a"
            href="/app"
            className="px-6 py-2 text-sm font-semibold text-green-400"
          >
            Launch App
          </MovingBorder>
        </div>
      </div>
    </FloatingNavbar>
  );
}
