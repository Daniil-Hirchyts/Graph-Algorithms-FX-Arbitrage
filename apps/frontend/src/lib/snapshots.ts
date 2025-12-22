import { db, type SnapshotRecord } from '@/lib/db';

export async function saveSnapshot(record: SnapshotRecord): Promise<void> {
  await db.snapshots.put(record);
}

export async function deleteSnapshot(id: string): Promise<void> {
  await db.snapshots.delete(id);
}

export async function getSnapshot(id: string): Promise<SnapshotRecord | undefined> {
  return db.snapshots.get(id);
}
