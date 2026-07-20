import { LineChart, RefreshCw } from 'lucide-react';
import { formatDateTime } from '../utils/formatters';
import type { FetchStatus } from '../types/stock';

interface HeaderProps {
  status: FetchStatus;
  lastRefresh: string | null;
  onRefresh: () => void;
}

export default function Header({ status, lastRefresh, onRefresh }: HeaderProps) {
  const isLoading = status === 'loading';

  return (
    <header className="border-b border-line bg-panel/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl2 bg-brand text-white">
            <LineChart size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-ink-900">Painel de Ações B3</h1>
            <p className="text-xs text-ink-500">Preço Justo (Graham) &amp; Preço Teto (Barsi) · dados via Fundamentus</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="hidden text-xs text-ink-500 sm:inline">
              Última atualização: {formatDateTime(lastRefresh)}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Atualizando...' : 'Atualizar dados'}
          </button>
        </div>
      </div>
    </header>
  );
}
