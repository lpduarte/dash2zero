import type { FundingSource, Measure, MeasureCategory } from '@/types/actionPlan';

export const mockFunding: FundingSource[] = [
  // SUBSÍDIOS
  {
    id: 'fund-001',
    type: 'subsidio',
    name: 'Fundo Ambiental - Eficiência Energética',
    provider: 'Ministério do Ambiente',
    maxAmount: 50000,
    percentage: 50,
    deadline: '2026-06-30',
    requirements: [
      'Auditoria energética prévia',
      'Certificado energético do edifício',
      'Empresa sem dívidas à Segurança Social'
    ],
    applicableTo: {
      measureCategories: ['energia', 'mobilidade']
    },
    currentlyOpen: true,
    remainingBudget: 320000
  },
  {
    id: 'fund-002',
    type: 'subsidio',
    name: 'Cascais Sustentável',
    provider: 'Câmara Municipal de Cascais',
    maxAmount: 15000,
    percentage: 60,
    deadline: '2026-12-31',
    requirements: [
      'Empresa sediada em Cascais',
      'Plano de descarbonização aprovado'
    ],
    applicableTo: {
      measureCategories: ['energia', 'residuos', 'agua'],
      maxCompanySize: 'media'
    },
    currentlyOpen: true,
    remainingBudget: 85000
  },
  {
    id: 'fund-003',
    type: 'subsidio',
    name: 'PRR - Descarbonização',
    provider: 'Plano de Recuperação e Resiliência',
    maxAmount: 100000,
    percentage: 40,
    deadline: '2026-03-31',
    requirements: [
      'Projeto com redução mínima de 30% emissões',
      'Auditoria externa de impacto'
    ],
    applicableTo: {
      measureCategories: ['energia', 'mobilidade']
    },
    currentlyOpen: true,
    remainingBudget: 1500000
  },
  
  // INCENTIVOS
  {
    id: 'fund-004',
    type: 'incentivo',
    name: 'Incentivo Mobilidade Elétrica',
    provider: 'Fundo Ambiental',
    maxAmount: 20000,
    deadline: '2026-12-31',
    requirements: [
      'Veículos 100% elétricos',
      'Máximo 4.000€ por viatura'
    ],
    applicableTo: {
      measureCategories: ['mobilidade']
    },
    currentlyOpen: true,
    remainingBudget: 450000
  },
  
  // FINANCIAMENTO
  {
    id: 'fund-005',
    type: 'financiamento',
    name: 'Linha PPR - Sustentabilidade',
    provider: 'Sistema Bancário',
    maxAmount: 200000,
    deadline: 'rolling',
    requirements: [
      'Taxa bonificada: Euribor + 1.5%',
      'Prazo até 7 anos',
      'Carência de capital: 12 meses'
    ],
    applicableTo: {},
    currentlyOpen: true,
    remainingBudget: 2000000
  },
  {
    id: 'fund-006',
    type: 'financiamento',
    name: 'Linha BPF Verde',
    provider: 'Banco Português de Fomento',
    maxAmount: 500000,
    deadline: 'rolling',
    requirements: [
      'Taxa: Euribor + 2%',
      'Garantia Mútua: 80%',
      'Prazo até 10 anos'
    ],
    applicableTo: {
      measureCategories: ['energia', 'mobilidade', 'residuos', 'agua']
    },
    currentlyOpen: true,
    remainingBudget: 5000000
  }
];

/**
 * Calcula fundos elegíveis baseado nas medidas selecionadas
 */
export function getEligibleFunding(
  selectedMeasures: Measure[],
  companySize: 'micro' | 'pequena' | 'media' | 'grande',
  allFunding: FundingSource[] = mockFunding
): FundingSource[] {
  const measureCategories = [...new Set(selectedMeasures.map(m => m.category))];
  
  return allFunding.filter(fund => {
    // Filtro por estado aberto
    if (fund.currentlyOpen === false) {
      return false;
    }
    
    // Filtro por categoria de medida
    if (fund.applicableTo.measureCategories && 
        fund.applicableTo.measureCategories.length > 0 &&
        !fund.applicableTo.measureCategories.some(cat => 
          measureCategories.includes(cat)
        )) {
      return false;
    }
    
    // Filtro por dimensão máxima da empresa
    if (fund.applicableTo.maxCompanySize) {
      const sizeOrder = ['micro', 'pequena', 'media', 'grande'];
      const maxIndex = sizeOrder.indexOf(fund.applicableTo.maxCompanySize);
      const companyIndex = sizeOrder.indexOf(companySize);
      if (companyIndex > maxIndex) return false;
    }
    
    return true;
  });
}

/**
 * Calcula total de fundos disponíveis por categoria
 */
export function getFundingByCategory(
  allFunding: FundingSource[] = mockFunding
): { category: MeasureCategory; available: number }[] {
  const categories: MeasureCategory[] = ['energia', 'mobilidade', 'residuos', 'agua'];
  
  return categories.map(category => ({
    category,
    available: allFunding
      .filter(f => 
        f.currentlyOpen !== false && 
        (!f.applicableTo.measureCategories || 
         f.applicableTo.measureCategories.includes(category))
      )
      .reduce((sum, f) => sum + (f.remainingBudget || 0), 0)
  }));
}
