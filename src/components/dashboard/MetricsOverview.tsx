import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Supplier } from "@/types/supplier";
import { Factory, Users, Building, Euro, Calculator } from "lucide-react";

interface MetricsOverviewProps {
  suppliers: Supplier[];
  totalCompanies?: number;
}

const getPercentageColor = (percentage: number) => {
  if (percentage >= 75) return { text: "text-green-600", bg: "bg-green-500", bgLight: "bg-green-100", border: "border-green-200" };
  if (percentage >= 50) return { text: "text-lime-600", bg: "bg-lime-500", bgLight: "bg-lime-100", border: "border-lime-200" };
  if (percentage >= 25) return { text: "text-amber-600", bg: "bg-amber-500", bgLight: "bg-amber-100", border: "border-amber-200" };
  return { text: "text-red-600", bg: "bg-red-500", bgLight: "bg-red-100", border: "border-red-200" };
};

export const MetricsOverview = ({ suppliers, totalCompanies }: MetricsOverviewProps) => {
  const avgTotalEmissions = suppliers.reduce((acc, s) => acc + s.totalEmissions, 0) / suppliers.length;
  const avgEmissionsPerEmployee = suppliers.reduce((acc, s) => acc + s.emissionsPerEmployee, 0) / suppliers.length;
  const avgEmissionsPerArea = suppliers.reduce((acc, s) => acc + s.emissionsPerArea, 0) / suppliers.length;
  const avgEmissionsPerRevenue = suppliers.reduce((acc, s) => acc + s.emissionsPerRevenue, 0) / suppliers.length;
  const companiesCalculated = suppliers.length;
  const total = totalCompanies || companiesCalculated;
  const percentageCalculated = total > 0 ? Math.round((companiesCalculated / total) * 100) : 0;
  const percentageColors = getPercentageColor(percentageCalculated);

  const metrics = [
    {
      title: "Emissões totais",
      value: Math.round(avgTotalEmissions),
      unit: "tonCO₂e",
      icon: Factory,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Por colaborador",
      value: avgEmissionsPerEmployee.toFixed(2),
      unit: "tonCO₂e/colab",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Por m²",
      value: avgEmissionsPerArea.toFixed(3),
      unit: "tonCO₂e/m²",
      icon: Building,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Por faturação",
      value: avgEmissionsPerRevenue.toFixed(1),
      unit: "kgCO₂e/€",
      icon: Euro,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {metrics.map((metric) => (
        <Card key={metric.title} className="p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{metric.title}</p>
              <div className={`${metric.bgColor} ${metric.color} p-1.5 rounded`}>
                <metric.icon className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{metric.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{metric.unit}</p>
            </div>
          </div>
        </Card>
      ))}
      
      {/* Card especial para Pegadas Calculadas com barra de progresso */}
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
    </div>
  );
};
