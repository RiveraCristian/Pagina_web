import type { SceneResponseWithResolvedProjects } from '../types';
import '../styles/SceneView.css';

interface SceneViewProps {
  scene: SceneResponseWithResolvedProjects | null;
}

export function SceneView({ scene }: SceneViewProps) {
  if (!scene) return null;

  return (
    <div className="scene-view">
      <div className="scene-header">
        <h2 className="scene-title">{scene.titulo}</h2>
        <p className="scene-subtitle">{scene.subtitulo}</p>
      </div>
      
      <div className="scene-gallery">
        {scene.proyectos.map((proyecto) => (
          <div key={proyecto.id} className="scene-card">
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
            </div>
            <div className="scene-card-content">
              <h3 className="scene-card-title">{proyecto.nombre}</h3>
              <p className="scene-card-description">{proyecto.frase}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
