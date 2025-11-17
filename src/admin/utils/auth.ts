/**
 * Sistema de autenticación simple para el admin panel
 * 
 * Características:
 * - Password almacenado en variable de entorno
 * - Token JWT-like en localStorage
 * - Timeout de sesión
 */

const AUTH_TOKEN_KEY = 'admin_auth_token';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas

interface AuthToken {
  token: string;
  expiresAt: number;
}

/**
 * Valida la contraseña contra la variable de entorno
 */
export function validatePassword(password: string): boolean {
  // Obtener password desde variable de entorno o usar default
  const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
  
  return password === validPassword;
}

/**
 * Genera un token simple (no es JWT real, pero cumple la función)
 */
function generateToken(password: string): string {
  const timestamp = Date.now();
  const hash = btoa(`${password}:${timestamp}`); // Base64 encode
  return hash;
}

/**
 * Inicia sesión y guarda el token
 */
export function login(password: string): boolean {
  if (!validatePassword(password)) {
    return false;
  }

  const token = generateToken(password);
  const expiresAt = Date.now() + SESSION_DURATION;

  const authData: AuthToken = {
    token,
    expiresAt
  };

  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authData));
  
  return true;
}

/**
 * Verifica si hay una sesión activa y válida
 */
export function isAuthenticated(): boolean {
  try {
    const stored = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (!stored) {
      return false;
    }

    const authData: AuthToken = JSON.parse(stored);
    
    // Verificar si el token ha expirado
    if (Date.now() > authData.expiresAt) {
      logout();
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Cierra la sesión
 */
export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Obtiene el tiempo restante de la sesión en milisegundos
 */
export function getSessionTimeRemaining(): number {
  try {
    const stored = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (!stored) {
      return 0;
    }

    const authData: AuthToken = JSON.parse(stored);
    const remaining = authData.expiresAt - Date.now();
    
    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
}

/**
 * Renueva la sesión (extiende el tiempo de expiración)
 */
export function renewSession(): boolean {
  try {
    const stored = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (!stored) {
      return false;
    }

    const authData: AuthToken = JSON.parse(stored);
    
    // Extender expiración
    authData.expiresAt = Date.now() + SESSION_DURATION;
    
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authData));
    
    return true;
  } catch {
    return false;
  }
}
