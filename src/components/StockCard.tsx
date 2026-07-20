import { AlertTriangle, Clock } from 'lucide-react';
import type { StockData } from '../types/stock';
import { classifyOpportunity } from '../utils/calculations';
import { formatCurrency, formatDateTime, formatNumber, formatPercent } from '../utils/formatters';
import OpportunityBadge from './OpportunityBadge';

interface MetricProps {
  label: string;
  value: string;
  emphasis?: boolean;
}

function Metric({ label, value, emphasis }: MetricProps) {
  return (
    <div className="rounded-lg bg-canvas/70 px-3 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-500">{label}</p>
      <p className={`tabular font-mono ${emphasis ? 'text-base font-semibold text-ink-900' : 'text-sm font-medium text-ink-700'}`}>
        {value}
      </p>
    </div>
  );
}

export default function StockCard({ stock }: { stock: StockData }) {
  const opportunity = classifyOpportunity(stock.currentPrice, stock.barsiCeiling);
  const hasError = Boolean(stock.error);

  return (
    <div className="group flex flex-col rounded-xl2 border border-line bg-panel p-5 shadow-card transition-shadow hover:shadow-cardHover">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-mono text-lg font-bold tracking-tight text-ink-900">{stock.ticker}</h2>
          <p className="text-sm text-ink-500">{stock.companyName}</p>
        </div>
        {!hasError && <OpportunityBadge opportunity={opportunity} />}
      </div>

      {hasError ? (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-loss-soft px-3 py-3 text-sm text-loss">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>{stock.error}</span>
        </div>
      ) : (
        <>
          <div className="mt-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-500">Cotação atual</p>
            <p className="tabular font-mono text-3xl font-extrabold text-ink-900">
              {formatCurrency(stock.currentPrice)}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <Metric label="Preço justo (Graham)" value={formatCurrency(stock.grahamPrice)} emphasis />
            <Metric label="Preço teto (Barsi)" value={formatCurrency(stock.barsiCeiling)} emphasis />
            <Metric label="Dividend Yield" value={formatPercent(stock.dividendYield)} />
            <Metric label="P/L" value={formatNumber(stock.pl)} />
            <Metric label="P/VP" value={formatNumber(stock.pvp)} />
            <Metric label="Setor" value={stock.sector} />
          </div>
        </>
      )}

      <div className="mt-4 flex items-center gap-1.5 border-t border-line pt-3 text-xs text-ink-500">
        <Clock size={12} />
        <span>Atualizado em {formatDateTime(stock.lastUpdate)}</span>
      </div>
    </div>
  );
}
