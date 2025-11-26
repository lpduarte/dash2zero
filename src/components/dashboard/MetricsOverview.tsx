import { Card } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";
import { Factory, Users, Building, Euro } from "lucide-react";

interface MetricsOverviewProps {
  suppliers: Supplier[];
}

export const MetricsOverview = ({ suppliers }: MetricsOverviewProps) => {
  const avgTotalEmissions = suppliers.reduce((acc, s) => acc + s.totalEmissions, 0) / suppliers.length;
  const avgEmissionsPerEmployee = suppliers.reduce((acc, s) => acc + s.emissionsPerEmployee, 0) / suppliers.length;
  const avgEmissionsPerArea = suppliers.reduce((acc, s) => acc + s.emissionsPerArea, 0) / suppliers.length;
  const avgEmissionsPerRevenue = suppliers.reduce((acc, s) => acc + s.emissionsPerRevenue, 0) / suppliers.length;
  
  // Calculate average emissions by sector (CAE) - desmultiplicado
  const sectorEmissions = suppliers.reduce((acc, s) => {
    if (!acc[s.sector]) {
      acc[s.sector] = { total: 0, count: 0 };
    }
    acc[s.sector].total += s.totalEmissions;
    acc[s.sector].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);
  
  // Get number of different CAE sectors
  const numDifferentCAEs = Object.keys(sectorEmissions).length;
  
  const companiesCalculated = suppliers.length;

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
    {
      title: "Diferentes CAEs",
      value: numDifferentCAEs,
      unit: "setores",
      icon: Building,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Empresas calculadas",
      value: companiesCalculated,
      unit: "empresas",
      icon: Factory,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
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
    </div>
  );
};
