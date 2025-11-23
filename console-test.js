// Test rápido que puedes ejecutar en la consola del navegador
// Ve a http://localhost:5173 y abre las DevTools (F12)
// Luego pega este código en la consola:

console.log('🚀 Iniciando test de búsqueda completo...');

async function testCompleto() {
    console.log('\n=== 1. VERIFICAR APIs ===');
    
    // Test 1: API nosotros
    try {
        console.log('📡 Probando /api/items/nosotros...');
        const response = await fetch('/api/items/nosotros');
        const data = await response.json();
        console.log('✅ API Response:', data);
        
        if (data.items && data.items.length > 0) {
            console.log(`📦 Encontrados ${data.items.length} items en nosotros`);
            console.log('🔍 Primer item:', data.items[0]);
        } else {
            console.log('⚠️ No hay items en la categoría nosotros');
        }
    } catch (error) {
        console.error('❌ Error en API:', error);
    }
    
    console.log('\n=== 2. VERIFICAR SERVICIOS ===');
    
    // Test 2: SearchEngine
    if (window.searchEngine) {
        console.log('✅ window.searchEngine disponible');
        console.log(`📊 Tamaño del índice: ${window.searchEngine.getIndexSize()}`);
        
        const resultados = window.searchEngine.search('nosotros', { limit: 10, threshold: 0.0 });
        console.log(`🔍 Búsqueda "nosotros": ${resultados.length} resultados`);
        resultados.forEach((r, i) => {
            console.log(`  ${i+1}. Score: ${r.score.toFixed(3)} - Content:`, r.content);
        });
    } else {
        console.log('❌ window.searchEngine no disponible');
    }
    
    // Test 3: AI Service
    if (window.aiService) {
        console.log('✅ window.aiService disponible');
        try {
            const stats = window.aiService.getStats();
            console.log('📊 AI Stats:', stats);
            
            console.log('\n=== 3. TEST DE BÚSQUEDA IA ===');
            const respuesta = await window.aiService.processQuery('quienes son');
            console.log('🤖 Respuesta de IA:');
            console.log(`  Source: ${respuesta.source}`);
            console.log(`  Confidence: ${(respuesta.confidence * 100).toFixed(1)}%`);
            console.log(`  Answer: ${respuesta.answer}`);
            console.log(`  Related Content: ${respuesta.relatedContent?.length || 0} items`);
        } catch (error) {
            console.error('❌ Error en AI Service:', error);
        }
    } else {
        console.log('❌ window.aiService no disponible');
    }
    
    console.log('\n=== 4. TEST DE ESCENA COMPLETA ===');
    
    // Test 4: Intentar usar getSceneForQuery manualmente
    try {
        // Importar el módulo si es posible
        const aiSceneModule = await import('./src/services/aiSceneService.js');
        console.log('✅ Módulo aiSceneService cargado');
        
        const escena = await aiSceneModule.getSceneForQuery('quienes son');
        console.log('🎬 Resultado de getSceneForQuery:');
        console.log(escena);
    } catch (error) {
        console.log('⚠️ No se pudo importar aiSceneService:', error);
        console.log('💡 Esto es normal si los módulos no están expuestos para importación dinámica');
    }
    
    console.log('\n=== RESUMEN ===');
    console.log('Para probar la búsqueda completa, haz clic en el logo y busca "quienes son"');
    console.log('Observa la consola para ver todos los logs de debug que agregamos');
}

// Ejecutar el test
testCompleto().then(() => {
    console.log('✅ Test completo finalizado');
}).catch(error => {
    console.error('❌ Error en el test:', error);
});