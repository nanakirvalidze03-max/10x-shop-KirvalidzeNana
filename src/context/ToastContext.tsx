import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

type ToastTone = 'success' | 'error';
interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  showToast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const showToast = useCallback(
    (message: string, tone: ToastTone = 'success') => {
      const id = nextId.current++;
      setToasts((list) => [...list, { id, message, tone }]);
      setTimeout(() => dismiss(id), 3000); // auto-hide after 3 seconds
    },
    [dismiss],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start justify-between gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              t.tone === 'success' ? 'bg-green-700' : 'bg-red-700'
            }`}
          >
            <span>{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Close notification"
              className="-mt-1 min-h-8 min-w-8 rounded text-lg leading-none hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
