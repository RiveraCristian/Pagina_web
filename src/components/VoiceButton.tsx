import '../styles/VoiceButton.css';

interface VoiceButtonProps {
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  isSupported: boolean;
}

export function VoiceButton({ 
  isListening, 
  onStartListening, 
  onStopListening,
  isSupported 
}: VoiceButtonProps) {
  
  if (!isSupported) {
    return null; // No mostrar el botón si no es compatible
  }

  const handleClick = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`voice-button ${isListening ? 'listening' : ''}`}
      title={isListening ? 'Detener grabación' : 'Hablar'}
      aria-label={isListening ? 'Detener grabación' : 'Iniciar grabación de voz'}
    >
      {isListening ? (
        // Icono de micrófono activo (pulsando)
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      ) : (
        // Icono de micrófono normal
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      )}
      
      {isListening && (
        <span className="listening-indicator">
          <span className="pulse"></span>
          <span className="pulse"></span>
          <span className="pulse"></span>
        </span>
      )}
    </button>
  );
}
