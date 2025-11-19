import { useState, useMemo } from "react";
import { Header } from "@/components/dashboard/Header";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { AdvancedFilterPanel } from "@/components/dashboard/AdvancedFilterPanel";
import { SupplierCard } from "@/components/dashboard/SupplierCard";
import { ComparisonChart } from "@/components/dashboard/ComparisonChart";
import { TrendsChart } from "@/components/dashboard/TrendsChart";
import { mockSuppliers } from "@/data/mockSuppliers";
import { AdvancedFilters } from "@/types/supplier";

const Index = () => {
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    nifGroup: "all",
    nif: "all",
    district: "all",
    municipality: "all",
    companySize: "all",
    revenue: "all",
    caeSection: "all",
    caeDivision: "all",
    company: "all",
    carbonYear: "all",
    dateRange: {
      start: "2023-01",
      end: "2025-11",
    },
  });

  const handleFilterChange = (key: keyof AdvancedFilters, value: any) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setAdvancedFilters({
      nifGroup: "all",
      nif: "all",
      district: "all",
      municipality: "all",
      companySize: "all",
      revenue: "all",
      caeSection: "all",
      caeDivision: "all",
      company: "all",
      carbonYear: "all",
      dateRange: {
        start: "2023-01",
        end: "2025-11",
      },
    });
  };

  const filteredSuppliers = useMemo(() => {
    let filtered = [...mockSuppliers];

    // Filter by company
    if (advancedFilters.company !== "all") {
      filtered = filtered.filter((s) => s.id === advancedFilters.company);
    }

    // Filter by district (map regions to districts for demo)
    if (advancedFilters.district !== "all") {
      const districtToRegion: Record<string, string> = {
        porto: "north",
        braga: "north",
        lisboa: "center",
        coimbra: "center",
        faro: "south",
      };
      const region = districtToRegion[advancedFilters.district];
      if (region) {
        filtered = filtered.filter((s) => s.region === region);
      }
    }

    // Filter by company size (based on employees)
    if (advancedFilters.companySize !== "all") {
      filtered = filtered.filter((s) => {
        switch (advancedFilters.companySize) {
          case "micro":
            return s.employees < 10;
          case "small":
            return s.employees >= 10 && s.employees < 50;
          case "medium":
            return s.employees >= 50 && s.employees < 250;
          case "large":
            return s.employees >= 250;
          default:
            return true;
        }
      });
    }

    // Filter by revenue range
    if (advancedFilters.revenue !== "all") {
      filtered = filtered.filter((s) => {
        switch (advancedFilters.revenue) {
          case "0-1m":
            return s.revenue < 1;
          case "1m-10m":
            return s.revenue >= 1 && s.revenue < 10;
          case "10m-50m":
            return s.revenue >= 10 && s.revenue < 50;
          case "50m+":
            return s.revenue >= 50;
          default:
            return true;
        }
      });
    }

    // Sort by rating and total emissions
    return filtered.sort((a, b) => {
      if (a.rating !== b.rating) {
        return a.rating.localeCompare(b.rating);
      }
      return a.totalEmissions - b.totalEmissions;
    });
  }, [advancedFilters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <WelcomeBanner />
        
        <AdvancedFilterPanel
          filters={advancedFilters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <MetricsOverview suppliers={filteredSuppliers} />

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
