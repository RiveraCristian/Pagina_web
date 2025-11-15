import '../styles/EmptyState.css';

export function EmptyState() {
  const suggestions = [
    "¿Quién eres?",
    "Quiero aprender programación",
    "Necesito un dashboard",
    "Proyectos del sector público"
  ];

  return (
    <div className="empty-state">
      <div className="empty-state-icon">🔍</div>
      <h3 className="empty-state-title">¿Qué estás buscando?</h3>
      <p className="empty-state-description">
        Prueba preguntando por proyectos o información sobre la UDD
      </p>
      <div className="empty-state-suggestions">
        <p className="suggestions-label">Ejemplos:</p>
        <div className="suggestions-list">
          {suggestions.map((suggestion, index) => (
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
