import { useState, useMemo } from "react";
import { Header } from "@/components/dashboard/Header";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { ClusterSelector, ClusterType, ImprovementPotential } from "@/components/dashboard/ClusterSelector";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { FootprintSourcesRow } from "@/components/dashboard/FootprintSourcesRow";
import { TopSuppliersHighlight } from "@/components/dashboard/TopSuppliersHighlight";
import { CriticalSuppliersHighlight } from "@/components/dashboard/CriticalSuppliersHighlight";

import { mockSuppliers } from "@/data/mockSuppliers";
import { Supplier } from "@/types/supplier";

// Função para calcular potencial de melhoria de um conjunto de fornecedores
const calculateImprovementPotential = (suppliers: Supplier[]): ImprovementPotential => {
  if (suppliers.length === 0) return 'low';
  const totalEmissions = suppliers.reduce((acc, s) => acc + s.totalEmissions, 0);
  const avgEmissions = totalEmissions / suppliers.length;
  const criticalSuppliers = suppliers.filter(s => s.totalEmissions > avgEmissions * 1.2);
  const percentageCritical = (criticalSuppliers.length / suppliers.length) * 100;
  
  if (percentageCritical > 30) return 'high';
  if (percentageCritical > 15) return 'medium';
  return 'low';
};

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

  const clusterPotentials = useMemo((): Record<ClusterType, ImprovementPotential> => {
    return {
      all: calculateImprovementPotential(mockSuppliers),
      fornecedor: calculateImprovementPotential(mockSuppliers.filter(s => s.cluster === 'fornecedor')),
      cliente: calculateImprovementPotential(mockSuppliers.filter(s => s.cluster === 'cliente')),
      parceiro: calculateImprovementPotential(mockSuppliers.filter(s => s.cluster === 'parceiro')),
    };
  }, []);

  // Total de empresas por cluster (universo total do grupo)
  const clusterTotals: Record<ClusterType, number> = {
    all: 150,
    fornecedor: 20,
    cliente: 55,
    parceiro: 75,
  };

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
