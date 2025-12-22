import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GraphPayload,
  BFSResponse,
  DFSResponse,
  DijkstraResponse,
  BellmanFordResponse,
  FloydWarshallResponse,
  MSTResponse,
} from '@/lib/schemas';

export type PageName = 'data' | 'graph' | 'learn';
export type EdgeId = `${string}->${string}`;

interface AppState {
  // Navigation
  currentPage: PageName;
  setPage: (p: PageName) => void;

  // API
  apiBaseUrl: string;

  // Snapshot selection
  selectedSnapshotId: string | null;
  setSelectedSnapshotId: (id: string | null) => void;

  // Loaded graph
  loadedGraphSnapshotId: string | null;
  loadedGraph: GraphPayload | null;
  setLoadedGraph: (snapshotId: string, graph: GraphPayload) => void;

  // Algorithm results
  algorithmResults: {
    bfs?: BFSResponse;
    dfs?: DFSResponse;
    dijkstra?: DijkstraResponse;
    bellmanFord?: BellmanFordResponse;
    floydWarshall?: FloydWarshallResponse;
    mstPrim?: MSTResponse;
    mstKruskal?: MSTResponse;
  };
  setAlgorithmResult: (
    key:
      | 'bfs'
      | 'dfs'
      | 'dijkstra'
      | 'bellmanFord'
      | 'floydWarshall'
      | 'mstPrim'
      | 'mstKruskal',
    result: unknown
  ) => void;

  // Highlighting
  highlightedNodes: string[];
  highlightedEdges: EdgeId[];
  setHighlights: (nodes: string[], edges: EdgeId[]) => void;
  clearHighlights: () => void;

  // Graph UI
  edgeLabelMode: 'cost' | 'neglog' | 'none';
  setEdgeLabelMode: (m: 'cost' | 'neglog' | 'none') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Navigation
      currentPage: 'data',
      setPage: (p) => set({ currentPage: p }),

      // API
      apiBaseUrl:
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',

      // Snapshot selection
      selectedSnapshotId: null,
      setSelectedSnapshotId: (id) => set({ selectedSnapshotId: id }),

      // Loaded graph
      loadedGraphSnapshotId: null,
      loadedGraph: null,
      setLoadedGraph: (snapshotId, graph) =>
        set({ loadedGraphSnapshotId: snapshotId, loadedGraph: graph }),

      // Algorithm results
      algorithmResults: {},
      setAlgorithmResult: (key, result) =>
        set((state) => ({
          algorithmResults: {
            ...state.algorithmResults,
            [key]: result,
          },
        })),

      // Highlighting
      highlightedNodes: [],
      highlightedEdges: [],
      setHighlights: (nodes, edges) =>
        set({ highlightedNodes: nodes, highlightedEdges: edges }),
      clearHighlights: () => set({ highlightedNodes: [], highlightedEdges: [] }),

      // Graph UI
      edgeLabelMode: 'cost',
      setEdgeLabelMode: (m) => set({ edgeLabelMode: m }),
    }),
    {
      name: 'graph-algorithms-storage',
      partialize: (state) => ({
        currentPage: state.currentPage,
        selectedSnapshotId: state.selectedSnapshotId,
        loadedGraphSnapshotId: state.loadedGraphSnapshotId,
        loadedGraph: state.loadedGraph,
        algorithmResults: state.algorithmResults,
        highlightedNodes: state.highlightedNodes,
        highlightedEdges: state.highlightedEdges,
        edgeLabelMode: state.edgeLabelMode,
      }),
    }
  )
);
