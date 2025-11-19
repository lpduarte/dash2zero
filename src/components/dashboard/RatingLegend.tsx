import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

export const RatingLegend = () => {
  const ratings = [
    {
      rating: "A",
      label: "Excelente",
      description: "Desempenho excecional em sustentabilidade. Emissões muito baixas, alto uso de energia renovável, múltiplas certificações, compromisso SBTi validado.",
      color: "bg-success",
      threshold: "< 1000 ton CO₂e ou FE < 30 kg/€",
    },
    {
      rating: "B",
      label: "Bom",
      description: "Bom desempenho ambiental. Emissões moderadas, uso significativo de energia renovável, algumas certificações ambientais.",
      color: "bg-primary",
      threshold: "1000-3000 ton CO₂e ou FE 30-60 kg/€",
    },
    {
      rating: "C",
      label: "Médio",
      description: "Desempenho médio. Emissões moderadas a altas, esforços iniciais em sustentabilidade, poucas certificações.",
      color: "bg-warning",
      threshold: "3000-5000 ton CO₂e ou FE 60-100 kg/€",
    },
    {
      rating: "D",
      label: "Fraco",
      description: "Desempenho abaixo da média. Emissões elevadas, pouco ou nenhum uso de energia renovável, ausência de certificações significativas.",
      color: "bg-danger",
      threshold: "5000-8000 ton CO₂e ou FE 100-150 kg/€",
    },
    {
      rating: "E",
      label: "Muito Fraco",
      description: "Desempenho crítico. Emissões muito elevadas, nenhum compromisso visível com sustentabilidade, alto risco ESG.",
      color: "bg-destructive",
      threshold: "> 8000 ton CO₂e ou FE > 150 kg/€",
    },
  ];

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Legenda dos Ratings ESG
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Os ratings são atribuídos com base numa análise combinada de emissões totais, fator de emissão, 
          uso de energia renovável, certificações e compromissos SBTi.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ratings.map((item) => (
            <div 
              key={item.rating}
              className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card hover:bg-accent/5 transition-colors"
            >
              <Badge className={`${item.color} w-12 h-12 flex items-center justify-center text-2xl font-bold`}>
                {item.rating}
              </Badge>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{item.label}</h4>
                  <Badge variant="outline" className="text-xs">
                    {item.threshold}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Nota:</strong> O rating final considera múltiplos fatores ponderados incluindo emissões absolutas, 
            intensidade carbónica (FE), percentagem de energia renovável, certificações ambientais (ISO 14001, etc.), 
            compromissos SBTi, e tendências históricas de melhoria. Um fornecedor pode ter um rating superior se demonstrar 
            forte compromisso e progressos consistentes, mesmo com emissões moderadas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
