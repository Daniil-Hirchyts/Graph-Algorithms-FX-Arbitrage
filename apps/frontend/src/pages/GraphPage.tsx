import { useState } from 'react';
import { GraphViewer } from '@/components/graph/GraphViewer';
import { BfsForm } from '@/components/algorithms/forms/BfsForm';
import { DfsForm } from '@/components/algorithms/forms/DfsForm';
import { DijkstraForm } from '@/components/algorithms/forms/DijkstraForm';
import { BellmanFordForm } from '@/components/algorithms/forms/BellmanFordForm';
import { FloydWarshallForm } from '@/components/algorithms/forms/FloydWarshallForm';
import { MstForm } from '@/components/algorithms/forms/MstForm';
import { ResultsPanel } from '@/components/algorithms/ResultsPanel';
import { useAppStore, type EdgeId } from '@/stores/useAppStore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type AlgorithmKey =
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'bellmanFord'
  | 'floydWarshall'
  | 'mst';

export function GraphPage() {
  const [activeAlgorithm, setActiveAlgorithm] = useState<AlgorithmKey | null>(null);
  const algorithmResults = useAppStore((s) => s.algorithmResults);
  const setHighlights = useAppStore((s) => s.setHighlights);
  const clearHighlights = useAppStore((s) => s.clearHighlights);

  const algorithms: {
    key: AlgorithmKey;
    label: string;
    description: string;
    component: React.ReactNode;
    explanationId: string;
  }[] = [
    { key: 'bfs', label: 'BFS', description: 'Breadth-First Search', component: <BfsForm />, explanationId: 'bfs' },
    { key: 'dfs', label: 'DFS', description: 'Depth-First Search', component: <DfsForm />, explanationId: 'dfs' },
    { key: 'dijkstra', label: 'Dijkstra', description: 'Shortest Path', component: <DijkstraForm />, explanationId: 'dijkstra' },
    { key: 'bellmanFord', label: 'Bellman-Ford', description: 'Detect Negative Cycles', component: <BellmanFordForm />, explanationId: 'bellmanFord' },
    { key: 'floydWarshall', label: 'Floyd-Warshall', description: 'All-Pairs Shortest Paths', component: <FloydWarshallForm />, explanationId: 'floydWarshall' },
    { key: 'mst', label: 'MST', description: 'Minimum Spanning Tree', component: <MstForm />, explanationId: 'mstPrim' },
  ];

  const getCurrentResult = () => {
    if (!activeAlgorithm) return null;
    if (activeAlgorithm === 'mst') {
      return algorithmResults.mstPrim || algorithmResults.mstKruskal || null;
    }
    return algorithmResults[activeAlgorithm] || null;
  };

  const handleHighlight = () => {
    const result = getCurrentResult();
    if (!result) return;

    clearHighlights();

    const nodes: string[] = [];
    const edges: EdgeId[] = [];

    // BFS/DFS: highlight visited nodes
    if ('order' in result && result.order) {
      nodes.push(...result.order);
    }

    // Dijkstra: highlight path
    if ('path' in result && result.path) {
      nodes.push(...result.path);
      for (let i = 0; i < result.path.length - 1; i++) {
        edges.push(`${result.path[i]}->${result.path[i + 1]}` as EdgeId);
      }
    }

    // Bellman-Ford: highlight cycle if detected
    if ('cycle' in result && result.cycle) {
      nodes.push(...result.cycle);
      for (let i = 0; i < result.cycle.length - 1; i++) {
        edges.push(`${result.cycle[i]}->${result.cycle[i + 1]}` as EdgeId);
      }
      if (result.cycle.length > 0) {
        edges.push(
          `${result.cycle[result.cycle.length - 1]}->${result.cycle[0]}` as EdgeId
        );
      }
    }

    // MST: highlight edges
    if ('edges' in result && result.edges) {
      result.edges.forEach((edge) => {
        nodes.push(edge.u, edge.v);
        edges.push(`${edge.u}->${edge.v}` as EdgeId);
        edges.push(`${edge.v}->${edge.u}` as EdgeId);
      });
    }

    setHighlights([...new Set(nodes)], [...new Set(edges)]);
  };

  return (
    <div className="space-y-5 h-full flex flex-col pb-4">
      <div className="rounded-none border-2 border-black bg-gradient-to-r from-background via-muted/30 to-background px-4 py-4 shrink-0">
        <Badge className="rounded-none border border-black bg-black text-white font-mono text-[10px] uppercase">
          Graph
        </Badge>
        <h2 className="mt-2 text-2xl font-black tracking-tight">Graph Visualization</h2>
        <p className="text-sm text-muted-foreground">
          Explore the currency network, run algorithms, and highlight paths without losing layout.
        </p>
      </div>

      <Tabs defaultValue="canvas" className="flex-1 flex flex-col gap-4 min-h-0">
        <div className="shrink-0 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Views</p>
          </div>
          
          <TabsList className="bg-transparent p-0 gap-2 h-auto">
            <TabsTrigger 
              value="canvas" 
              className="rounded-none border-2 border-transparent border-b-black bg-muted/30 data-[state=active]:border-black data-[state=active]:bg-white font-mono uppercase text-xs px-4"
            >
              Canvas
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="rounded-none border-2 border-transparent border-b-black bg-muted/30 data-[state=active]:border-black data-[state=active]:bg-white font-mono uppercase text-xs px-4"
            >
              Results
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
          {/* Main Content Area - Graph and Results */}
          <div className="lg:col-span-3 h-[450px] sm:h-[550px] lg:h-full min-h-0 relative">
            <TabsContent 
              value="canvas" 
              forceMount
              className="h-full m-0 rounded-none border-2 border-black bg-background shadow-none overflow-hidden data-[state=inactive]:hidden"
            >
              <GraphViewer />
            </TabsContent>

            <TabsContent 
              value="results" 
              className="h-full m-0 rounded-none overflow-y-auto data-[state=inactive]:hidden"
            >
              <ResultsPanel
                result={getCurrentResult()}
                onHighlight={handleHighlight}
              />
            </TabsContent>
          </div>

          {/* Right Panel - Algorithms Only */}
          <div className="lg:col-span-1 flex flex-col gap-4 h-auto lg:h-full lg:overflow-hidden">
            {/* Scrollable section for algorithms */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden lg:pr-1 space-y-4">
              <Card className="border-2 border-black rounded-none shadow-none" data-tour="algorithms-panel">
                <CardHeader className="border-b-2 border-black py-2 px-3">
                  <CardTitle className="text-xs font-mono uppercase tracking-wider">Algorithms</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    onValueChange={(val) => setActiveAlgorithm(val as AlgorithmKey)}
                  >
                    {algorithms.map((algo) => {
                      return (
                        <AccordionItem key={algo.key} value={algo.key} className="border-b-2 border-black last:border-0">
                          <AccordionTrigger className="hover:no-underline font-mono px-3 py-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold uppercase">{algo.label}</span>
                              <span className="text-muted-foreground">—</span>
                              <span className="font-normal text-muted-foreground">
                                {algo.description}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-3 pt-3 pb-3 border-t-2 border-black">
                            {algo.component}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
