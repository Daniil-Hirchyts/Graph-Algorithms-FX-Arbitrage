import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          />
        </aside>
        <main className="flex h-[calc(100vh-3.5rem)] w-full flex-col overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
