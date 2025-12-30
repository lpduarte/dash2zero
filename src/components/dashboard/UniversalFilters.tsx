import { useMemo } from "react";
import { Building2, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Supplier, UniversalFilterState } from "@/types/supplier";

interface UniversalFiltersProps {
  suppliers: Supplier[];
  onFilterChange: (filters: UniversalFilterState) => void;
  currentFilters: UniversalFilterState;
}

const companySizeLabels: Record<string, string> = {
  all: "Todas",
  micro: "Micro",
  pequena: "Pequenas",
  media: "Médias",
  grande: "Grandes",
};

export const UniversalFilters = ({
  suppliers,
  onFilterChange,
  currentFilters,
}: UniversalFiltersProps) => {
  // Obter distritos únicos dos suppliers
  const districts = useMemo(() => {
    const uniqueDistricts = [...new Set(suppliers.map((s) => s.district))].filter(Boolean).sort();
    return uniqueDistricts;
  }, [suppliers]);

  // Obter municípios filtrados pelo distrito selecionado
  const municipalities = useMemo(() => {
    if (currentFilters.district === "all") return [];
    const filtered = suppliers.filter((s) => s.district === currentFilters.district);
    return [...new Set(filtered.map((s) => s.municipality))].filter(Boolean).sort();
  }, [suppliers, currentFilters.district]);

  // Obter freguesias filtradas pelo município selecionado
  const parishes = useMemo(() => {
    if (currentFilters.municipality === "all") return [];
    const filtered = suppliers.filter((s) => s.municipality === currentFilters.municipality);
    return [...new Set(filtered.map((s) => s.parish))].filter(Boolean).sort();
  }, [suppliers, currentFilters.municipality]);

  const handleSizeChange = (value: string) => {
    onFilterChange({
      ...currentFilters,
      companySize: value as UniversalFilterState["companySize"],
    });
  };

  const handleDistrictChange = (value: string) => {
    onFilterChange({
      ...currentFilters,
      district: value,
      municipality: "all",
      parish: "all",
    });
  };

  const handleMunicipalityChange = (value: string) => {
    onFilterChange({
      ...currentFilters,
      municipality: value,
      parish: "all",
    });
  };

  const handleParishChange = (value: string) => {
    onFilterChange({
      ...currentFilters,
      parish: value,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      companySize: "all",
      district: "all",
      municipality: "all",
      parish: "all",
    });
  };

  const hasActiveFilters =
    currentFilters.companySize !== "all" ||
    currentFilters.district !== "all" ||
    currentFilters.municipality !== "all" ||
    currentFilters.parish !== "all";

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center p-4 bg-card rounded-lg border border-border">
      {/* Filtro de dimensão */}
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <Select value={currentFilters.companySize} onValueChange={handleSizeChange}>
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue placeholder="Dimensão" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border z-50">
            {Object.entries(companySizeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtros de localização */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground hidden sm:block" />
        
        <Select value={currentFilters.district} onValueChange={handleDistrictChange}>
          <SelectTrigger className="w-[150px] bg-background">
            <SelectValue placeholder="Distrito" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border z-50">
            <SelectItem value="all">Todos os distritos</SelectItem>
            {districts.map((district) => (
              <SelectItem key={district} value={district}>
                {district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={currentFilters.municipality} 
          onValueChange={handleMunicipalityChange}
          disabled={currentFilters.district === "all"}
        >
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue placeholder="Município" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border z-50">
            <SelectItem value="all">Todos os municípios</SelectItem>
            {municipalities.map((municipality) => (
              <SelectItem key={municipality} value={municipality}>
                {municipality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={currentFilters.parish} 
          onValueChange={handleParishChange}
          disabled={currentFilters.municipality === "all"}
        >
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue placeholder="Freguesia" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border z-50">
            <SelectItem value="all">Todas as freguesias</SelectItem>
            {parishes.map((parish) => (
              <SelectItem key={parish} value={parish}>
                {parish}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Botão limpar filtros */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Limpar
        </Button>
      )}
    </div>
  );
};
