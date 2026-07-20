export interface StockDefinition {
  ticker: string;
  companyName: string;
  sector: string;
}

export interface StockData {
  ticker: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  lpa: number;
  vpa: number;
  dividendYield: number; // percentual, ex: 8.42 = 8.42%
  annualDividend: number; // valor em R$ por ação
  pl: number;
  pvp: number;
  grahamPrice: number | null;
  barsiCeiling: number | null;
  lastUpdate: string;
  error?: string;
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';
