import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Supplier } from "@/types/supplier";
import { AlertTriangle, TrendingUp, Target, ArrowRight, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface CriticalSuppliersHighlightProps {
  suppliers: Supplier[];
}

export const CriticalSuppliersHighlight = ({ suppliers }: CriticalSuppliersHighlightProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const avgEmissions = suppliers.reduce((sum, s) => sum + s.totalEmissions, 0) / suppliers.length;
  
  const criticalSuppliers = suppliers.filter(s => 
    s.totalEmissions > avgEmissions * 1.2 || 
    s.rating === 'D' || 
    s.rating === 'E' ||
    !s.hasSBTi
  ).sort((a, b) => b.totalEmissions - a.totalEmissions).slice(0, 5);

  const totalCriticalEmissions = criticalSuppliers.reduce((sum, s) => sum + s.totalEmissions, 0);
  const percentageOfTotal = (totalCriticalEmissions / suppliers.reduce((sum, s) => sum + s.totalEmissions, 0)) * 100;

  return (
    <Card className="border-danger/50 bg-gradient-to-br from-danger/10 via-warning/5 to-accent/10">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full group">
            <div className="flex items-start justify-between flex-1">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl text-left">
                  <AlertTriangle className="h-6 w-6 text-danger" />
                  Fornecedores Críticos - Atenção Prioritária
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2 text-left">
                  Fornecedores que requerem ação imediata devido a emissões elevadas ou baixo rating ESG
                </p>
              </div>
              <div className="text-right mr-4">
                <Badge className="bg-danger text-lg px-4 py-2">
                  {criticalSuppliers.length}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">críticos</p>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
        <div className="mb-4 p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Emissões Totais</p>
              <p className="text-2xl font-bold text-danger">{totalCriticalEmissions.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">ton CO₂e</p>
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
                    <Badge className="bg-danger">{supplier.rating}</Badge>
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
                  <p className="text-xs text-muted-foreground mb-1">Emissões</p>
                  <p className="text-lg font-bold text-danger">{supplier.totalEmissions.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">ton CO₂e</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">FE</p>
                  <p className="text-lg font-bold text-warning">{supplier.emissionsPerRevenue.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">kg/€</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">vs Média</p>
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
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
