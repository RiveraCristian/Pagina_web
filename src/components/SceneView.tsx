import { useState } from 'react';
import type { SceneResponseWithResolvedProjects } from '../types';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { ImageGallery } from './ImageGallery';
import '../styles/SceneView.css';

interface SceneViewProps {
  scene: SceneResponseWithResolvedProjects | null;
}

export function SceneView({ scene }: SceneViewProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { displayedText: typedTitle } = useTypingEffect(scene?.titulo || '', 40);
  const { displayedText: typedSubtitle } = useTypingEffect(scene?.subtitulo || '', 20);

  if (!scene) return null;

  const handleCardClick = (projectId: string) => {
    setExpandedCard(expandedCard === projectId ? null : projectId);
  };

  return (
    <main id="main-content" className="scene-view" tabIndex={-1}>
      <div className="scene-header" role="region" aria-label="Resultados de búsqueda">
        <h2 className="scene-title">
          {typedTitle}
          <span className="cursor" aria-hidden="true">|</span>
        </h2>
        <p className="scene-subtitle">{typedSubtitle}</p>
      </div>
      
      {/* Mostrar información corporativa si no hay proyectos */}
      {scene.proyectos.length === 0 && scene.contenido && (
        <div className="company-info-card" role="article" aria-label="Información de la empresa">
          <div className="company-content">
            <div className="company-main-content">
              <p className="company-description">
                {scene.contenido}
              </p>
            </div>
            
            {scene.enlaces && scene.enlaces.length > 0 && (
              <div className="company-links">
                <h3 className="company-links-title">Enlaces relacionados</h3>
                <div className="links-grid">
                  {scene.enlaces.map((enlace, index) => (
                    <a 
                      key={index}
                      href={enlace.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="company-link"
                      aria-label={`Visitar ${enlace.texto}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15,3 21,3 21,9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      {enlace.texto}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {scene.contacto && (
              <div className="company-contact">
                <h3 className="company-contact-title">Información de contacto</h3>
                <div className="contact-info">
                  {typeof scene.contacto === 'string' ? (
                    <p>{scene.contacto}</p>
                  ) : (
                    <div className="contact-details">
                      {scene.contacto.telefono && (
                        <div className="contact-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          <span>{scene.contacto.telefono}</span>
                        </div>
                      )}
                      {scene.contacto.email && (
                        <div className="contact-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                          <span>{scene.contacto.email}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div 
        className="scene-gallery" 
        role="list" 
        aria-label={`${scene.proyectos.length} proyectos encontrados`}
        style={{ display: scene.proyectos.length === 0 ? 'none' : 'block' }}
      >
        {scene.proyectos.map((proyecto) => (
          <article
            key={proyecto.id} 
            className={`scene-card ${expandedCard === proyecto.id ? 'expanded' : ''}`}
            onClick={() => handleCardClick(proyecto.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(proyecto.id);
              }
            }}
            role="listitem"
            tabIndex={0}
            aria-expanded={expandedCard === proyecto.id}
            aria-label={`Proyecto: ${proyecto.nombre}`}
          >
            <div className="scene-card-image-container">
              <img 
                src={proyecto.imagenes[0]} 
                alt={proyecto.nombre}
                className="scene-card-image"
                onError={(e) => {
                  // Fallback si la imagen no existe
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="expand-icon">
                {expandedCard === proyecto.id ? '✕' : '+'}
              </div>
            </div>
            <div className="scene-card-content">
              <h3 className="scene-card-title">{proyecto.nombre}</h3>
              <p className="scene-card-description">{proyecto.frase}</p>
              
              {expandedCard === proyecto.id && (
                <div className="scene-card-expanded-content">
                  {/* Galería de imágenes */}
                  {proyecto.galeria && proyecto.galeria.length > 1 && (
                    <div className="expanded-section">
                      <h4 className="expanded-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        Galería
                      </h4>
                      <ImageGallery images={proyecto.galeria} alt={proyecto.nombre} />
                    </div>
                  )}

                  {/* Video demostrativo */}
                  {proyecto.videoUrl && (
                    <div className="expanded-section">
                      <h4 className="expanded-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="23 7 16 12 23 17 23 7"></polygon>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                        </svg>
                        Video Demostrativo
                      </h4>
                      <div className="video-container">
                        <iframe
                          src={proyecto.videoUrl}
                          title={`Video de ${proyecto.nombre}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="video-iframe"
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {/* Tecnologías */}
                  {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
                    <div className="expanded-section">
                      <h4 className="expanded-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                          <polyline points="2 17 12 22 22 17"></polyline>
                          <polyline points="2 12 12 17 22 12"></polyline>
                        </svg>
                        Tecnologías
                      </h4>
                      <div className="expanded-tags">
                        {proyecto.tecnologias.map((tech, idx) => (
                          <span key={idx} className="tag tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Duración y Equipo */}
                  <div className="expanded-grid">
                    {proyecto.duracion && (
                      <div className="expanded-info-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <div>
                          <span className="info-label">Duración</span>
                          <span className="info-value">{proyecto.duracion}</span>
                        </div>
                      </div>
                    )}
                    
                    {proyecto.equipo && proyecto.equipo.length > 0 && (
                      <div className="expanded-info-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <div>
                          <span className="info-label">Equipo</span>
                          <span className="info-value">{proyecto.equipo.join(', ')}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Testimonios */}
                  {proyecto.testimonios && proyecto.testimonios.length > 0 && (
                    <div className="expanded-section">
                      <h4 className="expanded-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Testimonios
                      </h4>
                      <div className="testimonios-grid">
                        {proyecto.testimonios.map((testimonio, idx) => (
                          <div key={idx} className="testimonio-card">
                            <div className="testimonio-quote">"</div>
                            <p className="testimonio-texto">{testimonio.texto}</p>
                            <div className="testimonio-autor">
                              <span className="testimonio-avatar">{testimonio.avatar}</span>
                              <div>
                                <div className="autor-nombre">{testimonio.autor}</div>
                                {testimonio.cargo && (
                                  <div className="autor-cargo">{testimonio.cargo}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Estadísticas */}
                  {proyecto.estadisticas && (
                    <div className="expanded-section">
                      <h4 className="expanded-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="20" x2="18" y2="10"></line>
                          <line x1="12" y1="20" x2="12" y2="4"></line>
                          <line x1="6" y1="20" x2="6" y2="14"></line>
                        </svg>
                        Impacto
                      </h4>
                      <div className="stats-grid">
                        {proyecto.estadisticas.usuarios && (
                          <div className="stat-item">
                            <span className="stat-value">{proyecto.estadisticas.usuarios.toLocaleString()}</span>
                            <span className="stat-label">Usuarios</span>
                          </div>
                        )}
                        {proyecto.estadisticas.proyectos && (
                          <div className="stat-item">
                            <span className="stat-value">{proyecto.estadisticas.proyectos.toLocaleString()}</span>
                            <span className="stat-label">Proyectos</span>
                          </div>
                        )}
                        {proyecto.estadisticas.satisfaccion && (
                          <div className="stat-item">
                            <span className="stat-value">{proyecto.estadisticas.satisfaccion}%</span>
                            <span className="stat-label">Satisfacción</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  {proyecto.links && Object.keys(proyecto.links).length > 0 && (
                    <div className="expanded-section">
                      <h4 className="expanded-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        Enlaces
                      </h4>
                      <div className="links-grid">
                        {proyecto.links.demo && (
                          <a href={proyecto.links.demo} target="_blank" rel="noopener noreferrer" className="link-button">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polygon points="10 8 16 12 10 16 10 8"></polygon>
                            </svg>
                            Demo
                          </a>
                        )}
                        {proyecto.links.repositorio && (
                          <a href={proyecto.links.repositorio} target="_blank" rel="noopener noreferrer" className="link-button">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                            Repositorio
                          </a>
                        )}
                        {proyecto.links.documentacion && (
                          <a href={proyecto.links.documentacion} target="_blank" rel="noopener noreferrer" className="link-button">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                              <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            Documentación
                          </a>
                        )}
                        {proyecto.links.website && (
                          <a href={proyecto.links.website} target="_blank" rel="noopener noreferrer" className="link-button">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="2" y1="12" x2="22" y2="12"></line>
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {proyecto.tags && proyecto.tags.length > 0 && (
                    <div className="expanded-section">
                      <h4 className="expanded-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                          <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                        Categorías
                      </h4>
                      <div className="expanded-tags">
                        {proyecto.tags.map((tag, idx) => (
                          <span key={idx} className="tag category-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
