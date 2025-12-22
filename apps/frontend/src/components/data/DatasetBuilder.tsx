import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import { ScenarioCard } from './ScenarioCard';
import type { GenerationRequest } from '@/lib/schemas';

interface DatasetBuilderProps {
  onCreate: (config: Partial<GenerationRequest>) => Promise<void>;
  isLoading: boolean;
}

const SCENARIOS = [
  {
    name: 'negative_cycle',
    displayName: 'Arbitrage Loop',
    description: 'Dense loop with extra currencies for cycle detection.',
    nodes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'SGD'],
  },
  {
    name: 'sparse_graph',
    displayName: 'Sparse Graph',
    description: 'Minimal links in a linear chain.',
    nodes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'SGD', 'HKD', 'MXN'],
  },
  {
    name: 'dense_graph',
    displayName: 'Dense Graph',
    description: 'High density with most pairs available.',
    nodes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'SGD', 'HKD'],
  },
  {
    name: 'hub_and_spoke',
    displayName: 'Hub & Spoke',
    description: 'Star topology centered on a single node.',
    nodes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'SGD', 'HKD', 'MXN', 'BRL'],
  },
  {
    name: 'disconnected_components',
    displayName: 'Disconnected Components',
    description: 'Two clusters with no edges between them.',
    nodes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'SGD', 'HKD'],
  },
  {
    name: 'balanced_tree',
    displayName: 'Balanced Tree',
    description: 'Hierarchical tree structure for traversal tests.',
    nodes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'SGD', 'HKD', 'MXN'],
  },
  {
    name: 'linear_chain',
    displayName: 'Linear Chain',
    description: 'Single-path topology for shortest-path tests.',
    nodes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'SGD'],
  },
];

const ALGORITHM_PRESETS = [
  {
    name: 'bfs_traversal',
    displayName: 'BFS Traversal',
    description: 'Layered tree for breadth-first levels.',
    nodes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'SGD', 'HKD', 'MXN'],
  },
  {
    name: 'dfs_traversal',
    displayName: 'DFS Traversal',
    description: 'Deep chain for depth-first exploration.',
    nodes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'SGD'],
  },
  {
    name: 'dijkstra_paths',
    displayName: 'Dijkstra Paths',
    description: 'Sparse routes for shortest-path testing.',
    nodes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'SGD', 'HKD', 'MXN'],
  },
  {
    name: 'bellman_ford_arbitrage',
    displayName: 'Bellman-Ford Arbitrage',
    description: 'Cycle-heavy graph for negative-cycle detection.',
    nodes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'SGD'],
  },
  {
    name: 'floyd_warshall_matrix',
    displayName: 'Floyd-Warshall Matrix',
    description: 'Dense graph for all-pairs analysis.',
    nodes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'SGD', 'HKD'],
  },
  {
    name: 'mst_network',
    displayName: 'MST Network',
    description: 'Hub topology for minimum spanning trees.',
    nodes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'SGD', 'HKD', 'MXN', 'BRL'],
  },
];

export function DatasetBuilder({ onCreate, isLoading }: DatasetBuilderProps) {
  const [open, setOpen] = useState(false);

  const handleScenarioSelect = async (scenarioId: string) => {
    await onCreate({
      mode: 'scenario',
      scenario_id: scenarioId,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-7 px-3 text-[11px] font-medium rounded-md bg-black text-white hover:bg-black/80"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Create Dataset
        </Button>
      </DialogTrigger>
      <DialogContent className=" max-w-[70vw]! max-h-[95vh] border-2 border-black rounded-none shadow-none overflow-y-auto">
        <DialogHeader className="border-b-2 border-black pb-4">
          <DialogTitle className="font-mono uppercase text-sm tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            FX Snapshot Builder
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            Create FX datasets for testing trading algorithms.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
              Algorithm Presets
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALGORITHM_PRESETS.map((preset) => (
                <ScenarioCard
                  key={preset.name}
                  name={preset.name}
                  displayName={preset.displayName}
                  description={preset.description}
                  nodes={preset.nodes}
                  onSelect={() => handleScenarioSelect(preset.name)}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
              Topology Scenarios
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SCENARIOS.map((scenario) => (
                <ScenarioCard
                  key={scenario.name}
                  name={scenario.name}
                  displayName={scenario.displayName}
                  description={scenario.description}
                  nodes={scenario.nodes}
                  onSelect={() => handleScenarioSelect(scenario.name)}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
