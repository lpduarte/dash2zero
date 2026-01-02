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

  const renderStepContent = () => {
    // Step 1: Análise - Layout 2x2
    if (currentStep === 1) {
      // Calcular percentagens dos scopes
      const scope1Pct = supplier.totalEmissions > 0 
        ? (supplier.scope1 / supplier.totalEmissions) * 100 
        : 0;
      const scope2Pct = supplier.totalEmissions > 0 
        ? (supplier.scope2 / supplier.totalEmissions) * 100 
        : 0;
      const scope3Pct = supplier.totalEmissions > 0 
        ? (supplier.scope3 / supplier.totalEmissions) * 100 
        : 0;
      
      // Calcular potencial de redução baseado no risco
      const targetMultiplier = 1.2;
      const currentIntensity = supplier.emissionsPerRevenue || 0;
      const targetIntensity = avgSectorIntensity * targetMultiplier;
      const potentialReductionPct = currentIntensity > targetIntensity 
        ? ((currentIntensity - targetIntensity) / currentIntensity) * 100 
        : 0;
      const potentialReductionTons = Math.round((potentialReductionPct / 100) * supplier.totalEmissions);
      const progressToSafe = riskMultiplier <= 1.2 ? 100 : Math.max(0, 100 - ((riskMultiplier - 1.2) / (riskMultiplier - 1) * 100));
      
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {/* Card 1: Emissões Atuais */}
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base">Emissões Atuais</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Anual</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{supplier.totalEmissions.toLocaleString('pt-PT')}</span>
                  <span className="text-sm text-muted-foreground">t CO₂e</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Scope 1 (Diretas)</span>
                    <span className="font-medium">{supplier.scope1.toLocaleString('pt-PT')} t ({scope1Pct.toFixed(0)}%)</span>
                  </div>
                  <Progress value={scope1Pct} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Scope 2 (Energia)</span>
                    <span className="font-medium">{supplier.scope2.toLocaleString('pt-PT')} t ({scope2Pct.toFixed(0)}%)</span>
                  </div>
                  <Progress value={scope2Pct} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Scope 3 (Indiretas)</span>
                    <span className="font-medium">{supplier.scope3.toLocaleString('pt-PT')} t ({scope3Pct.toFixed(0)}%)</span>
                  </div>
                  <Progress value={scope3Pct} className="h-2" />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Card 2: Análise de Risco */}
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <h3 className="font-semibold text-base">Análise de Risco</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Nível de Risco</p>
                <Badge 
                  variant={getRiskBadgeVariant()} 
                  className="text-sm px-3 py-1"
                >
                  {riskLevel === 'alto' ? '🔴' : riskLevel === 'medio' ? '🟡' : '🟢'}{' '}
                  {getRiskLabel()} Risco
                </Badge>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Intensidade de Carbono</span>
                  <span className="font-medium">{supplier.emissionsPerRevenue?.toFixed(2) || 'N/A'} kg CO₂e/€</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Média do Setor</span>
                  <span className="font-medium">{avgSectorIntensity.toFixed(2)} kg CO₂e/€</span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Multiplicador</span>
                  <span className={`text-lg font-bold ${
                    riskLevel === 'alto' ? 'text-destructive' : 
                    riskLevel === 'medio' ? 'text-warning' : 'text-success'
                  }`}>
                    {riskMultiplier.toFixed(1)}x
                  </span>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Card 3: Potencial de Melhoria */}
          <Card className="p-5 bg-success/5 border-success/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-success" />
              </div>
              <h3 className="font-semibold text-base">Potencial de Melhoria</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Redução Recomendada</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-success">{potentialReductionTons.toLocaleString('pt-PT')} t CO₂e</span>
                  <span className="text-sm text-muted-foreground">(-{potentialReductionPct.toFixed(0)}%)</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">Meta</p>
                <p className="text-sm">
                  Atingir intensidade de 1.2x média do setor (zona segura)
                </p>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Progresso até zona segura</span>
                  <span>{progressToSafe.toFixed(0)}%</span>
                </div>
                <Progress value={progressToSafe} className="h-2" />
              </div>
            </div>
          </Card>
          
          {/* Card 4: Contexto de Risco */}
          <Card className="p-5 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base">Contexto de Risco</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Empresas com intensidade {'>'}1.5x média do setor enfrentam:
              </p>
              
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary">•</span>
                  <span>Aumento de até 60% nos custos regulatórios</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary">•</span>
                  <span>Dificuldade de acesso a crédito verde</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary">•</span>
                  <span>Risco de obsolescência tecnológica</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary">•</span>
                  <span>Pressão de stakeholders (investidores, clientes)</span>
                </li>
              </ul>
            </div>
          </Card>
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
