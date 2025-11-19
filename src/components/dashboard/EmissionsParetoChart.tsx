import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/types/supplier";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, AlertCircle, Target } from "lucide-react";

interface EmissionsParetoChartProps {
  suppliers: Supplier[];
}

export const EmissionsParetoChart = ({ suppliers }: EmissionsParetoChartProps) => {
  // Calculate weighted impact: emissions per revenue * revenue (total emissions contribution)
  const supplierImpact = suppliers.map(s => ({
    name: s.name.length > 15 ? s.name.substring(0, 12) + '...' : s.name,
    fullName: s.name,
    fe: s.emissionsPerRevenue,
    revenue: s.revenue,
    totalEmissions: s.totalEmissions,
    impact: s.totalEmissions, // Using total emissions as the impact metric
    cluster: s.cluster,
  })).sort((a, b) => b.impact - a.impact);

  // Calculate cumulative percentage
  const totalImpact = supplierImpact.reduce((sum, s) => sum + s.impact, 0);
  let cumulative = 0;
  
  const paretoData = supplierImpact.map(s => {
    cumulative += s.impact;
    return {
      ...s,
      cumulativePercent: (cumulative / totalImpact) * 100,
    };
  });

  // Find 80% threshold
  const threshold80Index = paretoData.findIndex(d => d.cumulativePercent >= 80);
  const critical20Percent = ((threshold80Index + 1) / paretoData.length) * 100;

  const getBarColor = (index: number) => {
    if (index <= threshold80Index) {
      return "hsl(var(--danger))"; // Critical suppliers
    }
    return "hsl(var(--success))"; // Lower priority
  };

  // Summary stats
  const avgFE = supplierImpact.reduce((sum, s) => sum + s.fe, 0) / supplierImpact.length;
  const maxFE = Math.max(...supplierImpact.map(s => s.fe));
  const minFE = Math.min(...supplierImpact.map(s => s.fe));
  const criticalSuppliers = supplierImpact.slice(0, threshold80Index + 1);
  const criticalSuppliersWithPercent = paretoData.slice(0, threshold80Index + 1);
  const totalCriticalRevenue = criticalSuppliers.reduce((sum, s) => sum + s.revenue, 0);
  const totalRevenue = supplierImpact.reduce((sum, s) => sum + s.revenue, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-danger/30 bg-danger/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-danger" />
              <span className="text-sm text-muted-foreground">Fornecedores Críticos</span>
            </div>
            <p className="text-3xl font-bold text-danger">{threshold80Index + 1}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {critical20Percent.toFixed(0)}% geram 80% das emissões
            </p>
          </CardContent>
        </Card>

        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-warning" />
              <span className="text-sm text-muted-foreground">FE Médio</span>
            </div>
            <p className="text-3xl font-bold text-warning">{avgFE.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground mt-1">kg CO₂e / €</p>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Investimento Crítico</span>
            </div>
            <p className="text-3xl font-bold text-primary">{totalCriticalRevenue.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              M€ ({((totalCriticalRevenue / totalRevenue) * 100).toFixed(0)}% do total)
            </p>
          </CardContent>
        </Card>

        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Amplitude FE</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-success">{minFE.toFixed(1)}</p>
              <span className="text-muted-foreground">-</span>
              <p className="text-2xl font-bold text-danger">{maxFE.toFixed(1)}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">kg CO₂e / €</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Pareto: Fator de Emissões vs Investimento</CardTitle>
          <p className="text-sm text-muted-foreground">
            Análise de Pareto mostrando os fornecedores que contribuem para 80% do impacto total de emissões.
            As barras vermelhas representam os fornecedores críticos prioritários.
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <ComposedChart data={paretoData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'Emissões Totais (ton CO₂e)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: '% Acumulada', angle: 90, position: 'insideRight' }}
                domain={[0, 100]}
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
                          <span className="font-bold">{data.totalEmissions.toFixed(0)} ton CO₂e</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Fator de Emissão: </span>
                          <span className="font-bold">{data.fe.toFixed(1)} kg/€</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Investimento: </span>
                          <span className="font-bold">{data.revenue.toFixed(1)} M€</span>
                        </p>
                        <p className="pt-2 border-t">
                          <span className="text-muted-foreground">% Acumulada: </span>
                          <span className="font-bold">{data.cumulativePercent.toFixed(1)}%</span>
                        </p>
                        <Badge variant="outline" className="mt-2">{data.cluster}</Badge>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="totalEmissions" name="Emissões Totais (ton CO₂e)" radius={[8, 8, 0, 0]}>
                {paretoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                ))}
              </Bar>
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="cumulativePercent" 
                name="% Acumulada"
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-accent/5 border border-accent/30 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-danger" />
              Análise de Pareto - Princípio 80/20
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Identificámos que <strong className="text-danger">{threshold80Index + 1} fornecedores</strong> (
              <strong>{critical20Percent.toFixed(0)}%</strong> do total) são responsáveis por{" "}
              <strong>80% das emissões totais</strong>. Estes fornecedores representam um investimento de{" "}
              <strong className="text-primary">{totalCriticalRevenue.toFixed(1)}M€</strong> (
              {((totalCriticalRevenue / totalRevenue) * 100).toFixed(0)}% do volume de negócios total).
            </p>
            <p className="text-sm">
              <strong>Recomendação:</strong> Priorize ações de redução de emissões nestes fornecedores críticos 
              (barras vermelhas no gráfico) para obter o máximo impacto com o menor esforço. 
              Uma redução de 20% nas emissões destes fornecedores resultaria numa redução de{" "}
              <strong className="text-success">16% nas emissões totais</strong> do grupo.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fornecedores Críticos - Priorização de Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {criticalSuppliersWithPercent.map((supplier, index) => (
              <div 
                key={supplier.fullName}
                className="flex items-center justify-between p-3 border border-danger/30 rounded-lg bg-danger/5 hover:bg-danger/10 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Badge className="bg-danger w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-semibold">{supplier.fullName}</p>
                    <p className="text-xs text-muted-foreground">{supplier.cluster}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-semibold">{supplier.totalEmissions.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">ton CO₂e</p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-warning">{supplier.fe.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">kg/€ FE</p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-primary">{supplier.revenue.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">M€ invest.</p>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <Badge variant="outline" className="text-xs">
                      {supplier.cumulativePercent.toFixed(0)}% acum.
                    </Badge>
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
