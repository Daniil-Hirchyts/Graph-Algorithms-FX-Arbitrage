import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Network, GitBranch, Share2, Shuffle, Split, Grid, Link, Route } from 'lucide-react';

interface ScenarioCardProps {
  name: string;
  displayName: string;
  description: string;
  nodes: string[];
  onSelect: () => void;
  isLoading?: boolean;
}

const scenarioIcons: Record<string, React.ElementType> = {
  'negative_cycle': Shuffle,
  'sparse_graph': Link,
  'dense_graph': Grid,
  'hub_and_spoke': Share2,
  'disconnected_components': Split,
  'balanced_tree': GitBranch,
  'linear_chain': Network,
  'bfs_traversal': Network,
  'dfs_traversal': GitBranch,
  'dijkstra_paths': Route,
  'bellman_ford_arbitrage': Shuffle,
  'floyd_warshall_matrix': Grid,
  'mst_network': Share2,
};

export function ScenarioCard({ 
  name, 
  displayName, 
  description, 
  nodes,
  onSelect,
  isLoading = false 
}: ScenarioCardProps) {
  const Icon = scenarioIcons[name] || Network;
  
  return (
    <Card className="border-2 border-black rounded-none shadow-none hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
      <CardHeader className="border-b-2 border-black pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <CardTitle className="text-sm font-mono uppercase">{displayName}</CardTitle>
          </div>
          <Badge variant="outline" className="rounded-none border-black font-mono text-[10px]">
            {nodes.length} CURRENCIES
          </Badge>
        </div>
        <CardDescription className="text-xs font-mono mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {nodes.slice(0, 6).map((node) => (
              <Badge 
                key={node} 
                variant="secondary" 
                className="rounded-none text-[10px] font-mono"
              >
                {node}
              </Badge>
            ))}
            {nodes.length > 6 && (
              <Badge variant="secondary" className="rounded-none text-[10px] font-mono">
                +{nodes.length - 6}
              </Badge>
            )}
          </div>
          <Button 
            onClick={onSelect}
            disabled={isLoading}
            className="w-full border-2 border-black rounded-none bg-black text-white hover:bg-black/80 font-mono uppercase text-[11px]"
          >
            {isLoading ? 'CREATING...' : 'USE THIS SCENARIO'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
