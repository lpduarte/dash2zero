import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Supplier } from "@/types/supplier";

interface Scope3AnalysisProps {
  suppliers: Supplier[];
}

export const Scope3Analysis = ({ suppliers }: Scope3AnalysisProps) => {
  const scope3Data = suppliers
    .map(s => ({
      name: s.name.length > 20 ? s.name.substring(0, 17) + '...' : s.name,
      fullName: s.name,
      scope3: s.scope3,
      totalEmissions: s.totalEmissions,
      scope3Percentage: (s.scope3 / s.totalEmissions) * 100,
      sector: s.sector,
      cluster: s.cluster,
    }))
    .sort((a, b) => b.scope3 - a.scope3);

  const avgScope3 = suppliers.reduce((sum, s) => sum + s.scope3, 0) / suppliers.length;

  const getBarColor = (value: number) => {
    if (value < avgScope3 * 0.5) return "hsl(var(--success))";
    if (value < avgScope3) return "hsl(var(--primary))";
    if (value < avgScope3 * 1.5) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Emissões de Alcance 3 por Fornecedor</CardTitle>
          <p className="text-sm text-muted-foreground">
            Emissões indiretas da cadeia de valor - desagregadas por fornecedor
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={scope3Data} layout="vertical" margin={{ left: 150 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                width={140}
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
                          <span className="text-muted-foreground">Alcance 3: </span>
                          <span className="font-bold">{data.scope3.toFixed(0)} t CO₂e</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">% do Total: </span>
                          <span className="font-bold">{data.scope3Percentage.toFixed(1)}%</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Emissões Totais: </span>
                          <span>{data.totalEmissions.toFixed(0)} t CO₂e</span>
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
              <Bar dataKey="scope3" radius={[0, 4, 4, 0]}>
                {scope3Data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.scope3)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Percentagem de Alcance 3 nas Emissões Totais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scope3Data.map((supplier, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{supplier.fullName}</span>
                  <span className="text-muted-foreground">
                    {supplier.scope3.toFixed(0)} t CO₂e ({supplier.scope3Percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all"
                    style={{
                      width: `${supplier.scope3Percentage}%`,
                      backgroundColor: getBarColor(supplier.scope3),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
