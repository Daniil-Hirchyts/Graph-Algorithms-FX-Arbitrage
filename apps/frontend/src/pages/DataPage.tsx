import { useState } from 'react';
import { SnapshotsTable } from '@/components/data/SnapshotsTable';
import { GraphMetadata } from '@/components/data/GraphMetadata';
import { DatasetBuilder } from '@/components/data/DatasetBuilder';
import { useAppStore } from '@/stores/useAppStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { generateSnapshot } from '@/lib/api/mutations';
import { db } from '@/lib/db';
import { deleteSnapshot, getSnapshot, saveSnapshot } from '@/lib/snapshots';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { GenerationRequest } from '@/lib/schemas';

export function DataPage() {
  const apiBaseUrl = useAppStore((s) => s.apiBaseUrl);
  const selectedSnapshotId = useAppStore((s) => s.selectedSnapshotId);
  const setLoadedGraph = useAppStore((s) => s.setLoadedGraph);
  const setSelectedSnapshotId = useAppStore((s) => s.setSelectedSnapshotId);
  const snapshots = useLiveQuery(
    () => db.snapshots.orderBy('created_at').reverse().toArray(),
    []
  ) || [];

  const [creating, setCreating] = useState(false);
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (config: Partial<GenerationRequest>) => {
    try {
      setCreating(true);
      setError(null);
      const response = await generateSnapshot(apiBaseUrl, config);
      await saveSnapshot({
        id: response.snapshot_id,
        created_at: response.timestamp,
        dataset_type: response.dataset_type,
        scenario_id: response.scenario_id ?? null,
        graph_payload: response.graph_payload,
        node_count: response.node_count,
        edge_count: response.edge_count,
      });

      setLoadedGraph(response.snapshot_id, response.graph_payload);
      setSelectedSnapshotId(response.snapshot_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create snapshot');
    } finally {
      setCreating(false);
    }
  };

  const handleLoadGraph = async (snapshotId: string | 'latest') => {
    try {
      setLoadingGraph(true);
      setError(null);
      if (snapshotId === 'latest') {
        if (snapshots.length === 0) {
          throw new Error('No snapshots available');
        }
        const latest = snapshots[0];
        setLoadedGraph(latest.id, latest.graph_payload);
        setSelectedSnapshotId(latest.id);
        return;
      }

      const record = await getSnapshot(snapshotId);
      if (!record) {
        throw new Error('Snapshot not found');
      }
      setLoadedGraph(record.id, record.graph_payload);
      setSelectedSnapshotId(record.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load graph');
    } finally {
      setLoadingGraph(false);
    }
  };

  const handleDeleteSnapshot = async (snapshotId: string) => {
    try {
      await deleteSnapshot(snapshotId);
      if (selectedSnapshotId === snapshotId) {
        setSelectedSnapshotId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete snapshot');
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-none border-2 border-black bg-gradient-to-r from-background via-muted/30 to-background px-4 py-4">
        <Badge className="rounded-none border border-black bg-black text-white font-mono text-[10px]">Data</Badge>
        <h2 className="mt-2 text-2xl font-black tracking-tight">FX Data Management</h2>
        <p className="text-sm text-muted-foreground">
          Create FX snapshots, load graphs, and explore scenarios.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.95fr]">
        <div className="space-y-4">
          <GraphMetadata />
        </div>

        <Card className="border-2 border-black rounded-none shadow-none" data-tour="data-content">
          <CardHeader className="border-b-2 border-black pb-4">
            <CardTitle>Actions</CardTitle>
            <CardDescription>Create FX datasets and load graphs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-2">
              <DatasetBuilder onCreate={handleCreate} isLoading={creating} />

              <Button
                onClick={() => handleLoadGraph('latest')}
                disabled={loadingGraph || snapshots.length === 0}
                variant="outline"
                size="sm"
                className="w-full border-2 border-black rounded-none shadow-none font-mono uppercase text-[11px]"
              >
                <Download className="mr-2 h-4 w-4" />
                {loadingGraph ? 'Loading...' : 'Load Latest'}
              </Button>
              
            </div>

            <Separator />

            <div className="text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground">Selected Snapshot</p>
              <p>{selectedSnapshotId ? selectedSnapshotId : 'No snapshot selected yet.'}</p>
              <p className="mt-2">
                Tip: Create a snapshot to test FX paths with controlled data.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Snapshot history
          </p>
          <h3 className="text-xl font-semibold tracking-tight">Available Snapshots</h3>
        </div>
        <SnapshotsTable
          snapshots={snapshots}
          onLoadSnapshot={handleLoadGraph}
          onDeleteSnapshot={handleDeleteSnapshot}
          isLoading={loadingGraph}
        />
      </div>
    </div>
  );
}
