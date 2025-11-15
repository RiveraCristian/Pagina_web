import { useEffect } from 'react';

interface UseKeyboardShortcutsOptions {
  onEscape?: () => void;
  onCtrlK?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onEscape,
  onCtrlK,
  onArrowLeft,
  onArrowRight,
  enabled = true
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorar shortcuts si el usuario está escribiendo
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Excepto Ctrl+K y Escape que funcionan siempre
        if (event.key !== 'Escape' && !(event.ctrlKey && event.key === 'k')) {
          return;
        }
      }

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;
          
        case 'k':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            onCtrlK?.();
          }
          break;
          
        case 'ArrowLeft':
          if (!target.matches('input, textarea')) {
            event.preventDefault();
            onArrowLeft?.();
          }
          break;
          
        case 'ArrowRight':
          if (!target.matches('input, textarea')) {
            event.preventDefault();
            onArrowRight?.();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onEscape, onCtrlK, onArrowLeft, onArrowRight]);
}
