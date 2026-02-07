"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Employer", href: "/app/employer" },
  { label: "Employee", href: "/app/employee" },
  { label: "Verifier", href: "/app/verifier" },
];

export function AppNavbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-white/10 px-8 py-4 backdrop-blur-md"
      style={{ backgroundColor: "rgba(2, 43, 26, 0.9)" }}
    >
      <Link href="/" className="font-display text-xl tracking-wider text-white">
        VEILPAY
      </Link>

      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative rounded-full px-5 py-2 text-sm font-medium transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-green-500"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${isActive ? "text-green-950" : "text-white/60 hover:text-white"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>

      <Link
        href="/"
        className="text-sm tracking-wide text-white/50 transition-colors hover:text-white"
      >
        Back to Home
      </Link>
    </motion.nav>
  );
}
