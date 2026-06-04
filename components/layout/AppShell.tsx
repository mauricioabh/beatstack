import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen min-h-0 overflow-hidden">
      <Sidebar />
      <main className="min-h-0 min-w-0 flex-1 overflow-auto">{children}</main>
    </div>
  );
}
