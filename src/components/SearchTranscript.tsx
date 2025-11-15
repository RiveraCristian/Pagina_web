import { useState } from 'react';
import '../styles/SearchTranscript.css';

interface SearchTranscriptProps {
  query: string;
  timestamp: string;
}

export function SearchTranscript({ query, timestamp }: SearchTranscriptProps) {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="search-transcript">
      <button
        className="transcript-toggle"
        onClick={() => setShowTranscript(!showTranscript)}
        aria-expanded={showTranscript}
        aria-label="Ver transcripción de búsqueda"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Transcripción
      </button>

      {showTranscript && (
        <div className="transcript-content" role="region" aria-label="Transcripción de la búsqueda">
          <div className="transcript-header">
            <span className="transcript-time">{timestamp}</span>
          </div>
          <p className="transcript-text">{query}</p>
        </div>
      )}
    </div>
  );
}
