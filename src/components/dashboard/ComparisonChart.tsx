import { Card } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ComparisonChartProps {
  suppliers: Supplier[];
}

export const ComparisonChart = ({ suppliers }: ComparisonChartProps) => {
  // Take top 8 suppliers for better readability
  const topSuppliers = suppliers.slice(0, 8);

  const chartData = topSuppliers.map((supplier) => ({
    name: supplier.name.length > 20 ? supplier.name.substring(0, 17) + '...' : supplier.name,
    'Scope 1': supplier.scope1,
    'Scope 2': supplier.scope2,
    'Scope 3': supplier.scope3,
  }));

  return (
    <Card className="p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">Comparação de Emissões por Scope</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            label={{ value: 'Emissões (t CO₂e)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="Scope 1" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Scope 2" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Scope 3" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
