import { AlertTriangle } from 'lucide-react';

export default function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl2 border border-loss/20 bg-loss-soft px-4 py-3.5 text-sm text-loss">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
