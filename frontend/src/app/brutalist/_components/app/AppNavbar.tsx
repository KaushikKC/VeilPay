"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWalletButton } from "./ConnectWalletButton";

const tabs = [
  { label: "EMPLOYER", href: "/app/employer" },
  { label: "EMPLOYEE", href: "/app/employee" },
  { label: "VERIFIER", href: "/app/verifier" },
];

export function AppNavbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b-4 border-black bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-0">
        <Link
          href="/"
          className="flex items-center gap-2 py-4 text-xl font-black uppercase tracking-widest"
        >
          <Image
            src="/character.svg"
            alt="VeilPay character"
            width={44}
            height={44}
            className="h-11 w-auto"
          />
          VEILPAY
        </Link>

        <div className="flex items-center">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`border-l-4 border-black px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-white text-black/60 hover:bg-gray-100 hover:text-black"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
          <div className="border-l-4 border-black px-4 py-2">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
