import React from 'react';
import '../styles/SearchFooter.css';

interface SearchFooterProps {
  isVisible: boolean;
}

export const SearchFooter: React.FC<SearchFooterProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <footer className="search-footer">
      <div className="search-footer-content">
        <div className="search-instructions">
          <div className="instruction-item">
            <span className="instruction-icon">⌨️</span>
            <span>Escribe para buscar proyectos</span>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon">🎤</span>
            <span>Habla para búsqueda por voz</span>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon">⏎</span>
            <span>Enter para buscar</span>
          </div>
        </div>
        <p className="search-footer-hint">
          Prueba buscar: "proyectos web", "aplicaciones móviles", "diseño UI/UX"
        </p>
      </div>
    </footer>
  );
};