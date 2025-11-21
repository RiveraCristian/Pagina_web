import { useState, useEffect } from 'react';
import { searchEngine } from '../../services/searchEngine';
import './SearchEngine.css';

interface SearchStats {
  totalResults: number;
  processingTime: number;
  indexSize: number;
  queryComplexity: number;
  topCategories: Array<{ category: string; count: number }>;
}

export default function SearchEngineAdmin() {
  const [testQuery, setTestQuery] = useState('programación web');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchStats, setSearchStats] = useState<SearchStats | null>(null);
  const [facets, setFacets] = useState<Record<string, Array<{ value: string; count: number }>>>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [trends, setTrends] = useState<Array<{ term: string; frequency: number; growth: number }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEngineStats();
    loadTrends();
    loadFacets();
  }, []);

  const loadEngineStats = async () => {
    try {
      // Simular carga de contenido
      const mockContent = [
        {
          id: '1',
          nombre: 'Sistema de Gestión Web',
          descripcion: 'Desarrollo de aplicación web con React y TypeScript',
          categoria: 'proyectos',
          tecnologias: ['React', 'TypeScript', 'Node.js'],
          fecha: '2024-01-15'
        },
        {
          id: '2',
          nombre: 'Diseño UX/UI Moderno',
          descripcion: 'Interfaces de usuario intuitivas y atractivas',
          categoria: 'servicios',
          tecnologias: ['Figma', 'Adobe XD', 'Sketch'],
          fecha: '2024-02-20'
        },
        {
          id: '3',
          nombre: 'Análisis de Datos',
          descripcion: 'Visualización y análisis de datos empresariales',
          categoria: 'servicios',
          tecnologias: ['Python', 'Pandas', 'Matplotlib'],
          fecha: '2024-03-10'
        }
      ];

      searchEngine.indexContent(mockContent);
    } catch (error) {
      console.error('Error loading engine stats:', error);
    }
  };

  const loadTrends = () => {
    const engineTrends = searchEngine.getTrends('week');
    setTrends(engineTrends);
  };

  const loadFacets = () => {
    const engineFacets = searchEngine.getFacets();
    setFacets(engineFacets);
  };

  const runTest = async () => {
    if (!testQuery.trim()) return;

    setLoading(true);
    try {
      // Ejecutar búsqueda
      const results = searchEngine.search(testQuery, {
        limit: 10,
        fuzzy: true,
        includeStats: true
      });
      
      // Obtener estadísticas
      const stats = searchEngine.getSearchStats(testQuery);
      
      // Obtener sugerencias
      const autoSuggestions = searchEngine.getSuggestions(testQuery.split(' ').pop() || '');

      setSearchResults(results);
      setSearchStats(stats);
      setSuggestions(autoSuggestions);
      
      console.log('🔍 Test Results:', {
        results,
        stats,
        suggestions: autoSuggestions
      });
    } catch (error) {
      console.error('Error running test:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSimilarity = () => {
    const similar = searchEngine.findSimilar('1', 3);
    console.log('🔗 Similar items:', similar);
    alert(`Encontrados ${similar.length} elementos similares. Ver consola para detalles.`);
  };

  return (
    <div className="search-engine-admin">
      <div className="page-header">
        <h1>🔍 Motor de Búsqueda - Panel de Control</h1>
        <p>Configuración y análisis del motor de búsqueda local avanzado</p>
      </div>

      {/* Estadísticas Generales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Índice</h3>
            <p className="stat-value">{searchEngine.getIndexSize()}</p>
            <span>tokens únicos</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <h3>Contenido</h3>
            <p className="stat-value">{facets.categories?.reduce((sum, cat) => sum + cat.count, 0) || 0}</p>
            <span>elementos indexados</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-info">
            <h3>Categorías</h3>
            <p className="stat-value">{facets.categories?.length || 0}</p>
            <span>categorías activas</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-info">
            <h3>Tecnologías</h3>
            <p className="stat-value">{facets.technologies?.length || 0}</p>
            <span>tecnologías detectadas</span>
          </div>
        </div>
      </div>

      {/* Test de Búsqueda */}
      <div className="search-test-section">
        <h2>🧪 Prueba de Búsqueda</h2>
        
        <div className="test-controls">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Ingresa una consulta de prueba..."
            className="test-query-input"
            onKeyPress={(e) => e.key === 'Enter' && runTest()}
          />
          <button 
            onClick={runTest} 
            className="test-button"
            disabled={loading}
          >
            {loading ? '🔄 Buscando...' : '🔍 Probar Búsqueda'}
          </button>
          <button 
            onClick={testSimilarity}
            className="test-button secondary"
          >
            🔗 Test Similitud
          </button>
        </div>

        {/* Sugerencias */}
        {suggestions.length > 0 && (
          <div className="suggestions-section">
            <h3>💡 Sugerencias de Autocompletado</h3>
            <div className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <span key={index} className="suggestion-tag">
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Estadísticas de Búsqueda */}
        {searchStats && (
          <div className="search-stats">
            <h3>📈 Estadísticas de Búsqueda</h3>
            <div className="stats-row">
              <div className="mini-stat">
                <span className="label">Resultados:</span>
                <span className="value">{searchStats.totalResults}</span>
              </div>
              <div className="mini-stat">
                <span className="label">Tiempo:</span>
                <span className="value">{searchStats.processingTime}ms</span>
              </div>
              <div className="mini-stat">
                <span className="label">Complejidad:</span>
                <span className="value">{searchStats.queryComplexity} tokens</span>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>🎯 Resultados de Búsqueda</h3>
            {searchResults.map((result, index) => (
              <div key={index} className="result-item">
                <div className="result-header">
                  <h4>{result.content.nombre}</h4>
                  <div className="result-score">
                    Score: {(result.score * 100).toFixed(1)}%
                  </div>
                </div>
                <p className="result-description">{result.content.descripcion}</p>
                <div className="result-meta">
                  <span className="category">{result.content.categoria}</span>
                  {result.content.tecnologias && (
                    <div className="technologies">
                      {result.content.tecnologias.map((tech: string, techIndex: number) => (
                        <span key={techIndex} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
                {result.explanation && (
                  <p className="result-explanation">📝 {result.explanation}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Facetas y Tendencias */}
      <div className="analytics-section">
        <div className="facets-panel">
          <h2>🏷️ Facetas de Contenido</h2>
          
          {Object.entries(facets).map(([facetType, values]) => (
            <div key={facetType} className="facet-group">
              <h3>{facetType.charAt(0).toUpperCase() + facetType.slice(1)}</h3>
              <div className="facet-list">
                {values.map((item, index) => (
                  <div key={index} className="facet-item">
                    <span className="facet-name">{item.value}</span>
                    <span className="facet-count">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="trends-panel">
          <h2>📈 Tendencias de Búsqueda</h2>
          <div className="trends-list">
            {trends.map((trend, index) => (
              <div key={index} className="trend-item">
                <div className="trend-info">
                  <span className="trend-term">{trend.term}</span>
                  <span className="trend-frequency">Frecuencia: {trend.frequency}</span>
                </div>
                <div className={`trend-growth ${trend.growth > 0 ? 'positive' : 'negative'}`}>
                  {trend.growth > 0 ? '↗️' : '↘️'} {(trend.growth * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Configuración Avanzada */}
      <div className="config-section">
        <h2>⚙️ Configuración del Motor</h2>
        
        <div className="config-grid">
          <div className="config-item">
            <h3>🔍 Búsqueda Difusa</h3>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider">Habilitada</span>
            </label>
            <p>Permite encontrar coincidencias con errores tipográficos</p>
          </div>

          <div className="config-item">
            <h3>🔗 Sinónimos</h3>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider">Habilitados</span>
            </label>
            <p>Expande búsquedas con términos relacionados</p>
          </div>

          <div className="config-item">
            <h3>📊 Análisis Semántico</h3>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider">Habilitado</span>
            </label>
            <p>Mejora relevancia con análisis de contexto</p>
          </div>

          <div className="config-item">
            <h3>🎯 Autocompletado</h3>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider">Habilitado</span>
            </label>
            <p>Sugerencias inteligentes mientras se escribe</p>
          </div>
        </div>
      </div>
    </div>
  );
}