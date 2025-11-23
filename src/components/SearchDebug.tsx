import React, { useState, useEffect } from 'react';
import { useAI } from '../hooks/useAI';

export function SearchDebug() {
  const [query, setQuery] = useState('quienes somos');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { query: aiQuery, isInitialized, error } = useAI();

  const handleSearch = async () => {
    if (!isInitialized) {
      alert('Motor de búsqueda no inicializado');
      return;
    }

    setLoading(true);
    try {
      const response = await aiQuery(query);
      setResult(response);
      console.log('🔍 Resultado de búsqueda:', response);
    } catch (err) {
      console.error('❌ Error en búsqueda:', err);
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-buscar al cargar si está inicializado
    if (isInitialized) {
      handleSearch();
    }
  }, [isInitialized]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '20px', borderRadius: '8px' }}>
      <h2>🔍 Debug Motor de Búsqueda</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Estado:</strong> {isInitialized ? '✅ Inicializado' : '⏳ Cargando...'}
        {error && <span style={{ color: 'red' }}> - Error: {error}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escribe tu búsqueda..."
          style={{ width: '300px', padding: '8px', marginRight: '10px' }}
        />
        <button onClick={handleSearch} disabled={loading || !isInitialized}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Resultado:</h3>
          {result.error ? (
            <div style={{ color: 'red' }}>Error: {result.error}</div>
          ) : (
            <div>
              <div><strong>Respuesta:</strong> {result.answer}</div>
              <div><strong>Fuente:</strong> {result.source}</div>
              <div><strong>Confianza:</strong> {(result.confidence * 100).toFixed(1)}%</div>
              {result.relatedContent && result.relatedContent.length > 0 && (
                <div>
                  <strong>Contenido relacionado:</strong>
                  <ul>
                    {result.relatedContent.map((content, idx) => (
                      <li key={idx}>
                        {content.data?.titulo || content.title || 'Sin título'} 
                        (Score: {content.score?.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <details style={{ marginTop: '10px' }}>
            <summary>JSON completo</summary>
            <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default SearchDebug;