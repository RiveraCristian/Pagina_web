/**
 * Hook para cargar y aplicar configuración de theme.json
 * Inyecta CSS variables dinámicamente en el documento
 */

import { useState, useEffect } from 'react';
import type { ThemeConfig } from '../types/schema';

export function useThemeConfig() {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadThemeConfig = async () => {
      try {
        // En desarrollo: cargar desde el archivo JSON
        const response = await fetch('/src/data/theme.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setThemeConfig(data);
        applyThemeConfig(data);
      } catch (err) {
        console.error('Error loading theme config:', err);
        setError(err instanceof Error ? err : new Error('Failed to load theme config'));
        
        // Fallback: tema por defecto
        const defaultTheme: ThemeConfig = {
          mode: 'dark',
          colors: {
            primary: '#00ff88',
            secondary: '#0d1b2a',
            background: '#000814',
            surface: '#1a1a2e',
            text: '#ffffff',
            textSecondary: '#a0a0a0',
            accent: '#00ff88',
            error: '#ff4444',
            success: '#00ff88',
            warning: '#ffaa00',
            info: '#3b82f6'
          },
          typography: {
            fontFamily: 'Inter, system-ui, sans-serif',
            headingFamily: 'Poppins, sans-serif',
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem',
              base: '1rem',
              lg: '1.125rem',
              xl: '1.25rem',
              '2xl': '1.5rem',
              '3xl': '2rem',
              '4xl': '3rem'
            },
            fontWeight: {
              normal: '400',
              medium: '500',
              semibold: '600',
              bold: '700'
            }
          },
          spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
            '2xl': '3rem',
            '3xl': '4rem'
          },
          borderRadius: {
            sm: '4px',
            md: '8px',
            lg: '12px',
            xl: '16px',
            full: '9999px'
          },
          effects: {
            particles: {
              enabled: true,
              count: 100,
              color: '#00ff88',
              speed: 0.5,
              size: 2
            },
            animations: {
              level: 'medium',
              duration: '0.3s',
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            },
            blur: {
              enabled: false,
              amount: '10px'
            }
          },
          logo: {
            path: '/logo.svg',
            width: 200,
            height: 80,
            compactWidth: 50,
            compactHeight: 50
          }
        };
        setThemeConfig(defaultTheme);
        applyThemeConfig(defaultTheme);
      } finally {
        setLoading(false);
      }
    };

    loadThemeConfig();
  }, []);

  const applyThemeConfig = (config: ThemeConfig) => {
    const root = document.documentElement;
    
    // Aplicar colores
    Object.entries(config.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Aplicar tipografía
    root.style.setProperty('--font-family', config.typography.fontFamily);
    root.style.setProperty('--font-heading', config.typography.headingFamily);
    
    Object.entries(config.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });
    
    Object.entries(config.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value);
    });
    
    // Aplicar espaciado
    Object.entries(config.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    // Aplicar border radius
    Object.entries(config.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
    
    // Aplicar efectos
    root.style.setProperty('--animation-duration', config.effects.animations.duration);
    root.style.setProperty('--animation-easing', config.effects.animations.easing);
    
    if (config.effects.blur.enabled) {
      root.style.setProperty('--blur-amount', config.effects.blur.amount);
    }
    
    // Aplicar modo (dark/light) - esto se combina con useTheme existente
    root.setAttribute('data-theme-mode', config.mode);
  };

  return { themeConfig, loading, error, applyThemeConfig };
}
