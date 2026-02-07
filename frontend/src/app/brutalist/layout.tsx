import "~/styles/brutalist.css";

import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-neo-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-neo-mono",
});

export const metadata = {
  title: "VeilPay Brutalist — ZK Credentials",
  description: "Neo-brutalist version of VeilPay private payroll",
};

export default function BrutalistLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} min-h-screen bg-white text-black`}
      style={{
        fontFamily:
          "var(--font-neo-body), 'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
