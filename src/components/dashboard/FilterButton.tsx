import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterButtonProps {
  activeFiltersCount: number;
  onClick: () => void;
}

export function FilterButton({ activeFiltersCount, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200",
        "[&_svg]:text-current",
        "bg-card text-card-foreground border-border hover:border-primary/50 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
      )}
    >
      <SlidersHorizontal className="h-4 w-4" />
      <span className="font-normal">Filtros</span>
      {activeFiltersCount > 0 && (
        <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-muted text-muted-foreground">
          {activeFiltersCount}
        </span>
      )}
    </button>
  );
}
