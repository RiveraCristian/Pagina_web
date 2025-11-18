import { useState, useRef, useCallback } from 'react';
import { FaUpload, FaImage, FaTimes, FaSpinner } from 'react-icons/fa';
import './ImageUpload.css';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  placeholder?: string;
  accept?: string;
  maxSize?: number; // en MB
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  placeholder = 'Selecciona una imagen o arrastra aquí',
  accept = 'image/*',
  maxSize = 5
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      // Validar tamaño del archivo
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`El archivo es muy grande. Máximo ${maxSize}MB`);
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Solo se permiten archivos de imagen');
      }

      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('image', file);

      // Subir archivo al servidor
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al subir: ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success && result.url) {
        onChange(result.url);
      } else {
        throw new Error(result.message || 'Error desconocido al subir imagen');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir la imagen';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }, [onChange, maxSize]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Solo salir si realmente estamos saliendo del área de drop
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, [uploadFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  }, [uploadFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setError(null);
    onRemove?.();
  };

  return (
    <div className="image-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {value ? (
        <div className="image-preview">
          <img src={value} alt="Vista previa" className="preview-image" />
          <div className="image-controls">
            <button
              type="button"
              onClick={handleClick}
              className="control-button change"
              disabled={isUploading}
            >
              <FaUpload />
              Cambiar
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="control-button remove"
              disabled={isUploading}
            >
              <FaTimes />
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`drop-zone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={!isUploading ? handleClick : undefined}
        >
          <div className="drop-zone-content">
            {isUploading ? (
              <>
                <FaSpinner className="upload-icon spin" />
                <span>Subiendo imagen...</span>
              </>
            ) : (
              <>
                <FaImage className="upload-icon" />
                <span className="drop-text">{placeholder}</span>
                <span className="drop-hint">
                  O haz clic para seleccionar archivo
                </span>
                <small className="file-info">
                  Formatos: JPG, PNG, GIF, WebP (máx. {maxSize}MB)
                </small>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}
    </div>
  );
}