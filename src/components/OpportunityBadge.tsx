import { Circle } from 'lucide-react';
import type { Opportunity } from '../utils/calculations';

const CONFIG: Record<Opportunity, { label: string; textClass: string; bgClass: string; dotClass: string }> = {
  boa: {
    label: 'Boa oportunidade',
    textClass: 'text-gain',
    bgClass: 'bg-gain-soft',
    dotClass: 'fill-gain text-gain',
  },
  cara: {
    label: 'Acima do preço teto',
    textClass: 'text-loss',
    bgClass: 'bg-loss-soft',
    dotClass: 'fill-loss text-loss',
  },
  indefinido: {
    label: 'Sem dados suficientes',
    textClass: 'text-ink-500',
    bgClass: 'bg-ink-300/20',
    dotClass: 'fill-ink-500 text-ink-500',
  },
};

export default function OpportunityBadge({ opportunity }: { opportunity: Opportunity }) {
  const config = CONFIG[opportunity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.textClass} ${config.bgClass}`}
    >
      <Circle size={7} className={config.dotClass} />
      {config.label}
    </span>
  );
}
