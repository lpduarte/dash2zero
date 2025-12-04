import { useState, useMemo } from "react";
import { Header } from "@/components/dashboard/Header";
import { ClusterSelector, ClusterType, ImprovementPotential } from "@/components/dashboard/ClusterSelector";
import { SupplierCard } from "@/components/dashboard/SupplierCard";
import { ComparisonChart } from "@/components/dashboard/ComparisonChart";
import { EmissionsBreakdown } from "@/components/dashboard/EmissionsBreakdown";
import { RankingChart } from "@/components/dashboard/RankingChart";
import { RadarComparison } from "@/components/dashboard/RadarComparison";
import { PerformanceHeatmap } from "@/components/dashboard/PerformanceHeatmap";
import { ScatterPlot } from "@/components/dashboard/ScatterPlot";
import { AverageEmissionsChart } from "@/components/dashboard/AverageEmissionsChart";
import { BestWorstSuppliers } from "@/components/dashboard/BestWorstSuppliers";
import { Scope3Analysis } from "@/components/dashboard/Scope3Analysis";
import { SectorBenchmarking } from "@/components/dashboard/SectorBenchmarking";
import { FinancialAnalysis } from "@/components/dashboard/FinancialAnalysis";
import { PartnerComparison } from "@/components/dashboard/PartnerComparison";
import { SupplierRecommendations } from "@/components/dashboard/SupplierRecommendations";
import { EmissionsParetoChart } from "@/components/dashboard/EmissionsParetoChart";
import { mockSuppliers } from "@/data/mockSuppliers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Analysis = () => {
  const [selectedCluster, setSelectedCluster] = useState<ClusterType>('all');

  // Calculate cluster counts from mock data
  const clusterCounts: Record<ClusterType, number> = useMemo(() => ({
    all: mockSuppliers.length,
    fornecedor: mockSuppliers.filter(s => s.cluster === 'fornecedor').length,
    cliente: mockSuppliers.filter(s => s.cluster === 'cliente').length,
    parceiro: mockSuppliers.filter(s => s.cluster === 'parceiro').length,
  }), []);

  // Calculate improvement potentials (based on critical suppliers percentage)
  const clusterPotentials: Record<ClusterType, ImprovementPotential> = useMemo(() => {
    const calculatePotential = (suppliers: typeof mockSuppliers): ImprovementPotential => {
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

    return {
      all: calculatePotential(mockSuppliers),
      fornecedor: calculatePotential(mockSuppliers.filter(s => s.cluster === 'fornecedor')),
      cliente: calculatePotential(mockSuppliers.filter(s => s.cluster === 'cliente')),
      parceiro: calculatePotential(mockSuppliers.filter(s => s.cluster === 'parceiro')),
    };
  }, []);

  const filteredSuppliers = useMemo(() => {
    let filtered = [...mockSuppliers];

    // Filter by cluster
    if (selectedCluster !== 'all') {
      filtered = filtered.filter((s) => s.cluster === selectedCluster);
    }

    // Sort by total emissions
    return filtered.sort((a, b) => a.totalEmissions - b.totalEmissions);
  }, [selectedCluster]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-8 py-8">
        <ClusterSelector
          selectedCluster={selectedCluster}
          onClusterChange={setSelectedCluster}
          clusterCounts={clusterCounts}
          clusterPotentials={clusterPotentials}
        />

        <Tabs defaultValue="overview" className="space-y-6 mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="environmental">Métricas Ambientais</TabsTrigger>
            <TabsTrigger value="financial">Financeira</TabsTrigger>
            <TabsTrigger value="comparative">Análise Comparativa</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Accordion type="multiple" className="space-y-4">
              <AccordionItem value="breakdown">
                <AccordionTrigger className="text-lg font-semibold">
                  Distribuição de Emissões por Scope
                </AccordionTrigger>
                <AccordionContent>
                  <EmissionsBreakdown suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="charts">
                <AccordionTrigger className="text-lg font-semibold">
                  Gráficos de Comparação
                </AccordionTrigger>
                <AccordionContent>
                  <ComparisonChart suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="suppliers">
                <AccordionTrigger className="text-lg font-semibold">
                  Cards dos Fornecedores ({filteredSuppliers.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {filteredSuppliers.map((supplier) => (
                      <SupplierCard key={supplier.id} supplier={supplier} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="environmental" className="space-y-6">
            <Accordion type="multiple" className="space-y-4">

              <AccordionItem value="scope3">
                <AccordionTrigger className="text-lg font-semibold">
                  Análise Detalhada do Alcance 3 por Fornecedor
                </AccordionTrigger>
                <AccordionContent>
                  <Scope3Analysis suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="heatmap">
                <AccordionTrigger className="text-lg font-semibold">
                  Desempenho por Região e Setor
                </AccordionTrigger>
                <AccordionContent>
                  <PerformanceHeatmap suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="benchmark">
                <AccordionTrigger className="text-lg font-semibold">
                  Comparação com Setor de Atividade Similar
                </AccordionTrigger>
                <AccordionContent>
                  <SectorBenchmarking suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Accordion type="multiple" className="space-y-4">
              <AccordionItem value="analysis">
                <AccordionTrigger className="text-lg font-semibold">
                  Análise Financeira e Eficiência Carbónica
                </AccordionTrigger>
                <AccordionContent>
                  <FinancialAnalysis suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pareto">
                <AccordionTrigger className="text-lg font-semibold">
                  Gráfico de Pareto - Fator de Emissões vs Investimento
                </AccordionTrigger>
                <AccordionContent>
                  <EmissionsParetoChart suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="comparative" className="space-y-6">
            <Accordion type="multiple" className="space-y-4">
              <AccordionItem value="recommendations">
                <AccordionTrigger className="text-lg font-semibold">
                  Cenários de Otimização e Recomendações
                </AccordionTrigger>
                <AccordionContent>
                  <SupplierRecommendations suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="partner-comparison">
                <AccordionTrigger className="text-lg font-semibold">
                  Comparação de Parceiros e Análise What-If
                </AccordionTrigger>
                <AccordionContent>
                  <PartnerComparison suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ranking">
                <AccordionTrigger className="text-lg font-semibold">
                  Ranking - Top 10 Menores Emissões
                </AccordionTrigger>
                <AccordionContent>
                  <RankingChart suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="radar">
                <AccordionTrigger className="text-lg font-semibold">
                  Comparação Multi-Critério (Radar)
                </AccordionTrigger>
                <AccordionContent>
                  <RadarComparison suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="scatter">
                <AccordionTrigger className="text-lg font-semibold">
                  ESG vs Volume de Negócios
                </AccordionTrigger>
                <AccordionContent>
                  <ScatterPlot suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="average">
                <AccordionTrigger className="text-lg font-semibold">
                  Emissões Médias por Parceiro
                </AccordionTrigger>
                <AccordionContent>
                  <AverageEmissionsChart suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="bestworst">
                <AccordionTrigger className="text-lg font-semibold">
                  Melhor e Pior Desempenho
                </AccordionTrigger>
                <AccordionContent>
                  <BestWorstSuppliers suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Analysis;
