import { useState, useMemo } from "react";
import { Header } from "@/components/dashboard/Header";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { ClusterSelector, ClusterType, PotentialLevel } from "@/components/dashboard/ClusterSelector";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { FootprintSourcesRow } from "@/components/dashboard/FootprintSourcesRow";
import { TopSuppliersHighlight } from "@/components/dashboard/TopSuppliersHighlight";
import { CriticalSuppliersHighlight } from "@/components/dashboard/CriticalSuppliersHighlight";

import { mockSuppliers } from "@/data/mockSuppliers";

const Overview = () => {
  const [selectedCluster, setSelectedCluster] = useState<ClusterType>('all');

  const clusterCounts = useMemo(() => {
    return {
      all: mockSuppliers.length,
      fornecedor: mockSuppliers.filter(s => s.cluster === 'fornecedor').length,
      cliente: mockSuppliers.filter(s => s.cluster === 'cliente').length,
      parceiro: mockSuppliers.filter(s => s.cluster === 'parceiro').length,
    };
  }, []);

  // Total de empresas por cluster (universo total do grupo)
  const clusterTotals: Record<ClusterType, number> = {
    all: 150,
    fornecedor: 20,
    cliente: 55,
    parceiro: 75,
  };

  // Calcular potencial de melhoria para cada cluster
  const clusterPotentials = useMemo(() => {
    const calculatePotential = (suppliers: typeof mockSuppliers): PotentialLevel => {
      if (suppliers.length === 0) return 'Baixo';
      const avgEmissions = suppliers.reduce((sum, s) => sum + s.totalEmissions, 0) / suppliers.length;
      const criticalCount = suppliers.filter(s => s.totalEmissions > avgEmissions * 1.2).length;
      const percentageCritical = (criticalCount / suppliers.length) * 100;
      
      if (percentageCritical > 30) return 'Alto';
      if (percentageCritical > 15) return 'Médio';
      return 'Baixo';
    };

    return {
      all: calculatePotential(mockSuppliers),
      fornecedor: calculatePotential(mockSuppliers.filter(s => s.cluster === 'fornecedor')),
      cliente: calculatePotential(mockSuppliers.filter(s => s.cluster === 'cliente')),
      parceiro: calculatePotential(mockSuppliers.filter(s => s.cluster === 'parceiro')),
    };
  }, []);

  const filteredSuppliers = useMemo(() => {
    if (selectedCluster === 'all') {
      return mockSuppliers.sort((a, b) => a.totalEmissions - b.totalEmissions);
    }
    return mockSuppliers
      .filter(supplier => supplier.cluster === selectedCluster)
      .sort((a, b) => a.totalEmissions - b.totalEmissions);
  }, [selectedCluster]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[1400px] mx-auto px-8 py-8">
        <WelcomeBanner />
        <ClusterSelector
          selectedCluster={selectedCluster}
          onClusterChange={setSelectedCluster}
          clusterCounts={clusterCounts}
          clusterPotentials={clusterPotentials}
        />
        
        <MetricsOverview suppliers={filteredSuppliers} />
        
        <FootprintSourcesRow suppliers={filteredSuppliers} totalCompanies={clusterTotals[selectedCluster]} />

        <div className="space-y-6 mb-8">
          <CriticalSuppliersHighlight suppliers={filteredSuppliers} />
          <TopSuppliersHighlight suppliers={filteredSuppliers} />
        </div>

        
      </main>
    </div>
  );
};

export default Overview;
