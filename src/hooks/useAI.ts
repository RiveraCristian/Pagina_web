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
    if (autoInitialize && projects.length > 0 && !isInitialized) {
      initializeAI();
    }
  }, [projects, autoInitialize, isInitialized]);

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
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        // 2. Cargar todos los items de todas las categorías
        for (const category of categoriesData.categories) {
          try {
            const itemsResponse = await fetch(`/api/items/${category.id}`);
            const categoryItems = await itemsResponse.json();
            
            // Agregar todos los items de esta categoría
            knowledgeBase.push(...categoryItems);
            
            console.log(`✅ Loaded ${categoryItems.length} items from category "${category.name}"`);
          } catch (categoryError) {
            console.warn(`⚠️ Could not load items from category "${category.id}":`, categoryError);
            // Continuar con otras categorías
          }
        }
        
        // 3. También agregar proyectos legacy si existen
        if (projects && projects.length > 0) {
          knowledgeBase.push(...projects);
          console.log(`✅ Added ${projects.length} legacy projects`);
        }
        
        console.log(`🔍 Total knowledge base: ${knowledgeBase.length} items across ${categoriesData.categories.length} categories`);
        
      } catch (err) {
        console.error('Error loading knowledge base:', err);
        // Fallback a solo proyectos
        knowledgeBase = [...projects];
      }

      await aiService.initialize(aiConfig, knowledgeBase);
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