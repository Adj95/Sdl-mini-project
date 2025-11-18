import Link from 'next/link';
import { Home, LogOut, PanelLeft, Settings, User } from 'lucide-react';
import ProtectedLayout from '@/components/protected-layout';
import Header from '@/components/header';
import SidebarNav from '@/components/sidebar-nav';
import { getDevices } from '@/lib/api/devices';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Fetch devices on the server to pass to the client-side header for voice control
  const devices = await getDevices().catch(() => []);

  return (
    <ProtectedLayout>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <Link
            href="/dashboard"
            className="flex h-14 items-center justify-center gap-2 bg-primary text-lg font-semibold text-primary-foreground"
          >
            <Home className="h-6 w-6" />
            <span className="sr-only">HomeSphere</span>
          </Link>
          <SidebarNav />
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <Header devices={devices} />
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedLayout>
  );
}
