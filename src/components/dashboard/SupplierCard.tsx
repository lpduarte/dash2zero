import { Card } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";
import { 
  Mail, 
  Phone, 
  ExternalLink,
  FileText,
  Building2,
  Users,
  Handshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSectorName } from "@/data/sectors";

interface SupplierCardProps {
  supplier: Supplier;
}

const getRegionLabel = (region: string) => {
  const labels: Record<string, string> = {
    north: 'Norte',
    center: 'Centro',
    south: 'Sul',
    islands: 'Ilhas',
  };
  return labels[region] || region;
};

const getClusterInfo = (cluster: string) => {
  const info: Record<string, { label: string; icon: typeof Building2 }> = {
    fornecedor: { label: 'Fornecedor', icon: Building2 },
    cliente: { label: 'Cliente', icon: Users },
    parceiro: { label: 'Parceiro', icon: Handshake },
  };
  return info[cluster] || { label: cluster, icon: Building2 };
};

export const SupplierCard = ({ supplier }: SupplierCardProps) => {
  const clusterInfo = getClusterInfo(supplier.cluster);
  const ClusterIcon = clusterInfo.icon;

  return (
    <Card className="p-6 shadow-md hover:shadow-lg transition-all">
      <div className="flex flex-col gap-3 mb-4">
        <h3 className="text-xl font-bold text-card-foreground">{supplier.name}</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {getSectorName(supplier.sector)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {getRegionLabel(supplier.region)}
          </Badge>
          <Badge variant="secondary" className="text-xs flex items-center gap-1">
            <ClusterIcon className="h-3 w-3" />
            {clusterInfo.label}
          </Badge>
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
      </div>

      {/* Scope Breakdown */}
      <div className="mb-4 space-y-2">
        <p className="text-sm font-medium mb-2">Breakdown por Âmbito:</p>
        <div className="flex gap-2 text-xs">
          <div className="flex-1 p-2 bg-primary/10 rounded">
            <p className="text-muted-foreground">Âmbito 1</p>
            <p className="font-bold text-primary">{supplier.scope1} t CO₂e</p>
          </div>
          <div className="flex-1 p-2 bg-secondary/10 rounded">
            <p className="text-muted-foreground">Âmbito 2</p>
            <p className="font-bold text-secondary">{supplier.scope2} t CO₂e</p>
          </div>
          <div className="flex-1 p-2 bg-accent/10 rounded">
            <p className="text-muted-foreground">Âmbito 3</p>
            <p className="font-bold text-accent">{supplier.scope3} t CO₂e</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{supplier.contact.nif}</span>
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
