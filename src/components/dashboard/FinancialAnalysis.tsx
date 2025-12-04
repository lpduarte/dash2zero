import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/types/supplier";
import { DollarSign, TrendingUp, Users, Building2, Target, Zap } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface FinancialAnalysisProps {
  suppliers: Supplier[];
}

export const FinancialAnalysis = ({ suppliers }: FinancialAnalysisProps) => {
  const totalRevenue = suppliers.reduce((sum, s) => sum + s.revenue, 0);
  const avgRevenue = totalRevenue / suppliers.length;
  const totalEmployees = suppliers.reduce((sum, s) => sum + s.employees, 0);
  const avgRevenuePerEmployee = (totalRevenue * 1000000) / totalEmployees; // Convert to euros

  // Calculate emissions intensity (ton CO2e per million EUR)
  const emissionsIntensityData = suppliers.map(s => ({
    name: s.name,
    revenue: s.revenue,
    emissionsPerRevenue: s.emissionsPerRevenue,
    totalEmissions: s.totalEmissions,
    cluster: s.cluster,
    sector: s.sector,
  }));

  // Financial efficiency metrics
  const financialMetrics = suppliers.map(s => ({
    name: s.name.length > 20 ? s.name.substring(0, 17) + '...' : s.name,
    fullName: s.name,
    revenue: s.revenue,
    emissionsPerRevenue: s.emissionsPerRevenue,
    revenuePerEmployee: (s.revenue * 1000000) / s.employees,
    employees: s.employees,
    cluster: s.cluster,
  })).sort((a, b) => a.emissionsPerRevenue - b.emissionsPerRevenue);

  const bestEfficiency = financialMetrics[0];
  const worstEfficiency = financialMetrics[financialMetrics.length - 1];

  const getIntensityColor = (value: number) => {
    if (value < 30) return "hsl(var(--success))";
    if (value < 60) return "hsl(var(--primary))";
    if (value < 100) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">Receita Média</span>
            </div>
            <p className="text-3xl font-bold text-success">{avgRevenue.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">M€ por empresa</p>
          </CardContent>
        </Card>

        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-warning" />
              <span className="text-sm text-muted-foreground">Receita por Colaborador</span>
            </div>
            <p className="text-3xl font-bold text-warning">{(avgRevenuePerEmployee / 1000).toFixed(0)}k</p>
            <p className="text-xs text-muted-foreground">€ média</p>
          </CardContent>
        </Card>

        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-accent" />
              <span className="text-sm text-muted-foreground">Intensidade Carbónica Média</span>
            </div>
            <p className="text-3xl font-bold text-accent">
              {(suppliers.reduce((sum, s) => sum + s.emissionsPerRevenue, 0) / suppliers.length).toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground">kg CO₂e / €</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Melhor Eficiência Financeira/Carbono</span>
              </div>
            </div>
            <p className="text-xl font-bold mb-1">{bestEfficiency.fullName}</p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-xs text-muted-foreground">Intensidade</p>
                <p className="text-2xl font-bold text-success">{bestEfficiency.emissionsPerRevenue.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">kg CO₂e/€</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Receita</p>
                <p className="text-2xl font-bold text-success">{bestEfficiency.revenue.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">M€</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-danger/30 bg-danger/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-danger" />
                <span className="text-sm font-medium">Pior Eficiência Financeira/Carbono</span>
              </div>
            </div>
            <p className="text-xl font-bold mb-1">{worstEfficiency.fullName}</p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-xs text-muted-foreground">Intensidade</p>
                <p className="text-2xl font-bold text-danger">{worstEfficiency.emissionsPerRevenue.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">kg CO₂e/€</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Receita</p>
                <p className="text-2xl font-bold text-danger">{worstEfficiency.revenue.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">M€</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Intensidade de Emissões vs Volume de Negócios</CardTitle>
          <p className="text-sm text-muted-foreground">
            Relação entre emissões por euro de receita e volume total de negócios
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                dataKey="revenue" 
                name="Receita"
                unit=" M€"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'Volume de Negócios (M€)', position: 'bottom' }}
              />
              <YAxis 
                type="number" 
                dataKey="emissionsPerRevenue" 
                name="Intensidade"
                unit=" kg/€"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'Intensidade Carbónica (kg CO₂e/€)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload[0]) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold mb-2">{data.name}</p>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">Volume Negócios: </span>
                          <span className="font-bold">{data.revenue.toFixed(1)} M€</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Intensidade Carbónica: </span>
                          <span className="font-bold">{data.emissionsPerRevenue.toFixed(1)} kg CO₂e/€</span>
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
              <Scatter name="Fornecedores" data={emissionsIntensityData}>
                {emissionsIntensityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getIntensityColor(entry.emissionsPerRevenue)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
};
