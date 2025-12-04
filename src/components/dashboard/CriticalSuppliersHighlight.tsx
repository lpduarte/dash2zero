import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Supplier } from "@/types/supplier";
import { AlertTriangle, ArrowRight, TrendingUp, Euro, BarChart3, Info, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupplierLabel, sectorLabels } from "./SupplierLabel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CriticalSuppliersHighlightProps {
  suppliers: Supplier[];
}

export const CriticalSuppliersHighlight = ({
  suppliers
}: CriticalSuppliersHighlightProps) => {
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(true);
  const filteredSuppliers = selectedSector === "all" ? suppliers : suppliers.filter(s => s.sector === selectedSector);
  const avgEmissions = filteredSuppliers.reduce((sum, s) => sum + s.totalEmissions, 0) / filteredSuppliers.length;

  // Calcular todos os fornecedores críticos primeiro (para a percentagem)
  const allCriticalSuppliers = filteredSuppliers.filter(s => s.totalEmissions > avgEmissions * 1.2);

  // Depois ordenar e limitar a 5 para exibição
  const criticalSuppliers = [...allCriticalSuppliers].sort((a, b) => b.totalEmissions - a.totalEmissions).slice(0, 5);

  // Calculate sector averages for FE comparison
  const sectorAverages = suppliers.reduce((acc, s) => {
    if (!acc[s.sector]) {
      acc[s.sector] = {
        total: 0,
        count: 0
      };
    }
    acc[s.sector].total += s.emissionsPerRevenue;
    acc[s.sector].count += 1;
    return acc;
  }, {} as Record<string, {
    total: number;
    count: number;
  }>);
  const getSectorAvgFE = (sector: string) => {
    const sectorData = sectorAverages[sector];
    return sectorData ? sectorData.total / sectorData.count : 0;
  };

  // Find best alternative for each critical supplier (prefer same subsector, then same sector)
  const findBestAlternative = (criticalSupplier: Supplier) => {
    // First try to find alternatives in the same subsector
    if (criticalSupplier.subsector) {
      const subsectorAlternatives = suppliers.filter(s => s.subsector === criticalSupplier.subsector && s.id !== criticalSupplier.id && s.totalEmissions < criticalSupplier.totalEmissions).sort((a, b) => a.totalEmissions - b.totalEmissions);
      if (subsectorAlternatives.length > 0) {
        return subsectorAlternatives[0];
      }
    }

    // Fallback to same sector
    const sectorAlternatives = suppliers.filter(s => s.sector === criticalSupplier.sector && s.id !== criticalSupplier.id && s.totalEmissions < criticalSupplier.totalEmissions).sort((a, b) => a.totalEmissions - b.totalEmissions);
    return sectorAlternatives[0] || null;
  };
  const uniqueSectors = [...new Set(suppliers.map(s => s.sector))];
  const sectorCounts = suppliers.reduce((acc, s) => {
    acc[s.sector] = (acc[s.sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const totalCriticalEmissions = criticalSuppliers.reduce((sum, s) => sum + s.totalEmissions, 0);
  const percentageOfTotal = totalCriticalEmissions / suppliers.reduce((sum, s) => sum + s.totalEmissions, 0) * 100;

  // Cálculo dinâmico do potencial de melhoria
  const percentageCritical = allCriticalSuppliers.length / filteredSuppliers.length * 100;
  const getImprovementPotential = () => {
    if (percentageCritical > 30) return {
      level: "Alto",
      color: "text-danger"
    };
    if (percentageCritical > 15) return {
      level: "Médio",
      color: "text-warning"
    };
    return {
      level: "Baixo",
      color: "text-success"
    };
  };
  const improvementPotential = getImprovementPotential();
  return <Collapsible open={isOpen} onOpenChange={setIsOpen}>
    <Card className="border-danger/50 bg-gradient-to-br from-danger/10 via-warning/5 to-accent/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <AlertTriangle className="h-6 w-6 text-danger" />
            Empresas críticas e alternativas 
          </CardTitle>
          <div className="flex items-center gap-2">
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
                {uniqueSectors.map(sector => <SelectItem key={sector} value={sector}>
                    <div className="flex items-center justify-between w-[230px]">
                      <span>{sectorLabels[sector] || sector}</span>
                      <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">{sectorCounts[sector]}</span>
                    </div>
                  </SelectItem>)}
              </SelectContent>
            </Select>
            <CollapsibleTrigger asChild>
              <button className="ml-2 w-10 h-10 rounded-full border-2 border-danger bg-white hover:bg-danger/10 flex items-center justify-center transition-colors shadow-md shrink-0">
                <ChevronDown className={`h-5 w-5 text-danger transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
              </button>
            </CollapsibleTrigger>
          </div>
        </div>
      </CardHeader>
      <CollapsibleContent>
        <CardContent>
        <div className="space-y-3">
          {criticalSuppliers.map((supplier, index) => {
          const alternative = findBestAlternative(supplier);
          const emissionsSavings = alternative ? supplier.totalEmissions - alternative.totalEmissions : 0;
          const savingsPercentage = alternative ? (emissionsSavings / supplier.totalEmissions * 100).toFixed(0) : 0;
          const sectorAvgFE = getSectorAvgFE(supplier.sector);
          const feDiff = (supplier.emissionsPerRevenue - sectorAvgFE) / sectorAvgFE * 100;
          return <div key={supplier.id} className="p-4 border border-danger/30 rounded-lg bg-card hover:bg-danger/5 transition-colors">
                <div className="flex items-center gap-4">
                  <Badge className="bg-danger w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">
                    {index + 1}
                  </Badge>

                  {/* Current supplier */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{supplier.name}</h4>
                    <SupplierLabel sector={supplier.sector} cluster={supplier.cluster} />
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
                      <p className="text-xs text-muted-foreground">kg CO₂e/€</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <BarChart3 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">vs Setor</span>
                      </div>
                      <p className={`text-lg font-bold ${feDiff > 0 ? 'text-danger' : 'text-success'}`}>
                        {feDiff > 0 ? '+' : ''}{feDiff.toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {feDiff > 0 ? 'acima' : 'abaixo'}
                      </p>
                    </div>
                  </div>

                  {/* Arrow separator with transition indicator */}
                  {alternative && <>
                      <div className="flex flex-col items-center shrink-0 px-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-danger/20 to-success/20 flex items-center justify-center">
                          <ArrowRight className="h-4 w-4 text-success" />
                        </div>
                      </div>

                      {/* Alternative supplier */}
                      <div className="flex-1 min-w-0 bg-gradient-to-r from-success/10 to-success/5 rounded-lg p-3 border border-success/30">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5">Alternativa</p>
                            <h4 className="font-semibold text-sm truncate text-success">{alternative.name}</h4>
                          </div>
                          <div className="text-right shrink-0 flex items-center gap-2">
                            <div className="flex items-baseline gap-1">
                              <p className="text-lg font-bold text-success">{alternative.totalEmissions.toFixed(0)}</p>
                              <span className="text-xs text-muted-foreground">t CO₂e</span>
                            </div>
                            <Badge className="bg-success text-white text-xs font-bold">
                              -{savingsPercentage}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </>}

                  {!alternative && <>
                      <div className="flex flex-col items-center shrink-0 px-3">
                        <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center">
                          <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex-1 min-w-0 bg-muted/20 rounded-lg p-3 border border-border/30 cursor-help">
                              <div className="flex items-center justify-center gap-2 py-2">
                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">Sem alternativa no mesmo setor</p>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[320px]">
                            <div className="space-y-2">
                              <p className="text-xs">
                                Não existem outras empresas no setor <strong>{sectorLabels[supplier.sector] || supplier.sector}</strong> com 
                                emissões inferiores a este fornecedor.
                              </p>
                              <div className="border-t border-border/50 pt-2">
                                <p className="text-xs font-medium mb-1">Sugestões de ação:</p>
                                <ul className="text-xs text-muted-foreground space-y-0.5">
                                  <li>• Realizar auditoria energética conjunta</li>
                                  <li>• Propor formação em eficiência energética</li>
                                  <li>• Estabelecer metas de redução contratuais</li>
                                  <li>• Incentivar certificações ambientais</li>
                                </ul>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>}

                  <Button size="sm" variant="outline" className="shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>;
        })}
        </div>
        </CardContent>
      </CollapsibleContent>
    </Card>
  </Collapsible>;
};