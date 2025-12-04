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
    'Âmbito 1': supplier.scope1,
    'Âmbito 2': supplier.scope2,
    'Âmbito 3': supplier.scope3,
  }));

  return (
    <Card className="p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">Comparação de Emissões por Âmbito</h2>
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
          <Bar dataKey="Âmbito 1" fill="hsl(220 70% 55%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Âmbito 2" fill="hsl(280 60% 60%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Âmbito 3" fill="hsl(25 85% 55%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
