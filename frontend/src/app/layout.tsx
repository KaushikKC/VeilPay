import "~/styles/globals.css";
import "~/styles/brutalist.css";

import { type Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "VeilPay — ZK Credentials & Private Payroll",
  description:
    "Pay employees privately on-chain. Generate zero-knowledge income proofs. Verify credentials without exposing financial data.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-neo-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-neo-mono",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body
        className="min-h-screen bg-white text-black antialiased"
        style={{
          fontFamily:
            "var(--font-neo-body), 'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
