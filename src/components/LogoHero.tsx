import '../styles/LogoHero.css';

interface LogoHeroProps {
  onClick: () => void;
  isCompact: boolean;
}

export function LogoHero({ onClick, isCompact }: LogoHeroProps) {
  return (
    <div className={`logo-hero ${isCompact ? 'compact' : ''}`} onClick={!isCompact ? onClick : undefined}>
      <div className="logo-content">
        <h1 className="logo-text">UDD</h1>
        {!isCompact && <p className="logo-subtitle">Universidad del Desarrollo</p>}
      </div>
      {!isCompact && <p className="logo-hint">Haz clic para comenzar</p>}
    </div>
  );
}
