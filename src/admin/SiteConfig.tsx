import React, { useState, useEffect } from 'react';
import './SiteConfig.css';

interface LogoConfig {
  type: 'text' | 'image';
  text?: string;
  image?: string;
  width?: number;
  height?: number;
}

interface SiteConfig {
  site: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    url: string;
    language: string;
    timezone: string;
    logo: LogoConfig;
    favicon: string;
    email: string;
    phone: string;
    address: string;
    socialMedia: {
      twitter: string;
      facebook: string;
      instagram: string;
      linkedin: string;
      youtube: string;
    };
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    ogImageAlt: string;
    twitterHandle: string;
    twitterCard: string;
    canonical: string;
    robots: string;
    author: string;
  };
  search: {
    placeholder: string;
    voiceButtonText: string;
    maxResults: number;
    fuzzySearch: boolean;
  };
}

export function SiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      console.log('Loading config...');
      const response = await fetch('/api/config');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      console.log('Config loaded:', data);
      setConfig(data);
    } catch (error) {
      console.error('Error loading config:', error);
      setMessage(`❌ Error al cargar configuración: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    
    setSaving(true);
    try {
      console.log('Saving config:', config);
      
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Save result:', result);
        setMessage('✅ Configuración guardada exitosamente');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorText = await response.text();
        console.error('Save error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage(`❌ Error al guardar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const updateSiteField = (field: string, value: any) => {
    if (!config) return;
    
    setConfig(prev => ({
      ...prev!,
      site: {
        ...prev!.site,
        [field]: value
      }
    }));
  };

  const updateSeoField = (field: string, value: any) => {
    if (!config) return;
    
    setConfig(prev => ({
      ...prev!,
      seo: {
        ...prev!.seo,
        [field]: value
      }
    }));
  };

  const updateSocialField = (platform: string, value: string) => {
    if (!config) return;
    
    setConfig(prev => ({
      ...prev!,
      site: {
        ...prev!.site,
        socialMedia: {
          ...prev!.site.socialMedia,
          [platform]: value
        }
      }
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('❌ El archivo es muy grande. Máximo 5MB.');
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('❌ Solo se permiten archivos de imagen.');
      return;
    }
    
    try {
      setMessage('📤 Subiendo imagen...');
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileData: reader.result,
              fileType: file.type
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            const currentLogo = config?.site.logo || { type: 'text' as const };
            updateSiteField('logo', {
              ...currentLogo,
              type: 'image' as const,
              image: result.path
            });
            setMessage('✅ Logo subido exitosamente');
            setTimeout(() => setMessage(''), 3000);
          } else {
            throw new Error('Error al subir imagen');
          }
        } catch (error) {
          console.error('Upload error:', error);
          setMessage('❌ Error al subir imagen');
          setTimeout(() => setMessage(''), 5000);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File read error:', error);
      setMessage('❌ Error al leer archivo');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  if (loading) {
    return (
      <div className="site-config">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="site-config">
        <div className="error-state">
          <h3>Error al cargar la configuración</h3>
          <button onClick={loadConfig} className="retry-btn">
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="site-config">
      <div className="site-config-header">
        <h2>Configuración del Sitio</h2>
        <div className="header-actions">
          {message && <div className="message">{message}</div>}
          <button 
            onClick={async () => {
              try {
                const response = await fetch('/api/config/test');
                const result = await response.json();
                console.log('Config test:', result);
                setMessage(`🔍 Test: ${JSON.stringify(result, null, 2)}`);
              } catch (error) {
                console.error('Test error:', error);
                setMessage(`❌ Test error: ${error}`);
              }
            }}
            className="test-btn"
          >
            Test Config
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="save-btn"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      <div className="config-sections">
        {/* Logo */}
        <section className="config-section">
          <h3>Logo del Sitio</h3>
          <div className="logo-config">
            <div className="logo-type-selector">
              <label className="radio-group">
                <input
                  type="radio"
                  name="logoType"
                  value="text"
                  checked={config.site.logo?.type === 'text'}
                  onChange={() => {
                    const currentLogo = config.site.logo || { type: 'text' as const };
                    updateSiteField('logo', { ...currentLogo, type: 'text' as const });
                  }}
                />
                <span>Texto</span>
              </label>
              <label className="radio-group">
                <input
                  type="radio"
                  name="logoType"
                  value="image"
                  checked={config.site.logo?.type === 'image'}
                  onChange={() => {
                    const currentLogo = config.site.logo || { type: 'text' as const };
                    updateSiteField('logo', { ...currentLogo, type: 'image' as const });
                  }}
                />
                <span>Imagen</span>
              </label>
            </div>
            
            {config.site.logo?.type === 'text' ? (
              <div className="form-group">
                <label>Texto del Logo</label>
                <input
                  type="text"
                  value={config.site.logo?.text || ''}
                  onChange={(e) => {
                    const currentLogo = config.site.logo || { type: 'text' as const };
                    updateSiteField('logo', { ...currentLogo, text: e.target.value });
                  }}
                  placeholder="Nombre del sitio"
                />
              </div>
            ) : (
              <div className="logo-image-config">
                <div className="form-group">
                  <label>Subir Imagen del Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="file-input"
                  />
                  {config.site.logo?.image && (
                    <div className="logo-preview">
                      <img 
                        src={config.site.logo.image} 
                        alt="Logo preview" 
                        style={{ maxWidth: '200px', maxHeight: '100px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="form-grid">
              <div className="form-group">
                <label>Ancho (px)</label>
                <input
                  type="number"
                  value={config.site.logo?.width || 200}
                  onChange={(e) => {
                    const currentLogo = config.site.logo || { type: 'text' as const };
                    updateSiteField('logo', { ...currentLogo, width: parseInt(e.target.value) });
                  }}
                  min="50"
                  max="500"
                />
              </div>
              <div className="form-group">
                <label>Alto (px)</label>
                <input
                  type="number"
                  value={config.site.logo?.height || 80}
                  onChange={(e) => {
                    const currentLogo = config.site.logo || { type: 'text' as const };
                    updateSiteField('logo', { ...currentLogo, height: parseInt(e.target.value) });
                  }}
                  min="30"
                  max="200"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Información Básica */}
        <section className="config-section">
          <h3>Información Básica</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre del Sitio</label>
              <input
                type="text"
                value={config.site.name}
                onChange={(e) => updateSiteField('name', e.target.value)}
                placeholder="Mi Sitio Web"
              />
            </div>
            
            <div className="form-group">
              <label>Nombre Corto</label>
              <input
                type="text"
                value={config.site.shortName}
                onChange={(e) => updateSiteField('shortName', e.target.value)}
                placeholder="MSW"
              />
            </div>
            
            <div className="form-group full-width">
              <label>Eslogan</label>
              <input
                type="text"
                value={config.site.tagline}
                onChange={(e) => updateSiteField('tagline', e.target.value)}
                placeholder="Búsqueda inteligente configurable"
              />
            </div>
            
            <div className="form-group full-width">
              <label>Descripción</label>
              <textarea
                value={config.site.description}
                onChange={(e) => updateSiteField('description', e.target.value)}
                placeholder="Descripción del sitio web"
                rows={3}
              />
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section className="config-section">
          <h3>Información de Contacto</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>URL del Sitio</label>
              <input
                type="url"
                value={config.site.url}
                onChange={(e) => updateSiteField('url', e.target.value)}
                placeholder="https://mi-sitio.com"
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={config.site.email}
                onChange={(e) => updateSiteField('email', e.target.value)}
                placeholder="contacto@mi-sitio.com"
              />
            </div>
            
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                value={config.site.phone}
                onChange={(e) => updateSiteField('phone', e.target.value)}
                placeholder="+56 9 0000 0000"
              />
            </div>
            
            <div className="form-group full-width">
              <label>Dirección</label>
              <input
                type="text"
                value={config.site.address}
                onChange={(e) => updateSiteField('address', e.target.value)}
                placeholder="Dirección física"
              />
            </div>
          </div>
        </section>

        {/* SEO */}
        <section className="config-section">
          <h3>Configuración SEO</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Título SEO</label>
              <input
                type="text"
                value={config.seo.title}
                onChange={(e) => updateSeoField('title', e.target.value)}
                placeholder="Mi Sitio Web - Búsqueda Inteligente"
              />
            </div>
            
            <div className="form-group">
              <label>Autor</label>
              <input
                type="text"
                value={config.seo.author}
                onChange={(e) => updateSeoField('author', e.target.value)}
                placeholder="Autor del sitio"
              />
            </div>
            
            <div className="form-group full-width">
              <label>Descripción SEO</label>
              <textarea
                value={config.seo.description}
                onChange={(e) => updateSeoField('description', e.target.value)}
                placeholder="Descripción para motores de búsqueda"
                rows={3}
              />
            </div>
            
            <div className="form-group full-width">
              <label>Palabras Clave (separadas por coma)</label>
              <input
                type="text"
                value={config.seo.keywords.join(', ')}
                onChange={(e) => updateSeoField('keywords', e.target.value.split(',').map((k: string) => k.trim()))}
                placeholder="búsqueda, IA, sitio web"
              />
            </div>
          </div>
        </section>

        {/* Redes Sociales */}
        <section className="config-section">
          <h3>Redes Sociales</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Twitter</label>
              <input
                type="url"
                value={config.site.socialMedia.twitter}
                onChange={(e) => updateSocialField('twitter', e.target.value)}
                placeholder="https://twitter.com/usuario"
              />
            </div>
            
            <div className="form-group">
              <label>Facebook</label>
              <input
                type="url"
                value={config.site.socialMedia.facebook}
                onChange={(e) => updateSocialField('facebook', e.target.value)}
                placeholder="https://facebook.com/usuario"
              />
            </div>
            
            <div className="form-group">
              <label>Instagram</label>
              <input
                type="url"
                value={config.site.socialMedia.instagram}
                onChange={(e) => updateSocialField('instagram', e.target.value)}
                placeholder="https://instagram.com/usuario"
              />
            </div>
            
            <div className="form-group">
              <label>LinkedIn</label>
              <input
                type="url"
                value={config.site.socialMedia.linkedin}
                onChange={(e) => updateSocialField('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/usuario"
              />
            </div>
            
            <div className="form-group">
              <label>YouTube</label>
              <input
                type="url"
                value={config.site.socialMedia.youtube}
                onChange={(e) => updateSocialField('youtube', e.target.value)}
                placeholder="https://youtube.com/@usuario"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}