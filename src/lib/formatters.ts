/**
 * Funções de formatação numérica para o mercado português
 * Centraliza toda a formatação de números, moedas e percentagens
 */

/**
 * Formata um número com separadores portugueses (ponto para milhares, vírgula para decimais)
 * @param value - Número a formatar
 * @param decimals - Casas decimais (default: 0)
 * @returns String formatada (ex: "1.234,56")
 */
export const formatNumber = (value: number, decimals = 0): string => {
  if (isNaN(value) || !isFinite(value)) return '0';
  return value.toLocaleString('pt-PT', { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals 
  });
};

/**
 * Formata emissões em toneladas de CO₂e
 * @param tons - Valor em toneladas
 * @returns String formatada (ex: "1.234 t CO₂e")
 */
export const formatEmissions = (tons: number): string => {
  return `${formatNumber(tons, 0)} t CO₂e`;
};

/**
 * Formata emissões compactas (apenas número + t)
 * @param tons - Valor em toneladas
 * @returns String formatada (ex: "1.234t")
 */
export const formatEmissionsCompact = (tons: number): string => {
  return `${formatNumber(tons, 0)}t`;
};

/**
 * Formata uma percentagem
 * @param value - Valor da percentagem (ex: 75.5)
 * @param decimals - Casas decimais (default: 1)
 * @returns String formatada (ex: "75,5%")
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${formatNumber(value, decimals)}%`;
};

/**
 * Formata intensidade de emissões (kg CO₂e por euro)
 * @param value - Valor da intensidade
 * @returns String formatada (ex: "0,45 kg CO₂e/€")
 */
export const formatIntensity = (value: number): string => {
  return `${formatNumber(value, 2)} kg CO₂e/€`;
};

/**
 * Formata intensidade por funcionário
 * @param value - Valor da intensidade
 * @returns String formatada (ex: "2,35 t/func")
 */
export const formatIntensityPerEmployee = (value: number): string => {
  return `${formatNumber(value, 2)} t/func`;
};

/**
 * Formata valor em euros
 * @param euros - Valor em euros
 * @returns String formatada (ex: "1.234 €")
 */
export const formatCurrency = (euros: number): string => {
  return new Intl.NumberFormat('pt-PT', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(euros);
};

/**
 * Formata valor em euros com decimais
 * @param euros - Valor em euros
 * @returns String formatada (ex: "1.234,56 €")
 */
export const formatCurrencyDecimals = (euros: number): string => {
  return new Intl.NumberFormat('pt-PT', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(euros);
};

/**
 * Formata área em metros quadrados
 * @param sqm - Valor em m²
 * @returns String formatada (ex: "1.500 m²")
 */
export const formatArea = (sqm: number): string => {
  return `${formatNumber(sqm, 0)} m²`;
};

/**
 * Formata receita em milhões de euros
 * @param millions - Valor em milhões
 * @returns String formatada (ex: "2,5 M€")
 */
export const formatRevenue = (millions: number): string => {
  if (millions >= 1) {
    return `${formatNumber(millions, 1)} M€`;
  }
  return `${formatNumber(millions * 1000, 0)} k€`;
};
