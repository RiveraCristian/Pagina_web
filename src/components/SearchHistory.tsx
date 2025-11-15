import type { SceneResponseWithResolvedProjects } from '../types';
import '../styles/SearchHistory.css';

interface SearchHistoryProps {
  history: Array<{ query: string; scene: SceneResponseWithResolvedProjects }>;
  onSelectHistory: (scene: SceneResponseWithResolvedProjects) => void;
}

export function SearchHistory({ history, onSelectHistory }: SearchHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="search-history">
      <p className="history-label">Búsquedas recientes:</p>
      <div className="history-items">
        {history.slice(-3).reverse().map((item, index) => (
          <button
            key={index}
            className="history-item"
            onClick={() => onSelectHistory(item.scene)}
            title={item.query}
          >
            {item.query}
          </button>
        ))}
      </div>
    </div>
  );
}
