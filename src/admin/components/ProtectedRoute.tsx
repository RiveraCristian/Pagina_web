import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, renewSession } from '../utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Componente que protege rutas requiriendo autenticación
 * 
 * Características:
 * - Verifica autenticación al montar
 * - Redirige a login si no está autenticado
 * - Renueva sesión automáticamente cada 5 minutos
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar autenticación inicial
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
    };

    checkAuth();

    // Renovar sesión cada 5 minutos si está activa
    const renewInterval = setInterval(() => {
      if (isAuthenticated()) {
        renewSession();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => {
      clearInterval(renewInterval);
    };
  }, []);

  // Mostrar loading mientras verifica
  if (isAuth === null) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: '#00ff88',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  // Renderizar contenido protegido
  return <>{children}</>;
}
