import { useHealth } from '@/lib/api/hooks';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Compass } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useTour } from '@/hooks/useTour';
import '@/styles/shepherd-custom.css';

export function Header() {
  const apiBaseUrl = useAppStore((s) => s.apiBaseUrl);
  const { data: health, isLoading } = useHealth(apiBaseUrl);
  const { startTour } = useTour();

  const isHealthy = health?.status === 'healthy';

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 bg-background">
      <div className=" flex h-14 items-center px-4 w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 border-r-2 border-black">
            <Sidebar className="h-full" />
          </SheetContent>
        </Sheet>
        
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2 font-semibold tracking-tight text-lg" href="#">
          Graph Algorithms for FX & Arbitrage
          </a>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or other controls could go here */}
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] uppercase">
            <Button
              variant="ghost"
              size="sm"
              onClick={startTour}
              className="h-8 gap-1.5 border-2 border-black bg-white hover:bg-black hover:text-white rounded-none font-mono text-[10px] uppercase tracking-wider px-3 transition-colors"
            >
              <Compass className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">Guide</span>
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground hidden sm:inline-block">Backend</span>
              {isLoading ? (
                <span className="inline-flex items-center px-2 py-1">[ Checking ]</span>
              ) : (
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-1 font-bold',
                    isHealthy ? 'text-foreground' : 'text-destructive'
                  )}
                >
                  {isHealthy ? '[ Online ]' : '[ Offline ]'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
