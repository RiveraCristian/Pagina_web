import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaRobot, FaSave, FaKey, FaBrain, FaCog, FaChartLine } from 'react-icons/fa';
import { aiService, type AIConfig } from '../../services/aiService';
import './AISettings.css';

export default function AISettings() {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<AIConfig>({
    openai: {
      apiKey: '',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 500,
      enabled: false
    },
    fallback: {
      enabled: true,
      confidence: 0.3
    },
    system: {
      prompt: '',
      context: '',
      language: 'es'
    }
  });
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTestLoading, setIsTestLoading] = useState(false);

  // Cargar configuración actual
  const { data: currentConfig, isLoading } = useQuery({
    queryKey: ['ai-config'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        return data.ai || config;
      } catch (error) {
        console.error('Error loading AI config:', error);
        return config;
      }
    }
  });

  // Cargar estadísticas de IA
  const { data: stats } = useQuery({
    queryKey: ['ai-stats'],
    queryFn: () => aiService.getStats(),
    refetchInterval: 30000 // Actualizar cada 30 segundos
  });

  useEffect(() => {
    if (currentConfig) {
      setConfig(currentConfig);
    }
  }, [currentConfig]);

  // Mutación para guardar configuración
  const saveMutation = useMutation({
    mutationFn: async (newConfig: AIConfig) => {
      // Guardar en el backend
      const response = await fetch('/api/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ai: newConfig })
      });

      if (!response.ok) {
        throw new Error('Error saving AI configuration');
      }

      // Actualizar servicio de IA
      await aiService.updateConfig(newConfig);
      
      return newConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-config'] });
      queryClient.invalidateQueries({ queryKey: ['ai-stats'] });
    }
  });

  // Función para probar la IA
  const testAI = async () => {
    if (!testQuery.trim()) return;

    setIsTestLoading(true);
    try {
      // Inicializar con configuración actual si es necesario
      const knowledgeBase: any[] = []; // Se puede cargar desde API
      await aiService.initialize(config, knowledgeBase);
      
      const result = await aiService.processQuery(testQuery);
      setTestResult(result);
    } catch (error) {
      setTestResult({ error: (error as Error).message });
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleSave = () => {
    saveMutation.mutate(config);
  };

  if (isLoading) {
    return (
      <div className="admin-page">
        <h1 className="admin-page-title">Configuración de IA</h1>
        <div className="loading">Cargando configuración...</div>
      </div>
    );
  }

  return (
    <div className="admin-page ai-settings">
      <div className="page-header">
        <h1 className="admin-page-title">
          <FaRobot />
          Configuración de IA y Búsqueda
        </h1>
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="admin-button primary"
        >
          <FaSave />
          {saveMutation.isPending ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="stats-section">
          <h2>Estadísticas del Sistema</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <FaChartLine className="stat-icon" />
              <div>
                <span className="stat-number">{stats.knowledgeBaseSize}</span>
                <span className="stat-label">Items en Base de Conocimiento</span>
              </div>
            </div>
            <div className="stat-card">
              <FaBrain className="stat-icon" />
              <div>
                <span className="stat-number">{stats.indexedContent}</span>
                <span className="stat-label">Tokens Indexados</span>
              </div>
            </div>
            <div className="stat-card">
              <FaRobot className="stat-icon" />
              <div>
                <span className={`stat-status ${stats.isOpenAIEnabled ? 'enabled' : 'disabled'}`}>
                  {stats.isOpenAIEnabled ? 'Activo' : 'Inactivo'}
                </span>
                <span className="stat-label">Estado OpenAI</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="settings-content">
        {/* Configuración OpenAI */}
        <section className="settings-section">
          <h2>
            <FaKey />
            Configuración OpenAI
          </h2>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={config.openai.enabled}
                onChange={(e) => setConfig({
                  ...config,
                  openai: { ...config.openai, enabled: e.target.checked }
                })}
              />
              Habilitar OpenAI ChatGPT
            </label>
          </div>

          <div className="form-group">
            <label>API Key de OpenAI</label>
            <input
              type="password"
              value={config.openai.apiKey}
              onChange={(e) => setConfig({
                ...config,
                openai: { ...config.openai, apiKey: e.target.value }
              })}
              placeholder="sk-..."
              disabled={!config.openai.enabled}
            />
            <small>
              Obtén tu API key en{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                OpenAI Platform
              </a>
            </small>
          </div>

          <div className="form-group">
            <label>Modelo</label>
            <select
              value={config.openai.model}
              onChange={(e) => setConfig({
                ...config,
                openai: { ...config.openai, model: e.target.value }
              })}
              disabled={!config.openai.enabled}
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Económico)</option>
              <option value="gpt-4">GPT-4 (Más Potente)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo (Equilibrado)</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Temperatura ({config.openai.temperature})</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.openai.temperature}
                onChange={(e) => setConfig({
                  ...config,
                  openai: { ...config.openai, temperature: parseFloat(e.target.value) }
                })}
                disabled={!config.openai.enabled}
              />
              <small>Mayor = más creativo, Menor = más preciso</small>
            </div>

            <div className="form-group">
              <label>Tokens Máximos</label>
              <input
                type="number"
                min="100"
                max="4000"
                value={config.openai.maxTokens}
                onChange={(e) => setConfig({
                  ...config,
                  openai: { ...config.openai, maxTokens: parseInt(e.target.value) }
                })}
                disabled={!config.openai.enabled}
              />
              <small>Límite de palabras en la respuesta</small>
            </div>
          </div>
        </section>

        {/* Configuración Fallback */}
        <section className="settings-section">
          <h2>
            <FaBrain />
            Motor de Búsqueda Local
          </h2>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={config.fallback.enabled}
                onChange={(e) => setConfig({
                  ...config,
                  fallback: { ...config.fallback, enabled: e.target.checked }
                })}
              />
              Habilitar motor de búsqueda local (recomendado)
            </label>
            <small>
              Funciona cuando OpenAI no está disponible o falla
            </small>
          </div>

          <div className="form-group">
            <label>Umbral de Confianza ({config.fallback.confidence})</label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              value={config.fallback.confidence}
              onChange={(e) => setConfig({
                ...config,
                fallback: { ...config.fallback, confidence: parseFloat(e.target.value) }
              })}
              disabled={!config.fallback.enabled}
            />
            <small>Menor = más resultados, Mayor = más precisión</small>
          </div>
        </section>

        {/* Configuración del Sistema */}
        <section className="settings-section">
          <h2>
            <FaCog />
            Configuración del Sistema
          </h2>

          <div className="form-group">
            <label>Prompt del Sistema</label>
            <textarea
              rows={4}
              value={config.system.prompt}
              onChange={(e) => setConfig({
                ...config,
                system: { ...config.system, prompt: e.target.value }
              })}
              placeholder="Eres un asistente virtual especializado en..."
            />
            <small>Instrucciones base para la IA</small>
          </div>

          <div className="form-group">
            <label>Contexto Adicional</label>
            <textarea
              rows={3}
              value={config.system.context}
              onChange={(e) => setConfig({
                ...config,
                system: { ...config.system, context: e.target.value }
              })}
              placeholder="Información adicional sobre el sitio web..."
            />
          </div>

          <div className="form-group">
            <label>Idioma Principal</label>
            <select
              value={config.system.language}
              onChange={(e) => setConfig({
                ...config,
                system: { ...config.system, language: e.target.value }
              })}
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="pt">Portugués</option>
            </select>
          </div>
        </section>

        {/* Pruebas */}
        <section className="settings-section">
          <h2>Probar IA</h2>
          
          <div className="test-section">
            <div className="form-group">
              <label>Consulta de Prueba</label>
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Escribe una pregunta para probar..."
                onKeyPress={(e) => e.key === 'Enter' && testAI()}
              />
              <button
                onClick={testAI}
                disabled={isTestLoading || !testQuery.trim()}
                className="admin-button secondary"
              >
                {isTestLoading ? 'Procesando...' : 'Probar'}
              </button>
            </div>

            {testResult && (
              <div className="test-result">
                {testResult.error ? (
                  <div className="error">
                    <strong>Error:</strong> {testResult.error}
                  </div>
                ) : (
                  <div className="success">
                    <div className="result-header">
                      <strong>Respuesta ({testResult.source}):</strong>
                      <span className="confidence">
                        Confianza: {(testResult.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="answer">{testResult.answer}</div>
                    {testResult.processingTime && (
                      <small>Tiempo: {testResult.processingTime}ms</small>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}