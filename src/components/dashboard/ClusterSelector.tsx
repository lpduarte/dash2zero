import { Building2, Users, Handshake, LayoutGrid, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

type ClusterType = 'all' | 'fornecedor' | 'cliente' | 'parceiro';
type ImprovementPotential = 'high' | 'medium' | 'low';

interface ClusterOption {
  value: ClusterType;
  label: string;
  icon: React.ReactNode;
}

interface ClusterSelectorProps {
  selectedCluster: ClusterType;
  onClusterChange: (cluster: ClusterType) => void;
  clusterCounts: Record<ClusterType, number>;
  clusterPotentials: Record<ClusterType, ImprovementPotential>;
}

const clusterOptions: ClusterOption[] = [
  { value: 'all', label: 'Todos', icon: <LayoutGrid className="h-4 w-4" /> },
  { value: 'fornecedor', label: 'Fornecedores', icon: <Building2 className="h-4 w-4" /> },
  { value: 'cliente', label: 'Clientes', icon: <Users className="h-4 w-4" /> },
  { value: 'parceiro', label: 'Parceiros', icon: <Handshake className="h-4 w-4" /> },
];

const getPotentialConfig = (potential: ImprovementPotential, isSelected: boolean) => {
  const configs = {
    high: { 
      icon: TrendingDown, 
      color: isSelected ? 'text-red-200' : 'text-danger',
      bgColor: isSelected ? 'bg-red-200/30' : 'bg-danger/15'
    },
    medium: { 
      icon: Minus, 
      color: isSelected ? 'text-yellow-200' : 'text-warning',
      bgColor: isSelected ? 'bg-yellow-200/30' : 'bg-warning/15'
    },
    low: { 
      icon: TrendingDown, 
      color: isSelected ? 'text-green-200' : 'text-success',
      bgColor: isSelected ? 'bg-green-200/30' : 'bg-success/15'
    },
  };
  return configs[potential];
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
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      <div
        ref={stickyRef}
        className={cn(
          "sticky top-4 z-50 mb-6 transition-all duration-200",
          isSticky
            ? "bg-background/95 backdrop-blur-sm shadow-lg rounded-b-lg -mx-8 px-8 py-4"
            : "bg-transparent"
        )}
      >
        <div className="flex flex-wrap gap-2">
          {clusterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onClusterChange(option.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200",
                "hover:shadow-md",
                "[&_svg]:text-current",
                selectedCluster === option.value
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-card text-card-foreground border-border hover:border-primary hover:bg-primary hover:text-primary-foreground"
              )}
            >
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
              {(() => {
                const potential = clusterPotentials[option.value];
                const config = getPotentialConfig(potential, selectedCluster === option.value);
                const PotentialIcon = config.icon;
                return (
                  <span className={cn("ml-1 p-1 rounded-full", config.bgColor)}>
                    <PotentialIcon className={cn("h-3 w-3", config.color)} />
                  </span>
                );
              })()}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export type { ClusterType, ImprovementPotential };
