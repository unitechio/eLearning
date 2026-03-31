import { SideNav } from "@/components/shared/side-nav";
import { TopNav } from "@/components/shared/top-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface flex">
      <SideNav />
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        <TopNav />
        <div className="w-full flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
