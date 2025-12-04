import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Supplier } from "@/types/supplier";
import { getSectorName } from "@/data/sectors";
import { Building2, Users, Handshake } from "lucide-react";

const clusterConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  fornecedor: { label: "Fornecedor", icon: <Building2 className="h-3 w-3" /> },
  cliente: { label: "Cliente", icon: <Users className="h-3 w-3" /> },
  parceiro: { label: "Parceiro", icon: <Handshake className="h-3 w-3" /> },
};

interface SectorRelativeEmissionsChartProps {
  suppliers: Supplier[];
}

export const SectorRelativeEmissionsChart = ({
  suppliers
}: SectorRelativeEmissionsChartProps) => {
  // Calculate sector averages
  const sectorAverages = suppliers.reduce((acc, s) => {
    if (!acc[s.sector]) {
      acc[s.sector] = { total: 0, count: 0 };
    }
    acc[s.sector].total += s.totalEmissions;
    acc[s.sector].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const sectorAvgValues = Object.entries(sectorAverages).reduce((acc, [sector, data]) => {
    acc[sector] = data.total / data.count;
    return acc;
  }, {} as Record<string, number>);

  // Calculate relative emissions (as percentage of sector average)
  const emissionsData = suppliers.map(s => {
    const sectorAvg = sectorAvgValues[s.sector] || 1;
    const relativeEmissions = (s.totalEmissions / sectorAvg) * 100;
    return {
      name: s.name.length > 28 ? s.name.substring(0, 25) + '...' : s.name,
      fullName: s.name,
      relativeEmissions,
      totalEmissions: s.totalEmissions,
      sectorAverage: sectorAvg,
      sector: s.sector,
      cluster: s.cluster
    };
  }).sort((a, b) => b.relativeEmissions - a.relativeEmissions);

  const getBarColor = (value: number) => {
    if (value < 50) return "hsl(var(--success))";
    if (value < 100) return "hsl(var(--primary))";
    if (value < 150) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emissões vs média do setor</CardTitle>
        <p className="text-sm text-muted-foreground">
          Emissões relativas à média do setor (100% = média)
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(250, emissionsData.length * 14)}>
          <BarChart data={emissionsData} layout="vertical" margin={{
            left: 0,
            right: 20
          }} barSize={5}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              tick={{
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 10
              }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis dataKey="name" type="category" tick={{
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 10
            }} width={220} interval={0} />
            <ReferenceLine x={100} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" label={{ value: 'Média', position: 'top', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
            <Tooltip content={({
              active,
              payload
            }) => {
              if (!active || !payload || !payload[0]) return null;
              const data = payload[0].payload;
              const cluster = clusterConfig[data.cluster] || { label: data.cluster, icon: null };
              const diff = data.relativeEmissions - 100;
              const diffText = diff > 0 ? `+${diff.toFixed(0)}%` : `${diff.toFixed(0)}%`;
              const diffColor = diff > 0 ? 'text-danger' : 'text-success';
              return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                  <p className="font-semibold mb-2">{data.fullName}</p>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Emissões: </span>
                      <span className="font-bold">{data.totalEmissions.toFixed(0)} t CO₂e</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Média do setor: </span>
                      <span className="font-medium">{data.sectorAverage.toFixed(0)} t CO₂e</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">vs Média: </span>
                      <span className={`font-bold ${diffColor}`}>{diffText}</span>
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{getSectorName(data.sector)}</Badge>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        {cluster.icon}
                        {cluster.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            }} />
            <Bar dataKey="relativeEmissions" radius={[0, 4, 4, 0]}>
              {emissionsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.relativeEmissions)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
