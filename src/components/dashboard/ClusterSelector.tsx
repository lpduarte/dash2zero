import { Building2, Users, Handshake, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

type ClusterType = 'all' | 'fornecedor' | 'cliente' | 'parceiro';

interface ClusterOption {
  value: ClusterType;
  label: string;
  icon: React.ReactNode;
}

interface ClusterSelectorProps {
  selectedCluster: ClusterType;
  onClusterChange: (cluster: ClusterType) => void;
  clusterCounts: Record<ClusterType, number>;
}

const clusterOptions: ClusterOption[] = [
  { value: 'all', label: 'Todos', icon: <LayoutGrid className="h-4 w-4" /> },
  { value: 'fornecedor', label: 'Fornecedores', icon: <Building2 className="h-4 w-4" /> },
  { value: 'cliente', label: 'Clientes', icon: <Users className="h-4 w-4" /> },
  { value: 'parceiro', label: 'Parceiros', icon: <Handshake className="h-4 w-4" /> },
];

export function ClusterSelector({ selectedCluster, onClusterChange, clusterCounts }: ClusterSelectorProps) {
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-16px 0px 0px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-0" aria-hidden="true" />
      <div
        ref={stickyRef}
        className={cn(
          "sticky top-4 z-50 mb-6 transition-all duration-200 -mx-8 px-8 py-4",
          isSticky
            ? "bg-background/95 backdrop-blur-sm shadow-lg rounded-b-lg"
            : "bg-transparent"
        )}
      >
        {!isSticky && (
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Filtrar por Cluster</h3>
        )}
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
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export type { ClusterType };
