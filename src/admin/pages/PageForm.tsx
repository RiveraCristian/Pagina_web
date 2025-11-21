import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FaSave, FaTimes, FaSpinner, FaEye } from 'react-icons/fa';
import './PageForm.css';

interface PageFormData {
  title: string;
  slug: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  status: 'draft' | 'published' | 'archived';
  template: 'default' | 'about' | 'contact' | 'services';
  featured: boolean;
}

interface Page extends PageFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export default function PageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Cargar página existente si es edición
  const { data: page, isLoading: loadingPage } = useQuery({
    queryKey: ['page', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await fetch(`/api/pages/${id}`);
      if (!response.ok) throw new Error('Page not found');
      return response.json();
    },
    enabled: isEdit
  });

  const { register, handleSubmit, watch, setValue, formState: { errors, isDirty } } = useForm<PageFormData>({
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      seoTitle: '',
      seoDescription: '',
      status: 'draft',
      template: 'default',
      featured: false
    }
  });

  const watchTitle = watch('title');
  const watchSlug = watch('slug');

  // Auto-generar slug desde el título
  useEffect(() => {
    if (watchTitle && !isEdit) {
      const autoSlug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      setValue('slug', autoSlug, { shouldValidate: true });
    }
  }, [watchTitle, isEdit, setValue]);

  // Cargar datos en el formulario cuando se carga la página
  useEffect(() => {
    if (page && isEdit) {
      setValue('title', page.title);
      setValue('slug', page.slug);
      setValue('content', page.content);
      setValue('seoTitle', page.seoTitle || '');
      setValue('seoDescription', page.seoDescription || '');
      setValue('status', page.status);
      setValue('template', page.template || 'default');
      setValue('featured', page.featured || false);
    }
  }, [page, isEdit, setValue]);

  // Mutación para guardar página
  const saveMutation = useMutation({
    mutationFn: async (formData: PageFormData) => {
      const pageData = {
        ...formData,
        id: isEdit ? id : `page-${Date.now()}`,
        createdAt: page?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('/api/save-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData)
      });

      if (!response.ok) {
        throw new Error('Failed to save page');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', id] });
      setSaveMessage({ 
        type: 'success', 
        text: isEdit ? 'Página actualizada' : 'Página creada exitosamente' 
      });
      setTimeout(() => navigate('/admin/pages'), 1500);
    },
    onError: (error: Error) => {
      setSaveMessage({ type: 'error', text: `Error: ${error.message}` });
      setTimeout(() => setSaveMessage(null), 5000);
    }
  });

  const onSubmit = (data: PageFormData) => {
    saveMutation.mutate(data);
  };

  if (loadingPage) {
    return (
      <div className="admin-page">
        <h1 className="admin-page-title">
          {isEdit ? 'Editar' : 'Nueva'} Página
        </h1>
        <div className="form-loading">
          <FaSpinner className="spin" />
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page page-form">
      <div className="form-header">
        <h1 className="admin-page-title">
          {isEdit ? `Editar: ${page?.title || 'Página'}` : 'Nueva Página'}
        </h1>
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/pages')}
            className="admin-button secondary"
          >
            <FaTimes />
            Cancelar
          </button>
          {isEdit && watchSlug && (
            <a
              href={`/${watchSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-button info"
            >
              <FaEye />
              Vista Previa
            </a>
          )}
          <button
            type="submit"
            form="page-form"
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

      <form id="page-form" onSubmit={handleSubmit(onSubmit)} className="page-form-content">
        <div className="form-layout">
          {/* Columna principal */}
          <div className="form-main">
            {/* Información básica */}
            <section className="form-section">
              <h2>Información Básica</h2>
              
              <div className="form-group">
                <label htmlFor="title">Título de la Página *</label>
                <input
                  id="title"
                  type="text"
                  {...register('title', { 
                    required: 'El título es requerido',
                    minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                  })}
                  placeholder="Ej: Acerca de Nosotros"
                />
                {errors.title && <span className="field-error">{errors.title.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="slug">URL (Slug) *</label>
                <input
                  id="slug"
                  type="text"
                  {...register('slug', { 
                    required: 'La URL es requerida',
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: 'Solo letras minúsculas, números y guiones'
                    }
                  })}
                  placeholder="acerca-de-nosotros"
                />
                {watchSlug && <small className="url-preview">La página estará en: /{watchSlug}</small>}
                {errors.slug && <span className="field-error">{errors.slug.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="template">Plantilla</label>
                <select
                  id="template"
                  {...register('template')}
                >
                  <option value="default">Por Defecto</option>
                  <option value="about">Acerca de</option>
                  <option value="contact">Contacto</option>
                  <option value="services">Servicios</option>
                </select>
              </div>
            </section>

            {/* Contenido */}
            <section className="form-section">
              <h2>Contenido</h2>
              
              <div className="form-group">
                <label htmlFor="content">Contenido de la Página *</label>
                <textarea
                  id="content"
                  rows={15}
                  {...register('content', { 
                    required: 'El contenido es requerido',
                    minLength: { value: 10, message: 'Mínimo 10 caracteres' }
                  })}
                  placeholder="Escribe el contenido de tu página aquí..."
                />
                <small>Puedes usar Markdown para dar formato al texto.</small>
                {errors.content && <span className="field-error">{errors.content.message}</span>}
              </div>
            </section>

            {/* SEO */}
            <section className="form-section">
              <h2>SEO y Meta Tags</h2>
              
              <div className="form-group">
                <label htmlFor="seoTitle">Título SEO</label>
                <input
                  id="seoTitle"
                  type="text"
                  {...register('seoTitle')}
                  placeholder="Si se deja vacío, se usará el título de la página"
                />
                <small>Recomendado: 50-60 caracteres</small>
              </div>

              <div className="form-group">
                <label htmlFor="seoDescription">Descripción SEO</label>
                <textarea
                  id="seoDescription"
                  rows={3}
                  {...register('seoDescription')}
                  placeholder="Descripción que aparecerá en los resultados de búsqueda"
                />
                <small>Recomendado: 150-160 caracteres</small>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="form-sidebar">
            <section className="sidebar-section">
              <h3>Estado de Publicación</h3>
              
              <div className="form-group">
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="draft"
                      {...register('status')}
                    />
                    <span className="radio-content">
                      <strong>Borrador</strong>
                      <small>No visible públicamente</small>
                    </span>
                  </label>
                  
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="published"
                      {...register('status')}
                    />
                    <span className="radio-content">
                      <strong>Publicada</strong>
                      <small>Visible en el sitio</small>
                    </span>
                  </label>
                  
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="archived"
                      {...register('status')}
                    />
                    <span className="radio-content">
                      <strong>Archivada</strong>
                      <small>Oculta pero no eliminada</small>
                    </span>
                  </label>
                </div>
              </div>
            </section>

            <section className="sidebar-section">
              <h3>Configuración</h3>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    {...register('featured')}
                  />
                  <span>Página destacada</span>
                </label>
                <small>Las páginas destacadas pueden aparecer en menús especiales</small>
              </div>
            </section>

            {isEdit && page && (
              <section className="sidebar-section">
                <h3>Información</h3>
                <div className="page-info">
                  <p><strong>Creada:</strong> {new Date(page.createdAt).toLocaleString()}</p>
                  <p><strong>Actualizada:</strong> {new Date(page.updatedAt).toLocaleString()}</p>
                </div>
              </section>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}