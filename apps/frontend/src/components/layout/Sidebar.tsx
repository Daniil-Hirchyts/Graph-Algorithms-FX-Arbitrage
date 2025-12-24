import { Button } from "@/components/ui/button"
import { useAppStore } from "@/stores/useAppStore"
import { cn } from "@/lib/utils"
import { Database, Network, ChevronLeft, ChevronRight, GraduationCap, ExternalLink } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ className, collapsed = false, onToggleCollapse }: SidebarProps) {
  const currentPage = useAppStore((s) => s.currentPage)
  const setPage = useAppStore((s) => s.setPage)

  const items = [
    { id: 'data', label: 'Data', icon: Database },
    { id: 'graph', label: 'Graph', icon: Network },
    { id: 'learn', label: 'Learn', icon: GraduationCap },
  ] as const

  return (
    <div className={cn("h-full bg-background relative flex flex-col justify-between", className)}>
      <div className="py-3">
        <div className="space-y-1 px-2">
          {items.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size={collapsed ? "icon" : "default"}
              title={collapsed ? item.label : undefined}
              data-tour={`${item.id}-nav`}
              className={cn(
                "w-full font-mono text-xs uppercase tracking-wider transition-all",
                collapsed ? "justify-center px-2 h-10" : "justify-start h-10 px-3",
                currentPage === item.id
                  ? "bg-black text-white hover:bg-black/90 hover:text-white"
                  : "hover:bg-muted hover:text-foreground"
              )}
              onClick={() => setPage(item.id)}
            >
              <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
              {!collapsed && item.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="px-2 pb-2">
          <Button
            variant="ghost"
            asChild
            size={collapsed ? "icon" : "default"}
            title={collapsed ? "About author" : undefined}
            className={cn(
              "w-full font-mono text-xs uppercase tracking-wider transition-all",
              collapsed ? "justify-center px-2 h-10" : "justify-start h-10 px-3",
              "hover:bg-muted hover:text-foreground"
            )}
          >
            <a href="https://hirchyts-daniil.me/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className={cn("h-4 w-4", !collapsed && "mr-3")} />
              {!collapsed && "About author"}
            </a>
          </Button>
        </div>

        {onToggleCollapse && (
          <div className="border-t-2 border-black p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center h-8 hover:bg-muted hover:text-foreground font-mono text-xs"
              onClick={onToggleCollapse}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <div className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="uppercase">Collapse</span>
                </div>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
