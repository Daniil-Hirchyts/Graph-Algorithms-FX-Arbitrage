import { useState } from 'react';
// @ts-expect-error - react-cytoscapejs has no type definitions
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
// @ts-expect-error - cytoscape-fcose has no type definitions
import fcose from 'cytoscape-fcose';
import { useAppStore, type EdgeId } from '@/stores/useAppStore';
import { CompactGraphControls } from './CompactGraphControls';
import { LegendPopup } from './LegendPopup';

cytoscape.use(fcose);

interface GraphViewerProps {
  onCyReady?: (cy: cytoscape.Core) => void;
}

export function GraphViewer({ onCyReady }: GraphViewerProps) {
  const loadedGraph = useAppStore((s) => s.loadedGraph);
  const highlightedEdges = useAppStore((s) => s.highlightedEdges);
  const highlightedNodes = useAppStore((s) => s.highlightedNodes);
  const edgeLabelMode = useAppStore((s) => s.edgeLabelMode);
  const showLegend = useAppStore((s) => s.showLegend);
  const toggleLegend = useAppStore((s) => s.toggleLegend);

  const [cyInstance, setCyInstance] = useState<cytoscape.Core | null>(null);

  if (!loadedGraph) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <p className="text-muted-foreground font-mono uppercase tracking-wider text-sm">No graph loaded. Select "Data" to load.</p>
      </div>
    );
  }

  const highlightedEdgesSet = new Set(highlightedEdges);
  const highlightedNodesSet = new Set(highlightedNodes);

  // Transform graph to Cytoscape format
  const elements = [
    ...loadedGraph.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.id,
      },
      classes: highlightedNodesSet.has(node.id) ? 'highlighted' : '',
    })),
    ...loadedGraph.edges.map((edge) => {
      const edgeId = `${edge.from}->${edge.to}`;
      let label = '';
      if (edgeLabelMode === 'cost') {
        label = edge.weight_cost.toFixed(2);
      } else if (edgeLabelMode === 'neglog') {
        label = edge.weight_neglog.toFixed(4);
      }

      return {
        data: {
          id: edgeId,
          source: edge.from,
          target: edge.to,
          label,
          weight_cost: edge.weight_cost,
          weight_neglog: edge.weight_neglog,
        },
        classes: highlightedEdgesSet.has(edgeId as EdgeId) ? 'highlighted' : '',
      };
    }),
  ];

  const stylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': '#ffffff',
        'border-width': 2,
        'border-color': '#000000',
        label: 'data(label)',
        color: '#000000',
        'text-valign': 'center',
        'text-halign': 'center',
        width: 40,
        height: 40,
        'font-size': 12,
        'font-weight': 'bold',
        'font-family': 'monospace',
      },
    },
    {
      selector: 'node.highlighted',
      style: {
        'background-color': '#000000',
        'border-color': '#000000',
        color: '#ffffff',
      },
    },
    {
      selector: 'edge',
      style: {
        width: 1.5,
        'line-color': '#a1a1aa', // Zinc-400
        'target-arrow-color': '#a1a1aa',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        label: 'data(label)',
        'font-size': 10,
        'font-family': 'monospace',
        color: '#52525b', // Zinc-600
        'text-rotation': 'autorotate',
        'text-margin-y': -10,
        'text-background-opacity': 1,
        'text-background-color': '#ffffff',
        'text-background-padding': 2,
      },
    },
    {
      selector: 'edge.highlighted',
      style: {
        'line-color': '#000000',
        'target-arrow-color': '#000000',
        width: 3,
        'z-index': 9999,
      },
    },
    // Search highlight class
    {
      selector: '.search-highlight',
      style: {
        'border-width': 4,
        'border-style': 'double',
      }
    }
  ];

  const layout = {
    name: 'fcose',
    quality: 'proof',
    randomize: true,
    animationDuration: 1000,
    animate: true,
    fit: true,
    padding: 30,
    
    // Separation
    nodeDimensionsIncludeLabels: true,
    uniformNodeDimensions: false,
    packComponents: true,
    step: 'all',
    
    // Physics
    samplingType: true,
    sampleSize: 25,
    nodeSeparation: 250,
    piTol: 0.0000001,
    
    // Ideal length
    idealEdgeLength: 300,
    edgeElasticity: 0.45,
    
    // Repulsion
    nodeRepulsion: 20000,
    
    // Gravity
    gravity: 0.25,
    gravityRange: 3.8,
    gravityCompound: 1.0,
    gravityRangeCompound: 1.5,
    
    // Iterations
    numIter: 2500,
    tilingPaddingVertical: 10,
    tilingPaddingHorizontal: 10,
  };

  return (
    <div className="bg-background h-full relative">
      <CytoscapeComponent
        elements={elements}
        stylesheet={stylesheet}
        layout={layout}
        style={{ width: '100%', height: '100%' }}
        cy={(cy: cytoscape.Core) => {
          setCyInstance(cy);
          if (onCyReady) {
            onCyReady(cy);
          }
        }}
      />

      {/* Compact Controls Overlay */}
      <CompactGraphControls
        cy={cyInstance}
        onToggleLegend={toggleLegend}
        onRearrange={() => {
          if (cyInstance) {
            const layoutInstance = cyInstance.layout(layout);
            layoutInstance.run();
          }
        }}
      />

      {/* Legend Popup */}
      {showLegend && <LegendPopup onClose={toggleLegend} />}
    </div>
  );
}