import { useState, useMemo } from "react";
import { Header } from "@/components/dashboard/Header";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { SupplierCard } from "@/components/dashboard/SupplierCard";
import { ComparisonChart } from "@/components/dashboard/ComparisonChart";
import { TrendsChart } from "@/components/dashboard/TrendsChart";
import { mockSuppliers } from "@/data/mockSuppliers";
import { SectorFilter, RegionFilter } from "@/types/supplier";

const Index = () => {
  const [sectorFilter, setSectorFilter] = useState<SectorFilter>("all");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");

  const filteredSuppliers = useMemo(() => {
    let filtered = [...mockSuppliers];

    if (sectorFilter !== "all") {
      filtered = filtered.filter((s) => s.sector === sectorFilter);
    }

    if (regionFilter !== "all") {
      filtered = filtered.filter((s) => s.region === regionFilter);
    }

    // Sort by rating and total emissions
    return filtered.sort((a, b) => {
      if (a.rating !== b.rating) {
        return a.rating.localeCompare(b.rating);
      }
      return a.totalEmissions - b.totalEmissions;
    });
  }, [sectorFilter, regionFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <MetricsOverview suppliers={filteredSuppliers} />
        
        <FilterPanel
          sector={sectorFilter}
          region={regionFilter}
          onSectorChange={setSectorFilter}
          onRegionChange={setRegionFilter}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ComparisonChart suppliers={filteredSuppliers} />
          <TrendsChart suppliers={filteredSuppliers} />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Fornecedores ({filteredSuppliers.length})
          </h2>
          <p className="text-muted-foreground">
            Ordenados por rating de sustentabilidade e emissões totais
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
