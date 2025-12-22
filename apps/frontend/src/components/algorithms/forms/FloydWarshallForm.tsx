import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FloydWarshallRequestSchema,
  type FloydWarshallRequest,
  FloydWarshallResponseSchema,
} from '@/lib/schemas';
import { useAppStore } from '@/stores/useAppStore';
import { runAlgorithm } from '@/lib/api/mutations';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function FloydWarshallForm() {
  const apiBaseUrl = useAppStore((s) => s.apiBaseUrl);
  const loadedGraph = useAppStore((s) => s.loadedGraph);
  const loadedGraphSnapshotId = useAppStore((s) => s.loadedGraphSnapshotId);
  const setAlgorithmResult = useAppStore((s) => s.setAlgorithmResult);
  const clearHighlights = useAppStore((s) => s.clearHighlights);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FloydWarshallRequest>({
    resolver: zodResolver(FloydWarshallRequestSchema),
    defaultValues: {
      weight_mode: 'cost',
    },
  });

  const onSubmit = async (data: FloydWarshallRequest) => {
    try {
      setLoading(true);
      setError(null);
      if (!loadedGraph) {
        throw new Error('No graph loaded');
      }
      const result = await runAlgorithm(
        apiBaseUrl,
        '/algorithms/floyd-warshall',
        {
          ...data,
          snapshot_id: loadedGraphSnapshotId ?? undefined,
          graph_payload: loadedGraph,
        },
        FloydWarshallResponseSchema
      );
      setAlgorithmResult('floydWarshall', result);
      clearHighlights();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to run Floyd-Warshall'
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
          name="weight_mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono uppercase text-xs tracking-wider">Weight Mode</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-2 border-black rounded-none shadow-none font-mono uppercase">
                    <SelectValue placeholder="Select weight mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-2 border-black rounded-none shadow-none">
                  <SelectItem value="cost" className="font-mono uppercase">
                    Cost
                  </SelectItem>
                  <SelectItem value="neglog" className="font-mono uppercase">
                    Negative Log (Arbitrage)
                  </SelectItem>
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
          {loading ? 'Running...' : 'Run Floyd-Warshall'}
        </Button>
      </form>
    </Form>
  );
}
