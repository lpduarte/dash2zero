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
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle>Médias de Emissões por Setor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sectorData.map((sector, index) => (
              <Card key={index} className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{sector.sector}</h4>
                    <Badge variant="outline">{sector.count} empresas</Badge>
                  </div>
                  <p className="text-3xl font-bold text-primary">{sector.average.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">t CO₂e média</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comparação com Média do Setor</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Detalhes por Fornecedor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {comparisonData.map((supplier, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    {getDeviationIcon(supplier.deviation)}
                    {supplier.rank === 1 && (
                      <Award className="h-4 w-4 text-success" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{supplier.fullName}</p>
                    <p className="text-xs text-muted-foreground">{supplier.sector}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-semibold">{supplier.emissions.toFixed(0)} ton</p>
                    <p className="text-xs text-muted-foreground">Emissões</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">{supplier.sectorAvg.toFixed(0)} ton</p>
                    <p className="text-xs text-muted-foreground">Média Setor</p>
                  </div>
                  
                  <div className="text-right min-w-[80px]">
                    <Badge 
                      className={
                        supplier.deviation < -20 ? 'bg-success' :
                        supplier.deviation < 0 ? 'bg-primary' :
                        supplier.deviation < 20 ? 'bg-warning' :
                        'bg-danger'
                      }
                    >
                      {supplier.deviation > 0 ? '+' : ''}{supplier.deviation.toFixed(1)}%
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {supplier.rank}º/{supplier.totalInSector}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
