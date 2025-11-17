import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import { FileManager } from '../utils/fileManager';
import type { FieldDefinition } from '@/types/schema';
import '../styles/ItemForm.css';

export default function ItemForm() {
  const { categoryId, id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Cargar categoría
  const { data: category, isLoading: loadingCategory } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      return await FileManager.getCategory(categoryId);
    },
  });

  // Cargar item existente si es edición
  const { data: item, isLoading: loadingItem } = useQuery({
    queryKey: ['item', categoryId, id],
    queryFn: async () => {
      if (!categoryId || !id) return null;
      return await FileManager.getItem(categoryId, id);
    },
    enabled: isEdit && !!categoryId && !!id,
  });

  // Preparar valores por defecto del formulario
  const defaultValues = isEdit && item
    ? { status: item.status, ...item.data }
    : { status: 'draft' as const };

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<any>({
    defaultValues,
    values: isEdit && item ? { status: item.status, ...item.data } : undefined,
  });

  // Mutación para guardar
  const saveMutation = useMutation({
    mutationFn: async (formData: any) => {
      if (!categoryId) throw new Error('No category ID');

      const { status, ...data } = formData;
      
      if (isEdit && id) {
        // Actualizar item existente
        await FileManager.updateItem(categoryId, id, { status, data });
      } else {
        // Crear nuevo item
        await FileManager.createItem(categoryId, { categoryId, status, data });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-items'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['recentItems'] });
      setSaveMessage({ 
        type: 'success', 
        text: isEdit ? 'Item actualizado' : 'Item creado exitosamente' 
      });
      setTimeout(() => navigate('/admin/items'), 1500);
    },
    onError: (error: Error) => {
      setSaveMessage({ type: 'error', text: `Error: ${error.message}` });
      setTimeout(() => setSaveMessage(null), 5000);
    },
  });

  const onSubmit = (data: any) => {
    saveMutation.mutate(data);
  };

  const renderField = (field: FieldDefinition) => {
    const fieldName = field.id;
    const error = errors[fieldName];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <div key={field.id} className="form-field">
            <label htmlFor={fieldName}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              id={fieldName}
              type={field.type}
              {...register(fieldName, {
                required: field.required ? `${field.label} es requerido` : false,
                maxLength: field.validation?.maxLength ? {
                  value: field.validation.maxLength,
                  message: `Máximo ${field.validation.maxLength} caracteres`
                } : undefined,
              })}
              placeholder={field.placeholder || field.helpText || ''}
            />
            {field.helpText && !error && <small>{field.helpText}</small>}
            {error && <span className="field-error">{error.message as string}</span>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="form-field full-width">
            <label htmlFor={fieldName}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <textarea
              id={fieldName}
              rows={field.rows || 4}
              {...register(fieldName, {
                required: field.required ? `${field.label} es requerido` : false,
                maxLength: field.validation?.maxLength ? {
                  value: field.validation.maxLength,
                  message: `Máximo ${field.validation.maxLength} caracteres`
                } : undefined,
              })}
              placeholder={field.placeholder || field.helpText || ''}
            />
            {field.helpText && !error && <small>{field.helpText}</small>}
            {error && <span className="field-error">{error.message as string}</span>}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="form-field">
            <label htmlFor={fieldName}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              id={fieldName}
              type="number"
              step={field.step || 1}
              min={field.validation?.min}
              max={field.validation?.max}
              {...register(fieldName, {
                required: field.required ? `${field.label} es requerido` : false,
                valueAsNumber: true,
                min: field.validation?.min ? {
                  value: field.validation.min,
                  message: `Mínimo ${field.validation.min}`
                } : undefined,
                max: field.validation?.max ? {
                  value: field.validation.max,
                  message: `Máximo ${field.validation.max}`
                } : undefined,
              })}
              placeholder={field.placeholder || field.helpText || ''}
            />
            {field.helpText && !error && <small>{field.helpText}</small>}
            {error && <span className="field-error">{error.message as string}</span>}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="form-field">
            <label htmlFor={fieldName}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              id={fieldName}
              type="date"
              {...register(fieldName, {
                required: field.required ? `${field.label} es requerido` : false,
              })}
            />
            {field.helpText && !error && <small>{field.helpText}</small>}
            {error && <span className="field-error">{error.message as string}</span>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="form-field">
            <label htmlFor={fieldName}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <select
              id={fieldName}
              {...register(fieldName, {
                required: field.required ? `${field.label} es requerido` : false,
              })}
            >
              <option value="">Seleccionar...</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {field.helpText && !error && <small>{field.helpText}</small>}
            {error && <span className="field-error">{error.message as string}</span>}
          </div>
        );

      case 'checkbox':
      case 'boolean':
        return (
          <div key={field.id} className="form-field checkbox-field">
            <label className="checkbox-label">
              <input
                id={fieldName}
                type="checkbox"
                {...register(fieldName)}
              />
              <span>
                {field.label}
                {field.required && <span className="required">*</span>}
              </span>
            </label>
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="form-field full-width">
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <div className="radio-group">
              {field.options?.map(option => (
                <label key={option} className="radio-label">
                  <input
                    type="radio"
                    value={option}
                    {...register(fieldName, {
                      required: field.required ? `${field.label} es requerido` : false,
                    })}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {field.helpText && !error && <small>{field.helpText}</small>}
            {error && <span className="field-error">{error.message as string}</span>}
          </div>
        );

      case 'tags':
        return (
          <div key={field.id} className="form-field full-width">
            <label htmlFor={fieldName}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              id={fieldName}
              type="text"
              {...register(fieldName)}
              placeholder="Separar con comas"
            />
            <small>
              {field.helpText || 'Separar múltiples valores con comas'}
            </small>
            {error && <span className="field-error">{error.message as string}</span>}
          </div>
        );

      case 'color':
        return (
          <div key={field.id} className="form-field">
            <label htmlFor={fieldName}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              id={fieldName}
              type="color"
              {...register(fieldName, {
                required: field.required ? `${field.label} es requerido` : false,
              })}
            />
            {field.helpText && !error && <small>{field.helpText}</small>}
            {error && <span className="field-error">{error.message as string}</span>}
          </div>
        );

      case 'image':
      case 'file':
        return (
          <div key={field.id} className="form-field full-width">
            <label htmlFor={fieldName}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              id={fieldName}
              type="text"
              {...register(fieldName, {
                required: field.required ? `${field.label} es requerido` : false,
              })}
              placeholder={field.placeholder || '/images/example.png'}
            />
            <small>
              {field.helpText || 'Ruta de la imagen (ej: /images/example.png)'}
            </small>
            {error && <span className="field-error">{error.message as string}</span>}
          </div>
        );

      default:
        return (
          <div key={field.id} className="form-field">
            <label htmlFor={fieldName}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              id={fieldName}
              type="text"
              {...register(fieldName, {
                required: field.required ? `${field.label} es requerido` : false,
              })}
              placeholder={field.placeholder || field.helpText || ''}
            />
            {field.helpText && !error && <small>{field.helpText}</small>}
            {error && <span className="field-error">{error.message as string}</span>}
          </div>
        );
    }
  };

  if (loadingCategory || loadingItem) {
    return (
      <div className="admin-page">
        <h1 className="admin-page-title">
          {isEdit ? 'Editar' : 'Nuevo'} Item
        </h1>
        <div className="form-loading">
          <FaSpinner className="spin" />
          Cargando...
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="admin-page">
        <h1 className="admin-page-title">Error</h1>
        <div className="error-message">Categoría no encontrada</div>
      </div>
    );
  }

  const itemTitle = isEdit && item 
    ? (item.data?.titulo || item.data?.title || item.data?.name || `Item ${id}`)
    : `Nuevo ${category.name}`;

  return (
    <div className="admin-page item-form">
      <div className="form-header">
        <h1 className="admin-page-title">{itemTitle}</h1>
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/items')}
            className="admin-button secondary"
          >
            <FaTimes />
            Cancelar
          </button>
          <button
            type="submit"
            form="item-form"
            className="admin-button primary"
            disabled={!isDirty || saveMutation.isPending}
          >
            <FaSave />
            {saveMutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className={`form-message ${saveMessage.type}`}>
          {saveMessage.text}
        </div>
      )}

      <form id="item-form" onSubmit={handleSubmit(onSubmit)} className="item-form-content">
        {/* Estado */}
        <div className="form-section status-section">
          <h2>Estado</h2>
          <div className="status-options">
            <label className="status-option">
              <input type="radio" value="draft" {...register('status')} />
              <span className="status-label">
                <strong>Borrador</strong>
                <small>No visible públicamente</small>
              </span>
            </label>
            <label className="status-option">
              <input type="radio" value="published" {...register('status')} />
              <span className="status-label">
                <strong>Publicado</strong>
                <small>Visible en el sitio</small>
              </span>
            </label>
            <label className="status-option">
              <input type="radio" value="archived" {...register('status')} />
              <span className="status-label">
                <strong>Archivado</strong>
                <small>Oculto pero no eliminado</small>
              </span>
            </label>
          </div>
        </div>

        {/* Campos dinámicos */}
        <div className="form-section">
          <h2>Contenido de {category.name}</h2>
          <div className="form-grid">
            {category.fields.map(field => renderField(field))}
          </div>
        </div>
      </form>
    </div>
  );
}
