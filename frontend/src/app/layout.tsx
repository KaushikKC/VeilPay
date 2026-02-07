import "~/styles/globals.css";

import { type Metadata } from "next";
import { Anton, Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "VeilPay — Private Payments on Sui",
  description:
    "Send and receive payments privately on the Sui blockchain. Zero-knowledge proofs ensure your financial data stays yours.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body className="bg-green-950 font-sans text-white antialiased">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
