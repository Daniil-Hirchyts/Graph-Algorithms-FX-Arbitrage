import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { cn, downloadJson } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SnapshotRecord } from '@/lib/db';

interface SnapshotsTableProps {
  snapshots: SnapshotRecord[];
  onLoadSnapshot: (snapshotId: string) => Promise<void>;
  onDeleteSnapshot: (snapshotId: string) => Promise<void>;
  isLoading?: boolean;
}

export function SnapshotsTable({
  snapshots,
  onLoadSnapshot,
  onDeleteSnapshot,
  isLoading: loadingExternal,
}: SnapshotsTableProps) {
  const selectedSnapshotId = useAppStore((s) => s.selectedSnapshotId);
  const setSelectedSnapshotId = useAppStore((s) => s.setSelectedSnapshotId);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      await onDeleteSnapshot(deleteId);
      if (selectedSnapshotId === deleteId) {
        setSelectedSnapshotId(null);
      }
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete snapshot:', err);
      // In a real app we'd use a toast here
    }
  };

  if (loadingExternal && snapshots.length === 0) {
    return (
      <Card className="rounded-none border-2 border-black shadow-none">
        <CardHeader className="border-b-2 border-black p-3">
          <CardTitle className="text-xs font-mono uppercase tracking-wider">Snapshots</CardTitle>
          <CardDescription className="text-xs font-mono">Loading data...</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
           <p className="font-mono text-xs animate-pulse">[ FETCHING_DATA... ]</p>
        </CardContent>
      </Card>
    );
  }

  if (snapshots.length === 0) {
    return (
      <Card className="rounded-none border-2 border-black shadow-none">
        <CardHeader className="border-b-2 border-black p-3">
          <CardTitle className="text-xs font-mono uppercase tracking-wider">Snapshots</CardTitle>
          <CardDescription className="text-xs font-mono">No data available.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="rounded-none border-2 border-black shadow-none">
        <CardHeader className="border-b-2 border-black p-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xs font-mono uppercase tracking-wider">Snapshots History</CardTitle>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">
              {snapshots.length} RECORDS
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-none border-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-black hover:bg-transparent">
                  <TableHead className="h-8 font-mono text-[10px] uppercase tracking-wider text-black font-bold">Timestamp</TableHead>
                  <TableHead className="h-8 font-mono text-[10px] uppercase tracking-wider text-black font-bold">Scenario</TableHead>
                  <TableHead className="h-8 font-mono text-[10px] uppercase tracking-wider text-black font-bold text-right">Currencies</TableHead>
                  <TableHead className="h-8 font-mono text-[10px] uppercase tracking-wider text-black font-bold text-right">Edges</TableHead>
                  <TableHead className="h-8 font-mono text-[10px] uppercase tracking-wider text-black font-bold text-center w-[90px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshots.map((snapshot) => {
                  const isSelected = selectedSnapshotId === snapshot.id;
                  return (
                    <TableRow
                      key={snapshot.id}
                      onClick={() => {
                        setSelectedSnapshotId(snapshot.id);
                        onLoadSnapshot(snapshot.id);
                      }}
                      className={cn(
                        'cursor-pointer border-b-2 border-black/20 hover:bg-black/5 transition-colors',
                        isSelected && 'bg-black text-white hover:bg-black',
                        loadingExternal && 'opacity-50 pointer-events-none'
                      )}
                    >
                      <TableCell className="py-2 font-mono text-xs">
                        {new Date(snapshot.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-2 font-mono text-xs uppercase">
                        {snapshot.scenario_id || snapshot.dataset_type}
                      </TableCell>
                      <TableCell className="py-2 font-mono text-xs text-right">{snapshot.node_count}</TableCell>
                      <TableCell className="py-2 font-mono text-xs text-right">{snapshot.edge_count}</TableCell>
                      <TableCell className="py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-6 w-6 p-0 border-2 border-black rounded-none",
                              isSelected && "border-white text-white hover:text-white hover:bg-white/10"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadJson(`${snapshot.id}.json`, snapshot);
                            }}
                            aria-label="Download snapshot JSON"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-6 w-6 p-0 border-2 border-black rounded-none hover:bg-destructive hover:text-destructive-foreground",
                              isSelected && "border-white text-white hover:text-white hover:bg-red-600"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(snapshot.id);
                            }}
                            aria-label="Delete snapshot"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {selectedSnapshotId && (
            <div className="border-t-2 border-black p-2 bg-muted/20">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Selected ID: <span className="text-black font-bold">{selectedSnapshotId}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[425px] border-2 border-black rounded-none shadow-none">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase tracking-wider">Delete Snapshot</DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Are you sure you want to delete this snapshot? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="rounded-none border-2 border-black font-mono uppercase text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="rounded-none font-mono uppercase text-xs"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
