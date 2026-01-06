import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Landmark, BarChart3, Zap, Euro, FileText, AlertTriangle, Target, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { Supplier } from '@/types/supplier';
import { sectorLabels } from './SupplierLabel';

interface MunicipalityActionPlanModalProps {
  supplier: Supplier | null;
  riskLevel: 'alto' | 'medio' | 'normal';
  riskMultiplier: number;
  avgSectorIntensity: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 1 | 2 | 3 | 4;

const stepConfig = [
  { number: 1, title: 'Análise', icon: BarChart3 },
  { number: 2, title: 'Medidas', icon: Zap },
  { number: 3, title: 'Financiamento', icon: Euro },
  { number: 4, title: 'Resumo', icon: FileText }
];

export const MunicipalityActionPlanModal = ({
  supplier,
  riskLevel,
  riskMultiplier,
  avgSectorIntensity,
  open,
  onOpenChange
}: MunicipalityActionPlanModalProps) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  
  if (!supplier) return null;
  
  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((currentStep + 1) as Step);
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  };
  
  const handleClose = () => {
    setCurrentStep(1);
    onOpenChange(false);
  };

  // Dimensão label helper
  const getDimensionLabel = (size: string) => {
    const labels: Record<string, string> = {
      'micro': 'Micro',
      'pequena': 'Pequena',
      'media': 'Média',
      'grande': 'Grande'
    };
    return labels[size] || size;
  };

  // Risco badge
  const getRiskBadgeVariant = () => {
    switch (riskLevel) {
      case 'alto': return 'destructive';
      case 'medio': return 'default';
      default: return 'secondary';
    }
  };
  
  const getRiskLabel = () => {
    switch (riskLevel) {
      case 'alto': return 'Alto';
      case 'medio': return 'Médio';
      default: return 'Normal';
    }
  };
  
  // Step titles for placeholder
  const stepTitles = ['Análise', 'Medidas', 'Financiamento', 'Resumo'];

  // Função única para Step 1: Card Análise de Risco Consolidado
  const renderAnaliseRiscoCard = () => {
    // Calcular percentagens dos âmbitos
    const scope1Pct = supplier.totalEmissions > 0 
      ? (supplier.scope1 / supplier.totalEmissions) * 100 : 0;
    const scope2Pct = supplier.totalEmissions > 0 
      ? (supplier.scope2 / supplier.totalEmissions) * 100 : 0;
    const scope3Pct = supplier.totalEmissions > 0 
      ? (supplier.scope3 / supplier.totalEmissions) * 100 : 0;
    
    // Cor do card baseada no nível de risco
    const cardColors = {
      alto: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900',
      medio: 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900',
      normal: 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900'
    };
    
    const badgeColors = {
      alto: 'bg-red-500 text-white',
      medio: 'bg-amber-500 text-white',
      normal: 'bg-green-500 text-white'
    };
    
    const riskLabels = {
      alto: '🔴 Alto Risco',
      medio: '🟡 Médio Risco',
      normal: '🟢 Risco Normal'
    };
    
    // Calcular larguras das barras de intensidade (normalizado)
    const empresaIntensity = supplier.emissionsPerRevenue || 0;
    const maxIntensity = Math.max(empresaIntensity, avgSectorIntensity);
    const empresaBarWidth = maxIntensity > 0 ? (empresaIntensity / maxIntensity) * 100 : 0;
    const setorBarWidth = maxIntensity > 0 ? (avgSectorIntensity / maxIntensity) * 100 : 0;
    
    // Cálculos para zona segura
    const reducaoEstimada = Math.round(supplier.totalEmissions * 0.37);
    const reducaoPct = 37;

    return (
      <Card className={`p-6 ${cardColors[riskLevel]}`}>
        {/* HEADER: Título + KPIs + Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Análise de Risco</h3>
              <p className="text-sm text-muted-foreground">
                {supplier.totalEmissions.toLocaleString('pt-PT')} t CO₂e
                <span className="mx-2">•</span>
                {riskMultiplier.toFixed(1)}x acima da média do setor
              </p>
            </div>
          </div>
          <Badge className={`${badgeColors[riskLevel]} px-3 py-1.5 text-sm`}>
            {riskLabels[riskLevel]}
          </Badge>
        </div>
        
        {/* SECÇÃO 1: Barras Comparativas de Intensidade */}
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Intensidade de Carbono
          </p>
          
          <div className="space-y-3">
            {/* Barra Empresa */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Esta Empresa</span>
                <span className="font-medium">{empresaIntensity.toFixed(2)} kg CO₂e/€</span>
              </div>
              <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{ width: `${empresaBarWidth}%` }}
                />
              </div>
            </div>
            
            {/* Barra Média Setor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Média do Setor</span>
                <span className="font-medium">{avgSectorIntensity.toFixed(2)} kg CO₂e/€</span>
              </div>
              <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${setorBarWidth}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        {/* SECÇÃO 2: Caixa Consequências (Vermelha) */}
        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <p className="text-sm font-medium text-red-700 dark:text-red-300">
              Consequências (intensidade {'>'}1.5x média)
            </p>
          </div>
          
          <ul className="space-y-1.5 text-sm text-red-700 dark:text-red-300">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Aumento de até 60% nos custos regulatórios</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Dificuldade de acesso a crédito verde</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Risco de obsolescência tecnológica</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Pressão de stakeholders (investidores, clientes)</span>
            </li>
          </ul>
        </div>
        
        {/* SECÇÃO 3: Caixa Para Atingir Zona Segura (Verde) */}
        <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              Para atingir zona segura
            </p>
          </div>
          
          {/* Barra de Âmbitos */}
          <div className="mb-4">
            <p className="text-xs text-green-700 dark:text-green-300 mb-2">Distribuição por Âmbito (onde atuar):</p>
            
            <div className="w-full h-5 rounded-full overflow-hidden flex mb-2">
              {/* Âmbito 1 - Roxo */}
              <div 
                className="h-full bg-purple-500 hover:opacity-80 transition-opacity cursor-pointer relative group"
                style={{ width: `${scope1Pct}%` }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Âmbito 1: {scope1Pct.toFixed(0)}%
                </div>
              </div>
              
              {/* Âmbito 2 - Azul */}
              <div 
                className="h-full bg-blue-500 hover:opacity-80 transition-opacity cursor-pointer relative group"
                style={{ width: `${scope2Pct}%` }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Âmbito 2: {scope2Pct.toFixed(0)}%
                </div>
              </div>
              
              {/* Âmbito 3 - Laranja */}
              <div 
                className="h-full bg-orange-500 hover:opacity-80 transition-opacity cursor-pointer relative group"
                style={{ width: `${scope3Pct}%` }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Âmbito 3: {scope3Pct.toFixed(0)}%
                </div>
              </div>
            </div>
            
            {/* Legenda Âmbitos */}
            <div className="flex items-center gap-4 text-xs text-green-700 dark:text-green-300">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span>Âmb.1 ({scope1Pct.toFixed(0)}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Âmb.2 ({scope2Pct.toFixed(0)}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span>Âmb.3 ({scope3Pct.toFixed(0)}%)</span>
              </div>
            </div>
          </div>
          
          {/* Esforço Estimado */}
          <div className="space-y-1.5 text-sm text-green-700 dark:text-green-300">
            <div className="flex items-start gap-2">
              <span>•</span>
              <span>Redução necessária: <span className="font-medium">{reducaoEstimada.toLocaleString('pt-PT')} t CO₂e (-{reducaoPct}%)</span></span>
            </div>
            <div className="flex items-start gap-2">
              <span>•</span>
              <span>Investimento estimado: <span className="font-medium">85.000€ - 150.000€</span></span>
            </div>
            <div className="flex items-start gap-2">
              <span>•</span>
              <span>Prazo típico: <span className="font-medium">12-24 meses</span></span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderStepContent = () => {
    // Step 1: Análise - Card único consolidado
    if (currentStep === 1) {
      return (
        <div className="p-6">
          {renderAnaliseRiscoCard()}
        </div>
      );
    }
    
    // Steps 2, 3, 4: Placeholder (será implementado em 2.4B)
    const StepIcon = stepConfig[currentStep - 1].icon;
    
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Card className="w-full max-w-2xl p-8 text-center border-dashed border-2">
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <StepIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Step {currentStep}: {stepTitles[currentStep - 1]}
            </h3>
            <p className="text-muted-foreground">
              🚧 Conteúdo em construção - Será implementado na Fase 2.4B
            </p>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Empresa</p>
              <p className="font-medium">{supplier.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Emissões</p>
              <p className="font-medium">{supplier.totalEmissions.toLocaleString('pt-PT')} t CO₂e</p>
            </div>
          </div>
        </Card>
      </div>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Landmark className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                Plano de Ação - {supplier.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1.5 px-3 py-1.5 rounded-full border border-border bg-muted/30">
                <span className="text-xs text-muted-foreground">
                  Setor: <span className="text-foreground font-medium">{sectorLabels[supplier.sector] || supplier.sector}</span>
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  Dimensão: <span className="text-foreground font-medium">{getDimensionLabel(supplier.companySize)}</span>
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  Freguesia: <span className="text-foreground font-medium">{supplier.parish}</span>
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <Separator />
        
        {/* Steps Indicator */}
        <div className="px-6 py-4 bg-muted/30 border-b shrink-0">
          <div className="flex items-center justify-center">
            {stepConfig.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = currentStep >= step.number;
              const isCurrent = currentStep === step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  {/* Step circle */}
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                      ${isCurrent 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : isActive 
                          ? 'bg-primary/20 text-primary border-primary/50' 
                          : 'bg-muted text-muted-foreground border-muted-foreground/30'
                      }
                    `}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    
                    {/* Step label */}
                    <div className="mt-2 text-center">
                      <p className={`text-xs font-medium ${
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  
                  {/* Connector line */}
                  {step.number < 4 && (
                    <div className={`
                      w-24 h-0.5 mx-2 mt-[-20px]
                      ${currentStep > step.number ? 'bg-primary' : 'bg-muted-foreground/30'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderStepContent()}
        </div>
        
        {/* Footer Navigation */}
        <div className="p-4 border-t flex items-center justify-between shrink-0 bg-background">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Passo {currentStep} de 4
            </span>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={currentStep === 4}
            className="gap-2"
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
