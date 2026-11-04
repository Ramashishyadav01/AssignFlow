import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const typeConfig: Record<ToastType, { bg: string; icon: ReactNode }> = {
  success: {
    bg: 'bg-emerald-600',
    icon: <CheckCircle size={18} />,
  },
  error: {
    bg: 'bg-red-600',
    icon: <XCircle size={18} />,
  },
  info: {
    bg: 'bg-indigo-600',
    icon: <Info size={18} />,
  },
};

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++counter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end">
          {toasts.map((toast) => {
            const cfg = typeConfig[toast.type];
            return (
              <div
                key={toast.id}
                className={[
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm shadow-lg min-w-[260px] max-w-sm',
                  cfg.bg,
                ].join(' ')}
              >
                <span className="shrink-0">{cfg.icon}</span>
                <span className="flex-1">{toast.message}</span>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
