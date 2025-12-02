import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/types/supplier";
import { Award, TrendingDown, Zap, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface TopSuppliersHighlightProps {
  suppliers: Supplier[];
}

export const TopSuppliersHighlight = ({ suppliers }: TopSuppliersHighlightProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const topSuppliers = [...suppliers]
    .sort((a, b) => a.totalEmissions - b.totalEmissions)
    .slice(0, 5);

  return (
    <Card className="border-success/50 bg-gradient-to-br from-success/10 via-primary/5 to-accent/10">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full group">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl text-left">
                <Award className="h-6 w-6 text-success" />
                Top 5 Fornecedores do Banco Montepio/Município
              </CardTitle>
              <p className="text-sm text-muted-foreground text-left mt-1">
                Os 5 fornecedores com melhor desempenho ambiental - menores emissões totais
              </p>
            </div>
            <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
        <div className="grid gap-3">
          {topSuppliers.map((supplier, index) => (
            <div
              key={supplier.id}
              className={`flex items-center gap-4 p-4 border rounded-lg transition-all hover:shadow-md ${
                index === 0 
                  ? 'border-success/50 bg-success/5' 
                  : index < 3 
                  ? 'border-primary/30 bg-card' 
                  : 'border-border bg-card'
              }`}
            >
              <Badge 
                className={`w-10 h-10 flex items-center justify-center text-lg font-bold ${
                  index === 0 
                    ? 'bg-success' 
                    : index < 3 
                    ? 'bg-primary' 
                    : 'bg-accent'
                }`}
              >
                {index + 1}
              </Badge>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{supplier.name}</h4>
                  <Badge className={`bg-${supplier.rating === 'A' ? 'success' : supplier.rating === 'B' ? 'primary' : 'warning'}`}>
                    {supplier.rating}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{supplier.sector} • {supplier.cluster}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingDown className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Emissões</span>
                  </div>
                  <p className="text-lg font-bold text-success">{supplier.totalEmissions.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">ton CO₂e</p>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Zap className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">FE</span>
                  </div>
                  <p className="text-lg font-bold text-warning">{supplier.emissionsPerRevenue.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">kg/€</p>
                </div>
              </div>
            </div>
          ))}
        </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
