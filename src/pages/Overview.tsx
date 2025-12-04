import { useState, useMemo } from "react";
import { Header } from "@/components/dashboard/Header";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { ClusterSelector, ClusterType, ImprovementPotential } from "@/components/dashboard/ClusterSelector";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { FootprintSourcesRow } from "@/components/dashboard/FootprintSourcesRow";
import { TopSuppliersHighlight } from "@/components/dashboard/TopSuppliersHighlight";
import { CriticalSuppliersHighlight } from "@/components/dashboard/CriticalSuppliersHighlight";
import { SupplierCard } from "@/components/dashboard/SupplierCard";
import { ComparisonChart } from "@/components/dashboard/ComparisonChart";
import { EmissionsBreakdown } from "@/components/dashboard/EmissionsBreakdown";
import { RankingChart } from "@/components/dashboard/RankingChart";
import { RadarComparison } from "@/components/dashboard/RadarComparison";
import { PerformanceHeatmap } from "@/components/dashboard/PerformanceHeatmap";
import { ScatterPlot } from "@/components/dashboard/ScatterPlot";
import { AverageEmissionsChart } from "@/components/dashboard/AverageEmissionsChart";
import { BestWorstSuppliers } from "@/components/dashboard/BestWorstSuppliers";
import { SupplierEmissionsChart } from "@/components/dashboard/SupplierEmissionsChart";
import { SectorBenchmarking } from "@/components/dashboard/SectorBenchmarking";
import { FinancialAnalysis } from "@/components/dashboard/FinancialAnalysis";
import { PartnerComparison } from "@/components/dashboard/PartnerComparison";
import { SupplierRecommendations } from "@/components/dashboard/SupplierRecommendations";
import { EmissionsParetoChart } from "@/components/dashboard/EmissionsParetoChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { mockSuppliers } from "@/data/mockSuppliers";
import { getSectorsWithCounts } from "@/data/sectors";
import { Supplier } from "@/types/supplier";

// Função para calcular potencial de melhoria de um conjunto de fornecedores
const calculateImprovementPotential = (suppliers: Supplier[]): ImprovementPotential => {
  if (suppliers.length === 0) return 'low';
  
  // Calculate sector averages
  const sectorEmissions: Record<string, number[]> = {};
  suppliers.forEach(s => {
    if (!sectorEmissions[s.sector]) sectorEmissions[s.sector] = [];
    sectorEmissions[s.sector].push(s.totalEmissions);
  });
  
  const sectorAverages: Record<string, number> = {};
  Object.entries(sectorEmissions).forEach(([sector, emissions]) => {
    sectorAverages[sector] = emissions.reduce((a, b) => a + b, 0) / emissions.length;
  });
  
  // Count critical suppliers (emissions > 1.2x sector average)
  const criticalCount = suppliers.filter(s => 
    s.totalEmissions > (sectorAverages[s.sector] || 0) * 1.2
  ).length;
  
  const criticalPercentage = (criticalCount / suppliers.length) * 100;
  
  if (criticalPercentage > 30) return 'high';
  if (criticalPercentage >= 15) return 'medium';
  return 'low';
};

const Overview = () => {
  const [selectedCluster, setSelectedCluster] = useState<ClusterType>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');

  // Get unique sectors with counts from centralized config
  const sectorsWithCounts = useMemo(() => getSectorsWithCounts(mockSuppliers), []);

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

  // Suppliers filtered by both cluster and sector (for charts)
  const chartFilteredSuppliers = useMemo(() => {
    let filtered = filteredSuppliers;
    
    if (selectedSector !== 'all') {
      filtered = filtered.filter((s) => s.sector === selectedSector);
    }

    return filtered;
  }, [filteredSuppliers, selectedSector]);

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
        
        <Tabs defaultValue="home" className="space-y-6 mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="environmental">Análise por atividade</TabsTrigger>
            <TabsTrigger value="financial">Financeira</TabsTrigger>
            <TabsTrigger value="comparative">Análise Comparativa</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <MetricsOverview suppliers={filteredSuppliers} />
            
            <FootprintSourcesRow suppliers={filteredSuppliers} totalCompanies={clusterTotals[selectedCluster]} />

            <div className="space-y-6">
              <CriticalSuppliersHighlight suppliers={filteredSuppliers} />
              <TopSuppliersHighlight suppliers={filteredSuppliers} />
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-4 gap-6 items-stretch">
              <div className="col-span-1 flex flex-col">
                <EmissionsBreakdown suppliers={chartFilteredSuppliers} />
              </div>
              <div className="col-span-3 flex flex-col">
                <ComparisonChart 
                  suppliers={chartFilteredSuppliers} 
                  sectors={sectorsWithCounts}
                  selectedSector={selectedSector}
                  onSectorChange={setSelectedSector}
                />
              </div>
            </div>

            <SupplierEmissionsChart suppliers={chartFilteredSuppliers} />

            <div className="grid gap-6 md:grid-cols-2">
              {filteredSuppliers.map((supplier) => (
                <SupplierCard key={supplier.id} supplier={supplier} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="environmental" className="space-y-6">
            <PerformanceHeatmap suppliers={filteredSuppliers} />
            <SectorBenchmarking suppliers={filteredSuppliers} />
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <FinancialAnalysis suppliers={filteredSuppliers} />
            <EmissionsParetoChart suppliers={filteredSuppliers} />
          </TabsContent>

          <TabsContent value="comparative" className="space-y-6">
            <SupplierRecommendations suppliers={filteredSuppliers} />
            <PartnerComparison suppliers={filteredSuppliers} />
            <RankingChart suppliers={filteredSuppliers} />
            <RadarComparison suppliers={filteredSuppliers} />
            <ScatterPlot suppliers={filteredSuppliers} />
            <AverageEmissionsChart suppliers={filteredSuppliers} />
            <BestWorstSuppliers suppliers={filteredSuppliers} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Overview;
