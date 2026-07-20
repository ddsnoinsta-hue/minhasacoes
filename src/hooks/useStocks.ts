import { useCallback, useEffect, useRef, useState } from 'react';
import type { FetchStatus, StockData } from '../types/stock';
import { fetchAllStocks, TRACKED_STOCKS } from '../services/fundamentusService';

interface UseStocksResult {
  stocks: StockData[];
  status: FetchStatus;
  globalError: string | null;
  lastRefresh: string | null;
  refresh: () => Promise<void>;
}

export function useStocks(autoFetchOnMount = true): UseStocksResult {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const refresh = useCallback(async () => {
    setStatus('loading');
    setGlobalError(null);
    try {
      const data = await fetchAllStocks();
      setStocks(data);
      const allFailed = data.length > 0 && data.every((s) => s.error);
      setStatus(allFailed ? 'error' : 'success');
      if (allFailed) {
        setGlobalError(
          'Não foi possível obter dados do Fundamentus no momento. Os servidores de proxy podem estar temporariamente indisponíveis — tente novamente em instantes.',
        );
      }
      setLastRefresh(new Date().toISOString());
    } catch (err) {
      setStatus('error');
      setGlobalError(err instanceof Error ? err.message : 'Erro inesperado ao atualizar os dados.');
    }
  }, []);

  useEffect(() => {
    if (autoFetchOnMount && !hasFetched.current) {
      hasFetched.current = true;
      void refresh();
    }
  }, [autoFetchOnMount, refresh]);

  return {
    stocks: stocks.length ? stocks : TRACKED_STOCKS.map((s) => ({
      ticker: s.ticker,
      companyName: s.companyName,
      sector: s.sector,
      currentPrice: NaN,
      lpa: NaN,
      vpa: NaN,
      dividendYield: NaN,
      annualDividend: NaN,
      pl: NaN,
      pvp: NaN,
      grahamPrice: null,
      barsiCeiling: null,
      lastUpdate: '',
    })),
    status,
    globalError,
    lastRefresh,
    refresh,
  };
}
