import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Supplier } from "@/types/supplier";
import { getSectorName } from "@/data/sectors";
import { Building2, Users, Handshake } from "lucide-react";

const clusterConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  fornecedor: { label: "Fornecedor", icon: <Building2 className="h-3 w-3" /> },
  cliente: { label: "Cliente", icon: <Users className="h-3 w-3" /> },
  parceiro: { label: "Parceiro", icon: <Handshake className="h-3 w-3" /> },
};
interface SupplierEmissionsChartProps {
  suppliers: Supplier[];
}
export const SupplierEmissionsChart = ({
  suppliers
}: SupplierEmissionsChartProps) => {
  const emissionsData = suppliers.map(s => ({
    name: s.name.length > 28 ? s.name.substring(0, 25) + '...' : s.name,
    fullName: s.name,
    totalEmissions: s.totalEmissions,
    sector: s.sector,
    cluster: s.cluster
  })).sort((a, b) => b.totalEmissions - a.totalEmissions);
  const avgEmissions = suppliers.reduce((sum, s) => sum + s.totalEmissions, 0) / suppliers.length;
  const getBarColor = (value: number) => {
    if (value < avgEmissions * 0.5) return "hsl(var(--success))";
    if (value < avgEmissions) return "hsl(var(--primary))";
    if (value < avgEmissions * 1.5) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  };
  return <Card>
      <CardHeader>
        <CardTitle>Emissões totais por empresa</CardTitle>
        <p className="text-sm text-muted-foreground">
          Emissões (t CO₂e)
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(250, emissionsData.length * 14)}>
          <BarChart data={emissionsData} layout="vertical" margin={{
          left: 0,
          right: 20
        }} barSize={5}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{
            fill: 'hsl(var(--muted-foreground))',
            fontSize: 10
          }} />
            <YAxis dataKey="name" type="category" tick={{
            fill: 'hsl(var(--muted-foreground))',
            fontSize: 10
          }} width={220} interval={0} />
            <Tooltip content={({
            active,
            payload
          }) => {
            if (!active || !payload || !payload[0]) return null;
            const data = payload[0].payload;
            const cluster = clusterConfig[data.cluster] || { label: data.cluster, icon: null };
            return <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold mb-2">{data.fullName}</p>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Emissões Totais: </span>
                        <span className="font-bold">{data.totalEmissions.toFixed(0)} t CO₂e</span>
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{getSectorName(data.sector)}</Badge>
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          {cluster.icon}
                          {cluster.label}
                        </Badge>
                      </div>
                    </div>
                  </div>;
          }} />
            <Bar dataKey="totalEmissions" radius={[0, 4, 4, 0]}>
              {emissionsData.map((entry, index) => <Cell key={`cell-${index}`} fill={getBarColor(entry.totalEmissions)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>;
};