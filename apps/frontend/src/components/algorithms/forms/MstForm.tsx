import { MSTResponseSchema } from '@/lib/schemas';
import { useAppStore, type EdgeId } from '@/stores/useAppStore';
import { runAlgorithm } from '@/lib/api/mutations';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function MstForm() {
  const apiBaseUrl = useAppStore((s) => s.apiBaseUrl);
  const loadedGraph = useAppStore((s) => s.loadedGraph);
  const loadedGraphSnapshotId = useAppStore((s) => s.loadedGraphSnapshotId);
  const setAlgorithmResult = useAppStore((s) => s.setAlgorithmResult);
  const setHighlights = useAppStore((s) => s.setHighlights);
  const clearHighlights = useAppStore((s) => s.clearHighlights);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (algorithm: 'prim' | 'kruskal') => {
    try {
      setLoading(true);
      setError(null);
      if (!loadedGraph) {
        throw new Error('No graph loaded');
      }
      const endpoint =
        algorithm === 'prim'
          ? '/algorithms/mst/prim'
          : '/algorithms/mst/kruskal';
      const result = await runAlgorithm(
        apiBaseUrl,
        endpoint,
        {
          snapshot_id: loadedGraphSnapshotId ?? undefined,
          graph_payload: loadedGraph,
        },
        MSTResponseSchema
      );
      setAlgorithmResult(
        algorithm === 'prim' ? 'mstPrim' : 'mstKruskal',
        result
      );

      // Auto-highlight MST edges
      if (result.edges && result.edges.length > 0) {
        const nodes: string[] = [];
        const edges: EdgeId[] = [];
        result.edges.forEach((edge) => {
          nodes.push(edge.u, edge.v);
          edges.push(`${edge.u}->${edge.v}` as EdgeId);
          edges.push(`${edge.v}->${edge.u}` as EdgeId);
        });
        setHighlights([...new Set(nodes)], [...new Set(edges)]);
      } else {
        clearHighlights();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to run MST (${algorithm})`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!loadedGraph) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="font-mono uppercase text-xs">No Graph Loaded</AlertTitle>
        <AlertDescription className="font-mono text-xs">
          Please load a graph from the Data page first.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground font-mono uppercase text-xs tracking-wider">
        Compute Minimum Spanning Tree using Prim or Kruskal
      </p>

      {error && (
        <Alert variant="destructive" className="border-2 rounded-none">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-mono uppercase text-xs">Error</AlertTitle>
          <AlertDescription className="font-mono text-xs">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button
          onClick={() => onSubmit('prim')}
          disabled={loading}
          className="flex-1 border-2 border-black rounded-none shadow-none font-mono uppercase text-xs"
        >
          {loading ? 'Running...' : 'Run Prim'}
        </Button>
        <Button
          onClick={() => onSubmit('kruskal')}
          disabled={loading}
          variant="secondary"
          className="flex-1 border-2 border-black rounded-none shadow-none font-mono uppercase text-xs"
        >
          {loading ? 'Running...' : 'Run Kruskal'}
        </Button>
      </div>
    </div>
  );
}
