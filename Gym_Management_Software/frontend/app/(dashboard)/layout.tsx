import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 pl-64">
        <Topbar />
        <main className="p-6 flex-1 overflow-x-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}
