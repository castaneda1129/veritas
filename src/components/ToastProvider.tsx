"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  exiting: boolean;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: "border-l-accent",
  error: "border-l-danger",
  info: "border-l-blue",
};

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = Math.random().toString(36).substring(2, 10);
    setToasts((prev) => [...prev.slice(-2), { id, message, variant, exiting: false }]);

    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 200);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${toast.exiting ? "animate-toast-out" : "animate-toast-in"} rounded-lg border border-card-border border-l-[3px] bg-card-bg px-4 py-2.5 shadow-2xl ${VARIANT_STYLES[toast.variant]}`}
          >
            <p className="whitespace-nowrap font-mono text-xs text-foreground">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
