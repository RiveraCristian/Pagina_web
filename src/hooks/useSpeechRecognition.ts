import { useState, useEffect } from 'react';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
  error: string | null;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Verificar si el navegador soporta Web Speech API
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) {
      setError('Tu navegador no soporta reconocimiento de voz. Usa Chrome, Edge o Safari.');
      return;
    }

    // Crear instancia de SpeechRecognition
    const SpeechRecognitionAPI = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    const recognitionInstance = new SpeechRecognitionAPI();
    
    // Configuración
    recognitionInstance.continuous = false;  // Se detiene automáticamente
    recognitionInstance.interimResults = false;  // Solo resultados finales
    recognitionInstance.lang = 'es-ES';  // Español

    // Evento: resultado recibido
    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const transcriptResult = event.results[0][0].transcript;
      setTranscript(transcriptResult);
      setIsListening(false);
    };

    // Evento: error
    recognitionInstance.onerror = (event: any) => {
      console.error('Error de reconocimiento de voz:', event.error);
      
      if (event.error === 'not-allowed') {
        setError('Permiso denegado. Por favor, permite el acceso al micrófono.');
      } else if (event.error === 'no-speech') {
        setError('No se detectó voz. Intenta de nuevo.');
      } else {
        setError(`Error: ${event.error}`);
      }
      
      setIsListening(false);
    };

    // Evento: finalización
    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    // Cleanup
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [isSupported]);

  const startListening = () => {
    if (!recognition) return;
    
    setError(null);
    setTranscript('');
    
    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.error('Error al iniciar reconocimiento:', err);
      setError('No se pudo iniciar el reconocimiento de voz.');
    }
  };

  const stopListening = () => {
    if (!recognition) return;
    
    try {
      recognition.stop();
      setIsListening(false);
    } catch (err) {
      console.error('Error al detener reconocimiento:', err);
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
    error
  };
}
