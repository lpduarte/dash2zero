import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";
import { useState } from "react";

interface PortugalEmissionsMapProps {
  suppliers: Supplier[];
}

export const PortugalEmissionsMap = ({ suppliers }: PortugalEmissionsMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getAverageEmissions = (region: string) => {
    const filtered = suppliers.filter(s => s.region === region);
    if (filtered.length === 0) return null;
    return filtered.reduce((sum, s) => sum + s.totalEmissions, 0) / filtered.length;
  };

  const getCompanyCount = (region: string) => {
    return suppliers.filter(s => s.region === region).length;
  };

  const allEmissions = suppliers.map(s => s.totalEmissions);
  const minEmissions = Math.min(...allEmissions);
  const maxEmissions = Math.max(...allEmissions);

  const getColor = (region: string) => {
    const value = getAverageEmissions(region);
    if (value === null) return 'hsl(var(--muted))';
    const normalized = (value - minEmissions) / (maxEmissions - minEmissions);
    if (normalized < 0.2) return 'hsl(var(--success))';
    if (normalized < 0.4) return 'hsl(var(--success) / 0.7)';
    if (normalized < 0.6) return 'hsl(var(--warning) / 0.7)';
    if (normalized < 0.8) return 'hsl(var(--danger) / 0.7)';
    return 'hsl(var(--danger))';
  };

  const getRegionLabel = (region: string) => {
    const labels: Record<string, string> = {
      north: 'Norte',
      center: 'Centro',
      south: 'Sul',
    };
    return labels[region] || region;
  };

  const regionData = (region: string) => {
    const avg = getAverageEmissions(region);
    const count = getCompanyCount(region);
    return { avg, count };
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Emissões por Região (Portugal Continental)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* SVG Map */}
          <div className="relative w-full max-w-[280px]">
            <svg
              viewBox="0 0 200 400"
              className="w-full h-auto"
              style={{ maxHeight: '400px' }}
            >
              {/* Norte region */}
              <path
                d="M40 20 L160 20 L165 40 L170 60 L168 80 L165 100 L160 120 L150 130 L40 130 L35 110 L30 90 L28 70 L30 50 L35 30 Z"
                fill={getColor('north')}
                stroke="hsl(var(--border))"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200 hover:opacity-80"
                onMouseEnter={() => setHoveredRegion('north')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              
              {/* Centro region */}
              <path
                d="M40 130 L150 130 L155 150 L158 170 L155 190 L150 210 L145 230 L140 250 L30 250 L28 230 L25 210 L23 190 L25 170 L28 150 Z"
                fill={getColor('center')}
                stroke="hsl(var(--border))"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200 hover:opacity-80"
                onMouseEnter={() => setHoveredRegion('center')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              
              {/* Sul region (Alentejo + Algarve) */}
              <path
                d="M30 250 L140 250 L145 270 L148 290 L150 310 L148 330 L145 350 L140 370 L130 385 L110 390 L90 388 L70 385 L50 375 L35 360 L25 340 L20 320 L22 300 L25 280 Z"
                fill={getColor('south')}
                stroke="hsl(var(--border))"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200 hover:opacity-80"
                onMouseEnter={() => setHoveredRegion('south')}
                onMouseLeave={() => setHoveredRegion(null)}
              />

              {/* Region labels */}
              <text x="100" y="75" textAnchor="middle" className="fill-foreground text-sm font-medium pointer-events-none">
                Norte
              </text>
              <text x="95" y="190" textAnchor="middle" className="fill-foreground text-sm font-medium pointer-events-none">
                Centro
              </text>
              <text x="90" y="320" textAnchor="middle" className="fill-foreground text-sm font-medium pointer-events-none">
                Sul
              </text>
            </svg>
          </div>

          {/* Stats panel */}
          <div className="flex-1 space-y-4 min-w-[200px]">
            {['north', 'center', 'south'].map((region) => {
              const data = regionData(region);
              const isHovered = hoveredRegion === region;
              return (
                <div
                  key={region}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    isHovered ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onMouseEnter={() => setHoveredRegion(region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{getRegionLabel(region)}</span>
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: getColor(region) }}
                    />
                  </div>
                  {data.avg !== null ? (
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">{data.avg.toFixed(0)} <span className="text-sm font-normal text-muted-foreground">t CO₂e</span></div>
                      <div className="text-sm text-muted-foreground">{data.count} empresas</div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Sem dados</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-6 text-sm">
          <span className="text-muted-foreground">Legenda:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-success rounded" />
            <span>Excelente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-warning/70 rounded" />
            <span>Médio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-danger rounded" />
            <span>Alto</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
