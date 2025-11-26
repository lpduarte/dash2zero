import { useState, useMemo } from "react";
import { Header } from "@/components/dashboard/Header";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { AdvancedFilterPanel } from "@/components/dashboard/AdvancedFilterPanel";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { GroupCounter } from "@/components/dashboard/GroupCounter";
import { DataSourceCounter } from "@/components/dashboard/DataSourceCounter";
import { TopSuppliersHighlight } from "@/components/dashboard/TopSuppliersHighlight";
import { CriticalSuppliersHighlight } from "@/components/dashboard/CriticalSuppliersHighlight";
import { TopSuppliersByCAE } from "@/components/dashboard/TopSuppliersByCAE";
import { mockSuppliers } from "@/data/mockSuppliers";
import { AdvancedFilters } from "@/types/supplier";

const Overview = () => {
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    nifGroup: "",
    nif: "",
    district: "",
    municipality: "",
    companySize: "",
    revenue: "",
    caeSection: "",
    caeDivision: "",
    company: "",
    carbonYear: "",
    dateRange: { start: "", end: "" },
  });

  const handleFilterChange = (key: keyof AdvancedFilters, value: string | { start: string; end: string }) => {
    setAdvancedFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setAdvancedFilters({
      nifGroup: "",
      nif: "",
      district: "",
      municipality: "",
      companySize: "",
      revenue: "",
      caeSection: "",
      caeDivision: "",
      company: "",
      carbonYear: "",
      dateRange: { start: "", end: "" },
    });
  };

  const filteredSuppliers = useMemo(() => {
    return mockSuppliers
      .filter(supplier => {
        if (advancedFilters.company && !supplier.name.toLowerCase().includes(advancedFilters.company.toLowerCase())) {
          return false;
        }
        if (advancedFilters.caeSection && supplier.sector !== advancedFilters.caeSection) {
          return false;
        }
        if (advancedFilters.district && supplier.region !== advancedFilters.district) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.totalEmissions - b.totalEmissions);
  }, [advancedFilters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <WelcomeBanner />
        <AdvancedFilterPanel
          filters={advancedFilters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
        
        <MetricsOverview suppliers={filteredSuppliers} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-3">
            <GroupCounter suppliers={filteredSuppliers} totalCompaniesInGroup={15000} />
          </div>
        </div>

        <DataSourceCounter suppliers={filteredSuppliers} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopSuppliersHighlight suppliers={filteredSuppliers} />
          <CriticalSuppliersHighlight suppliers={filteredSuppliers} />
        </div>

        <TopSuppliersByCAE suppliers={filteredSuppliers} />
      </main>
    </div>
  );
};

export default Overview;
