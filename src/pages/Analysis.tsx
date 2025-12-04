import { useState, useMemo } from "react";
import { Header } from "@/components/dashboard/Header";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { AdvancedFilterPanel } from "@/components/dashboard/AdvancedFilterPanel";
import { SupplierCard } from "@/components/dashboard/SupplierCard";
import { ComparisonChart } from "@/components/dashboard/ComparisonChart";
import { TrendsChart } from "@/components/dashboard/TrendsChart";
import { EmissionsBreakdown } from "@/components/dashboard/EmissionsBreakdown";
import { ESGScoreCard } from "@/components/dashboard/ESGScoreCard";
import { RankingChart } from "@/components/dashboard/RankingChart";
import { RadarComparison } from "@/components/dashboard/RadarComparison";
import { PerformanceHeatmap } from "@/components/dashboard/PerformanceHeatmap";
import { ScatterPlot } from "@/components/dashboard/ScatterPlot";
import { SupplierDetailsTable } from "@/components/dashboard/SupplierDetailsTable";
import { AverageEmissionsChart } from "@/components/dashboard/AverageEmissionsChart";
import { BestWorstSuppliers } from "@/components/dashboard/BestWorstSuppliers";
import { Scope3Analysis } from "@/components/dashboard/Scope3Analysis";
import { SectorBenchmarking } from "@/components/dashboard/SectorBenchmarking";
import { FinancialAnalysis } from "@/components/dashboard/FinancialAnalysis";
import { PartnerComparison } from "@/components/dashboard/PartnerComparison";
import { SupplierRecommendations } from "@/components/dashboard/SupplierRecommendations";
import { EmissionsParetoChart } from "@/components/dashboard/EmissionsParetoChart";
import { mockSuppliers } from "@/data/mockSuppliers";
import { AdvancedFilters } from "@/types/supplier";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Analysis = () => {
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
      
      <main className="max-w-[1400px] mx-auto py-8 px-8 space-y-8">
        <AdvancedFilterPanel
          filters={advancedFilters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="environmental">Métricas Ambientais</TabsTrigger>
            <TabsTrigger value="esg">ESG & Compliance</TabsTrigger>
            <TabsTrigger value="financial">Financeira</TabsTrigger>
            <TabsTrigger value="comparative">Análise Comparativa</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Accordion type="multiple" className="space-y-4">
              <AccordionItem value="kpis">
                <AccordionTrigger className="text-lg font-semibold">
                  KPIs Principais
                </AccordionTrigger>
                <AccordionContent>
                  <MetricsOverview suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="charts">
                <AccordionTrigger className="text-lg font-semibold">
                  Gráficos de Comparação
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <ComparisonChart suppliers={filteredSuppliers} />
                    <TrendsChart suppliers={filteredSuppliers} />
                  </div>
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
              <AccordionItem value="breakdown">
                <AccordionTrigger className="text-lg font-semibold">
                  Distribuição de Emissões por Scope
                </AccordionTrigger>
                <AccordionContent>
                  <EmissionsBreakdown suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="trends">
                <AccordionTrigger className="text-lg font-semibold">
                  Tendências Históricas
                </AccordionTrigger>
                <AccordionContent>
                  <TrendsChart suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>

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

          <TabsContent value="esg" className="space-y-6">
            <Accordion type="multiple" className="space-y-4">

              <AccordionItem value="score">
                <AccordionTrigger className="text-lg font-semibold">
                  Score ESG Agregado
                </AccordionTrigger>
                <AccordionContent>
                  <ESGScoreCard suppliers={filteredSuppliers} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="comparison">
                <AccordionTrigger className="text-lg font-semibold">
                  Comparação de Fornecedores
                </AccordionTrigger>
                <AccordionContent>
                  <ComparisonChart suppliers={filteredSuppliers} />
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

          <TabsContent value="details" className="space-y-6">
            <SupplierDetailsTable suppliers={filteredSuppliers} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Analysis;
