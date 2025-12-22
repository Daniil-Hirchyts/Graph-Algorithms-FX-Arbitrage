import Dexie, { type Table } from 'dexie';
import type { GraphPayload } from '@/lib/schemas';

export interface SnapshotRecord {
  id: string;
  created_at: string;
  dataset_type: string;
  scenario_id?: string | null;
  graph_payload: GraphPayload;
  node_count: number;
  edge_count: number;
}

class GraphDb extends Dexie {
  snapshots!: Table<SnapshotRecord, string>;

  constructor() {
    super('fx-graph-db');
    this.version(1).stores({
      snapshots: 'id, created_at, dataset_type, scenario_id',
    });
  }
}

export const db = new GraphDb();
