/**
 * Hook para usar el servicio de IA desde componentes React
 */

import { useState, useEffect, useCallback } from 'react';
import { aiService, type AIResponse } from '../services/aiService';
import { useProjects } from './useProjects';
import configData from '../data/config.json';
import nosotrosData from '../data/items/nosotros.json';
import proyectosData from '../data/items/proyectos.json';

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

  useEffect(() => {
    if (autoInitialize && !isInitialized) {
      initializeAI();
    }
  }, [projects, autoInitialize, isInitialized]);

  const initializeAI = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const aiConfig = (configData as any).ai || {
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
          context: (configData as any).site?.description || '',
          language: 'es'
        }
      };

      // Construir base de conocimiento desde los archivos JSON estáticos
      const knowledgeBase: any[] = [
        ...nosotrosData.items,
        ...proyectosData.items,
        // Agregar proyectos del catálogo si existen
        ...projects
      ];

      const { searchEngine } = await import('../services/searchEngine');
      (window as any).searchEngine = searchEngine;

      await aiService.initialize(aiConfig, knowledgeBase);

      setIsInitialized(true);
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

  const updateConfig = useCallback((newConfig: any) => {
    aiService.updateConfig(newConfig);
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