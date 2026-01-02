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
import { ChevronLeft, ChevronRight, X, Landmark, BarChart3, Zap, Euro, FileText } from 'lucide-react';
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
  
  // Placeholder para steps (será implementado em 2.4B)
  const renderStepContent = () => {
    const StepIcon = stepConfig[currentStep - 1].icon;
    
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Card className="w-full max-w-2xl p-8 text-center border-dashed border-2">
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <StepIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Step {currentStep}: {stepConfig[currentStep - 1].title}
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
              <p className="text-sm text-muted-foreground">Setor</p>
              <p className="font-medium">{sectorLabels[supplier.sector] || supplier.sector}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Risco</p>
              <Badge variant={getRiskBadgeVariant()}>
                {getRiskLabel()} ({riskMultiplier.toFixed(1)}x média)
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Emissões</p>
              <p className="font-medium">{supplier.totalEmissions.toLocaleString('pt-PT')} t CO₂e</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Dimensão</p>
              <p className="font-medium">{getDimensionLabel(supplier.companySize)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Freguesia</p>
              <p className="font-medium">{supplier.parish}</p>
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
          <div className="flex items-center justify-between pr-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Landmark className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  Plano de Ação - {supplier.name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {sectorLabels[supplier.sector] || supplier.sector} | {getDimensionLabel(supplier.companySize)} | {supplier.parish}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="absolute right-4 top-4"
            >
              <X className="h-5 w-5" />
            </Button>
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
