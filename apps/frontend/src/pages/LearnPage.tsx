import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlgorithmInfo } from '@/components/algorithms/AlgorithmInfo';
import { getAlgorithmExplanation } from '@/lib/algorithmExplanations';

type AlgorithmKey =
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'bellmanFord'
  | 'floydWarshall'
  | 'mst';

const algorithms: { key: AlgorithmKey; label: string; explanationId: string }[] = [
    { key: 'bfs', label: 'BFS', explanationId: 'bfs' },
    { key: 'dfs', label: 'DFS', explanationId: 'dfs' },
    { key: 'dijkstra', label: 'Dijkstra', explanationId: 'dijkstra' },
    { key: 'bellmanFord', label: 'Bellman-Ford', explanationId: 'bellmanFord' },
    { key: 'floydWarshall', label: 'Floyd-Warshall', explanationId: 'floydWarshall' },
    { key: 'mst', label: 'MST', explanationId: 'mstPrim' },
];

export function LearnPage() {
    return (
        <div className="space-y-6 pb-4">
            <div className="rounded-none border-2 border-black bg-gradient-to-r from-background via-muted/30 to-background px-4 py-4 shrink-0">
                <Badge className="rounded-none border border-black bg-black text-white font-mono text-[10px] uppercase">
                    Learn
                </Badge>
                <h2 className="mt-2 text-2xl font-black tracking-tight">Algorithm Reference</h2>
                <p className="text-sm text-muted-foreground">
                    Deep dive into how each algorithm works, its graph theory basis, and its application in currency markets.
                </p>
            </div>

            <div>
                <Tabs defaultValue="bfs" className="block space-y-4">
                    <TabsList className="w-full flex-wrap justify-start gap-2 bg-transparent p-0 h-auto border-b-2 border-transparent mb-4">
                        {algorithms.map((algo) => (
                            <TabsTrigger
                                key={algo.key}
                                value={algo.key}
                                className="rounded-none border-2 border-transparent border-b-black bg-muted/30 data-[state=active]:border-black data-[state=active]:bg-white font-mono uppercase text-xs px-4 py-2"
                            >
                                {algo.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div>
                        {algorithms.map((algo) => {
                             const explanation = getAlgorithmExplanation(algo.explanationId);
                             return (
                                 <TabsContent key={algo.key} value={algo.key} className="m-0 focus-visible:ring-0">
                                     {explanation ? (
                                         <div className="">
                                             <AlgorithmInfo explanation={explanation} />
                                         </div>
                                     ) : (
                                         <p className="text-muted-foreground">No explanation available.</p>
                                     )}
                                 </TabsContent>
                             );
                        })}
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
