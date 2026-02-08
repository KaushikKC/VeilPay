"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWalletButton } from "./ConnectWalletButton";

const allTabs = [
  { label: "EMPLOYER", href: "/app/employer" },
  { label: "EMPLOYEE", href: "/app/employee" },
  { label: "VERIFIER", href: "/app/verifier" },
];

export function AppNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Load user role from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("veilpay_user_role");
    setUserRole(stored);
  }, [pathname]); // Re-check on pathname change

  // Show all tabs once a role is selected (easier for testing)
  const tabs = useMemo(() => {
    // Hide tabs on the role selection page until a role is chosen
    if (pathname === "/app" && !userRole) {
      return [];
    }
    // Show all tabs once any role is selected
    return allTabs;
  }, [userRole, pathname]);

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

        {/* Desktop nav */}
        <div className="hidden items-stretch md:flex">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <div key={tab.href} className="flex items-stretch">
                <div className="w-0 border-l-2 border-gray-400" />
                <Link
                  href={tab.href}
                  className={`px-5 py-4 text-sm font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-white text-black/70 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  {tab.label}
                </Link>
              </div>
            );
          })}
          <div className="flex items-stretch">
            <div className="w-0 border-l-2 border-gray-400" />
            <div className="flex items-center px-5 py-2">
              <ConnectWalletButton />
            </div>
          </div>
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
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setMenuOpen(false)}
                className={`block border-b-2 border-black px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "text-black/60 hover:bg-gray-100 hover:text-black"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
          <div className="px-6 py-4">
            <ConnectWalletButton />
          </div>
        </div>
      )}
    </nav>
  );
}
