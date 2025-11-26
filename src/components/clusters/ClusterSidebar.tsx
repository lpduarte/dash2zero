import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cluster } from "@/types/cluster";
import { Plus, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClusterSidebarProps {
  clusters: Cluster[];
  selectedClusterId: string | null;
  onSelectCluster: (id: string) => void;
  onCreateCluster: () => void;
}

export function ClusterSidebar({
  clusters,
  selectedClusterId,
  onSelectCluster,
  onCreateCluster,
}: ClusterSidebarProps) {
  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Button onClick={onCreateCluster} className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cluster
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {clusters.map((cluster) => (
            <button
              key={cluster.id}
              onClick={() => onSelectCluster(cluster.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2",
                "hover:bg-accent hover:text-accent-foreground",
                selectedClusterId === cluster.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground"
              )}
            >
              <Folder className="h-4 w-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{cluster.name}</div>
                <div className="text-xs opacity-80">
                  {cluster.providers.length} fornecedores
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
