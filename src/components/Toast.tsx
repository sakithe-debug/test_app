import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm pointer-events-auto animate-slideDown">
      <div
        className={`flex items-center justify-between p-3.5 rounded-2xl shadow-xl text-xs font-semibold backdrop-blur-md border ${
          toast.type === 'success'
            ? 'bg-zinc-900/95 text-white border-zinc-700'
            : toast.type === 'warning'
            ? 'bg-amber-950/95 text-amber-100 border-amber-800'
            : 'bg-zinc-900/95 text-white border-zinc-700'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : toast.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          )}
          <span className="leading-snug">{toast.message}</span>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 rounded-full text-zinc-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
