import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Supplier } from "@/types/supplier";
import { TrendingUp, TrendingDown, Minus, Award } from "lucide-react";

interface SectorBenchmarkingProps {
  suppliers: Supplier[];
}

export const SectorBenchmarking = ({ suppliers }: SectorBenchmarkingProps) => {
  const sectorLabels: Record<string, string> = {
    technology: 'Tecnologia',
    construction: 'Construção',
    transport: 'Transporte',
    manufacturing: 'Indústria',
    services: 'Serviços',
  };

  // Calculate sector averages
  const sectorAverages = suppliers.reduce((acc, supplier) => {
    if (!acc[supplier.sector]) {
      acc[supplier.sector] = { total: 0, count: 0, suppliers: [] };
    }
    acc[supplier.sector].total += supplier.totalEmissions;
    acc[supplier.sector].count += 1;
    acc[supplier.sector].suppliers.push(supplier);
    return acc;
  }, {} as Record<string, { total: number; count: number; suppliers: Supplier[] }>);

  const sectorData = Object.entries(sectorAverages).map(([sector, data]) => ({
    sector: sectorLabels[sector] || sector,
    sectorKey: sector,
    average: data.total / data.count,
    count: data.count,
  }));

  // Prepare comparison data for each supplier
  const comparisonData = suppliers.map(supplier => {
    const sectorAvg = sectorAverages[supplier.sector].total / sectorAverages[supplier.sector].count;
    const deviation = ((supplier.totalEmissions - sectorAvg) / sectorAvg) * 100;
    const rank = sectorAverages[supplier.sector].suppliers
      .sort((a, b) => a.totalEmissions - b.totalEmissions)
      .findIndex(s => s.id === supplier.id) + 1;
    
    return {
      name: supplier.name.length > 20 ? supplier.name.substring(0, 17) + '...' : supplier.name,
      fullName: supplier.name,
      emissions: supplier.totalEmissions,
      sectorAvg: sectorAvg,
      deviation: deviation,
      sector: sectorLabels[supplier.sector] || supplier.sector,
      sectorKey: supplier.sector,
      rank: rank,
      totalInSector: sectorAverages[supplier.sector].count,
      cluster: supplier.cluster,
    };
  }).sort((a, b) => a.deviation - b.deviation);

  const getDeviationColor = (deviation: number) => {
    if (deviation < -20) return "hsl(var(--success))";
    if (deviation < 0) return "hsl(var(--primary))";
    if (deviation < 20) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  };

  const getDeviationIcon = (deviation: number) => {
    if (deviation < -5) return <TrendingDown className="h-4 w-4 text-success" />;
    if (deviation > 5) return <TrendingUp className="h-4 w-4 text-danger" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Comparação com Média do Setor</h2>
          <p className="text-sm text-muted-foreground">
            Desvio das emissões de cada fornecedor em relação à média do seu setor
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={comparisonData} layout="vertical" margin={{ left: 150 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'Desvio (%)', position: 'bottom' }}
              />
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
                          <span className="text-muted-foreground">Emissões: </span>
                          <span className="font-bold">{data.emissions.toFixed(0)} t CO₂e</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Média do Setor: </span>
                          <span className="font-bold">{data.sectorAvg.toFixed(0)} t CO₂e</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Desvio: </span>
                          <span className={`font-bold ${data.deviation < 0 ? 'text-success' : 'text-danger'}`}>
                            {data.deviation > 0 ? '+' : ''}{data.deviation.toFixed(1)}%
                          </span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Ranking no Setor: </span>
                          <span className="font-bold">{data.rank}º / {data.totalInSector}</span>
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
              <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
              <Bar dataKey="deviation" radius={[0, 4, 4, 0]}>
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getDeviationColor(entry.deviation)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
};
