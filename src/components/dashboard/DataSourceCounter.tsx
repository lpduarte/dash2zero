import { FileText, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";

interface DataSourceCounterProps {
  suppliers: Supplier[];
}

export const DataSourceCounter = ({ suppliers }: DataSourceCounterProps) => {
  const formularioCount = suppliers.filter(s => s.dataSource === "formulario").length;
  const get2zeroCount = suppliers.filter(s => s.dataSource === "get2zero").length;
  const total = suppliers.length;

  const formularioPercentage = total > 0 ? (formularioCount / total * 100).toFixed(0) : 0;
  const get2zeroPercentage = total > 0 ? (get2zeroCount / total * 100).toFixed(0) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            Formulário de Totais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">{formularioCount}</span>
              <span className="text-muted-foreground">empresas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${formularioPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{formularioPercentage}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="bg-accent/10 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-accent" />
            </div>
            Get2Zero Simple
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-accent">{get2zeroCount}</span>
              <span className="text-muted-foreground">empresas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-accent h-full transition-all duration-500"
                  style={{ width: `${get2zeroPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{get2zeroPercentage}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
