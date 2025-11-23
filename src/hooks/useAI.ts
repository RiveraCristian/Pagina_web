/**
 * Hook para usar el servicio de IA desde componentes React
 */

import { useState, useEffect, useCallback } from 'react';
import { aiService, type AIResponse } from '../services/aiService';
import { useProjects } from './useProjects';

export interface UseAIOptions {
  autoInitialize?: boolean;
  enableFallback?: boolean;
}

export function useAI(options: UseAIOptions = {}) {
  const { autoInitialize = true, enableFallback = true } = options;
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { projects } = useProjects();

  // Inicializar el servicio cuando se cargan los datos
  useEffect(() => {
    // Cambiar condición: no requerir proyectos para inicializar
    // El sistema debe funcionar solo con contenido del admin panel
    if (autoInitialize && !isInitialized) {
      console.log('🚀 Initializing AI service (projects count:', projects.length, ')');
      initializeAI();
    }
  }, [projects, autoInitialize, isInitialized]);

  // Debug: verificar estado del searchEngine cuando se inicializa
  useEffect(() => {
    if (isInitialized) {
      console.log('🎯 AI Hook initialized - verifying searchEngine...');
      
      // Exponer función de debug global
      (window as any).testSearchNow = () => {
        console.log('🧪 MANUAL SEARCH TEST FROM HOOK:');
        const testResult = (window as any).searchEngine?.search('nosotros', { limit: 3, threshold: 0.0 }) || [];
        console.log(`  Results: ${testResult.length}`);
        testResult.forEach((r: any, i: number) => {
          console.log(`  ${i+1}. Score: ${r.score} - ${r.content?.data?.titulo || 'No title'}`);
        });
        return testResult;
      };
      
      // Hacer test inicial después de 3 segundos
      setTimeout(() => {
        console.log('🔍 AUTO TEST AFTER INITIALIZATION:');
        (window as any).testSearchNow();
      }, 3000);
    }
  }, [isInitialized]);

  // Escuchar eventos de reindexación
  useEffect(() => {
    const handleReindex = () => {
      console.log('🔄 Reindexing search engine...');
      if (isInitialized) {
        initializeAI();
      }
    };

    window.addEventListener('reindexSearch', handleReindex);
    return () => window.removeEventListener('reindexSearch', handleReindex);
  }, [isInitialized]);

  const initializeAI = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Cargar configuración desde el backend
      const configResponse = await fetch('/api/config');
      const configData = await configResponse.json();
      
      const aiConfig = configData.ai || {
        openai: {
          apiKey: '',
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          maxTokens: 500,
          enabled: false
        },
        fallback: {
          enabled: enableFallback,
          confidence: 0.3
        },
        system: {
          prompt: `Eres un asistente virtual especializado en ayudar con preguntas sobre proyectos y servicios.
                   Responde de manera clara, concisa y útil. Si no tienes información específica, di que no la tienes.`,
          context: configData.site?.description || '',
          language: 'es'
        }
      };

      // Preparar base de conocimiento - CARGAR TODAS LAS CATEGORÍAS
      let knowledgeBase: any[] = [];
      
      try {
        // 1. Cargar categorías
        const categoriesResponse = await fetch(`/api/categories?t=${Date.now()}`);
        const categoriesData = await categoriesResponse.json();
        
        // 2. Cargar todos los items de todas las categorías
        for (const category of categoriesData.categories) {
          try {
            console.log(`📁 Loading category: ${category.id} (${category.name})`);
            const itemsResponse = await fetch(`/api/items/${category.id}?t=${Date.now()}`);
            const categoryItems = await itemsResponse.json();
            console.log(`📦 Raw response for ${category.id}:`, categoryItems);
            
            // Agregar todos los items de esta categoría
            const items = categoryItems.items || [];
            console.log(`📋 Items array for ${category.id}:`, items);
            
            knowledgeBase.push(...items);
            
            if (items.length > 0) {
              console.log(`✅ ${category.name}: ${items.length} items loaded`);
              // Debug: mostrar primer item
              console.log(`🔍 First item from ${category.id}:`, items[0]);
            } else {
              console.log(`⚠️ No items found in ${category.id}`);
            }
          } catch (categoryError) {
            console.warn(`⚠️ Could not load items from category "${category.id}":`, categoryError);
            // Continuar con otras categorías
          }
        }
        
        // 3. También agregar proyectos legacy si existen
        if (projects && projects.length > 0) {
          knowledgeBase.push(...projects);
          console.log(`✅ Added ${projects.length} legacy projects`);
        } else {
          console.log(`📋 No legacy projects found - using only admin panel content`);
        }
        
        console.log(`🤖 AI initialized with ${knowledgeBase.length} items from ${categoriesData.categories.length} categories`);
        
        // Validar que tenemos contenido para indexar
        if (knowledgeBase.length === 0) {
          console.warn(`⚠️ WARNING: No content to index! This will cause search to fail.`);
        }
        
        // Debug: mostrar estructura completa de knowledgeBase
        console.log(`📊 KNOWLEDGE BASE STRUCTURE:`);
        knowledgeBase.forEach((item, idx) => {
          const data = item.data || item;
          console.log(`  ${idx}: ${JSON.stringify({
            categoryId: item.categoryId,
            status: item.status,
            titulo: data.titulo,
            hasData: !!item.data
          })}`);
        });
        
        // Debug: probar múltiples búsquedas directas
        setTimeout(() => {
          console.log(`🔍 === TESTING MULTIPLE SEARCH TERMS ===`);
          const testTerms = ['nosotros', 'quienes somos', 'colabi', 'tecnologia'];
          
          try {
            const searchEngine = (window as any).searchEngine;
            if (searchEngine) {
              console.log(`🔍 SearchEngine available, index size: ${searchEngine.getIndexSize()}`);
              
              testTerms.forEach(term => {
                console.log(`\n🔍 Testing "${term}":`);
                const testResults = searchEngine.search(term, { limit: 5, threshold: 0.0 });
                console.log(`  📊 Results: ${testResults.length} found`);
                testResults.forEach((result: any, i: number) => {
                  const data = result.content.data || result.content;
                  const title = data.titulo || data.title || data.nombre || 'Sin título';
                  console.log(`    ${i+1}. Score: ${result.score.toFixed(3)} - ${title}`);
                  console.log(`       Content preview: ${(data.contenido_principal || data.descripcion || 'Sin contenido').substring(0, 80)}...`);
                });
              });
              
              // Debug del índice completo
              console.log(`\n🔍 SearchEngine debug info:`);
              if (searchEngine.debugIndex) {
                console.log(searchEngine.debugIndex());
              }
              
            } else {
              console.error(`❌ SearchEngine not available on window`);
            }
          } catch (error) {
            console.error(`❌ Search test failed:`, error);
          }
        }, 2000);
        
      } catch (err) {
        console.error('Error loading knowledge base:', err);
        // Fallback a solo proyectos
        knowledgeBase = [...projects];
      }

      // Exponer searchEngine ANTES de inicializar AI (para debugging)
      const { searchEngine } = await import('../services/searchEngine');
      (window as any).searchEngine = searchEngine;
      
      await aiService.initialize(aiConfig, knowledgeBase);
      
      // Exponer aiService para debugging
      (window as any).aiService = aiService;
      
      // Exponer función de reinicialización para debugging
      (window as any).forceReindex = async () => {
        console.log('🔄 FORCING REINDEX...');
        await initializeAI();
        console.log('✅ Reindex complete');
      };
      
      // Exponer función de debug completo
      (window as any).debugFullSystem = async () => {
        console.log('🔍 === FULL SYSTEM DEBUG ===');
        
        try {
          // 1. Verificar categorías
          const categoriesResponse = await fetch('/api/categories');
          const categoriesData = await categoriesResponse.json();
          console.log('📁 Categorías disponibles:', categoriesData.categories.map((c: any) => c.id));
          
          // 2. Verificar contenido de nosotros
          const nosotrosResponse = await fetch('/api/items/nosotros');
          const nosotrosData = await nosotrosResponse.json();
          console.log('📋 Items en nosotros:', nosotrosData.items?.length || 0);
          if (nosotrosData.items?.length > 0) {
            console.log('📄 Primer item nosotros:', nosotrosData.items[0]);
          }
          
          // 3. Verificar SearchEngine
          const searchEngine = (window as any).searchEngine;
          if (searchEngine) {
            console.log('🔍 SearchEngine index size:', searchEngine.getIndexSize());
            const debugInfo = searchEngine.debugIndex();
            console.log('🔍 SearchEngine debug:', debugInfo);
            
            // Probar búsqueda
            const testResult = searchEngine.search('nosotros', { limit: 3, threshold: 0.0 });
            console.log('🎯 Test search "nosotros":', testResult.length, 'results');
            testResult.forEach((r: any, i: number) => {
              console.log(`   ${i+1}.`, r.content);
            });
          } else {
            console.log('❌ SearchEngine not available');
          }
          
          // 4. Verificar aiSceneService
          const aiSceneModule = await import('../services/aiSceneService');
          const sceneResult = await aiSceneModule.getSceneForQuery('nosotros');
          console.log('🤖 aiSceneService result:', sceneResult);
          
        } catch (error) {
          console.error('❌ Debug error:', error);
        }
      };
      
      // Prueba inmediata después de inicializar
      setTimeout(() => {
        console.log('🧪 PRUEBA POST-INICIALIZACIÓN:');
        try {
          const testResults = (window as any).searchEngine.search('nosotros quienes colabi', { 
            limit: 10, 
            threshold: 0.0 
          });
          console.log(`📊 Prueba de búsqueda completada: ${testResults.length} resultados encontrados`);
          testResults.forEach((result: any, i: number) => {
            const data = result.content.data || result.content;
            console.log(`  ${i+1}. Score: ${result.score.toFixed(3)} - Título: ${data.titulo || data.name || 'Sin título'}`);
            console.log(`      Contenido: ${(data.contenido_principal || data.descripcion || 'Sin contenido').substring(0, 100)}...`);
          });
        } catch (error) {
          console.error('❌ Error en prueba post-inicialización:', error);
        }
      }, 1000);
      
      setIsInitialized(true);
      
      console.log('✅ AI Service initialized with', knowledgeBase.length, 'items');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error initializing AI service';
      setError(errorMessage);
      console.error('Error initializing AI:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projects, enableFallback]);

  const query = useCallback(async (question: string, context?: any): Promise<AIResponse | null> => {
    if (!isInitialized) {
      throw new Error('AI service not initialized');
    }

    try {
      setError(null);
      return await aiService.processQuery(question, context);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error processing query';
      setError(errorMessage);
      console.error('AI Query error:', err);
      return null;
    }
  }, [isInitialized]);

  const getStats = useCallback(() => {
    return aiService.getStats();
  }, []);

  const updateConfig = useCallback(async (newConfig: any) => {
    try {
      setError(null);
      aiService.updateConfig(newConfig);
      
      // También guardar en el backend
      await fetch('/api/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ai: newConfig })
      });
      
      console.log('✅ AI Config updated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating config';
      setError(errorMessage);
      console.error('Error updating AI config:', err);
    }
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    query,
    getStats,
    updateConfig,
    reinitialize: initializeAI
  };
}