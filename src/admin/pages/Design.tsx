import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FaSave, FaPalette, FaFont, FaRuler, FaMagic, FaImage, FaSpinner } from 'react-icons/fa';
import { HexColorPicker } from 'react-colorful';
import { FileManager } from '../utils/fileManager';
import type { ThemeConfig } from '@/types/schema';
import '../styles/Design.css';

type TabId = 'colors' | 'typography' | 'spacing' | 'effects' | 'logo';

export default function Design() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>('colors');
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);

  // Cargar tema actual
  const { data: theme, isLoading } = useQuery({
    queryKey: ['theme'],
    queryFn: async () => {
      return await FileManager.readTheme();
    },
  });

  // Formulario
  const { register, handleSubmit, watch, setValue, formState: { isDirty } } = useForm<any>({
    values: theme,
  });

  const watchedColors = watch('colors');

  // Mutación para guardar
  const saveMutation = useMutation({
    mutationFn: async (data: ThemeConfig) => {
      await FileManager.saveTheme(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme'] });
      setSaveMessage({ type: 'success', text: 'Diseño guardado exitosamente' });
      setTimeout(() => setSaveMessage(null), 3000);
    },
    onError: (error: Error) => {
      setSaveMessage({ type: 'error', text: `Error: ${error.message}` });
      setTimeout(() => setSaveMessage(null), 5000);
    },
  });

  const onSubmit = (data: ThemeConfig) => {
    saveMutation.mutate(data);
  };

  const handleColorChange = (colorKey: string, value: string) => {
    setValue(`colors.${colorKey}` as any, value, { shouldDirty: true });
    setColorPickerOpen(null);
  };

  if (isLoading) {
    return (
      <div className="admin-page">
        <h1 className="admin-page-title">Editor de Diseño</h1>
        <div className="design-loading">
          <FaSpinner className="spin" />
          Cargando tema...
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'colors' as TabId, label: 'Colores', icon: FaPalette },
    { id: 'typography' as TabId, label: 'Tipografía', icon: FaFont },
    { id: 'spacing' as TabId, label: 'Espaciado', icon: FaRuler },
    { id: 'effects' as TabId, label: 'Efectos', icon: FaMagic },
    { id: 'logo' as TabId, label: 'Logo', icon: FaImage },
  ];

  return (
    <div className="admin-page design">
      <div className="design-header">
        <div>
          <h1 className="admin-page-title">Editor de Diseño</h1>
          <p className="page-subtitle">Personaliza la apariencia visual del sitio</p>
        </div>
        <button
          type="submit"
          form="design-form"
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
        <div className={`design-message ${saveMessage.type}`}>
          {saveMessage.text}
        </div>
      )}

      {/* Tabs */}
      <div className="design-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form id="design-form" onSubmit={handleSubmit(onSubmit)} className="design-form">
        {/* Tab: Colores */}
        {activeTab === 'colors' && (
          <div className="tab-content colors-tab">
            <div className="section-intro">
              <h2>Paleta de Colores</h2>
              <p>Define los colores principales del sitio. Los cambios se aplicarán en todo el diseño.</p>
            </div>

            <div className="colors-grid">
              {Object.entries(watchedColors || {}).map(([key, value]) => (
                <div key={key} className="color-field">
                  <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <div className="color-input-group">
                    <button
                      type="button"
                      className="color-swatch"
                      style={{ backgroundColor: value as string }}
                      onClick={() => setColorPickerOpen(colorPickerOpen === key ? null : key)}
                    >
                      <span className="color-value">{String(value)}</span>
                    </button>
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="color-text-input"
                      placeholder="#000000"
                    />
                  </div>
                  {colorPickerOpen === key && (
                    <div className="color-picker-popover">
                      <div className="color-picker-backdrop" onClick={() => setColorPickerOpen(null)} />
                      <div className="color-picker-panel">
                        <HexColorPicker
                          color={value as string}
                          onChange={(newColor) => handleColorChange(key, newColor)}
                        />
                        <button
                          type="button"
                          onClick={() => setColorPickerOpen(null)}
                          className="color-picker-close"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="theme-mode-section">
              <label htmlFor="mode">Modo de tema:</label>
              <select id="mode" {...register('mode')}>
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab: Tipografía */}
        {activeTab === 'typography' && (
          <div className="tab-content typography-tab">
            <div className="section-intro">
              <h2>Tipografía</h2>
              <p>Configura las fuentes y tamaños de texto del sitio.</p>
            </div>

            <div className="form-section">
              <h3>Fuentes</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="fontFamily-primary">Fuente Principal</label>
                  <input
                    id="fontFamily-primary"
                    type="text"
                    {...register('typography.fontFamily.primary')}
                    placeholder="Inter, system-ui, sans-serif"
                  />
                  <small>Familia de fuentes para el cuerpo del texto</small>
                </div>

                <div className="form-field">
                  <label htmlFor="fontFamily-heading">Fuente de Encabezados</label>
                  <input
                    id="fontFamily-heading"
                    type="text"
                    {...register('typography.fontFamily.heading')}
                    placeholder="Poppins, sans-serif"
                  />
                  <small>Familia de fuentes para títulos</small>
                </div>

                <div className="form-field">
                  <label htmlFor="fontFamily-mono">Fuente Monoespaciada</label>
                  <input
                    id="fontFamily-mono"
                    type="text"
                    {...register('typography.fontFamily.mono')}
                    placeholder="'Courier New', monospace"
                  />
                  <small>Para código y texto técnico</small>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Tamaños de Texto</h3>
              <div className="typography-sizes">
                {['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'].map(size => (
                  <div key={size} className="form-field">
                    <label htmlFor={`fontSize-${size}`}>{size.toUpperCase()}</label>
                    <input
                      id={`fontSize-${size}`}
                      type="text"
                      {...register(`typography.fontSize.${size}` as any)}
                      placeholder="1rem"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Pesos de Fuente</h3>
              <div className="form-grid">
                {['light', 'normal', 'medium', 'semibold', 'bold'].map(weight => (
                  <div key={weight} className="form-field">
                    <label htmlFor={`fontWeight-${weight}`}>{weight}</label>
                    <input
                      id={`fontWeight-${weight}`}
                      type="number"
                      min="100"
                      max="900"
                      step="100"
                      {...register(`typography.fontWeight.${weight}` as any, { valueAsNumber: true })}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Espaciado */}
        {activeTab === 'spacing' && (
          <div className="tab-content spacing-tab">
            <div className="section-intro">
              <h2>Espaciado y Bordes</h2>
              <p>Define los espacios y radios de borde para mantener consistencia.</p>
            </div>

            <div className="form-section">
              <h3>Espaciado (Padding/Margin)</h3>
              <div className="spacing-grid">
                {['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].map(size => (
                  <div key={size} className="form-field">
                    <label htmlFor={`spacing-${size}`}>{size.toUpperCase()}</label>
                    <input
                      id={`spacing-${size}`}
                      type="text"
                      {...register(`spacing.${size}` as any)}
                      placeholder="0.5rem"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Radio de Bordes</h3>
              <div className="form-grid">
                {['sm', 'md', 'lg', 'xl', 'full'].map(size => (
                  <div key={size} className="form-field">
                    <label htmlFor={`borderRadius-${size}`}>{size.toUpperCase()}</label>
                    <input
                      id={`borderRadius-${size}`}
                      type="text"
                      {...register(`borderRadius.${size}` as any)}
                      placeholder="0.25rem"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Efectos */}
        {activeTab === 'effects' && (
          <div className="tab-content effects-tab">
            <div className="section-intro">
              <h2>Efectos Visuales</h2>
              <p>Configura partículas, animaciones y efectos de desenfoque.</p>
            </div>

            <div className="form-section">
              <h3>Partículas</h3>
              <div className="effects-toggle">
                <label className="toggle-field">
                  <input type="checkbox" {...register('effects.particles.enabled')} />
                  <span>Habilitar partículas de fondo</span>
                </label>
              </div>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="particles-count">Cantidad</label>
                  <input
                    id="particles-count"
                    type="number"
                    min="10"
                    max="200"
                    {...register('effects.particles.count', { valueAsNumber: true })}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="particles-color">Color</label>
                  <input
                    id="particles-color"
                    type="text"
                    {...register('effects.particles.color')}
                    placeholder="#ffffff"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="particles-speed">Velocidad</label>
                  <input
                    id="particles-speed"
                    type="number"
                    min="0.1"
                    max="5"
                    step="0.1"
                    {...register('effects.particles.speed', { valueAsNumber: true })}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="particles-size">Tamaño</label>
                  <input
                    id="particles-size"
                    type="number"
                    min="1"
                    max="10"
                    {...register('effects.particles.size', { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Animaciones</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="animations-level">Nivel de Animación</label>
                  <select id="animations-level" {...register('effects.animations.level')}>
                    <option value="none">Sin animaciones</option>
                    <option value="low">Bajo</option>
                    <option value="medium">Medio</option>
                    <option value="high">Alto</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="animations-duration">Duración</label>
                  <input
                    id="animations-duration"
                    type="text"
                    {...register('effects.animations.duration')}
                    placeholder="0.3s"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="animations-easing">Easing</label>
                  <input
                    id="animations-easing"
                    type="text"
                    {...register('effects.animations.easing')}
                    placeholder="ease-in-out"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Desenfoque (Blur)</h3>
              <div className="effects-toggle">
                <label className="toggle-field">
                  <input type="checkbox" {...register('effects.blur.enabled')} />
                  <span>Habilitar efectos de desenfoque</span>
                </label>
              </div>
              <div className="form-field">
                <label htmlFor="blur-amount">Cantidad de Desenfoque</label>
                <input
                  id="blur-amount"
                  type="text"
                  {...register('effects.blur.amount')}
                  placeholder="10px"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Logo */}
        {activeTab === 'logo' && (
          <div className="tab-content logo-tab">
            <div className="section-intro">
              <h2>Configuración del Logo</h2>
              <p>Define la ruta y dimensiones del logo del sitio.</p>
            </div>

            <div className="form-section">
              <div className="form-field full-width">
                <label htmlFor="logo-path">Ruta del Logo</label>
                <input
                  id="logo-path"
                  type="text"
                  {...register('logo.path')}
                  placeholder="/img/logo.svg"
                />
                <small>Ruta relativa desde la carpeta public/</small>
              </div>

              <h3>Tamaño Normal</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="logo-width">Ancho (px)</label>
                  <input
                    id="logo-width"
                    type="number"
                    min="50"
                    max="500"
                    {...register('logo.width', { valueAsNumber: true })}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="logo-height">Alto (px)</label>
                  <input
                    id="logo-height"
                    type="number"
                    min="50"
                    max="500"
                    {...register('logo.height', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <h3>Tamaño Compacto (Modo Móvil)</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="logo-compactWidth">Ancho (px)</label>
                  <input
                    id="logo-compactWidth"
                    type="number"
                    min="30"
                    max="200"
                    {...register('logo.compactWidth', { valueAsNumber: true })}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="logo-compactHeight">Alto (px)</label>
                  <input
                    id="logo-compactHeight"
                    type="number"
                    min="30"
                    max="200"
                    {...register('logo.compactHeight', { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
