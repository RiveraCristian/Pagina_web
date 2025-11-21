import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { LogoHero } from './components/LogoHero';
import { PromptBox } from './components/PromptBox';
import { ParticlesBackground } from './components/ParticlesBackground';
import { SkipLink } from './components/SkipLink';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAppConfig } from './hooks/useAppConfig';
import { useThemeConfig } from './hooks/useThemeConfig';
import { useProjects } from './hooks/useProjects';
import { useAI } from './hooks/useAI';
import { sanitizeSearchQuery, detectXSSAttempt, checkRateLimit } from './utils/sanitize';
import { cacheManager } from './utils/cache';

// Lazy load components
const SceneView = lazy(() => import('./components/SceneView').then(module => ({ default: module.SceneView })));
const SearchAgainHint = lazy(() => import('./components/SearchAgainHint').then(module => ({ default: module.SearchAgainHint })));
const SearchHistory = lazy(() => import('./components/SearchHistory').then(module => ({ default: module.SearchHistory })));
const BackToTopButton = lazy(() => import('./components/BackToTopButton').then(module => ({ default: module.BackToTopButton })));
const KeyboardShortcutsHelp = lazy(() => import('./components/KeyboardShortcutsHelp').then(module => ({ default: module.KeyboardShortcutsHelp })));
const ThemeToggle = lazy(() => import('./components/ThemeToggle').then(module => ({ default: module.ThemeToggle })));
const InstallPrompt = lazy(() => import('./components/InstallPrompt').then(module => ({ default: module.InstallPrompt })));
const SearchFooter = lazy(() => import('./components/SearchFooter').then(module => ({ default: module.SearchFooter })));
import { getSceneForQuery } from './services/aiSceneService';
import type { SceneResponseWithResolvedProjects, ResolvedSceneProject } from './types';
import './App.css';

