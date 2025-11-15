import { useState, useEffect } from 'react';
import '../styles/TranscriptConfirmation.css';

interface TranscriptConfirmationProps {
  transcript: string;
  onConfirm: (text: string) => void;
  onCancel: () => void;
}

export function TranscriptConfirmation({ 
  transcript, 
  onConfirm, 
  onCancel 
}: TranscriptConfirmationProps) {
  const [editedText, setEditedText] = useState(transcript);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleConfirm = () => {
    onConfirm(editedText);
  };

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className={`transcript-confirmation ${isVisible ? 'visible' : ''}`}>
      <div className="transcript-card">
        <div className="transcript-header">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
          <span className="transcript-label">Entendí:</span>
        </div>
        
        <input
          type="text"
          className="transcript-input"
          value={editedText}
          onChange={handleEdit}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="Edita si es necesario..."
        />
        
        <div className="transcript-actions">
          <button 
            className="btn-cancel" 
            onClick={onCancel}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Cancelar
          </button>
          
          <button 
            className="btn-confirm" 
            onClick={handleConfirm}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Buscar
          </button>
        </div>
        
        <div className="transcript-hint">
          <kbd>Enter</kbd> para buscar • <kbd>Esc</kbd> para cancelar
        </div>
      </div>
    </div>
  );
}
