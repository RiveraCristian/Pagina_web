import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { FaSave, FaTimes, FaPlus, FaTrash, FaGripVertical } from 'react-icons/fa';
import { FileManager } from '../utils/fileManager';
import { IDValidator } from '../components/IDValidator';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { SkeletonLoader } from '../components/SkeletonLoader';
import type { Category, FieldDefinition, FieldType } from '@/types/schema';
import '../styles/CategoryForm.css';

type CategoryFormData = Omit<Category, 'fields'> & {
  fields: FieldDefinition[];
};

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Texto corto' },
  { value: 'textarea', label: 'Texto largo' },
  { value: 'number', label: 'Número' },
  { value: 'email', label: 'Email' },
  { value: 'url', label: 'URL' },
  { value: 'date', label: 'Fecha' },
  { value: 'select', label: 'Selector' },
  { value: 'multiselect', label: 'Selector múltiple' },
  { value: 'checkbox', label: 'Casilla de verificación' },
  { value: 'radio', label: 'Opciones (radio)' },
  { value: 'image', label: 'Imagen' },
  { value: 'file', label: 'Archivo' },
  { value: 'color', label: 'Color' },
  { value: 'tags', label: 'Etiquetas' },
  { value: 'richtext', label: 'Texto enriquecido' },
  { value: 'json', label: 'JSON' },
  { value: 'relation', label: 'Relación' },
  { value: 'slug', label: 'Slug' },
];

