import { ShareButton } from './ShareButton';
import '../styles/SearchAgainHint.css';

interface SearchAgainHintProps {
  onNewSearch: () => void;
  currentQuery?: string;
}

export function SearchAgainHint({ onNewSearch, currentQuery }: SearchAgainHintProps) {
  const shareUrl = currentQuery 
    ? `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(currentQuery)}`
    : window.location.href;
  
  const shareTitle = currentQuery 
    ? `Resultados de búsqueda: ${currentQuery} - UDD Proyectos`
    : 'UDD Proyectos';
  
  const shareText = currentQuery
    ? `Mira estos proyectos interesantes sobre "${currentQuery}" en UDD`
    : 'Explora proyectos innovadores en UDD';

  return (
    <div className="search-again-hint">
      <div className="hint-content">
        <p className="hint-text">¿Quieres buscar algo más?</p>
        <div className="hint-actions">
          <button className="new-search-button" onClick={onNewSearch}>
            Nueva búsqueda
          </button>
          <ShareButton 
            url={shareUrl}
            title={shareTitle}
            text={shareText}
          />
        </div>
      </div>
    </div>
  );
}
