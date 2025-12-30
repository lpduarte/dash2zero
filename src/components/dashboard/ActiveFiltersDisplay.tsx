import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UniversalFilterState } from "@/types/supplier";

interface ActiveFiltersDisplayProps {
  filters: UniversalFilterState;
  onRemoveFilter: (key: keyof UniversalFilterState) => void;
}

const filterLabels: Record<keyof UniversalFilterState, string> = {
  companySize: "Dimensão",
  district: "Distrito",
  municipality: "Município",
  parish: "Freguesia",
};

const companySizeLabels: Record<string, string> = {
  micro: "Micro empresas",
  pequena: "Pequenas empresas",
  media: "Médias empresas",
  grande: "Grandes empresas",
};

export function ActiveFiltersDisplay({ filters, onRemoveFilter }: ActiveFiltersDisplayProps) {
  const activeFilters = Object.entries(filters).filter(
    ([_, value]) => value !== "all"
  ) as [keyof UniversalFilterState, string][];

  if (activeFilters.length === 0) return null;

  const getDisplayValue = (key: keyof UniversalFilterState, value: string) => {
    if (key === "companySize") {
      return companySizeLabels[value] || value;
    }
    return value;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <span className="text-sm text-muted-foreground">Filtros ativos:</span>
      {activeFilters.map(([key, value]) => (
        <Badge
          key={key}
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onRemoveFilter(key)}
        >
          {getDisplayValue(key, value)}
          <X className="h-3 w-3" />
        </Badge>
      ))}
    </div>
  );
}
