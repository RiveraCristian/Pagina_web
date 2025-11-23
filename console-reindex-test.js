// SCRIPT DE TEST RÁPIDO - Ejecutar en la consola del navegador
// Abre http://localhost:5173 y pega este código en la consola

console.log('🚀 INICIANDO TEST DE REINICIALIZACIÓN...');

async function testCompleteFlow() {
    try {
        console.log('\n=== 1. VERIFICAR ESTADO ACTUAL ===');
        
        if (window.searchEngine) {
            console.log('✅ SearchEngine disponible');
            const currentResults = window.searchEngine.search('nosotros', { limit: 5, threshold: 0.0 });
            console.log(`📊 Búsqueda 'nosotros' ANTES: ${currentResults.length} resultados`);
            
            // Mostrar debug del índice actual
            const debugInfo = window.searchEngine.debugIndex();
            console.log('🔍 Estado actual del índice:', debugInfo);
        }
        
        console.log('\n=== 2. FORZAR REINICIALIZACIÓN ===');
        
        if (window.searchEngine && window.searchEngine.forceReindex) {
            const reindexedCount = await window.searchEngine.forceReindex();
            console.log(`✅ Reindexados ${reindexedCount} items`);
        }
        
        // Si hay función de reinicialización global también
        if (window.forceReindex) {
            await window.forceReindex();
        }
        
        console.log('\n=== 3. VERIFICAR DESPUÉS DE REINICIALIZACIÓN ===');
        
        if (window.searchEngine) {
            const newResults = window.searchEngine.search('nosotros', { limit: 5, threshold: 0.0 });
            console.log(`📊 Búsqueda 'nosotros' DESPUÉS: ${newResults.length} resultados`);
            
            if (newResults.length > 0) {
                console.log('🎉 ¡FUNCIONÓ! Resultados encontrados:');
                newResults.forEach((result, i) => {
                    const data = result.content.data || result.content;
                    console.log(`  ${i+1}. Score: ${result.score.toFixed(3)} - ${data.titulo || 'Sin título'}`);
                });
            } else {
                console.log('❌ Aún no funciona. Probando otras consultas...');
                
                // Probar otras búsquedas
                const testQueries = ['quienes', 'colabi', 'empresa', 'consultora'];
                for (const query of testQueries) {
                    const results = window.searchEngine.search(query, { limit: 2, threshold: 0.0 });
                    console.log(`  "${query}": ${results.length} resultados`);
                }
            }
            
            // Mostrar contenido indexado
            const debugInfo = window.searchEngine.debugIndex();
            console.log('🔍 Estado final del índice:', debugInfo);
        }
        
        console.log('\n=== 4. TEST CON AI SERVICE ===');
        
        if (window.aiService) {
            try {
                const aiResponse = await window.aiService.processQuery('nosotros');
                console.log('🤖 Respuesta AI Service:', {
                    source: aiResponse.source,
                    confidence: aiResponse.confidence,
                    answerLength: aiResponse.answer.length,
                    answer: aiResponse.answer.substring(0, 200) + '...'
                });
            } catch (error) {
                console.log('❌ Error en AI Service:', error);
            }
        }
        
        console.log('\n✅ TEST COMPLETADO');
        
    } catch (error) {
        console.error('❌ Error en el test:', error);
    }
}

// Esperar un poco para que la página cargue y luego ejecutar
setTimeout(testCompleteFlow, 3000);

console.log('⏳ Esperando 3 segundos para que cargue la página...');