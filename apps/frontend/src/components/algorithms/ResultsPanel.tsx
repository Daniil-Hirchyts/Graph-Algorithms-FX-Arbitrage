import { useState } from 'react';
import type {
  BFSResponse,
  DFSResponse,
  DijkstraResponse,
  BellmanFordResponse,
  FloydWarshallResponse,
  MSTResponse,
} from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type AlgorithmResult =
  | BFSResponse
  | DFSResponse
  | DijkstraResponse
  | BellmanFordResponse
  | FloydWarshallResponse
  | MSTResponse;

interface ResultsPanelProps {
  result: AlgorithmResult | null;
  onHighlight?: () => void;
}

export function ResultsPanel({ result, onHighlight }: ResultsPanelProps) {
  const [showRaw, setShowRaw] = useState(false);

  if (!result) {
    return (
      <Card className="border-2 border-black rounded-none shadow-none">
        <CardHeader className="border-b-2 border-black">
          <CardTitle className="text-sm font-mono uppercase">Results</CardTitle>
          <CardDescription className="font-mono text-xs">
            Run an algorithm to see results
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-black rounded-none shadow-none">
      <CardHeader className="border-b-2 border-black pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-sm font-mono uppercase">Results</CardTitle>
          <CardDescription className="font-mono text-xs uppercase tracking-wider">
            Algorithm: {result.algorithm}
          </CardDescription>
        </div>
        {onHighlight && (
           <Button 
             size="sm" 
             variant="outline" 
             className="border-2 border-black rounded-none font-mono uppercase text-xs h-7"
             onClick={onHighlight}
           >
             Highlight Graph
           </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {/* Summary Section */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-mono font-medium uppercase text-xs tracking-wider">Snapshot:</span>{' '}
            <span className="font-mono text-xs">{result.snapshot_id}</span>
          </div>

          {'start_node' in result && (
            <div>
              <span className="font-mono font-medium uppercase text-xs tracking-wider">Start Currency:</span>{' '}
              <span className="font-mono text-xs">{result.start_node}</span>
            </div>
          )}
          {'source' in result && (
            <div>
              <span className="font-mono font-medium uppercase text-xs tracking-wider">Source:</span>{' '}
              <span className="font-mono text-xs">{result.source}</span>
            </div>
          )}
          {'target' in result && result.target && (
            <div>
              <span className="font-mono font-medium uppercase text-xs tracking-wider">Target:</span>{' '}
              <span className="font-mono text-xs">{result.target}</span>
            </div>
          )}
          {'found' in result && (
            <div>
              <span className="font-mono font-medium uppercase text-xs tracking-wider">Found:</span>{' '}
              <Badge
                variant={result.found ? 'default' : 'destructive'}
                className="border-2 border-black rounded-none font-mono uppercase text-xs"
              >
                {result.found ? 'Yes' : 'No'}
              </Badge>
            </div>
          )}
          {'distance' in result && result.distance !== null && result.distance !== undefined && (
            <div>
              <span className="font-mono font-medium uppercase text-xs tracking-wider">Distance:</span>{' '}
              <span className="font-mono text-xs">{result.distance.toFixed(4)}</span>
            </div>
          )}
          {'negative_cycle_found' in result && (
            <div>
              <span className="font-mono font-medium uppercase text-xs tracking-wider">Cycle:</span>{' '}
              <Badge
                variant={result.negative_cycle_found ? 'destructive' : 'outline'}
                className="border-2 border-black rounded-none font-mono uppercase text-xs"
              >
                {result.negative_cycle_found ? 'Detected' : 'None'}
              </Badge>
            </div>
          )}
          {'total_cost' in result && (
            <div>
              <span className="font-mono font-medium uppercase text-xs tracking-wider">Cost:</span>{' '}
              <span className="font-mono text-xs">{result.total_cost.toFixed(4)}</span>
            </div>
          )}
          {'is_forest' in result && (
            <div>
              <span className="font-mono font-medium uppercase text-xs tracking-wider">Forest:</span>{' '}
              <span className="font-mono text-xs">{result.is_forest ? 'Yes' : 'No'}</span>
            </div>
          )}
          {'num_components' in result && (
            <div>
              <span className="font-mono font-medium uppercase text-xs tracking-wider">Components:</span>{' '}
              <span className="font-mono text-xs">{result.num_components}</span>
            </div>
          )}
          {'central_node' in result && result.central_node && (
            <div>
              <span className="font-mono font-medium uppercase text-xs tracking-wider">Central Currency:</span>{' '}
              <span className="font-mono text-xs">{result.central_node}</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          {'order' in result && result.order.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-mono font-bold uppercase tracking-wider">Traversal Order:</h4>
              <div className="flex flex-wrap gap-1">
                {result.order.map((node, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="border-2 border-black rounded-none font-mono uppercase text-xs"
                  >
                    {node}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {'path' in result && result.path.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-mono font-bold uppercase tracking-wider">Path:</h4>
              <div className="flex flex-wrap items-center gap-1">
                {result.path.map((node, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <Badge
                      variant="outline"
                      className="border-2 border-black rounded-none font-mono uppercase text-xs bg-white"
                    >
                      {node}
                    </Badge>
                    {i < result.path.length - 1 && (
                      <span className="font-mono">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {'path_details' in result && result.path_details.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-mono font-bold uppercase tracking-wider">Path Details:</h4>
              <div className="rounded-none border-2 border-black overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-black">
                      <TableHead className="font-mono uppercase text-xs">From</TableHead>
                      <TableHead className="font-mono uppercase text-xs">To</TableHead>
                      <TableHead className="font-mono uppercase text-xs">Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.path_details.map((edge, i) => (
                      <TableRow key={i} className="border-b-2 border-black">
                        <TableCell className="font-mono text-xs">{edge.from}</TableCell>
                        <TableCell className="font-mono text-xs">{edge.to}</TableCell>
                        <TableCell className="font-mono text-xs">{edge.weight.toFixed(4)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {'edges' in result && result.edges.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-mono font-bold uppercase tracking-wider">MST Edges:</h4>
              <div className="rounded-none border-2 border-black overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-black">
                      <TableHead className="font-mono uppercase text-xs">U</TableHead>
                      <TableHead className="font-mono uppercase text-xs">V</TableHead>
                      <TableHead className="font-mono uppercase text-xs">Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.edges.map((edge, i) => (
                      <TableRow key={i} className="border-b-2 border-black">
                        <TableCell className="font-mono text-xs">{edge.u}</TableCell>
                        <TableCell className="font-mono text-xs">{edge.v}</TableCell>
                        <TableCell className="font-mono text-xs">{edge.weight.toFixed(4)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {'cycle' in result && result.cycle && Array.isArray(result.cycle) && result.cycle.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-mono font-bold uppercase tracking-wider text-destructive">
                Negative Cycle:
              </h4>
              <div className="flex flex-wrap items-center gap-1">
                {(result.cycle as string[]).map((node, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <Badge
                      variant="destructive"
                      className="border-2 rounded-none font-mono uppercase text-xs"
                    >
                      {node}
                    </Badge>
                    {i < (result.cycle as string[]).length - 1 && (
                      <span className="font-mono">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Raw JSON Collapsible Section */}
        {showRaw && (
          <div className="rounded-none border-2 border-black overflow-hidden">
            <pre className="max-h-64 overflow-auto bg-muted p-3 text-xs font-mono">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
      <div className="border-t-2 border-black px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowRaw(!showRaw)}
          className="h-6 w-full p-0 font-mono uppercase text-xs tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
        >
          {showRaw ? '[-] Collapse' : '[+] Expand'} JSON
        </Button>
      </div>
    </Card>
  );
}
