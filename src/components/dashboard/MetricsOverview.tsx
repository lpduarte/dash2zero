import { Card } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";
import { Factory, Users, Building, Euro, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricsOverviewProps {
  suppliers: Supplier[];
}

export const MetricsOverview = ({ suppliers }: MetricsOverviewProps) => {
  // Soma total das emissões de todas as empresas
  const totalEmissions = suppliers.reduce((acc, s) => acc + s.totalEmissions, 0);
  const avgEmissionsPerEmployee = suppliers.reduce((acc, s) => acc + s.emissionsPerEmployee, 0) / suppliers.length;
  const avgEmissionsPerArea = suppliers.reduce((acc, s) => acc + s.emissionsPerArea, 0) / suppliers.length;
  const avgEmissionsPerRevenue = suppliers.reduce((acc, s) => acc + s.emissionsPerRevenue, 0) / suppliers.length;

  // Cálculo do potencial de melhoria baseado apenas em emissões acima da média
  const avgEmissions = totalEmissions / suppliers.length;
  const criticalSuppliers = suppliers.filter(s => 
    s.totalEmissions > avgEmissions * 1.2
  );
  const percentageCritical = (criticalSuppliers.length / suppliers.length) * 100;
  
  // Determinar nível de potencial de melhoria
  const getImprovementPotential = () => {
    if (percentageCritical > 30) return { level: "Alto", color: "text-danger", bgColor: "bg-danger/10", icon: TrendingDown };
    if (percentageCritical > 15) return { level: "Médio", color: "text-warning", bgColor: "bg-warning/10", icon: Minus };
    return { level: "Baixo", color: "text-success", bgColor: "bg-success/10", icon: TrendingDown };
  };
  
  const improvementPotential = getImprovementPotential();

  const metrics = [
    {
      title: "Emissões totais",
      value: Math.round(totalEmissions).toLocaleString('pt-PT'),
      unit: "t CO₂e",
      icon: Factory,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Potencial de melhoria",
      value: improvementPotential.level,
      unit: `${percentageCritical.toFixed(0)}% das empresas`,
      icon: improvementPotential.icon,
      color: improvementPotential.color,
      bgColor: improvementPotential.bgColor,
      isImprovement: true,
    },
    {
      title: "Média por faturação",
      value: avgEmissionsPerRevenue.toFixed(1),
      unit: "t CO₂e/€",
      icon: Euro,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Média por colaborador",
      value: avgEmissionsPerEmployee.toFixed(2),
      unit: "t CO₂e/colab",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Média por área",
      value: avgEmissionsPerArea.toFixed(3),
      unit: "t CO₂e/m²",
      icon: Building,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
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
              <p className={`text-2xl font-bold ${metric.isImprovement ? metric.color : 'text-card-foreground'}`}>
                {metric.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{metric.unit}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};