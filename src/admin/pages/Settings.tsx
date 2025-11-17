import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FaSave, FaSpinner } from 'react-icons/fa';
import { FileManager } from '../utils/fileManager';
import type { SiteConfig } from '@/types/schema';
import '../styles/Settings.css';

export default function Settings() {
  const queryClient = useQueryClient();
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Cargar configuración actual
  const { data: config, isLoading } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      return await FileManager.readConfig();
    },
  });

  // Formulario
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<SiteConfig>({
    values: config,
  });

  // Mutación para guardar
  const saveMutation = useMutation({
    mutationFn: async (data: SiteConfig) => {
      await FileManager.saveConfig(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
      setSaveMessage({ type: 'success', text: 'Configuración guardada exitosamente' });
      setTimeout(() => setSaveMessage(null), 3000);
    },
    onError: (error: Error) => {
      setSaveMessage({ type: 'error', text: `Error: ${error.message}` });
      setTimeout(() => setSaveMessage(null), 5000);
    },
  });

  const onSubmit = (data: SiteConfig) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="admin-page">
        <h1 className="admin-page-title">Configuración General</h1>
        <div className="settings-loading">Cargando configuración...</div>
      </div>
    );
  }

  return (
    <div className="admin-page settings">
      <div className="settings-header">
        <h1 className="admin-page-title">Configuración General</h1>
        <button
          type="submit"
          form="settings-form"
          className="admin-button primary"
          disabled={!isDirty || saveMutation.isPending}
        >
          {saveMutation.isPending ? (
            <>
              <FaSpinner className="spin" />
              Guardando...
            </>
          ) : (
            <>
              <FaSave />
              Guardar Cambios
            </>
          )}
        </button>
      </div>

      {saveMessage && (
        <div className={`settings-message ${saveMessage.type}`}>
          {saveMessage.text}
        </div>
      )}

      <form id="settings-form" onSubmit={handleSubmit(onSubmit)} className="settings-form">
        {/* Sección: Información del Sitio */}
        <div className="settings-section">
          <h2>Información del Sitio</h2>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="site-name">Nombre del Sitio *</label>
              <input
                id="site-name"
                type="text"
                {...register('site.name', { required: 'El nombre es requerido' })}
                placeholder="Mi Sitio Web"
              />
              {errors.site?.name && (
                <span className="field-error">{errors.site.name.message}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="site-tagline">Tagline</label>
              <input
                id="site-tagline"
                type="text"
                {...register('site.tagline')}
                placeholder="Un sitio web increíble"
              />
            </div>

            <div className="form-field full-width">
              <label htmlFor="site-url">URL del Sitio</label>
              <input
                id="site-url"
                type="url"
                {...register('site.url')}
                placeholder="https://ejemplo.com"
              />
            </div>
          </div>
        </div>

        {/* Sección: SEO */}
        <div className="settings-section">
          <h2>SEO y Meta Tags</h2>
          <div className="form-grid">
            <div className="form-field full-width">
              <label htmlFor="seo-title">Título SEO *</label>
              <input
                id="seo-title"
                type="text"
                {...register('seo.title', { required: 'El título SEO es requerido' })}
                placeholder="Mi Sitio - Descripción breve"
              />
              {errors.seo?.title && (
                <span className="field-error">{errors.seo.title.message}</span>
              )}
              <small>Aparecerá en resultados de búsqueda (50-60 caracteres)</small>
            </div>

            <div className="form-field full-width">
              <label htmlFor="seo-description">Descripción SEO *</label>
              <textarea
                id="seo-description"
                rows={3}
                {...register('seo.description', { required: 'La descripción es requerida' })}
                placeholder="Descripción detallada del sitio web..."
              />
              {errors.seo?.description && (
                <span className="field-error">{errors.seo.description.message}</span>
              )}
              <small>Resumen del sitio para motores de búsqueda (150-160 caracteres)</small>
            </div>

            <div className="form-field full-width">
              <label htmlFor="seo-keywords">Keywords</label>
              <input
                id="seo-keywords"
                type="text"
                {...register('seo.keywords')}
                placeholder="palabra1, palabra2, palabra3"
              />
              <small>Palabras clave separadas por comas</small>
            </div>
          </div>
        </div>

        {/* Sección: Características */}
        <div className="settings-section">
          <h2>Características del Sitio</h2>
          <div className="features-grid">
            <label className="feature-toggle">
              <input type="checkbox" {...register('features.voiceSearch')} />
              <span className="toggle-label">
                <strong>Búsqueda por Voz</strong>
                <small>Permite buscar usando comandos de voz</small>
              </span>
            </label>

            <label className="feature-toggle">
              <input type="checkbox" {...register('features.darkMode')} />
              <span className="toggle-label">
                <strong>Modo Oscuro</strong>
                <small>Habilita el cambio entre tema claro y oscuro</small>
              </span>
            </label>

            <label className="feature-toggle">
              <input type="checkbox" {...register('features.pwa')} />
              <span className="toggle-label">
                <strong>Progressive Web App (PWA)</strong>
                <small>Permite instalar el sitio como aplicación</small>
              </span>
            </label>
          </div>
        </div>

        {/* Sección: Búsqueda */}
        <div className="settings-section">
          <h2>Configuración de Búsqueda</h2>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="search-placeholder">Texto del Buscador</label>
              <input
                id="search-placeholder"
                type="text"
                {...register('search.placeholder')}
                placeholder="Buscar proyectos..."
              />
            </div>

            <div className="form-field">
              <label htmlFor="search-maxResults">Resultados Máximos</label>
              <input
                id="search-maxResults"
                type="number"
                min="1"
                max="100"
                {...register('search.maxResults', { valueAsNumber: true })}
              />
              <small>Cantidad máxima de resultados a mostrar (1-100)</small>
            </div>
          </div>
        </div>

        {/* Sección: Admin */}
        <div className="settings-section">
          <h2>Panel de Administración</h2>
          <div className="form-grid">
            <label className="feature-toggle">
              <input type="checkbox" {...register('admin.enabled')} />
              <span className="toggle-label">
                <strong>Panel Activo</strong>
                <small>Habilitar/deshabilitar acceso al admin</small>
              </span>
            </label>

            <div className="form-field">
              <label htmlFor="admin-path">Ruta del Admin</label>
              <input
                id="admin-path"
                type="text"
                {...register('admin.path')}
                placeholder="/admin"
              />
              <small>Ruta URL para acceder al panel (ej: /admin)</small>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
