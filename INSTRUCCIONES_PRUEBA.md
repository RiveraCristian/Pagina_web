# INSTRUCCIONES DE PRUEBA PASO A PASO

1. **Abrir la página principal:**
   Abre http://localhost:5173 en el navegador

2. **Abrir DevTools:**
   Presiona F12 para abrir las herramientas de desarrollador

3. **Ejecutar estas pruebas en la consola (una por una):**

## PASO 1: Verificar API
```javascript
fetch('/api/items/nosotros').then(r => r.json()).then(data => {
  console.log('📦 API Response:', data);
  console.log(`Encontrados: ${data.items?.length || 0} items`);
  if (data.items && data.items.length > 0) {
    console.log('Primer item:', data.items[0].data);
  }
});
```

## PASO 2: Esperar y verificar SearchEngine (después de 5 segundos)
```javascript
setTimeout(() => {
  if (window.searchEngine) {
    console.log('✅ SearchEngine disponible');
    console.log(`Tamaño del índice: ${window.searchEngine.getIndexSize()}`);
    
    const results = window.searchEngine.search('nosotros', { limit: 5, threshold: 0.0 });
    console.log(`Resultados de búsqueda: ${results.length}`);
    results.forEach((r, i) => {
      console.log(`${i+1}. Score: ${r.score.toFixed(3)}`);
      console.log(`   Content:`, r.content);
    });
  } else {
    console.log('❌ SearchEngine no disponible');
  }
}, 5000);
```

## PASO 3: Probar AI Service
```javascript
setTimeout(async () => {
  if (window.aiService) {
    console.log('✅ AI Service disponible');
    try {
      const response = await window.aiService.processQuery('quienes son');
      console.log('🤖 Respuesta AI:');
      console.log(`Source: ${response.source}`);
      console.log(`Confidence: ${(response.confidence * 100).toFixed(1)}%`);
      console.log(`Answer: ${response.answer}`);
    } catch (error) {
      console.error('Error en AI:', error);
    }
  } else {
    console.log('❌ AI Service no disponible');
  }
}, 7000);
```

## PASO 4: Probar búsqueda completa en la interfaz
1. Haz clic en el logo de Colabi
2. Escribe "quienes son" en el campo de búsqueda
3. Presiona Enter
4. Observa los logs en la consola

## Logs esperados:
- Deberías ver logs de carga de categorías
- Logs de inicialización del AI Service
- Una prueba automática post-inicialización
- Los logs detallados que agregamos al aiSceneService

Si algún paso falla, copia el error exacto y continúa con el siguiente.