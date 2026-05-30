import { ToastMessage } from '@/types';

let listeners: ((toasts: ToastMessage[]) => void)[] = [];
let toasts: ToastMessage[] = [];

/**
 * Adiciona um listener para mudanças nos toasts
 */
export function subscribeToToasts(listener: (toasts: ToastMessage[]) => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

/**
 * Notifica todos os listeners
 */
function notifyListeners() {
  listeners.forEach(listener => listener([...toasts]));
}

/**
 * Adiciona um novo toast
 */
export function addToast(type: 'success' | 'error' | 'info', message: string) {
  const toast: ToastMessage = {
    id: Date.now().toString(),
    type,
    message,
  };
  
  toasts.push(toast);
  notifyListeners();
  
  // Remove automaticamente após 5 segundos
  setTimeout(() => {
    removeToast(toast.id);
  }, 5000);
}

/**
 * Remove um toast específico
 */
export function removeToast(id: string) {
  toasts = toasts.filter(t => t.id !== id);
  notifyListeners();
}

/**
 * Retorna os toasts atuais
 */
export function getToasts(): ToastMessage[] {
  return [...toasts];
}
