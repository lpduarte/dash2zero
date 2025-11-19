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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric) => (
        <Card key={metric.title} className="p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground mb-3">{metric.title}</p>
              <div className="flex items-baseline gap-2">
                <div className={`${metric.bgColor} ${metric.color} p-2 rounded`}>
                  <metric.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-card-foreground">{metric.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{metric.unit}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
