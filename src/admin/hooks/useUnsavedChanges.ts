import { useEffect } from 'react';

interface UseUnsavedChangesProps {
  hasUnsavedChanges: boolean;
  message?: string;
}

/**
 * Hook para prevenir navegación con cambios sin guardar
 */
export function useUnsavedChanges({
  hasUnsavedChanges,
  message = '¿Deseas salir sin guardar los cambios?'
}: UseUnsavedChangesProps) {

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    // Prevenir cierre de ventana/tab
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);

  // Función helper para confirmar navegación
  const confirmNavigation = (callback: () => void) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(message);
      if (confirmed) {
        callback();
      }
    } else {
      callback();
    }
  };

  return { confirmNavigation };
}