function App() {
  // Cargar configuración y datos desde JSON
  const { config } = useAppConfig();
  const { themeConfig } = useThemeConfig();
  const { projects: PROJECTS, loading: projectsLoading } = useProjects();
  const { isInitialized: aiInitialized, error: aiError } = useAI();
  const [promptVisible, setPromptVisible] = useState(false);
  const [scene, setScene] = useState<SceneResponseWithResolvedProjects | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<Array<{ query: string; scene: SceneResponseWithResolvedProjects }>>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const promptBoxRef = useRef<{ focusInput: () => void }>(null);

  // Actualizar título del documento cuando se carga la config
  useEffect(() => {
    if (config?.seo?.title) {
      document.title = config.seo.title;
    } else if (config?.site?.name) {
      document.title = config.site.name;
    }
  }, [config]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onEscape: () => {
      if (promptVisible) {
        handleBackToTop();
      }
    },
    onCtrlK: () => {
      if (promptVisible) {
        promptBoxRef.current?.focusInput();
      }
    },
    // Arrow keys: navegación entre proyectos (por ahora no implementado)
    onArrowLeft: () => {
      // TODO: navegar al proyecto anterior
    },
    onArrowRight: () => {
      // TODO: navegar al siguiente proyecto
    },
    enabled: promptVisible
  });

  // Deep linking: cargar query desde URL al montar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get('q');
    
    if (queryParam) {
      setPromptVisible(true);
      handleQuery(queryParam);
    }
    
    // Manejar navegación del navegador (botón atrás/adelante)
    const handlePopState = (event: PopStateEvent) => {
      const params = new URLSearchParams(window.location.search);
      const queryParam = params.get('q');
      
      if (queryParam && event.state?.query) {
        handleQuery(queryParam);
      } else {
        // Volver al estado inicial
        setPromptVisible(false);
        setScene(null);
        setCurrentQuery('');
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLogoClick = () => {
    setPromptVisible(true);
  };

  const handleNewSearch = () => {
    setScene(null);
    setError(null);
  };

  const handleBackToTop = () => {
    setPromptVisible(false);
    setScene(null);
    setError(null);
    setSearchHistory([]);
  };

  const handleHistorySelect = (historicScene: SceneResponseWithResolvedProjects) => {
    setScene(historicScene);
  };

  const handleQuery = async (query: string) => {
    // Sanitize input
    const sanitizedQuery = sanitizeSearchQuery(query);
    
    if (!sanitizedQuery) {
      setError('Por favor ingresa una búsqueda válida.');
      return;
    }

    // Verificar que los proyectos estén cargados
    if (projectsLoading) {
      setError('Cargando datos de proyectos, por favor espera un momento...');
      return;
    }

    if (!PROJECTS || PROJECTS.length === 0) {
      setError('No hay proyectos disponibles en este momento.');
      return;
    }

    // Detect XSS attempts
    if (detectXSSAttempt(query)) {
      setError('Búsqueda no válida. Por favor intenta con otros términos.');
      return;
    }

    // Rate limiting
    const rateLimit = checkRateLimit('search', 20, 60000); // 20 requests per minute
    if (!rateLimit.allowed) {
      setError('Demasiadas búsquedas. Por favor espera un momento antes de intentar nuevamente.');
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentQuery(sanitizedQuery);
    
    // Add to recent searches
    cacheManager.addRecentSearch(sanitizedQuery);
    
    // Check cache first
    const cachedResult = cacheManager.getCachedResult(sanitizedQuery);
    if (cachedResult) {
      setScene(cachedResult);
      setSearchHistory(prev => [...prev, { query: sanitizedQuery, scene: cachedResult }]);
      setLoading(false);
      return;
    }
    
    // Actualizar URL sin recargar la página
    const newUrl = `${window.location.pathname}?q=${encodeURIComponent(sanitizedQuery)}`;
    window.history.pushState({ query: sanitizedQuery }, '', newUrl);
    
    // Fade out de la escena anterior
    if (scene) {
      setScene(null);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    try {
      // Llamar al servicio de IA
      console.log('🔍 Buscando:', sanitizedQuery);
      const sceneResponse = await getSceneForQuery(sanitizedQuery);
      console.log('🤖 Respuesta de IA:', sceneResponse);

      // Resolver los proyectos cruzando con el catálogo local
      console.log('📂 Proyectos disponibles:', PROJECTS.length, 'proyectos');
      const resolvedProjects: ResolvedSceneProject[] = sceneResponse.proyectos
        .map((sceneProject) => {
          const project = PROJECTS.find((p) => p.id === sceneProject.id);
          
          if (!project) {
            console.warn(`❌ Proyecto con id "${sceneProject.id}" no encontrado en el catálogo`);
            return null;
          }

          console.log(`✅ Proyecto encontrado: ${project.id} - ${project.nombre}`);

          const resolved: ResolvedSceneProject = {
            id: project.id,
            nombre: project.nombre,
            frase: sceneProject.frase || project.fraseDefault,
            imagenes: project.imagenes,
            tecnologias: project.tecnologias,
            duracion: project.duracion,
            equipo: project.equipo,
            links: project.links,
            galeria: project.galeria,
            videoUrl: project.videoUrl,
            testimonios: project.testimonios,
            estadisticas: project.estadisticas,
            tags: project.tags,
            subcategoria: project.subcategoria
          };
          
          return resolved;
        })
        .filter(Boolean) as ResolvedSceneProject[];

      const resolvedScene = {
        titulo: sceneResponse.titulo,
        subtitulo: sceneResponse.subtitulo,
        proyectos: resolvedProjects
      };

      // Actualizar la escena con los proyectos resueltos
      setScene(resolvedScene);

      // Cache result
      cacheManager.cacheResult(sanitizedQuery, resolvedScene);

      // Agregar al historial
      setSearchHistory(prev => [...prev, { query: sanitizedQuery, scene: resolvedScene }]);
    } catch (err) {
      console.error('Error al obtener la escena:', err);
      setError('Ocurrió un error al procesar tu consulta. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <SkipLink />
      {themeConfig?.effects?.particles?.enabled && <ParticlesBackground />}
      
      <Suspense fallback={null}>
        {promptVisible && <BackToTopButton onClick={handleBackToTop} />}
        {promptVisible && <KeyboardShortcutsHelp />}
        {config?.features?.darkMode && <ThemeToggle />}
        {config?.features?.pwa && <InstallPrompt />}
      </Suspense>
      
      <LogoHero onClick={handleLogoClick} isCompact={promptVisible} />
      <PromptBox ref={promptBoxRef} isVisible={promptVisible} onSubmit={handleQuery} />
      
      <Suspense fallback={
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      }>

        
        {promptVisible && scene && (
          <>
            <SearchHistory history={searchHistory} onSelectHistory={handleHistorySelect} />
            <SearchAgainHint onNewSearch={handleNewSearch} currentQuery={currentQuery} />
          </>
        )}
        
        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Analizando tu consulta...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <SceneView scene={scene} />
        
        <SearchFooter isVisible={promptVisible && !scene && !loading && !error} />
      </Suspense>
    </div>
  );
}

export default App;
