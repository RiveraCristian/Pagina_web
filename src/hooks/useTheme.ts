import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'auto';

export function useTheme() {
  // Obtener tema guardado o usar 'auto' por defecto
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'auto';
  });

  // Estado del tema efectivo (resuelve 'auto' a 'light' o 'dark')
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Función para detectar preferencia del sistema
    const getSystemTheme = (): 'light' | 'dark' => {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    // Resolver el tema efectivo
    const resolveTheme = () => {
      if (theme === 'auto') {
        return getSystemTheme();
      }
      return theme;
    };

    const resolved = resolveTheme();
    setEffectiveTheme(resolved);

    // Aplicar el tema al documento
    document.documentElement.setAttribute('data-theme', resolved);
    
    // Guardar preferencia
    localStorage.setItem('theme', theme);

    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = () => {
      if (theme === 'auto') {
        const newTheme = getSystemTheme();
        setEffectiveTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'dark') return 'light';
      if (current === 'light') return 'auto';
      return 'dark';
    });
  };

  return { theme, effectiveTheme, setTheme, toggleTheme };
}
