import { Card } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SectorOption {
  sector: string;
  name: string;
  count: number;
}

interface ComparisonChartProps {
  suppliers: Supplier[];
  sectors?: SectorOption[];
  selectedSector?: string;
  onSectorChange?: (sector: string) => void;
}

export const ComparisonChart = ({ 
  suppliers, 
  sectors = [], 
  selectedSector = 'all',
  onSectorChange 
}: ComparisonChartProps) => {
  // Show all suppliers
  const topSuppliers = suppliers;

  const chartData = topSuppliers.map((supplier) => ({
    name: supplier.name.length > 20 ? supplier.name.substring(0, 17) + '...' : supplier.name,
    'Âmbito 1': supplier.scope1,
    'Âmbito 2': supplier.scope2,
    'Âmbito 3': supplier.scope3,
  }));

  return (
    <Card className="p-6 shadow-md h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Comparação de Emissões por Âmbito</h2>
          <p className="text-sm text-muted-foreground">Emissões (t CO₂e)</p>
        </div>
        {sectors.length > 0 && onSectorChange && (
          <Select value={selectedSector} onValueChange={onSectorChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por atividade" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all">Todas as atividades</SelectItem>
              {sectors.map((s) => (
                <SelectItem key={s.sector} value={s.sector}>
                  {s.name} ({s.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="flex-1" style={{ minHeight: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={4} barGap={1} barCategoryGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              angle={-90}
              textAnchor="end"
              height={140}
              interval={0}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              domain={[0, 'auto']}
              tickCount={8}
              width={40}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="Âmbito 1" fill="hsl(220 70% 55%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Âmbito 2" fill="hsl(280 60% 60%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Âmbito 3" fill="hsl(25 85% 55%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
