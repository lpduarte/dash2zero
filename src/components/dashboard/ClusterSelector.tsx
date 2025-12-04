import { Building2, Users, Handshake, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ClusterType = 'all' | 'fornecedor' | 'cliente' | 'parceiro';
type PotentialLevel = 'Alto' | 'Médio' | 'Baixo';

interface ClusterOption {
  value: ClusterType;
  label: string;
  icon: React.ReactNode;
}

interface ClusterSelectorProps {
  selectedCluster: ClusterType;
  onClusterChange: (cluster: ClusterType) => void;
  clusterCounts: Record<ClusterType, number>;
  clusterPotentials?: Record<ClusterType, PotentialLevel>;
}

const clusterOptions: ClusterOption[] = [
  { value: 'all', label: 'Todos', icon: <LayoutGrid className="h-4 w-4" /> },
  { value: 'fornecedor', label: 'Fornecedores', icon: <Building2 className="h-4 w-4" /> },
  { value: 'cliente', label: 'Clientes', icon: <Users className="h-4 w-4" /> },
  { value: 'parceiro', label: 'Parceiros', icon: <Handshake className="h-4 w-4" /> },
];

const getPotentialIndicator = (potential: PotentialLevel) => {
  switch (potential) {
    case 'Alto':
      return { color: 'bg-danger', label: 'Prioridade Alta' };
    case 'Médio':
      return { color: 'bg-warning', label: 'Prioridade Média' };
    case 'Baixo':
      return { color: 'bg-success', label: 'Prioridade Baixa' };
  }
};

export function ClusterSelector({ selectedCluster, onClusterChange, clusterCounts, clusterPotentials }: ClusterSelectorProps) {
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Add hysteresis to prevent flickering
        if (!entry.isIntersecting && !isSticky) {
          setIsSticky(true);
        } else if (entry.isIntersecting && entry.intersectionRatio > 0.5 && isSticky) {
          setIsSticky(false);
        }
      },
      { threshold: [0, 0.5, 1], rootMargin: "-20px 0px 0px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isSticky]);

  return (
    <>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Filtrar por Cluster</h3>
      <div ref={sentinelRef} className="h-1 -mb-1" aria-hidden="true" />
      <div
        ref={stickyRef}
        className={cn(
          "sticky top-4 z-50 mb-6 transition-all duration-200 -mx-8 px-8 py-4",
          isSticky
            ? "bg-background/95 backdrop-blur-sm shadow-lg rounded-b-lg"
            : "bg-transparent"
        )}
      >
        <div className="flex flex-wrap gap-2">
          {clusterOptions.map((option) => {
            const potential = clusterPotentials?.[option.value];
            const indicator = potential ? getPotentialIndicator(potential) : null;
            
            return (
              <TooltipProvider key={option.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onClusterChange(option.value)}
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200",
                        "hover:shadow-md",
                        "[&_svg]:text-current",
                        selectedCluster === option.value
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-card text-card-foreground border-border hover:border-primary hover:bg-primary hover:text-primary-foreground"
                      )}
                    >
                      {indicator && indicator.color === 'bg-danger' && (
                        <span 
                          className={cn(
                            "absolute -top-1 -right-1 w-3 h-3 rounded-full",
                            indicator.color,
                            "animate-pulse shadow-sm"
                          )} 
                        />
                      )}
                      {option.icon}
                      <span className="font-medium">{option.label}</span>
                      <span
                        className={cn(
                          "ml-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                          selectedCluster === option.value
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {clusterCounts[option.value]}
                      </span>
                    </button>
                  </TooltipTrigger>
                  {indicator && (
                    <TooltipContent>
                      <p className="text-xs">Potencial de Melhoria: <strong>{potential}</strong></p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
    </>
  );
}

export type { ClusterType, PotentialLevel };
