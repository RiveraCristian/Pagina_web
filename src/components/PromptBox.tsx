import { useState, useEffect, useRef } from 'react';
import { VoiceButton } from './VoiceButton';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import '../styles/PromptBox.css';

interface PromptBoxProps {
  onSubmit: (query: string) => void;
  isVisible: boolean;
}

export function PromptBox({ onSubmit, isVisible }: PromptBoxProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
    error: voiceError
  } = useSpeechRecognition();

  useEffect(() => {
    if (isVisible && inputRef.current) {
      // Enfoca el input automáticamente cuando se hace visible
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isVisible]);

  // Cuando se recibe un transcript de voz, actualizar el input
  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
      // Auto-enviar después de recibir el transcript
      setTimeout(() => {
        if (transcript.trim()) {
          onSubmit(transcript.trim());
          setQuery('');
        }
      }, 500);
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
      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="prompt-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isListening ? "Escuchando..." : "Escribe o habla para buscar proyectos…"}
            className="prompt-input"
            disabled={isListening}
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
        <div className="voice-error">
          <p>{voiceError}</p>
        </div>
      )}
      
      {isListening && (
        <div className="voice-hint">
          <p>🎤 Habla ahora...</p>
        </div>
      )}
    </div>
  );
}
