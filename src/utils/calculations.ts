/**
 * Preço Justo de Graham
 * Fórmula: Preço Justo = √(22,5 × LPA × VPA)
 * Só é válida quando LPA e VPA são positivos (empresa lucrativa e com PL positivo).
 */
export function grahamFairPrice(lpa: number, vpa: number): number | null {
  if (!Number.isFinite(lpa) || !Number.isFinite(vpa)) return null;
  if (lpa <= 0 || vpa <= 0) return null;
  return Math.sqrt(22.5 * lpa * vpa);
}

/**
 * Preço Teto pelo Método Barsi
 * Fórmula: Preço Teto = Dividendo Anual ÷ 0,06 (taxa fixa de 6%)
 */
export function barsiCeilingPrice(annualDividend: number): number | null {
  if (!Number.isFinite(annualDividend) || annualDividend <= 0) return null;
  const TAXA_BARSI = 0.06;
  return annualDividend / TAXA_BARSI;
}

/**
 * Dividendo Anual estimado a partir da cotação atual e do Dividend Yield (%)
 * divulgado pelo Fundamentus (janela de 12 meses).
 */
export function estimateAnnualDividend(currentPrice: number, dividendYieldPercent: number): number {
  if (!Number.isFinite(currentPrice) || !Number.isFinite(dividendYieldPercent)) return 0;
  return (currentPrice * dividendYieldPercent) / 100;
}

export type Opportunity = 'boa' | 'cara' | 'indefinido';

export function classifyOpportunity(currentPrice: number, ceiling: number | null): Opportunity {
  if (ceiling === null || !Number.isFinite(currentPrice)) return 'indefinido';
  return currentPrice < ceiling ? 'boa' : 'cara';
}
