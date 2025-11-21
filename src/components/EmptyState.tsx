import '../styles/EmptyState.css';
import { useState, useEffect } from 'react';

interface EmptyStateConfig {
  title?: string;
  description?: string;
  suggestions?: string[];
}

export function EmptyState() {
  const [config, setConfig] = useState<EmptyStateConfig>({
    title: '¿Qué estás buscando?',
    description: 'Prueba preguntando por nuestros servicios o información',
    suggestions: [
      '¿Qué servicios ofrecen?',
      'Cuéntame sobre sus proyectos',
      'Información de contacto',
      'Necesito ayuda'
    ]
  });

  useEffect(() => {
    // Cargar configuración desde el admin panel
    fetch('/api/config/empty-state')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(() => {
        // Mantener valores por defecto
      });
  }, []);

  return (
    <div className="empty-state">
      <div className="empty-state-icon">🔍</div>
      <h3 className="empty-state-title">{config.title}</h3>
      <p className="empty-state-description">
        {config.description}
      </p>
      <div className="empty-state-suggestions">
        <p className="suggestions-label">Ejemplos:</p>
        <div className="suggestions-list">
          {config.suggestions?.map((suggestion, index) => (
            <div key={index} className="suggestion-item">
              <span className="suggestion-icon">💡</span>
              <span className="suggestion-text">{suggestion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
