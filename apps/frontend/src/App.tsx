import { useEffect, useState, type ReactNode } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DataPage } from '@/pages/DataPage';
import { GraphPage } from '@/pages/GraphPage';
import { LearnPage } from '@/pages/LearnPage';
import { useAppStore, type PageName } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  isActive: boolean;
  children: ReactNode;
  className?: string;
}

function PageContainer({ isActive, children, className }: PageContainerProps) {
  return (
    <div
      className={cn("w-full", isActive ? 'block' : 'hidden', className)}
      aria-hidden={!isActive}
    >
      {children}
    </div>
  );
}

function App() {
  const currentPage = useAppStore((s) => s.currentPage);
  const [mountedPages, setMountedPages] = useState<Record<PageName, boolean>>({
    data: true,
    graph: false,
    learn: false,
  });

  useEffect(() => {
    setMountedPages((prev) =>
      prev[currentPage] ? prev : { ...prev, [currentPage]: true }
    );
  }, [currentPage]);

  const pageShouldRender: Record<PageName, boolean> = {
    data: true,
    graph: mountedPages.graph || currentPage === 'graph',
    learn: mountedPages.learn || currentPage === 'learn',
  };

  return (
    <Layout>
      <div className="h-full">
        {pageShouldRender.data && (
          <PageContainer isActive={currentPage === 'data'}>
            <DataPage />
          </PageContainer>
        )}
        {pageShouldRender.graph && (
          <PageContainer isActive={currentPage === 'graph'} className="h-full">
            <GraphPage />
          </PageContainer>
        )}
        {pageShouldRender.learn && (
          <PageContainer isActive={currentPage === 'learn'}>
            <LearnPage />
          </PageContainer>
        )}
      </div>
    </Layout>
  );
}

export default App;
