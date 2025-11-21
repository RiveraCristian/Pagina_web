import '../styles/LogoHero.css';
import { useState, useEffect } from 'react';

interface LogoHeroProps {
  onClick: () => void;
  isCompact: boolean;
}

interface SiteConfig {
  site?: {
    name?: string;
    tagline?: string;
    logo?: {
      type: 'text' | 'image';
      text?: string;
      image?: string;
      width?: number;
      height?: number;
    };
  };
}

export function LogoHero({ onClick, isCompact }: LogoHeroProps) {
  const [config, setConfig] = useState<SiteConfig>({
    site: {
      name: 'Colabi Spa',
      tagline: 'Haz clic para comenzar',
      logo: {
        type: 'text',
        text: 'Colabi Spa',
        width: 200,
        height: 80
      }
    }
  });

  useEffect(() => {
    // Cargar configuración desde el admin panel
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        console.log('Site config loaded:', data);
        if (data) {
          setConfig(data);
        }
      })
      .catch((error) => {
        console.log('Error loading site config:', error);
        // Mantener valores por defecto si no hay configuración
      });
  }, []);

  const logo = config.site?.logo;
  const siteName = config.site?.name || 'Colabi Spa';
  const tagline = config.site?.tagline || 'Haz clic para comenzar';

  const renderLogo = () => {
    if (logo?.type === 'image' && logo.image) {
      return (
        <img 
          src={logo.image}
          alt={siteName}
          className="logo-image"
          style={{
            width: isCompact ? (logo.width || 200) * 0.6 : logo.width || 200,
            height: isCompact ? (logo.height || 80) * 0.6 : logo.height || 80,
            objectFit: 'contain'
          }}
        />
      );
    } else {
      return (
        <h1 className="logo-text">{logo?.text || siteName}</h1>
      );
    }
  };

  return (
    <div 
      className={`logo-hero ${isCompact ? 'compact' : ''}`} 
      onClick={!isCompact ? onClick : undefined}
      style={{ cursor: !isCompact ? 'pointer' : 'default' }}
    >
      <div className="logo-content">
        {renderLogo()}
        {!isCompact && <p className="logo-subtitle">{tagline}</p>}
      </div>
    </div>
  );
}
