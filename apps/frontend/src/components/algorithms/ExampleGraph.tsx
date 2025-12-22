import { useEffect, useRef } from 'react';
// @ts-expect-error - react-cytoscapejs has no type definitions
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
// @ts-expect-error - cytoscape-fcose has no type definitions
import fcose from 'cytoscape-fcose';

cytoscape.use(fcose);

export interface ExampleGraphProps {
  nodes: { id: string; label?: string }[];
  edges: { source: string; target: string; label?: string; weight?: number }[];
}

export function ExampleGraph({ nodes, edges }: ExampleGraphProps) {
  const cyRef = useRef<cytoscape.Core | null>(null);

  const elements = [
    ...nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label || node.id,
      },
    })),
    ...edges.map((edge, i) => ({
      data: {
        id: `e${i}`,
        source: edge.source,
        target: edge.target,
        label: edge.label || (edge.weight ? edge.weight.toString() : ''),
      },
    })),
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
        width: 30,
        height: 30,
        'font-size': 10,
        'font-weight': 'bold',
        'font-family': 'monospace',
      },
    },
    {
      selector: 'edge',
      style: {
        width: 1.5,
        'line-color': '#000000',
        'target-arrow-color': '#000000',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        label: 'data(label)',
        'font-size': 9,
        'font-family': 'monospace',
        color: '#000000',
        'text-rotation': 'autorotate',
        'text-margin-y': -8,
        'text-background-opacity': 1,
        'text-background-color': '#ffffff',
        'text-background-padding': 2,
      },
    },
  ];

  const layout = {
    name: 'fcose',
    quality: 'proof',
    randomize: true,
    animationDuration: 500,
    animate: false,
    fit: true,
    padding: 20,
    nodeSeparation: 75,
    idealEdgeLength: 100,
  };

  useEffect(() => {
    if (cyRef.current) {
        // Re-run layout when elements change
        cyRef.current.layout(layout).run();
        cyRef.current.fit(undefined, 20);
    }
  }, [nodes, edges]);

  return (
    <div className="border-2 border-black h-[250px] w-full bg-white relative">
      <CytoscapeComponent
        elements={elements}
        stylesheet={stylesheet}
        layout={layout}
        style={{ width: '100%', height: '100%' }}
        cy={(cy: cytoscape.Core) => {
          cyRef.current = cy;
        }}
        userZoomingEnabled={false}
        userPanningEnabled={true} // Allow panning to adjust view
      />
      <div className="absolute top-2 left-2 pointer-events-none">
         <span className="bg-black text-white px-2 py-1 text-[10px] font-mono uppercase">
             Live Graph
         </span>
      </div>
    </div>
  );
}

