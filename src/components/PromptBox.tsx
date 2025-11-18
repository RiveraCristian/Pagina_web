import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { VoiceButton } from './VoiceButton';
import { LanguageSelector } from './LanguageSelector';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import '../styles/PromptBox.css';

interface PromptBoxProps {
  onSubmit: (query: string) => void;
  isVisible: boolean;
}

export interface PromptBoxRef {
  focusInput: () => void;
}

export const PromptBox = forwardRef<PromptBoxRef, PromptBoxProps>(
  function PromptBox({ onSubmit, isVisible }, ref) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
    error: voiceError,
    language,
    setLanguage
  } = useSpeechRecognition();

  // Exponer el método focusInput al componente padre
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current?.focus();
    }
  }));

  useEffect(() => {
    if (isVisible && inputRef.current) {
      // Enfoca el input automáticamente cuando se hace visible
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isVisible]);

  // Cuando se recibe un transcript de voz, buscar directamente
  useEffect(() => {
    if (transcript && transcript.trim()) {
      onSubmit(transcript.trim());
    }
  }, [transcript, onSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query.trim());
      setQuery('');
    }
  };



  if (!isVisible) return null;

  return (
    <div className="prompt-box">
      {isSupported && (
        <div className="prompt-controls">
          <LanguageSelector
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="prompt-form" role="search">
        <div className="prompt-input-wrapper">
          <label htmlFor="search-input" className="sr-only">
            Buscar proyectos
          </label>
          <input
            id="search-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isListening ? "Escuchando..." : "Escribe o habla para buscar proyectos…"}
            className="prompt-input"
            disabled={isListening}
            aria-label="Campo de búsqueda de proyectos"
            aria-describedby={voiceError ? "voice-error" : undefined}
            aria-live={isListening ? "polite" : undefined}
          />
          
          <VoiceButton
            isListening={isListening}
            onStartListening={startListening}
            onStopListening={stopListening}
            isSupported={isSupported}
          />
        </div>
      </form>
      
      {voiceError && (
        <div className="voice-error" role="alert" id="voice-error" aria-live="assertive">
          <p>{voiceError}</p>
        </div>
      )}
      
      {isListening && (
        <div className="voice-hint" role="status" aria-live="polite">
          <p>🎤 Habla ahora...</p>
        </div>
      )}


    </div>
  );
});
