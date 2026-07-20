import Header from '../components/Header';
import StockCard from '../components/StockCard';
import StockCardSkeleton from '../components/StockCardSkeleton';
import ErrorBanner from '../components/ErrorBanner';
import { useStocks } from '../hooks/useStocks';

export default function Dashboard() {
  const { stocks, status, globalError, lastRefresh, refresh } = useStocks();
  const isLoading = status === 'loading';

  return (
    <div className="min-h-screen bg-canvas">
      <Header status={status} lastRefresh={lastRefresh} onRefresh={refresh} />

      <main className="mx-auto max-w-6xl px-6 py-8">
        {globalError && <ErrorBanner message={globalError} />}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading && stocks.every((s) => !s.lastUpdate)
            ? Array.from({ length: 5 }).map((_, i) => <StockCardSkeleton key={i} />)
            : stocks.map((stock) => <StockCard key={stock.ticker} stock={stock} />)}
        </div>

        <footer className="mt-10 border-t border-line pt-5 text-xs leading-relaxed text-ink-500">
          <p>
            <strong className="text-ink-700">Preço Justo (Graham):</strong> √(22,5 × LPA × VPA). Calculado apenas
            quando LPA e VPA são positivos.
          </p>
          <p className="mt-1">
            <strong className="text-ink-700">Preço Teto (Barsi):</strong> Dividendo anual estimado ÷ 0,06 (taxa fixa
            de 6%).
          </p>
          <p className="mt-1">
            Dados obtidos automaticamente do Fundamentus através de um proxy de CORS no navegador. Este painel é
            apenas informativo e não constitui recomendação de investimento.
          </p>
        </footer>
      </main>
    </div>
  );
}
