import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { FileManager } from '../utils/fileManager';
import './IDValidator.css';

interface IDValidatorProps {
  value: string;
  currentId?: string; // ID actual si es edición
  onChange?: (isValid: boolean) => void;
}

export function IDValidator({ value, currentId, onChange }: IDValidatorProps) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!value) {
      setStatus('idle');
      setMessage('');
      onChange?.(false);
      return;
    }

    // Validar formato
    const formatRegex = /^[a-z0-9_-]+$/;
    if (!formatRegex.test(value)) {
      setStatus('invalid');
      setMessage('Solo minúsculas, números, guiones y guiones bajos');
      onChange?.(false);
      return;
    }

    // Si es edición y el ID no cambió, es válido
    if (currentId && value === currentId) {
      setStatus('valid');
      setMessage('ID actual (sin cambios)');
      onChange?.(true);
      return;
    }

    // Verificar si el ID está disponible
    setStatus('checking');
    setMessage('Verificando disponibilidad...');

    const timeoutId = setTimeout(async () => {
      try {
        const categoriesData = await FileManager.readCategories();
        const exists = categoriesData.categories.some(c => c.id === value);

        if (exists) {
          setStatus('invalid');
          setMessage('Este ID ya está en uso');
          onChange?.(false);
        } else {
          setStatus('valid');
          setMessage('ID disponible');
          onChange?.(true);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error al verificar ID');
        onChange?.(false);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [value, currentId, onChange]);

  if (status === 'idle') return null;

  return (
    <div className={`id-validator ${status}`}>
      <span className="validator-icon">
        {status === 'checking' && <FaSpinner className="spin" />}
        {status === 'valid' && <FaCheck />}
        {(status === 'invalid' || status === 'error') && <FaTimes />}
      </span>
      <span className="validator-message">{message}</span>
    </div>
  );
}
