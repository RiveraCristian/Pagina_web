import { useState } from 'react';
import { LogoHero } from './components/LogoHero';
import { PromptBox } from './components/PromptBox';
import { SceneView } from './components/SceneView';
import { getSceneForQuery } from './services/aiSceneService';
import { PROJECTS } from './data/projects';
import type { SceneResponseWithResolvedProjects, ResolvedSceneProject } from './types';
import './App.css';

function App() {
  const [promptVisible, setPromptVisible] = useState(false);
  const [scene, setScene] = useState<SceneResponseWithResolvedProjects | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogoClick = () => {
    setPromptVisible(true);
  };

  const handleQuery = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      // Llamar al servicio de IA
      const sceneResponse = await getSceneForQuery(query);

      // Resolver los proyectos cruzando con el catálogo local
      const resolvedProjects: ResolvedSceneProject[] = sceneResponse.proyectos
        .map((sceneProject) => {
          const project = PROJECTS.find((p) => p.id === sceneProject.id);
          
          if (!project) {
            console.warn(`Proyecto con id "${sceneProject.id}" no encontrado en el catálogo`);
            return null;
          }

          return {
            id: project.id,
            nombre: project.nombre,
            frase: sceneProject.frase || project.fraseDefault,
            imagenes: project.imagenes
          };
        })
        .filter((p): p is ResolvedSceneProject => p !== null);

      // Actualizar la escena con los proyectos resueltos
      setScene({
        titulo: sceneResponse.titulo,
        subtitulo: sceneResponse.subtitulo,
        proyectos: resolvedProjects
      });
    } catch (err) {
      console.error('Error al obtener la escena:', err);
      setError('Ocurrió un error al procesar tu consulta. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <LogoHero onClick={handleLogoClick} isCompact={promptVisible} />
      <PromptBox isVisible={promptVisible} onSubmit={handleQuery} />
      
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Analizando tu consulta...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <SceneView scene={scene} />
    </div>
  );
}

export default App;
