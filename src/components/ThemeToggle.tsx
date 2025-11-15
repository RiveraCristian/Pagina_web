import { useTheme } from '../hooks/useTheme';
import '../styles/ThemeToggle.css';

export function ThemeToggle() {
  const { theme, effectiveTheme, toggleTheme } = useTheme();

  const getIcon = () => {
    if (theme === 'dark') return '🌙';
    if (theme === 'light') return '☀️';
    return '🌓'; // auto
  };

  const getLabel = () => {
    if (theme === 'dark') return 'Oscuro';
    if (theme === 'light') return 'Claro';
    return 'Auto';
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Cambiar tema (actual: ${getLabel()})`}
      title={`Tema: ${getLabel()} (${effectiveTheme === 'dark' ? 'Oscuro' : 'Claro'})`}
    >
      <span className="theme-icon">{getIcon()}</span>
      <span className="theme-label">{getLabel()}</span>
    </button>
  );
}
