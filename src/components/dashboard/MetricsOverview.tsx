import { Card } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";
import { TrendingDown, Building2, Award, Leaf } from "lucide-react";

interface MetricsOverviewProps {
  suppliers: Supplier[];
}

export const MetricsOverview = ({ suppliers }: MetricsOverviewProps) => {
  const totalSuppliers = suppliers.length;
  const avgEmissions = suppliers.reduce((acc, s) => acc + s.totalEmissions, 0) / suppliers.length;
  const leadersCount = suppliers.filter(s => s.rating === 'A').length;
  const avgRenewable = suppliers.reduce((acc, s) => acc + s.renewableEnergy, 0) / suppliers.length;

  const metrics = [
    {
      title: "Total de Fornecedores",
      value: totalSuppliers,
      icon: Building2,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Emissões Médias",
      value: `${Math.round(avgEmissions)} t CO₂e`,
      icon: TrendingDown,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Líderes em Sustentabilidade",
      value: leadersCount,
      icon: Award,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Energia Renovável Média",
      value: `${Math.round(avgRenewable)}%`,
      icon: Leaf,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric) => (
        <Card key={metric.title} className="p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
              <p className="text-3xl font-bold text-card-foreground">{metric.value}</p>
            </div>
            <div className={`${metric.bgColor} ${metric.color} p-3 rounded-lg`}>
              <metric.icon className="h-6 w-6" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
