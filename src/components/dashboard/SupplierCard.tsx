import { Card } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";
import { 
  TrendingDown, 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SupplierCardProps {
  supplier: Supplier;
}

const getSectorLabel = (sector: string) => {
  const labels: Record<string, string> = {
    manufacturing: 'Indústria',
    technology: 'Tecnologia',
    construction: 'Construção',
    transport: 'Transporte',
    logistics: 'Logística',
    services: 'Serviços',
    food: 'Alimentar',
    energia: 'Energia',
  };
  return labels[sector] || sector;
};

const getRegionLabel = (region: string) => {
  const labels: Record<string, string> = {
    north: 'Norte',
    center: 'Centro',
    south: 'Sul',
    islands: 'Ilhas',
  };
  return labels[region] || region;
};

export const SupplierCard = ({ supplier }: SupplierCardProps) => {
  const emissionReduction = 
    ((supplier.yearlyProgress[0].emissions - supplier.totalEmissions) / 
    supplier.yearlyProgress[0].emissions) * 100;

  return (
    <Card className="p-6 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-card-foreground">{supplier.name}</h3>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {getSectorLabel(supplier.sector)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {getRegionLabel(supplier.region)}
            </span>
          </div>
        </div>
      </div>

      {/* Emissions Overview */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Emissões Totais</p>
          <p className="text-xl font-bold text-primary">{supplier.totalEmissions}</p>
          <p className="text-xs text-muted-foreground">t CO₂e</p>
        </div>
        <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Por Colaborador</p>
          <p className="text-xl font-bold text-secondary">{supplier.emissionsPerEmployee.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">t CO₂e/colab</p>
        </div>
        <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Por m²</p>
          <p className="text-xl font-bold text-accent">{supplier.emissionsPerArea.toFixed(3)}</p>
          <p className="text-xs text-muted-foreground">t CO₂e/m²</p>
        </div>
        <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Por Faturação</p>
          <p className="text-xl font-bold text-success">{supplier.emissionsPerRevenue.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">kg CO₂e/€</p>
        </div>
        <div className="col-span-2 flex items-center gap-2 text-sm p-2 bg-success/5 rounded">
          <TrendingDown className="h-4 w-4 text-success" />
          <span className="text-success font-medium">
            {emissionReduction.toFixed(1)}% redução (2021-2023)
          </span>
        </div>
      </div>

      {/* Scope Breakdown */}
      <div className="mb-4 space-y-2">
        <p className="text-sm font-medium mb-2">Breakdown por Âmbito:</p>
        <div className="flex gap-2 text-xs">
          <div className="flex-1 p-2 bg-primary/10 rounded">
            <p className="text-muted-foreground">Âmbito 1</p>
            <p className="font-bold text-primary">{supplier.scope1} t</p>
          </div>
          <div className="flex-1 p-2 bg-secondary/10 rounded">
            <p className="text-muted-foreground">Âmbito 2</p>
            <p className="font-bold text-secondary">{supplier.scope2} t</p>
          </div>
          <div className="flex-1 p-2 bg-accent/10 rounded">
            <p className="text-muted-foreground">Âmbito 3</p>
            <p className="font-bold text-accent">{supplier.scope3} t</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{supplier.contact.nif || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{supplier.contact.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{supplier.contact.phone}</span>
          </div>
        </div>
        {supplier.sustainabilityReport && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={supplier.sustainabilityReport} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-2" />
              Ver Relatório de Sustentabilidade
            </a>
          </Button>
        )}
      </div>
    </Card>
  );
};
