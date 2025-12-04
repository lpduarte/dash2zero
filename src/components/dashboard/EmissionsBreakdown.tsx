import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Supplier } from "@/types/supplier";

interface EmissionsBreakdownProps {
  suppliers: Supplier[];
}

export const EmissionsBreakdown = ({ suppliers }: EmissionsBreakdownProps) => {
  const totalScope1 = suppliers.reduce((sum, s) => sum + s.scope1, 0);
  const totalScope2 = suppliers.reduce((sum, s) => sum + s.scope2, 0);
  const totalScope3 = suppliers.reduce((sum, s) => sum + s.scope3, 0);

  const data = [
    { name: "Âmbito 1 (Diretas)", value: totalScope1, color: "hsl(var(--danger))" },
    { name: "Âmbito 2 (Energia)", value: totalScope2, color: "hsl(var(--warning))" },
    { name: "Âmbito 3 (Indiretas)", value: totalScope3, color: "hsl(var(--primary))" },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Emissões por Âmbito</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} t CO₂e`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-3 gap-3 mt-3">
        {data.map((scope, index) => (
          <Card key={scope.name} className="p-3">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">
                Âmbito {index + 1}
              </div>
              <div className="text-xl font-bold" style={{ color: scope.color }}>
                {scope.value.toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">t CO₂e</div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};
