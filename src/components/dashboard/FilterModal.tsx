import { useState, useMemo, useEffect } from "react";
import { Building2, MapPin, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Supplier, UniversalFilterState } from "@/types/supplier";

interface FilterModalProps {
  suppliers: Supplier[];
  currentFilters: UniversalFilterState;
  onFilterChange: (filters: UniversalFilterState) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const companySizeLabels: Record<string, string> = {
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

  // Calculate counts with applied other filters
  const countBySize = (size: string) => {
    return suppliers.filter(s => {
      let matches = true;
      if (localFilters.district.length > 0) {
        matches = matches && localFilters.district.includes(s.district);
      }
      if (localFilters.municipality.length > 0) {
        matches = matches && localFilters.municipality.includes(s.municipality);
      }
      if (localFilters.parish.length > 0) {
        matches = matches && localFilters.parish.includes(s.parish);
      }
      return matches && s.companySize === size;
    }).length;
  };

  const countByDistrict = (district: string) => {
    return suppliers.filter(s => {
      let matches = true;
      if (localFilters.companySize.length > 0) {
        matches = matches && localFilters.companySize.includes(s.companySize);
      }
      return matches && s.district === district;
    }).length;
  };

  const countByMunicipality = (municipality: string) => {
    return suppliers.filter(s => {
      let matches = true;
      if (localFilters.companySize.length > 0) {
        matches = matches && localFilters.companySize.includes(s.companySize);
      }
      if (localFilters.district.length > 0) {
        matches = matches && localFilters.district.includes(s.district);
      }
      return matches && s.municipality === municipality;
    }).length;
  };

  const countByParish = (parish: string) => {
    return suppliers.filter(s => {
      let matches = true;
      if (localFilters.companySize.length > 0) {
        matches = matches && localFilters.companySize.includes(s.companySize);
      }
      if (localFilters.district.length > 0) {
        matches = matches && localFilters.district.includes(s.district);
      }
      if (localFilters.municipality.length > 0) {
        matches = matches && localFilters.municipality.includes(s.municipality);
      }
      return matches && s.parish === parish;
    }).length;
  };

  // Size options
  const sizeOptions = useMemo(() => [
    { value: 'micro', label: 'Micro empresas', count: countBySize('micro') },
    { value: 'pequena', label: 'Pequenas empresas', count: countBySize('pequena') },
    { value: 'media', label: 'Médias empresas', count: countBySize('media') },
    { value: 'grande', label: 'Grandes empresas', count: countBySize('grande') },
  ], [suppliers, localFilters.district, localFilters.municipality, localFilters.parish]);

  // Get unique districts
  const districtOptions = useMemo(() => {
    const unique = [...new Set(suppliers.map((s) => s.district))].sort();
    return unique.map(d => ({ value: d, label: d, count: countByDistrict(d) }));
  }, [suppliers, localFilters.companySize]);

  // Get municipalities filtered by selected districts
  const municipalityOptions = useMemo(() => {
    if (localFilters.district.length === 0) return [];
    const filtered = suppliers.filter((s) => localFilters.district.includes(s.district));
    const unique = [...new Set(filtered.map((s) => s.municipality))].sort();
    return unique.map(m => ({ value: m, label: m, count: countByMunicipality(m) }));
  }, [suppliers, localFilters.district, localFilters.companySize]);

  // Get parishes filtered by selected municipalities
  const parishOptions = useMemo(() => {
    if (localFilters.municipality.length === 0) return [];
    const filtered = suppliers.filter((s) => localFilters.municipality.includes(s.municipality));
    const unique = [...new Set(filtered.map((s) => s.parish))].sort();
    return unique.map(p => ({ value: p, label: p, count: countByParish(p) }));
  }, [suppliers, localFilters.municipality, localFilters.companySize, localFilters.district]);

  // Count matching suppliers
  const matchingCount = useMemo(() => {
    let filtered = suppliers;

    if (localFilters.companySize.length > 0) {
      filtered = filtered.filter((s) => localFilters.companySize.includes(s.companySize));
    }
    if (localFilters.district.length > 0) {
      filtered = filtered.filter((s) => localFilters.district.includes(s.district));
    }
    if (localFilters.municipality.length > 0) {
      filtered = filtered.filter((s) => localFilters.municipality.includes(s.municipality));
    }
    if (localFilters.parish.length > 0) {
      filtered = filtered.filter((s) => localFilters.parish.includes(s.parish));
    }

    return filtered.length;
  }, [suppliers, localFilters]);

  const toggleSize = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      companySize: prev.companySize.includes(value)
        ? prev.companySize.filter(v => v !== value)
        : [...prev.companySize, value]
    }));
  };

  const toggleDistrict = (value: string) => {
    const newDistricts = localFilters.district.includes(value)
      ? localFilters.district.filter(v => v !== value)
      : [...localFilters.district, value];
    
    // Reset municipality and parish when district changes
    setLocalFilters(prev => ({
      ...prev,
      district: newDistricts,
      municipality: [],
      parish: [],
    }));
  };

  const toggleMunicipality = (value: string) => {
    const newMunicipalities = localFilters.municipality.includes(value)
      ? localFilters.municipality.filter(v => v !== value)
      : [...localFilters.municipality, value];
    
    // Reset parish when municipality changes
    setLocalFilters(prev => ({
      ...prev,
      municipality: newMunicipalities,
      parish: [],
    }));
  };

  const toggleParish = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      parish: prev.parish.includes(value)
        ? prev.parish.filter(v => v !== value)
        : [...prev.parish, value]
    }));
  };

  const handleClearFilters = () => {
    setLocalFilters({
      companySize: [],
      district: [],
      municipality: [],
      parish: [],
    });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onOpenChange(false);
  };

  const getSizeLabel = () => {
    if (localFilters.companySize.length === 0) return "Todas as dimensões";
    if (localFilters.companySize.length === 1) return companySizeLabels[localFilters.companySize[0]];
    return `${localFilters.companySize.length} selecionadas`;
  };

  const getDistrictLabel = () => {
    if (localFilters.district.length === 0) return "Todos os distritos";
    if (localFilters.district.length === 1) return localFilters.district[0];
    return `${localFilters.district.length} selecionados`;
  };

  const getMunicipalityLabel = () => {
    if (localFilters.municipality.length === 0) return "Todos os municípios";
    if (localFilters.municipality.length === 1) return localFilters.municipality[0];
    return `${localFilters.municipality.length} selecionados`;
  };

  const getParishLabel = () => {
    if (localFilters.parish.length === 0) return "Todas as freguesias";
    if (localFilters.parish.length === 1) return localFilters.parish[0];
    return `${localFilters.parish.length} selecionadas`;
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
            <div className="flex items-center gap-2 text-sm font-medium mb-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              Dimensão da Empresa
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between min-h-[44px]">
                  <span>{getSizeLabel()}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[380px] p-2" align="start">
                <div className="space-y-1">
                  {sizeOptions.map(option => (
                    <div 
                      key={option.value}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => toggleSize(option.value)}
                    >
                      <Checkbox 
                        checked={localFilters.companySize.includes(option.value)}
                        onCheckedChange={() => toggleSize(option.value)}
                      />
                      <Label className="text-sm cursor-pointer flex items-center justify-between flex-1">
                        <span>{option.label}</span>
                        <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">
                          {option.count}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Location Filters */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium mb-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Localização
            </div>

            {/* District */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between min-h-[44px]">
                  <span>{getDistrictLabel()}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[380px] p-2 max-h-[300px] overflow-y-auto" align="start">
                <div className="space-y-1">
                  {districtOptions.map(option => (
                    <div 
                      key={option.value}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => toggleDistrict(option.value)}
                    >
                      <Checkbox 
                        checked={localFilters.district.includes(option.value)}
                        onCheckedChange={() => toggleDistrict(option.value)}
                      />
                      <Label className="text-sm cursor-pointer flex items-center justify-between flex-1">
                        <span>{option.label}</span>
                        <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">
                          {option.count}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Municipality */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between min-h-[44px]"
                  disabled={localFilters.district.length === 0}
                >
                  <span>{getMunicipalityLabel()}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[380px] p-2 max-h-[300px] overflow-y-auto" align="start">
                <div className="space-y-1">
                  {municipalityOptions.map(option => (
                    <div 
                      key={option.value}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => toggleMunicipality(option.value)}
                    >
                      <Checkbox 
                        checked={localFilters.municipality.includes(option.value)}
                        onCheckedChange={() => toggleMunicipality(option.value)}
                      />
                      <Label className="text-sm cursor-pointer flex items-center justify-between flex-1">
                        <span>{option.label}</span>
                        <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">
                          {option.count}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Parish */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between min-h-[44px]"
                  disabled={localFilters.municipality.length === 0}
                >
                  <span>{getParishLabel()}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[380px] p-2 max-h-[300px] overflow-y-auto" align="start">
                <div className="space-y-1">
                  {parishOptions.map(option => (
                    <div 
                      key={option.value}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => toggleParish(option.value)}
                    >
                      <Checkbox 
                        checked={localFilters.parish.includes(option.value)}
                        onCheckedChange={() => toggleParish(option.value)}
                      />
                      <Label className="text-sm cursor-pointer flex items-center justify-between flex-1">
                        <span>{option.label}</span>
                        <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">
                          {option.count}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
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
