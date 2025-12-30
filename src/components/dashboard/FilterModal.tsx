import { useState, useMemo, useEffect } from "react";
import { Building2, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Supplier, UniversalFilterState } from "@/types/supplier";

interface FilterModalProps {
  suppliers: Supplier[];
  currentFilters: UniversalFilterState;
  onFilterChange: (filters: UniversalFilterState) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const companySizeLabels: Record<string, string> = {
  all: "Todas as dimensões",
  micro: "Micro empresas",
  pequena: "Pequenas empresas",
  media: "Médias empresas",
  grande: "Grandes empresas",
};

export function FilterModal({
  suppliers,
  currentFilters,
  onFilterChange,
  open,
  onOpenChange,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<UniversalFilterState>(currentFilters);

  // Reset local state when modal opens
  useEffect(() => {
    if (open) {
      setLocalFilters(currentFilters);
    }
  }, [open, currentFilters]);

  // Get unique districts
  const districts = useMemo(() => {
    const unique = [...new Set(suppliers.map((s) => s.district))].sort();
    return unique;
  }, [suppliers]);

  // Get municipalities filtered by selected district
  const municipalities = useMemo(() => {
    if (localFilters.district === "all") return [];
    const filtered = suppliers.filter((s) => s.district === localFilters.district);
    return [...new Set(filtered.map((s) => s.municipality))].sort();
  }, [suppliers, localFilters.district]);

  // Get parishes filtered by selected municipality
  const parishes = useMemo(() => {
    if (localFilters.municipality === "all") return [];
    const filtered = suppliers.filter((s) => s.municipality === localFilters.municipality);
    return [...new Set(filtered.map((s) => s.parish))].sort();
  }, [suppliers, localFilters.municipality]);

  // Count matching suppliers
  const matchingCount = useMemo(() => {
    let filtered = suppliers;

    if (localFilters.companySize !== "all") {
      filtered = filtered.filter((s) => s.companySize === localFilters.companySize);
    }
    if (localFilters.district !== "all") {
      filtered = filtered.filter((s) => s.district === localFilters.district);
    }
    if (localFilters.municipality !== "all") {
      filtered = filtered.filter((s) => s.municipality === localFilters.municipality);
    }
    if (localFilters.parish !== "all") {
      filtered = filtered.filter((s) => s.parish === localFilters.parish);
    }

    return filtered.length;
  }, [suppliers, localFilters]);

  const handleDistrictChange = (value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      district: value,
      municipality: "all",
      parish: "all",
    }));
  };

  const handleMunicipalityChange = (value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      municipality: value,
      parish: "all",
    }));
  };

  const handleClearFilters = () => {
    setLocalFilters({
      companySize: "all",
      district: "all",
      municipality: "all",
      parish: "all",
    });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Filtros Avançados</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Company Size Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              Dimensão da Empresa
            </label>
            <Select
              value={localFilters.companySize}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, companySize: value as UniversalFilterState["companySize"] }))
              }
            >
              <SelectTrigger className="min-h-[44px]">
                <SelectValue placeholder="Todas as dimensões" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as dimensões</SelectItem>
                <SelectItem value="micro">Micro empresas</SelectItem>
                <SelectItem value="pequena">Pequenas empresas</SelectItem>
                <SelectItem value="media">Médias empresas</SelectItem>
                <SelectItem value="grande">Grandes empresas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Filters */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Localização
            </label>

            <Select value={localFilters.district} onValueChange={handleDistrictChange}>
              <SelectTrigger className="min-h-[44px]">
                <SelectValue placeholder="Selecione o distrito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os distritos</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={localFilters.municipality}
              onValueChange={handleMunicipalityChange}
              disabled={localFilters.district === "all"}
            >
              <SelectTrigger className="min-h-[44px]">
                <SelectValue placeholder="Selecione o município" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os municípios</SelectItem>
                {municipalities.map((municipality) => (
                  <SelectItem key={municipality} value={municipality}>
                    {municipality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={localFilters.parish}
              onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, parish: value }))}
              disabled={localFilters.municipality === "all"}
            >
              <SelectTrigger className="min-h-[44px]">
                <SelectValue placeholder="Selecione a freguesia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as freguesias</SelectItem>
                {parishes.map((parish) => (
                  <SelectItem key={parish} value={parish}>
                    {parish}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results counter */}
          <p className="text-sm text-muted-foreground text-center">
            {matchingCount.toLocaleString("pt-PT")} empresas encontradas com estes critérios
          </p>
        </div>

        <DialogFooter className="flex-row gap-2 sm:gap-2">
          <Button variant="outline" onClick={handleClearFilters} className="flex-1">
            Limpar Filtros
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
