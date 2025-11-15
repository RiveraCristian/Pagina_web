import '../styles/SkipLink.css';

export function SkipLink() {
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main-content"
      className="skip-link"
      onClick={handleSkip}
    >
      Saltar al contenido principal
    </a>
  );
}
