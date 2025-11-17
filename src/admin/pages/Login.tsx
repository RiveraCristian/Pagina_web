import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/Login.css';

interface LoginProps {
  onLogin: (password: string) => Promise<boolean>;
}

export function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('Por favor ingresa la contraseña');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await onLogin(password);
      
      if (success) {
        // Redirigir al dashboard
        navigate('/admin/dashboard');
      } else {
        setError('Contraseña incorrecta');
        setPassword('');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-particles"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <FaLock />
          </div>
          <h1>Panel de Administración</h1>
          <p>Ingresa tu contraseña para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">
              <FaUser /> Contraseña
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                disabled={loading}
                autoFocus
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              <FaLock /> {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Verificando...
              </>
            ) : (
              <>
                <FaLock /> Acceder
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-hint">
            💡 <strong>Tip:</strong> La contraseña por defecto es <code>admin123</code>
          </p>
          <p className="login-security">
            <FaLock /> Conexión segura
          </p>
        </div>
      </div>
    </div>
  );
}
