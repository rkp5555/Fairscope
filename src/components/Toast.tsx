import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#FB7185] flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-[#8B5CF6] flex-shrink-0" />,
  };

  const borders = {
    success: 'border-[#22C55E]/40 bg-[#141418]/95 text-[#FAFAFA] shadow-[#22C55E]/10',
    error: 'border-[#FB7185]/40 bg-[#141418]/95 text-[#FAFAFA] shadow-[#FB7185]/10',
    info: 'border-[#8B5CF6]/40 bg-[#141418]/95 text-[#FAFAFA] shadow-[#8B5CF6]/10',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-up ${borders[toast.type]}`}
      role="alert"
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold tracking-wide text-[#FAFAFA]">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors p-1"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
