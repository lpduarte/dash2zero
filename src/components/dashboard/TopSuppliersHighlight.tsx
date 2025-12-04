import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/types/supplier";
import { Award, TrendingDown, Euro, BarChart3, Building2, Users, Handshake } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TopSuppliersHighlightProps {
  suppliers: Supplier[];
}

const sectorLabels: Record<string, string> = {
  all: "Todas as atividades",
  manufacturing: "Indústria",
  technology: "Tecnologia",
  construction: "Construção",
  transport: "Transporte",
  services: "Serviços",
};

const clusterLabels: Record<string, string> = {
  fornecedor: "Fornecedores",
  cliente: "Clientes",
  parceiro: "Parceiros",
};

const ClusterIcon = ({ cluster }: { cluster: string }) => {
  switch (cluster) {
    case 'fornecedor':
      return <Building2 className="h-3 w-3" />;
    case 'cliente':
      return <Users className="h-3 w-3" />;
    case 'parceiro':
      return <Handshake className="h-3 w-3" />;
    default:
      return null;
  }
};

const getMedalColor = (index: number) => {
  switch (index) {
    case 0:
      return "bg-[#FFD700] text-black"; // Gold
    case 1:
      return "bg-[#C0C0C0] text-black"; // Silver
    case 2:
      return "bg-[#CD7F32] text-white"; // Bronze
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getMedalBorder = (index: number) => {
  switch (index) {
    case 0:
      return "border-[#FFD700]/50 bg-[#FFD700]/5";
    case 1:
      return "border-[#C0C0C0]/50 bg-[#C0C0C0]/5";
    case 2:
      return "border-[#CD7F32]/50 bg-[#CD7F32]/5";
    default:
      return "border-border bg-card";
  }
};

export const TopSuppliersHighlight = ({ suppliers }: TopSuppliersHighlightProps) => {
  const [selectedSector, setSelectedSector] = useState<string>("all");

  // Calculate sector averages
  const sectorAverages = suppliers.reduce((acc, s) => {
    if (!acc[s.sector]) {
      acc[s.sector] = { total: 0, count: 0 };
    }
    acc[s.sector].total += s.totalEmissions;
    acc[s.sector].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const getSectorAverage = (sector: string) => {
    const data = sectorAverages[sector];
    return data ? data.total / data.count : 0;
  };

  const getComparisonToAverage = (supplier: Supplier) => {
    const avg = getSectorAverage(supplier.sector);
    if (avg === 0) return { percentage: 0, isBelow: true };
    const diff = ((supplier.totalEmissions - avg) / avg) * 100;
    return { percentage: Math.abs(diff), isBelow: diff < 0 };
  };

  const filteredSuppliers = selectedSector === "all"
    ? suppliers
    : suppliers.filter(s => s.sector === selectedSector);

  const topSuppliers = [...filteredSuppliers]
    .sort((a, b) => a.totalEmissions - b.totalEmissions)
    .slice(0, 3);

  const uniqueSectors = [...new Set(suppliers.map(s => s.sector))];

  return (
    <Card className="border-success/50 bg-gradient-to-br from-success/10 via-primary/5 to-accent/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Award className="h-6 w-6 text-success" />
            Top de empresas
          </CardTitle>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por atividade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{sectorLabels.all}</SelectItem>
              {uniqueSectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sectorLabels[sector] || sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {topSuppliers.map((supplier, index) => (
            <div
              key={supplier.id}
              className={`flex items-center gap-4 p-4 border rounded-lg transition-all hover:shadow-md ${getMedalBorder(index)}`}
            >
              <Badge 
                className={`w-10 h-10 flex items-center justify-center text-lg font-bold ${getMedalColor(index)}`}
              >
                {index + 1}
              </Badge>

              <div className="flex-1">
                <h4 className="font-semibold mb-1">{supplier.name}</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {sectorLabels[supplier.sector] || supplier.sector} • <ClusterIcon cluster={supplier.cluster} /> {clusterLabels[supplier.cluster] || supplier.cluster}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingDown className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Emissões</span>
                  </div>
                  <p className="text-lg font-bold text-success">{supplier.totalEmissions.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">t CO₂e</p>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Euro className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">FE</span>
                  </div>
                  <p className="text-lg font-bold text-warning">{supplier.emissionsPerRevenue.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">t CO₂e/€</p>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BarChart3 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">vs Setor</span>
                  </div>
                  {(() => {
                    const comparison = getComparisonToAverage(supplier);
                    return (
                      <>
                        <p className={`text-lg font-bold ${comparison.isBelow ? 'text-success' : 'text-destructive'}`}>
                          {comparison.isBelow ? '-' : '+'}{comparison.percentage.toFixed(0)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {comparison.isBelow ? 'abaixo' : 'acima'}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
          {topSuppliers.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma empresa encontrada para esta atividade
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
