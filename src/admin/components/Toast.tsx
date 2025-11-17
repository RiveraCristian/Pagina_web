import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './Toast.css';

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function Toast({ type, message, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <FaCheckCircle />,
    error: <FaExclamationCircle />,
    info: <FaInfoCircle />,
    warning: <FaExclamationCircle />,
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">{icons[type]}</div>
      <div className="toast-message">{message}</div>
      {onClose && (
        <button className="toast-close" onClick={onClose} aria-label="Cerrar">
          <FaTimes />
        </button>
      )}
    </div>
  );
}

// Hook para gestionar toasts
export function useToast() {
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null>(null);

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    setToast({ type, message });
  };

  const hideToast = () => {
    setToast(null);
  };

  return { toast, showToast, hideToast };
}
