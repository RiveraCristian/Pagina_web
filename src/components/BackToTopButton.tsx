import '../styles/BackToTopButton.css';

interface BackToTopButtonProps {
  onClick: () => void;
}

export function BackToTopButton({ onClick }: BackToTopButtonProps) {
  return (
    <button
      className="back-to-top-button"
      onClick={onClick}
      aria-label="Volver al inicio"
      title="Volver al inicio"
    >
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
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 8 8 12 12 16"></polyline>
        <line x1="16" y1="12" x2="8" y2="12"></line>
      </svg>
      <span className="button-text">Inicio</span>
    </button>
  );
}
