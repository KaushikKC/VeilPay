import { AppNavbar } from "~/app/brutalist/_components/app/AppNavbar";

export default function BrutalistAppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-white">
      <AppNavbar />
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
