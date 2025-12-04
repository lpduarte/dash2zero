import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Supplier } from "@/types/supplier";
import { AlertTriangle, Target, ArrowRight, TrendingUp, Euro, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CriticalSuppliersHighlightProps {
  suppliers: Supplier[];
}

const sectorLabels: Record<string, string> = {
  all: "Todas as atividades",
  manufacturing: "Indústria",
  technology: "Tecnologia",
  construction: "Construção",
  transport: "Transporte",
  services: "Serviços"
};

export const CriticalSuppliersHighlight = ({ suppliers }: CriticalSuppliersHighlightProps) => {
  const [selectedSector, setSelectedSector] = useState<string>("all");
  
  const filteredSuppliers = selectedSector === "all" ? suppliers : suppliers.filter(s => s.sector === selectedSector);
  const avgEmissions = filteredSuppliers.reduce((sum, s) => sum + s.totalEmissions, 0) / filteredSuppliers.length;
  
  const criticalSuppliers = filteredSuppliers.filter(s => 
    s.totalEmissions > avgEmissions * 1.2 || 
    s.rating === 'D' || 
    s.rating === 'E' ||
    !s.hasSBTi
  ).sort((a, b) => b.totalEmissions - a.totalEmissions).slice(0, 5);

  const uniqueSectors = [...new Set(suppliers.map(s => s.sector))];
  const sectorCounts = suppliers.reduce((acc, s) => {
    acc[s.sector] = (acc[s.sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalCriticalEmissions = criticalSuppliers.reduce((sum, s) => sum + s.totalEmissions, 0);
  const percentageOfTotal = (totalCriticalEmissions / suppliers.reduce((sum, s) => sum + s.totalEmissions, 0)) * 100;

  return (
    <Card className="border-danger/50 bg-gradient-to-br from-danger/10 via-warning/5 to-accent/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <AlertTriangle className="h-6 w-6 text-danger" />
            Fornecedores Críticos - Atenção Prioritária
          </CardTitle>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Filtrar por atividade" />
            </SelectTrigger>
            <SelectContent className="w-[280px]">
              <SelectItem value="all">
                <div className="flex items-center justify-between w-[230px]">
                  <span>{sectorLabels.all}</span>
                  <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">{suppliers.length}</span>
                </div>
              </SelectItem>
              {uniqueSectors.map(sector => (
                <SelectItem key={sector} value={sector}>
                  <div className="flex items-center justify-between w-[230px]">
                    <span>{sectorLabels[sector] || sector}</span>
                    <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">{sectorCounts[sector]}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Fornecedores que requerem ação imediata devido a emissões elevadas ou baixo rating ESG
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Emissões Totais</p>
              <p className="text-2xl font-bold text-danger">{totalCriticalEmissions.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">t CO₂e</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">% do Total do Grupo</p>
              <p className="text-2xl font-bold text-warning">{percentageOfTotal.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">impacto</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Potencial de Melhoria</p>
              <p className="text-2xl font-bold text-primary">Alto</p>
              <p className="text-xs text-muted-foreground">prioridade</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {criticalSuppliers.map((supplier, index) => (
            <div
              key={supplier.id}
              className="flex items-center gap-4 p-4 border border-danger/30 rounded-lg bg-card hover:bg-danger/5 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <Badge className="bg-danger w-10 h-10 flex items-center justify-center text-lg font-bold">
                  {index + 1}
                </Badge>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{supplier.name}</h4>
                    {!supplier.hasSBTi && (
                      <Badge variant="outline" className="text-xs border-warning text-warning">
                        Sem SBTi
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{supplier.sector} • {supplier.cluster}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Emissões</span>
                  </div>
                  <p className="text-lg font-bold text-danger">{supplier.totalEmissions.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">t CO₂e</p>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Euro className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">FE</span>
                  </div>
                  <p className="text-lg font-bold text-warning">{supplier.emissionsPerRevenue.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">kg/€</p>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BarChart3 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">vs Média</span>
                  </div>
                  <p className="text-lg font-bold text-danger">
                    +{(((supplier.totalEmissions - avgEmissions) / avgEmissions) * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground">acima</p>
                </div>
              </div>

              <Button size="sm" variant="outline">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-warning mt-0.5" />
            <div className="flex-1">
              <h5 className="font-semibold text-sm mb-1">Recomendação Prioritária</h5>
              <p className="text-sm text-muted-foreground">
                Focar esforços de redução nestes {criticalSuppliers.length} fornecedores pode resultar numa 
                redução de até <strong className="text-warning">{(percentageOfTotal * 0.3).toFixed(0)}%</strong> das 
                emissões totais do grupo. Consulte a aba "Análise Comparativa" para ver alternativas disponíveis.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