export default function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isIdValid, setIsIdValid] = useState(isEdit); // ID is valid by default in edit mode

  // Cargar categoría existente si es edición
  const { data: category, isLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      if (!id) return null;
      return await FileManager.getCategory(id);
    },
    enabled: isEdit,
  });

  // Formulario
  const { register, control, handleSubmit, watch, formState: { errors, isDirty } } = useForm<CategoryFormData>({
    defaultValues: {
      id: category?.id || '',
      name: category?.name || '',
      description: category?.description || '',
      icon: category?.icon || 'FaFolder',
      fields: category?.fields || [],
    },
    values: category || undefined,
  });

  // Hook para prevenir pérdida de cambios
  const { confirmNavigation } = useUnsavedChanges({
    hasUnsavedChanges: isDirty,
    message: 'Tienes cambios sin guardar. ¿Deseas salir sin guardar?'
  });

  // Watch ID field for validation
  const watchedId = watch('id');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  });

  // Mutación para guardar
  const saveMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const categoriesData = await FileManager.readCategories();
      
      if (isEdit) {
        // Actualizar categoría existente
        const index = categoriesData.categories.findIndex(c => c.id === id);
        if (index !== -1) {
          categoriesData.categories[index] = data as Category;
        }
      } else {
        // Agregar nueva categoría
        categoriesData.categories.push(data as Category);
      }
      
      await FileManager.saveCategories(categoriesData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setSaveMessage({ 
        type: 'success', 
        text: isEdit ? 'Categoría actualizada' : 'Categoría creada exitosamente' 
      });
      setTimeout(() => navigate('/admin/categories'), 1500);
    },
    onError: (error: Error) => {
      setSaveMessage({ type: 'error', text: `Error: ${error.message}` });
      setTimeout(() => setSaveMessage(null), 5000);
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    // Validar que el ID sea único si es nueva categoría
    if (!isEdit) {
      FileManager.readCategories().then(categoriesData => {
        const exists = categoriesData.categories.some(c => c.id === data.id);
        if (exists) {
          setSaveMessage({ type: 'error', text: 'Ya existe una categoría con ese ID' });
          setTimeout(() => setSaveMessage(null), 5000);
          return;
        }
        saveMutation.mutate(data);
      });
    } else {
      saveMutation.mutate(data);
    }
  };

  const addField = () => {
    append({
      id: `field_${Date.now()}`,
      name: `field_${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      searchable: false,
    });
  };

  if (isLoading) {
    return (
      <div className="admin-page">
        <h1 className="admin-page-title">{isEdit ? 'Editar' : 'Nueva'} Categoría</h1>
        <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
          <SkeletonLoader type="card" count={2} />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page category-form">
      <div className="form-header">
        <h1 className="admin-page-title">
          {isEdit ? `Editar Categoría: ${category?.name}` : 'Nueva Categoría'}
        </h1>
        <div className="form-actions">
          <button
            type="button"
            onClick={() => confirmNavigation(() => navigate('/admin/categories'))}
            className="admin-button secondary"
          >
            <FaTimes />
            Cancelar
          </button>
          <button
            type="submit"
            form="category-form"
            className="admin-button primary"
            disabled={(!isDirty && isEdit) || saveMutation.isPending || (!isIdValid && !isEdit)}
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

      <form id="category-form" onSubmit={handleSubmit(onSubmit)} className="category-form-content">
        {/* Información básica */}
        <div className="form-section">
          <h2>Información Básica</h2>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="id">ID * <small>(único, sin espacios)</small></label>
              <input
                id="id"
                type="text"
                {...register('id', { 
                  required: 'El ID es requerido',
                  pattern: {
                    value: /^[a-z0-9_-]+$/,
                    message: 'Solo minúsculas, números, guiones y guiones bajos'
                  }
                })}
                placeholder="proyectos"
                disabled={isEdit}
              />
              {errors.id && <span className="field-error">{errors.id.message}</span>}
              {!isEdit && watchedId && (
                <IDValidator 
                  value={watchedId} 
                  currentId={id}
                  onChange={setIsIdValid}
                />
              )}
            </div>

            <div className="form-field">
              <label htmlFor="name">Nombre *</label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'El nombre es requerido' })}
                placeholder="Proyectos"
              />
              {errors.name && <span className="field-error">{errors.name.message}</span>}
            </div>

            <div className="form-field full-width">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                rows={3}
                {...register('description')}
                placeholder="Descripción de la categoría..."
              />
            </div>

            <div className="form-field">
              <label htmlFor="icon">Icono <small>(React Icons)</small></label>
              <input
                id="icon"
                type="text"
                {...register('icon')}
                placeholder="FaFolder"
              />
              <small>Ej: FaFolder, FaLaptopCode, FaImage</small>
            </div>
          </div>
        </div>

        {/* Schema Builder */}
        <div className="form-section schema-builder">
          <div className="section-header">
            <h2>Campos Personalizados ({fields.length})</h2>
            <button type="button" onClick={addField} className="admin-button small primary">
              <FaPlus />
              Agregar Campo
            </button>
          </div>

          {fields.length === 0 ? (
            <div className="empty-fields">
              <p>No hay campos definidos. Agrega el primer campo para comenzar.</p>
            </div>
          ) : (
            <div className="fields-list">
              {fields.map((field, index) => {
                const fieldType = watch(`fields.${index}.type`);
                const needsOptions = ['select', 'multiselect', 'radio'].includes(fieldType);

                return (
                  <div key={field.id} className="field-builder-item">
                    <div className="field-drag-handle">
                      <FaGripVertical />
                    </div>

                    <div className="field-content">
                      <div className="field-row">
                        <div className="form-field">
                          <label>ID del Campo *</label>
                          <input
                            type="text"
                            {...register(`fields.${index}.id`, { 
                              required: 'Requerido',
                              pattern: {
                                value: /^[a-z0-9_]+$/,
                                message: 'Solo minúsculas, números y guiones bajos'
                              }
                            })}
                            placeholder="titulo"
                          />
                          {errors.fields?.[index]?.id && (
                            <span className="field-error">{errors.fields[index]?.id?.message}</span>
                          )}
                        </div>

                        <div className="form-field">
                          <label>Etiqueta *</label>
                          <input
                            type="text"
                            {...register(`fields.${index}.label`, { required: 'Requerido' })}
                            placeholder="Título"
                          />
                          {errors.fields?.[index]?.label && (
                            <span className="field-error">{errors.fields[index]?.label?.message}</span>
                          )}
                        </div>

                        <div className="form-field">
                          <label>Tipo *</label>
                          <select {...register(`fields.${index}.type`, { required: true })}>
                            {FIELD_TYPES.map(ft => (
                              <option key={ft.value} value={ft.value}>{ft.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="field-row">
                        <div className="form-field full-width">
                          <label>Texto de ayuda</label>
                          <input
                            type="text"
                            {...register(`fields.${index}.helpText`)}
                            placeholder="Descripción o instrucciones para este campo"
                          />
                        </div>
                      </div>

                      {needsOptions && (
                        <div className="field-row">
                          <div className="form-field full-width">
                            <label>Opciones <small>(separadas por coma)</small></label>
                            <input
                              type="text"
                              {...register(`fields.${index}.validation.options`)}
                              placeholder="Opción 1, Opción 2, Opción 3"
                            />
                          </div>
                        </div>
                      )}

                      <div className="field-row options-row">
                        <label className="checkbox-label">
                          <input type="checkbox" {...register(`fields.${index}.required`)} />
                          <span>Campo requerido</span>
                        </label>

                        <label className="checkbox-label">
                          <input type="checkbox" {...register(`fields.${index}.searchable`)} />
                          <span>Incluir en búsqueda</span>
                        </label>

                        {(fieldType === 'text' || fieldType === 'textarea') && (
                          <div className="validation-field">
                            <label>Max. caracteres:</label>
                            <input
                              type="number"
                              min="1"
                              {...register(`fields.${index}.validation.maxLength`, { valueAsNumber: true })}
                              placeholder="100"
                              className="small-input"
                            />
                          </div>
                        )}

                        {fieldType === 'number' && (
                          <>
                            <div className="validation-field">
                              <label>Mínimo:</label>
                              <input
                                type="number"
                                {...register(`fields.${index}.validation.min`, { valueAsNumber: true })}
                                placeholder="0"
                                className="small-input"
                              />
                            </div>
                            <div className="validation-field">
                              <label>Máximo:</label>
                              <input
                                type="number"
                                {...register(`fields.${index}.validation.max`, { valueAsNumber: true })}
                                placeholder="100"
                                className="small-input"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="field-remove-btn"
                      title="Eliminar campo"
                    >
                      <FaTrash />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
