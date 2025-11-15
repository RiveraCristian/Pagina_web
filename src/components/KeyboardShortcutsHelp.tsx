import { useState } from 'react';
import '../styles/KeyboardShortcutsHelp.css';

export function KeyboardShortcutsHelp() {
  const [isVisible, setIsVisible] = useState(false);

  const shortcuts = [
    { keys: ['Esc'], description: 'Volver al inicio' },
    { keys: ['Ctrl', 'K'], description: 'Enfocar búsqueda' },
    { keys: ['←', '→'], description: 'Navegar proyectos' },
    { keys: ['?'], description: 'Mostrar esta ayuda' },
  ];

  return (
    <>
      <button
        className="keyboard-help-trigger"
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Atajos de teclado"
        title="Atajos de teclado (?)"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
          <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"></path>
        </svg>
      </button>

      {isVisible && (
        <div className="keyboard-shortcuts-overlay" onClick={() => setIsVisible(false)}>
          <div className="keyboard-shortcuts-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Atajos de Teclado</h3>
              <button
                className="modal-close"
                onClick={() => setIsVisible(false)}
                aria-label="Cerrar"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="shortcuts-list">
              {shortcuts.map((shortcut, idx) => (
                <div key={idx} className="shortcut-item">
                  <div className="shortcut-keys">
                    {shortcut.keys.map((key, keyIdx) => (
                      <span key={keyIdx}>
                        <kbd className="keyboard-key">{key}</kbd>
                        {keyIdx < shortcut.keys.length - 1 && <span className="key-plus">+</span>}
                      </span>
                    ))}
                  </div>
                  <span className="shortcut-description">{shortcut.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
