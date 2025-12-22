import { useHealth } from '@/lib/api/hooks';
import { useAppStore } from '@/stores/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HealthPanel() {
  const apiBaseUrl = useAppStore((s) => s.apiBaseUrl);
  const { data: health, isLoading, error } = useHealth(apiBaseUrl);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Backend Health</CardTitle>
        </CardHeader>
        <CardContent>
           <p className="text-muted-foreground animate-pulse">[ INITIALIZING_CONNECTION... ]</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Backend Health</CardTitle>
        </CardHeader>
        <CardContent>
           <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>{String(error)}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backend Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center border-b-2 pb-2">
          <span className="font-medium">System Status</span>
          <span className={cn(
            "font-mono font-bold",
            health?.status === 'healthy' ? "text-green-600" : "text-destructive"
          )}>
            {health?.status === 'healthy' ? '[ ONLINE ]' : '[ OFFLINE ]'}
          </span>
        </div>
        
        <div className="flex justify-between items-center border-b-2 pb-2">
          <span className="font-medium">Latest Snapshot</span>
          <span className="font-mono text-sm">
            {health?.latest_snapshot ? new Date(health.latest_snapshot).toLocaleTimeString() : 'N/A'}
          </span>
        </div>

        <div className="flex justify-between items-center border-b-2 pb-2">
          <span className="font-medium">Cached Snapshots</span>
          <span className="font-mono text-sm font-bold">
            {health?.snapshot_count ?? 0}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
