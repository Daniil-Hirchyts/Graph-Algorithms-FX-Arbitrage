import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/useAppStore';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div
        className={cn(
          "flex-1 items-start md:grid transition-[grid-template-columns] duration-300 ease-in-out",
          isSidebarCollapsed
            ? "md:grid-cols-[60px_minmax(0,1fr)]"
            : "md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]"
        )}
      >
        <aside className="fixed top-14 z-30  hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r-2 md:sticky md:block">
          <Sidebar
            collapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        </aside>
        <main className="flex h-[calc(100vh-3.5rem)] w-full flex-col overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
