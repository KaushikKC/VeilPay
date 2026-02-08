import { AppNavbar } from "~/app/brutalist/_components/app/AppNavbar";
import { RoleProvider } from "~/app/_components/providers/RoleProvider";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RoleProvider>
      <div className="min-h-screen bg-white">
        <AppNavbar />
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </div>
    </RoleProvider>
  );
}
