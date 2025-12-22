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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Sparkles } from 'lucide-react';
import { ScenarioCard } from './ScenarioCard';
import type { GenerationRequest, GenerationParams } from '@/lib/schemas';

interface DatasetBuilderProps {
  onCreate: (config: Partial<GenerationRequest>) => Promise<void>;
  isLoading: boolean;
}

const SUPPORTED_NODES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK',
  'SGD', 'HKD', 'MXN', 'BRL', 'INR', 'CNY', 'KRW', 'ZAR', 'PLN', 'CZK',
  'TRY', 'AED', 'SAR', 'THB', 'MYR', 'IDR', 'PHP',
];

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

export function DatasetBuilder({ onCreate, isLoading }: DatasetBuilderProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('scenarios');

  const [numNodes, setNumNodes] = useState(7);
  const [valueMin, setValueMin] = useState(0.1);
  const [valueMax, setValueMax] = useState(10.0);
  const [variance, setVariance] = useState<'low' | 'medium' | 'high'>('medium');
  const [seed, setSeed] = useState<string>('');
  const [anchorNode, setAnchorNode] = useState('USD');

  const handleRandomGenerate = async () => {
    const params: GenerationParams = {
      num_nodes: numNodes,
      value_min: valueMin,
      value_max: valueMax,
      variance,
    };

    if (seed) {
      params.seed = parseInt(seed);
    }

    const selectedNodes = SUPPORTED_NODES.slice(0, numNodes);
    if (!selectedNodes.includes(anchorNode)) {
      selectedNodes[0] = anchorNode;
    }

    await onCreate({
      mode: 'random',
      generation_params: params,
      anchor_node: anchorNode,
      nodes: selectedNodes,
    });
    setOpen(false);
  };

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
        <Button className="w-full border-2 border-black rounded-none shadow-none font-mono uppercase text-[11px] bg-black text-white hover:bg-black/80">
          <Plus className="mr-2 h-4 w-4" />
          Create Snapshot
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 border-2 border-black rounded-none">
            <TabsTrigger value="scenarios" className="font-mono text-xs uppercase rounded-none">
              Preset Scenarios
            </TabsTrigger>
            <TabsTrigger value="random" className="font-mono text-xs uppercase rounded-none">
              Random Rates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="random" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-mono uppercase text-xs">Base Currency</Label>
                <Select value={anchorNode} onValueChange={setAnchorNode}>
                  <SelectTrigger className="border-2 border-black rounded-none font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black rounded-none">
                    {SUPPORTED_NODES.slice(0, 10).map((node) => (
                      <SelectItem key={node} value={node} className="font-mono">
                        {node}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-mono uppercase text-xs">
                  Number of Currencies: {numNodes}
                </Label>
                <Slider
                  value={[numNodes]}
                  onValueChange={([value]) => setNumNodes(value)}
                  min={3}
                  max={SUPPORTED_NODES.length}
                  step={1}
                  className="py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-mono uppercase text-xs">Min Rate</Label>
                <Input
                  type="number"
                  value={valueMin}
                  onChange={(e) => setValueMin(parseFloat(e.target.value) || 0.1)}
                  step="0.1"
                  min="0.01"
                  className="border-2 border-black rounded-none font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-mono uppercase text-xs">Max Rate</Label>
                <Input
                  type="number"
                  value={valueMax}
                  onChange={(e) => setValueMax(parseFloat(e.target.value) || 10.0)}
                  step="0.1"
                  min="0.1"
                  className="border-2 border-black rounded-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-mono uppercase text-xs">Variance Level</Label>
              <Select value={variance} onValueChange={(v: 'low' | 'medium' | 'high') => setVariance(v)}>
                <SelectTrigger className="border-2 border-black rounded-none font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-2 border-black rounded-none">
                  <SelectItem value="low" className="font-mono">Low (more uniform)</SelectItem>
                  <SelectItem value="medium" className="font-mono">Medium (balanced)</SelectItem>
                  <SelectItem value="high" className="font-mono">High (more varied)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-mono uppercase text-xs">Seed (Optional, for reproducibility)</Label>
              <Input
                type="number"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Leave empty for random"
                className="border-2 border-black rounded-none font-mono"
              />
            </div>

            <Button
              onClick={handleRandomGenerate}
              disabled={isLoading}
              className="w-full border-2 border-black rounded-none bg-black text-white hover:bg-black/80 font-mono uppercase"
            >
              {isLoading ? 'GENERATING...' : 'GENERATE SNAPSHOT'}
            </Button>
          </TabsContent>

          <TabsContent value="scenarios" className="mt-4">
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
