import { useState, useMemo } from "react";
import { Supplier } from "@/types/supplier";
import { SupplierCard } from "./SupplierCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Factory } from "lucide-react";

interface CompaniesTabProps {
  suppliers: Supplier[];
}

const getSectorLabel = (sector: string) => {
  const labels: Record<string, string> = {
    manufacturing: 'Indústria',
    technology: 'Tecnologia',
    construction: 'Construção',
    transport: 'Transporte',
    logistics: 'Logística',
    services: 'Serviços',
    food: 'Alimentar',
    energia: 'Energia',
  };
  return labels[sector] || sector;
};

const getRegionLabel = (region: string) => {
  const labels: Record<string, string> = {
    north: 'Norte',
    center: 'Centro',
    south: 'Sul',
    islands: 'Ilhas',
  };
  return labels[region] || region;
};

export const CompaniesTab = ({ suppliers }: CompaniesTabProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique regions and sectors with counts
  const regions = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    suppliers.forEach(s => {
      regionCounts[s.region] = (regionCounts[s.region] || 0) + 1;
    });
    return Object.entries(regionCounts).map(([region, count]) => ({
      value: region,
      label: getRegionLabel(region),
      count
    }));
  }, [suppliers]);

  const sectors = useMemo(() => {
    const sectorCounts: Record<string, number> = {};
    suppliers.forEach(s => {
      sectorCounts[s.sector] = (sectorCounts[s.sector] || 0) + 1;
    });
    return Object.entries(sectorCounts).map(([sector, count]) => ({
      value: sector,
      label: getSectorLabel(sector),
      count
    }));
  }, [suppliers]);

  // Filter suppliers
  const filteredSuppliers = useMemo(() => {
    let filtered = suppliers;
    
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(s => s.region === selectedRegion);
    }
    
    if (selectedSector !== 'all') {
      filtered = filtered.filter(s => s.sector === selectedSector);
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(search) ||
        s.contact.nif.toLowerCase().includes(search) ||
        s.contact.email.toLowerCase().includes(search)
      );
    }
    
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [suppliers, selectedRegion, selectedSector, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, NIF ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[220px]">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Região" />
              </div>
            </SelectTrigger>
            <SelectContent className="w-[220px]">
              <SelectItem value="all">
                <div className="flex items-center justify-between w-[170px]">
                  <span>Todas as regiões</span>
                  <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">{suppliers.length}</span>
                </div>
              </SelectItem>
              {regions.map(r => (
                <SelectItem key={r.value} value={r.value}>
                  <div className="flex items-center justify-between w-[170px]">
                    <span>{r.label}</span>
                    <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">{r.count}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-[250px]">
              <div className="flex items-center gap-2">
                <Factory className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Atividade" />
              </div>
            </SelectTrigger>
            <SelectContent className="w-[250px]">
              <SelectItem value="all">
                <div className="flex items-center justify-between w-[200px]">
                  <span>Todas as atividades</span>
                  <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">{suppliers.length}</span>
                </div>
              </SelectItem>
              {sectors.map(s => (
                <SelectItem key={s.value} value={s.value}>
                  <div className="flex items-center justify-between w-[200px]">
                    <span>{s.label}</span>
                    <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">{s.count}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground ml-auto">
          {filteredSuppliers.length} empresa{filteredSuppliers.length !== 1 ? 's' : ''} encontrada{filteredSuppliers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Supplier Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredSuppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nenhuma empresa encontrada com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};
