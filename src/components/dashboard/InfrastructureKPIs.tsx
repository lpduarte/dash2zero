import { Zap, Recycle, Bike, Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getInfrastructureByMunicipalities } from "@/data/mockInfrastructure";

interface InfrastructureKPIsProps {
  municipalities: string[]; // Lista de municípios filtrados
}

export const InfrastructureKPIs = ({ municipalities }: InfrastructureKPIsProps) => {
  const data = getInfrastructureByMunicipalities(municipalities);

  const kpis = [
    {
      icon: Zap,
      label: "Postos de Carregamento",
      value: data.chargingStations,
      description: "Elétrico",
    },
    {
      icon: Recycle,
      label: "Ecopontos",
      value: data.ecoPoints,
      description: "Reciclagem",
    },
    {
      icon: Bike,
      label: "Estações de Bicicletas",
      value: data.bikeStations,
      description: "Elétricas",
    },
    {
      icon: Leaf,
      label: "Contentores Orgânicos",
      value: data.organicBins,
      description: "Resíduos verdes",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <kpi.icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="text-3xl font-bold text-primary">
                {kpi.value.toLocaleString('pt-PT')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
