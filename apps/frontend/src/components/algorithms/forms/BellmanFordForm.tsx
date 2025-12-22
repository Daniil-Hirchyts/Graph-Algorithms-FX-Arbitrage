import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BellmanFordRequestSchema,
  type BellmanFordRequest,
  BellmanFordResponseSchema,
} from '@/lib/schemas';
import { useAppStore, type EdgeId } from '@/stores/useAppStore';
import { runAlgorithm } from '@/lib/api/mutations';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
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

export function BellmanFordForm() {
  const apiBaseUrl = useAppStore((s) => s.apiBaseUrl);
  const loadedGraph = useAppStore((s) => s.loadedGraph);
  const loadedGraphSnapshotId = useAppStore((s) => s.loadedGraphSnapshotId);
  const setAlgorithmResult = useAppStore((s) => s.setAlgorithmResult);
  const setHighlights = useAppStore((s) => s.setHighlights);
  const clearHighlights = useAppStore((s) => s.clearHighlights);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nodes = loadedGraph?.nodes.map(n => n.id).sort() || [];

  const form = useForm({
    resolver: zodResolver(BellmanFordRequestSchema),
    defaultValues: {
      source: '',
      detect_negative_cycle: true,
    },
  });

  const onSubmit = async (data: BellmanFordRequest) => {
    try {
      setLoading(true);
      setError(null);
      if (!loadedGraph) {
        throw new Error('No graph loaded');
      }
      const result = await runAlgorithm(
        apiBaseUrl,
        '/algorithms/bellman-ford',
        {
          ...data,
          snapshot_id: loadedGraphSnapshotId ?? undefined,
          graph_payload: loadedGraph,
        },
        BellmanFordResponseSchema
      );
      setAlgorithmResult('bellmanFord', result);

      // Auto-highlight cycle if detected
      if (result.cycle && result.cycle.length > 0) {
        const nodes = result.cycle;
        const edges: EdgeId[] = [];
        for (let i = 0; i < result.cycle.length - 1; i++) {
          edges.push(`${result.cycle[i]}->${result.cycle[i + 1]}` as EdgeId);
        }
        // Close the cycle
        if (result.cycle.length > 0) {
          edges.push(
            `${result.cycle[result.cycle.length - 1]}->${result.cycle[0]}` as EdgeId
          );
        }
        setHighlights(nodes, edges);
      } else {
        clearHighlights();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to run Bellman-Ford'
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono uppercase text-xs tracking-wider">Source Currency</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="border-2 border-black rounded-none shadow-none font-mono uppercase">
                    <SelectValue placeholder="Select source" />
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

        <FormField
          control={form.control}
          name="detect_negative_cycle"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-none border-2 border-black p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-2 border-black rounded-none"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-mono uppercase text-xs tracking-wider">
                  Detect Arbitrage Cycles
                </FormLabel>
                <FormDescription className="font-mono text-xs">
                  Check for arbitrage opportunities
                </FormDescription>
              </div>
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
          {loading ? 'Running...' : 'Run Bellman-Ford'}
        </Button>
      </form>
    </Form>
  );
}
