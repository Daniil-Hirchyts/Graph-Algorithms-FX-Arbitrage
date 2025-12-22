import { useAppStore } from '@/stores/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function GraphMetadata() {
  const loadedGraph = useAppStore((s) => s.loadedGraph);
  const loadedGraphSnapshotId = useAppStore((s) => s.loadedGraphSnapshotId);

  if (!loadedGraph) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loaded Graph</CardTitle>
        </CardHeader>
        <CardContent>
           <p className="text-muted-foreground">No graph loaded.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loaded Graph</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Snapshot ID:</span>
          <span className="font-mono text-sm text-muted-foreground">
            {loadedGraphSnapshotId}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Currencies:</span>
          <span className="font-mono">{loadedGraph.metadata.node_count}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Edges:</span>
          <span className="font-mono">{loadedGraph.metadata.edge_count}</span>
        </div>
      </CardContent>
    </Card>
  );
}
