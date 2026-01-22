/**
 * Configuração centralizada dos estados de onboarding
 *
 * FLUXO DE ONBOARDING:
 *
 * 1. POR CONTACTAR
 *    └─> Empresa ainda não foi contactada (0 emails enviados)
 *
 * 2. SEM INTERAÇÃO
 *    └─> Email enviado mas sem resposta/clique
 *
 * 3. INTERESSADA
 *    └─> Clicou no link do email (demonstrou interesse)
 *
 * 4. REGISTADA (apenas via Simple)
 *    └─> Criou conta na plataforma Simple
 *
 * 5. EM PROGRESSO
 *    ├─> Simple: Iniciou o cálculo da pegada no Simple
 *    └─> Formulário: Iniciou o preenchimento do formulário
 *
 * 6. COMPLETO
 *    ├─> Simple: Pegada calculada via plataforma Simple
 *    └─> Formulário: Pegada calculada via formulário manual
 */

export type OnboardingStatus =
  | 'por_contactar'
  | 'sem_interacao'
  | 'interessada'
  | 'registada_simple'
  | 'em_progresso_simple'
  | 'em_progresso_formulario'
  | 'completo';

export type CompletedVia = 'simple' | 'formulario';

export interface StatusConfig {
  label: string;
  color: string;
  borderColor: string;
  tooltip: string;
  order: number;
}

/**
 * Configuração visual e descritiva de cada estado
 */
export const onboardingStatusConfig: Record<OnboardingStatus, StatusConfig> = {
  por_contactar: {
    label: 'Por contactar',
    color: 'bg-status-pending/15 text-status-pending border border-status-pending/30 hover:bg-status-pending/25 transition-colors',
    borderColor: 'border-status-pending',
    tooltip: 'Ainda não recebeu nenhum email',
    order: 1,
  },
  sem_interacao: {
    label: 'Sem interação',
    color: 'bg-status-contacted/15 text-status-contacted border border-status-contacted/30 hover:bg-status-contacted/25 transition-colors',
    borderColor: 'border-status-contacted',
    tooltip: 'Recebeu email mas não clicou no link',
    order: 2,
  },
  interessada: {
    label: 'Interessada',
    color: 'bg-status-interested/15 text-status-interested border border-status-interested/30 hover:bg-status-interested/25 transition-colors',
    borderColor: 'border-status-interested',
    tooltip: 'Clicou no link do email',
    order: 3,
  },
  registada_simple: {
    label: 'Registada / Simple',
    color: 'bg-status-registered/15 text-status-registered border border-status-registered/30 hover:bg-status-registered/25 transition-colors',
    borderColor: 'border-status-registered',
    tooltip: 'Criou conta no Simple',
    order: 4,
  },
  em_progresso_simple: {
    label: 'Em progresso / Simple',
    color: 'bg-status-progress/15 text-status-progress border border-status-progress/30 hover:bg-status-progress/25 transition-colors',
    borderColor: 'border-status-progress',
    tooltip: 'Iniciou o cálculo da pegada no Simple',
    order: 5,
  },
  em_progresso_formulario: {
    label: 'Em progresso / Formulário',
    color: 'bg-status-progress/15 text-status-progress border border-status-progress/30 hover:bg-status-progress/25 transition-colors',
    borderColor: 'border-status-progress',
    tooltip: 'Iniciou o preenchimento do formulário',
    order: 6,
  },
  completo: {
    label: 'Completo',
    color: 'bg-status-complete/15 text-status-complete border border-status-complete/30 hover:bg-status-complete/25 transition-colors',
    borderColor: 'border-status-complete',
    tooltip: 'Pegada calculada com sucesso',
    order: 7,
  },
};

/**
 * Retorna o label do status, com indicação do caminho para status "completo"
 */
export function getStatusLabel(status: OnboardingStatus, completedVia?: CompletedVia): string {
  if (status === 'completo' && completedVia) {
    return `Completo / ${completedVia === 'simple' ? 'Simple' : 'Formulário'}`;
  }
  return onboardingStatusConfig[status]?.label || status;
}

/**
 * Retorna a ordem do status para ordenação (menor = mais inicial no funil)
 */
export function getStatusOrder(status: OnboardingStatus): number {
  return onboardingStatusConfig[status]?.order || 99;
}

/**
 * Agrupa status por fase do funil
 */
export const statusPhases = {
  preDecision: ['por_contactar', 'sem_interacao', 'interessada'] as OnboardingStatus[],
  postDecision: ['registada_simple', 'em_progresso_simple', 'em_progresso_formulario', 'completo'] as OnboardingStatus[],
  simple: ['registada_simple', 'em_progresso_simple'] as OnboardingStatus[],
  formulario: ['em_progresso_formulario'] as OnboardingStatus[],
};
