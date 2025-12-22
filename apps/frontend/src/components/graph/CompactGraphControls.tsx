import type Cytoscape from 'cytoscape';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize, Info, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompactGraphControlsProps {
  cy: Cytoscape.Core | null;
  onToggleLegend?: () => void;
  onRearrange?: () => void;
}

export function CompactGraphControls({ cy, onToggleLegend, onRearrange }: CompactGraphControlsProps) {
  const edgeLabelMode = useAppStore((s) => s.edgeLabelMode);
  const setEdgeLabelMode = useAppStore((s) => s.setEdgeLabelMode);

  const handleZoomIn = () => {
    if (cy) {
      cy.zoom(cy.zoom() * 1.2);
    }
  };

  const handleZoomOut = () => {
    if (cy) {
      cy.zoom(cy.zoom() * 0.8);
    }
  };

  const handleFit = () => {
    if (cy) {
      cy.fit(undefined, 50);
    }
  };

  return (
    <div className="absolute top-3 right-3 flex flex-col gap-2 items-end z-10" data-tour="graph-controls">
      {/* Zoom & Layout Controls */}
      <div className="flex flex-col bg-white border-2 border-black shadow-lg w-fit">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          title="Zoom In"
          className="h-8 w-8 p-0 rounded-none hover:bg-black hover:text-white border-b-2 border-black last:border-b-0"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="h-8 w-8 p-0 rounded-none hover:bg-black hover:text-white border-b-2 border-black last:border-b-0"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFit}
          title="Fit to Screen"
          className="h-8 w-8 p-0 rounded-none hover:bg-black hover:text-white border-b-2 border-black last:border-b-0"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        {onRearrange && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRearrange}
            title="Rearrange Graph"
            className="h-8 w-8 p-0 rounded-none hover:bg-black hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Legend Toggle */}
      <div className="flex flex-col bg-white border-2 border-black shadow-lg w-fit">
      {onToggleLegend && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleLegend}
          title="Toggle Legend"
          className="h-8 w-8 p-0 rounded-none hover:bg-black hover:text-white"
        >
          <Info className="h-4 w-4" />
        </Button>
      )}
      </div>

      {/* Edge Label Mode Toggle */}
      <div className="flex flex-col bg-white border-2 border-black shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEdgeLabelMode('cost')}
          className={cn(
            "h-8 px-2 rounded-none font-mono text-[10px] uppercase border-b-2 border-black",
            edgeLabelMode === 'cost' ? "bg-black text-white hover:bg-black hover:text-white" : "hover:bg-black hover:text-white"
          )}
        >
          Cost
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEdgeLabelMode('neglog')}
          className={cn(
            "h-8 px-2 rounded-none font-mono text-[10px] uppercase border-b-2 border-black",
            edgeLabelMode === 'neglog' ? "bg-black text-white hover:bg-black hover:text-white" : "hover:bg-black hover:text-white"
          )}
        >
          NegLog
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEdgeLabelMode('none')}
          className={cn(
            "h-8 px-2 rounded-none font-mono text-[10px] uppercase",
            edgeLabelMode === 'none' ? "bg-black text-white hover:bg-black hover:text-white" : "hover:bg-black hover:text-white"
          )}
        >
          None
        </Button>
      </div>
    </div>
  );
}
