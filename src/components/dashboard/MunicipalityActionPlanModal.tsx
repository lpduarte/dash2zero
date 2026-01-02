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

  // Helper functions for Step 1 cards
  const renderEmissoesCard = () => {
    const scope1Pct = supplier.totalEmissions > 0 
      ? (supplier.scope1 / supplier.totalEmissions) * 100 : 0;
    const scope2Pct = supplier.totalEmissions > 0 
      ? (supplier.scope2 / supplier.totalEmissions) * 100 : 0;
    const scope3Pct = supplier.totalEmissions > 0 
      ? (supplier.scope3 / supplier.totalEmissions) * 100 : 0;

    return (
      <Card className="p-5">
        {/* Header: Título esquerda, KPI direita */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-base">Emissões Atuais</h3>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{supplier.totalEmissions.toLocaleString('pt-PT')}</span>
              <span className="text-xs text-muted-foreground">t CO₂e</span>
            </div>
          </div>
        </div>
        
        {/* Barra Stacked Horizontal Única */}
        <div className="space-y-3">
          <div className="w-full h-6 rounded-full overflow-hidden flex" title="Distribuição por âmbito">
            {/* Âmbito 1 - Roxo */}
            <div 
              className="h-full bg-purple-500 hover:opacity-80 transition-opacity cursor-pointer relative group"
              style={{ width: `${scope1Pct}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                <p className="font-medium">Âmbito 1 (Diretas)</p>
                <p>{supplier.scope1.toLocaleString('pt-PT')} t CO₂e ({scope1Pct.toFixed(0)}%)</p>
              </div>
            </div>
            
            {/* Âmbito 2 - Azul */}
            <div 
              className="h-full bg-blue-500 hover:opacity-80 transition-opacity cursor-pointer relative group"
              style={{ width: `${scope2Pct}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                <p className="font-medium">Âmbito 2 (Energia)</p>
                <p>{supplier.scope2.toLocaleString('pt-PT')} t CO₂e ({scope2Pct.toFixed(0)}%)</p>
              </div>
            </div>
            
            {/* Âmbito 3 - Laranja */}
            <div 
              className="h-full bg-orange-500 hover:opacity-80 transition-opacity cursor-pointer relative group"
              style={{ width: `${scope3Pct}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                <p className="font-medium">Âmbito 3 (Indiretas)</p>
                <p>{supplier.scope3.toLocaleString('pt-PT')} t CO₂e ({scope3Pct.toFixed(0)}%)</p>
              </div>
            </div>
          </div>
          
          {/* Legenda mínima */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Âmbito 1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Âmbito 2</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span>Âmbito 3</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderRiscoCard = () => {
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
    
    // Calcular larguras das barras (normalizado para visualização)
    const currentIntensity = supplier.emissionsPerRevenue || 0;
    const maxIntensity = Math.max(currentIntensity, avgSectorIntensity);
    const empresaBarWidth = maxIntensity > 0 
      ? (currentIntensity / maxIntensity) * 100 : 0;
    const setorBarWidth = maxIntensity > 0 
      ? (avgSectorIntensity / maxIntensity) * 100 : 0;

    return (
      <Card className={`p-5 h-full flex flex-col ${cardColors[riskLevel]}`}>
        {/* Header: Título esquerda, Badge direita */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <h3 className="font-semibold text-base">Análise de Risco</h3>
          </div>
          <Badge className={`${badgeColors[riskLevel]} px-3 py-1`}>
            {riskLabels[riskLevel]}
          </Badge>
        </div>
        
        {/* Barras Comparativas */}
        <div className="space-y-4 flex-1">
          {/* Barra Empresa */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Esta Empresa</span>
              <span className="font-medium">{currentIntensity.toFixed(2)} kg CO₂e/€</span>
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
          
          {/* Multiplicador */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">Multiplicador</span>
            <span className={`text-xl font-bold ${
              riskLevel === 'alto' ? 'text-red-600' : 
              riskLevel === 'medio' ? 'text-amber-600' : 'text-green-600'
            }`}>
              {riskMultiplier.toFixed(1)}x
            </span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Contexto de Risco (integrado) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">Consequências (intensidade {'>'}1.5x média)</p>
          </div>
          
          <ul className="space-y-1.5 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>Aumento de até 60% nos custos regulatórios</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>Dificuldade de acesso a crédito verde</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>Risco de obsolescência tecnológica</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>Pressão de stakeholders (investidores, clientes)</span>
            </li>
          </ul>
        </div>
      </Card>
    );
  };

  const renderPotencialCard = () => {
    // Determinar âmbito dominante
    const scopes = [
      { name: 'Âmbito 1', value: supplier.scope1, pct: supplier.totalEmissions > 0 ? (supplier.scope1 / supplier.totalEmissions) * 100 : 0 },
      { name: 'Âmbito 2', value: supplier.scope2, pct: supplier.totalEmissions > 0 ? (supplier.scope2 / supplier.totalEmissions) * 100 : 0 },
      { name: 'Âmbito 3', value: supplier.scope3, pct: supplier.totalEmissions > 0 ? (supplier.scope3 / supplier.totalEmissions) * 100 : 0 }
    ];
    const dominantScope = scopes.reduce((a, b) => a.value > b.value ? a : b);
    
    // Sugestões por âmbito
    const suggestions: Record<string, string[]> = {
      'Âmbito 1': [
        'Substituição de caldeiras por bombas de calor',
        'Otimização de processos industriais',
        'Eletrificação de equipamentos'
      ],
      'Âmbito 2': [
        'Instalação de painéis solares',
        'Auditoria e eficiência energética',
        'Contratação de energia verde certificada'
      ],
      'Âmbito 3': [
        'Otimização da cadeia de fornecedores',
        'Critérios ESG na seleção de parceiros',
        'Redução de emissões em transporte/logística'
      ]
    };
    
    // Cálculos estimados
    const reducaoEstimada = Math.round(supplier.totalEmissions * 0.37);
    const reducaoPct = 37;
    const metaMultiplicador = 1.2;
    
    // Larguras das barras comparativas
    const atualBarWidth = 100;
    const metaBarWidth = (metaMultiplicador / riskMultiplier) * 100;

    return (
      <Card className="p-5 bg-success/5 border-success/20">
        {/* Header: Título esquerda, KPI direita */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-success" />
            </div>
            <h3 className="font-semibold text-base">Potencial de Melhoria</h3>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-success">-{reducaoEstimada.toLocaleString('pt-PT')} t</span>
              <span className="text-xs text-muted-foreground">(-{reducaoPct}%)</span>
            </div>
          </div>
        </div>
        
        {/* Comparação Atual vs Meta */}
        <div className="space-y-3 mb-4">
          <p className="text-xs text-muted-foreground font-medium">Situação Atual vs Meta:</p>
          
          <div className="space-y-2">
            {/* Barra Atual */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Atual</span>
                <span className="font-medium">
                  {riskMultiplier.toFixed(1)}x média{' '}
                  <span>{riskLevel === 'alto' ? '🔴' : riskLevel === 'medio' ? '🟡' : '🟢'}</span>
                </span>
              </div>
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-400 rounded-full"
                  style={{ width: `${atualBarWidth}%` }}
                />
              </div>
            </div>
            
            {/* Barra Meta */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Meta</span>
                <span className="font-medium">{metaMultiplicador}x média 🟢</span>
              </div>
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${Math.min(metaBarWidth, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Esforço Estimado */}
        <div className="space-y-2 mb-4 p-3 bg-background/50 rounded-lg">
          <p className="text-xs text-muted-foreground font-medium">Para atingir zona segura:</p>
          <div className="text-sm space-y-0.5">
            <p>• Redução necessária: <span className="font-medium">{reducaoEstimada.toLocaleString('pt-PT')} t CO₂e</span></p>
            <p>• Investimento estimado: <span className="font-medium">85.000€ - 150.000€</span></p>
            <p>• Prazo típico: <span className="font-medium">12-24 meses</span></p>
          </div>
        </div>
        
        {/* Sugestão Prioritária baseada no Âmbito Dominante */}
        <div className="space-y-2 p-3 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-success" />
            <p className="text-xs font-medium text-success">Sugestão Prioritária</p>
          </div>
          
          <p className="text-xs text-muted-foreground">
            O {dominantScope.name} representa <span className="font-medium">{dominantScope.pct.toFixed(0)}%</span> das emissões. Recomendamos focar em:
          </p>
          
          <ul className="text-sm space-y-1">
            {suggestions[dominantScope.name].map((suggestion, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-success">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    );
  };

  const renderStepContent = () => {
    // Step 1: Análise - Layout 2 colunas (esquerda 2 cards, direita 1 card flex)
    if (currentStep === 1) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
          {/* Coluna Esquerda: 2 cards empilhados */}
          <div className="flex flex-col gap-4">
            {renderEmissoesCard()}
            {renderPotencialCard()}
          </div>
          
          {/* Coluna Direita: Card Risco (flex para ocupar altura total) */}
          <div className="flex flex-col">
            {renderRiscoCard()}
          </div>
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
