import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Supplier } from "@/types/supplier";
import { AlertTriangle, Target, ArrowRight, Award, Users, TrendingDown } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupplierLabel, sectorLabels } from "./SupplierLabel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CriticalSuppliersHighlightProps {
  suppliers: Supplier[];
}

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

  // Find best alternative for each critical supplier (same sector, lower emissions)
  const findBestAlternative = (criticalSupplier: Supplier) => {
    const alternatives = suppliers.filter(s => 
      s.sector === criticalSupplier.sector && 
      s.id !== criticalSupplier.id &&
      s.totalEmissions < criticalSupplier.totalEmissions
    ).sort((a, b) => a.totalEmissions - b.totalEmissions);
    
    return alternatives[0] || null;
  };

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
          {criticalSuppliers.map((supplier, index) => {
            const alternative = findBestAlternative(supplier);
            const emissionsSavings = alternative 
              ? supplier.totalEmissions - alternative.totalEmissions 
              : 0;
            const savingsPercentage = alternative 
              ? ((emissionsSavings / supplier.totalEmissions) * 100).toFixed(0)
              : 0;

            return (
              <div
                key={supplier.id}
                className="p-4 border border-danger/30 rounded-lg bg-card hover:bg-danger/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Badge className="bg-danger w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">
                    {index + 1}
                  </Badge>

                  {/* Current supplier */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{supplier.name}</h4>
                    <SupplierLabel sector={supplier.sector} cluster={supplier.cluster} />
                  </div>

                  <div className="text-center shrink-0">
                    <p className="text-lg font-bold text-danger">{supplier.totalEmissions.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">t CO₂e</p>
                  </div>

                  {/* Arrow separator */}
                  {alternative && (
                    <>
                      <div className="flex flex-col items-center shrink-0 px-2">
                        <ArrowRight className="h-5 w-5 text-success" />
                        <Badge className="bg-success/10 text-success border-success/30 text-xs mt-1">
                          -{savingsPercentage}%
                        </Badge>
                      </div>

                      {/* Alternative supplier */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex-1 min-w-0 bg-success/5 rounded-lg p-2 border border-success/20 cursor-pointer hover:bg-success/10 transition-colors">
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-xs text-muted-foreground mb-0.5">Alternativa</p>
                                  <h4 className="font-semibold text-sm truncate text-success">{alternative.name}</h4>
                                </div>
                                <div className="text-center shrink-0">
                                  <p className="text-lg font-bold text-success">{alternative.totalEmissions.toFixed(0)}</p>
                                  <p className="text-xs text-muted-foreground">t CO₂e</p>
                                </div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="w-64 p-3">
                            <div className="space-y-2">
                              <p className="font-semibold text-sm">{alternative.name}</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex items-center gap-1">
                                  <TrendingDown className="h-3 w-3 text-success" />
                                  <span className="text-muted-foreground">Emissões:</span>
                                  <span className="font-medium">{alternative.totalEmissions.toFixed(0)} t</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">Por colab:</span>
                                  <span className="font-medium">{alternative.emissionsPerEmployee.toFixed(1)} t</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <span className="text-muted-foreground">FE:</span>
                                <span className="font-medium">{alternative.emissionsPerRevenue.toFixed(2)} kg/€</span>
                              </div>
                              {alternative.certifications.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1 border-t border-border/50">
                                  <Award className="h-3 w-3 text-primary" />
                                  {alternative.certifications.map((cert, i) => (
                                    <Badge key={i} variant="outline" className="text-[10px] px-1 py-0">
                                      {cert}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <div className="pt-1 border-t border-border/50 text-xs text-success font-medium">
                                Poupança potencial: {emissionsSavings.toFixed(0)} t CO₂e ({savingsPercentage}%)
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  )}

                  {!alternative && (
                    <div className="flex-1 min-w-0 bg-muted/30 rounded-lg p-2 border border-border/50">
                      <p className="text-xs text-muted-foreground text-center">Sem alternativa disponível</p>
                    </div>
                  )}

                  <Button size="sm" variant="outline" className="shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
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
