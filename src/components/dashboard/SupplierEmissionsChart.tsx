import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Supplier } from "@/types/supplier";

interface SupplierEmissionsChartProps {
  suppliers: Supplier[];
}

export const SupplierEmissionsChart = ({ suppliers }: SupplierEmissionsChartProps) => {
  const emissionsData = suppliers
    .map(s => ({
      name: s.name.length > 20 ? s.name.substring(0, 17) + '...' : s.name,
      fullName: s.name,
      totalEmissions: s.totalEmissions,
      sector: s.sector,
      cluster: s.cluster,
    }))
    .sort((a, b) => b.totalEmissions - a.totalEmissions);

  const avgEmissions = suppliers.reduce((sum, s) => sum + s.totalEmissions, 0) / suppliers.length;

  const getBarColor = (value: number) => {
    if (value < avgEmissions * 0.5) return "hsl(var(--success))";
    if (value < avgEmissions) return "hsl(var(--primary))";
    if (value < avgEmissions * 1.5) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emissões Totais por Fornecedor</CardTitle>
        <p className="text-sm text-muted-foreground">
          Emissões totais (Alcance 1 + 2 + 3) desagregadas por fornecedor
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(300, emissionsData.length * 18)}>
          <BarChart data={emissionsData} layout="vertical" margin={{ left: 150 }} barSize={12}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              width={140}
              interval={0}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload[0]) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold mb-2">{data.fullName}</p>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Emissões Totais: </span>
                        <span className="font-bold">{data.totalEmissions.toFixed(0)} t CO₂e</span>
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{data.sector}</Badge>
                        <Badge variant="outline" className="text-xs">{data.cluster}</Badge>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="totalEmissions" radius={[0, 4, 4, 0]}>
              {emissionsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.totalEmissions)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
