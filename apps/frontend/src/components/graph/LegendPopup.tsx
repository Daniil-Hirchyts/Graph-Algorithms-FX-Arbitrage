import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LegendPopupProps {
  onClose: () => void;
}

export function LegendPopup({ onClose }: LegendPopupProps) {
  return (
    <div className="absolute bottom-3 left-3 z-10 bg-white border-2 border-black shadow-lg w-[200px]">
      <div className="flex items-center justify-between border-b-2 border-black py-2 px-3">
        <span className="text-xs font-mono uppercase tracking-wider font-bold">Legend</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-5 w-5 p-0 rounded-none hover:bg-black hover:text-white"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 border-2 border-black bg-white shrink-0"></div>
          <span className="text-xs font-mono">Currency</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 border-2 border-black bg-black shrink-0"></div>
          <span className="text-xs font-mono">Highlighted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4 bg-zinc-400 shrink-0"></div>
          <span className="text-xs font-mono">Pair</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 w-4 bg-black shrink-0"></div>
          <span className="text-xs font-mono">Path</span>
        </div>
      </div>
    </div>
  );
}
