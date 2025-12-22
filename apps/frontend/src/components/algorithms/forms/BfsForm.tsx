import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BFSRequestSchema, type BFSRequest, BFSResponseSchema } from '@/lib/schemas';
import { useAppStore } from '@/stores/useAppStore';
import { runAlgorithm } from '@/lib/api/mutations';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function BfsForm() {
  const apiBaseUrl = useAppStore((s) => s.apiBaseUrl);
  const loadedGraph = useAppStore((s) => s.loadedGraph);
  const loadedGraphSnapshotId = useAppStore((s) => s.loadedGraphSnapshotId);
  const setAlgorithmResult = useAppStore((s) => s.setAlgorithmResult);
  const setHighlights = useAppStore((s) => s.setHighlights);
  const clearHighlights = useAppStore((s) => s.clearHighlights);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nodes = loadedGraph?.nodes.map(n => n.id).sort() || [];

  const form = useForm<BFSRequest>({
    resolver: zodResolver(BFSRequestSchema),
    defaultValues: {
      start_node: '',
    },
  });

  const onSubmit = async (data: BFSRequest) => {
    try {
      setLoading(true);
      setError(null);
      if (!loadedGraph) {
        throw new Error('No graph loaded');
      }
      const result = await runAlgorithm(
        apiBaseUrl,
        '/algorithms/bfs',
        {
          ...data,
          snapshot_id: loadedGraphSnapshotId ?? undefined,
          graph_payload: loadedGraph,
        },
        BFSResponseSchema
      );
      setAlgorithmResult('bfs', result);

      // Auto-highlight visited nodes
      if (result.order && result.order.length > 0) {
        setHighlights(result.order, []);
      } else {
        clearHighlights();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run BFS');
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="start_node"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono uppercase text-xs tracking-wider">Start Currency</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="border-2 border-black rounded-none shadow-none font-mono uppercase">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-2 border-black rounded-none shadow-none">
                  {nodes.map((node) => (
                    <SelectItem
                      key={node}
                      value={node}
                      className="font-mono uppercase"
                    >
                      {node}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <Alert variant="destructive" className="border-2 rounded-none">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-mono uppercase text-xs">Error</AlertTitle>
            <AlertDescription className="font-mono text-xs">{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full border-2 border-black rounded-none shadow-none font-mono uppercase text-xs"
          disabled={loading}
        >
          {loading ? 'Running...' : 'Run BFS'}
        </Button>
      </form>
    </Form>
  );
}
