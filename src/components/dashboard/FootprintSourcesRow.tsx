import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Supplier } from "@/types/supplier";
import { Calculator, FileText, Zap } from "lucide-react";

interface FootprintSourcesRowProps {
  suppliers: Supplier[];
  totalCompanies?: number;
}

const getPercentageColor = (percentage: number) => {
  if (percentage >= 75) return { text: "text-green-600", bg: "bg-green-500", bgLight: "bg-green-100", border: "border-green-200" };
  if (percentage >= 50) return { text: "text-lime-600", bg: "bg-lime-500", bgLight: "bg-lime-100", border: "border-lime-200" };
  if (percentage >= 25) return { text: "text-amber-600", bg: "bg-amber-500", bgLight: "bg-amber-100", border: "border-amber-200" };
  return { text: "text-red-600", bg: "bg-red-500", bgLight: "bg-red-100", border: "border-red-200" };
};

export const FootprintSourcesRow = ({ suppliers, totalCompanies }: FootprintSourcesRowProps) => {
  const companiesCalculated = suppliers.length;
  const total = totalCompanies || companiesCalculated;
  const percentageCalculated = total > 0 ? Math.round((companiesCalculated / total) * 100) : 0;
  const percentageColors = getPercentageColor(percentageCalculated);

  const formularioCount = suppliers.filter(s => s.dataSource === "formulario").length;
  const get2zeroCount = suppliers.filter(s => s.dataSource === "get2zero").length;
  const formularioPercentage = companiesCalculated > 0 ? Math.round((formularioCount / companiesCalculated) * 100) : 0;
  const get2zeroPercentage = companiesCalculated > 0 ? Math.round((get2zeroCount / companiesCalculated) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Card Pegadas Calculadas */}
      <Card className={`p-4 shadow-md hover:shadow-lg transition-shadow ${percentageColors.bgLight} ${percentageColors.border} border-2`}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className={`text-xs font-medium ${percentageColors.text}`}>Pegadas calculadas</p>
            <div className={`${percentageColors.bg} text-white p-1.5 rounded`}>
              <Calculator className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className={`text-2xl font-bold ${percentageColors.text}`}>{companiesCalculated} de {total}</p>
            <p className={`text-xs ${percentageColors.text} mt-1 font-medium`}>{percentageCalculated}% do cluster</p>
          </div>
          <div className="mt-1">
            <Progress 
              value={percentageCalculated} 
              className="h-2 bg-white/50"
              indicatorClassName={percentageColors.bg}
            />
          </div>
        </div>
      </Card>

      {/* Card Formulário de Totais */}
      <Card className="p-4 shadow-md hover:shadow-lg transition-shadow border-2 border-primary/20">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-primary">Formulário de Totais</p>
            <div className="bg-primary/10 text-primary p-1.5 rounded">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{formularioCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{formularioPercentage}% das pegadas</p>
          </div>
          <div className="mt-1">
            <Progress 
              value={formularioPercentage} 
              className="h-2 bg-primary/10"
              indicatorClassName="bg-primary"
            />
          </div>
        </div>
      </Card>

      {/* Card Get2Zero Simple */}
      <Card className="p-4 shadow-md hover:shadow-lg transition-shadow border-2 border-accent/20">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-accent">Get2Zero Simple</p>
            <div className="bg-accent/10 text-accent p-1.5 rounded">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">{get2zeroCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{get2zeroPercentage}% das pegadas</p>
          </div>
          <div className="mt-1">
            <Progress 
              value={get2zeroPercentage} 
              className="h-2 bg-accent/10"
              indicatorClassName="bg-accent"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
