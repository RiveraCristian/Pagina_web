/**
 * Servicio de IA que integra ChatGPT con sistema de fallback inteligente
 * Incluye motor de búsqueda local con procesamiento de lenguaje natural
 */

import { searchEngine } from './searchEngine';

export interface AIConfig {
  openai: {
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
    enabled: boolean;
  };
  fallback: {
    enabled: boolean;
    confidence: number; // Umbral mínimo de confianza
  };
  system: {
    prompt: string;
    context: string;
    language: string;
  };
}

export interface AIResponse {
  answer: string;
  source: 'openai' | 'local';
  confidence: number;
  relatedContent?: any[];
  processingTime: number;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

class AIService {
  private config: AIConfig | null = null;
  private knowledgeBase: any[] = [];

  /**
   * Inicializar el servicio con configuración
   */
  async initialize(config: AIConfig, knowledgeBase: any[] = []) {
    this.config = config;
    this.knowledgeBase = knowledgeBase;
    
    console.log(`🤖 AI Service initializing with ${knowledgeBase.length} items...`);
    
    // Debug: mostrar items que se van a indexar
    knowledgeBase.forEach((item, idx) => {
      const data = item.data || item;
      console.log(`  Indexing ${idx}: categoryId=${item.categoryId}, status=${item.status}, titulo=${data.titulo || 'N/A'}`);
    });
    
    // Indexar contenido para búsqueda local
    console.log(`🔄 About to index ${knowledgeBase.length} items:`);
    knowledgeBase.forEach((item, i) => {
      console.log(`  ${i}: ${JSON.stringify({ categoryId: item.categoryId, status: item.status, hasData: !!item.data })}`);
    });
    
    searchEngine.indexContent(knowledgeBase);
    
    // Verificar que se indexó correctamente
    const indexSize = searchEngine.getIndexSize();
    console.log(`🤖 AI Service initialized - SearchEngine index size: ${indexSize}`);
    
    // Test inmediato de búsqueda
    setTimeout(() => {
      console.log(`🧪 IMMEDIATE SEARCH TEST:`);
      const testResult = searchEngine.search('nosotros', { limit: 3, threshold: 0.0 });
      console.log(`  - 'nosotros': ${testResult.length} results`);
      if (testResult.length > 0) {
        console.log(`  ✅ SearchEngine working! First result:`, testResult[0]);
      } else {
        console.log(`  ❌ SearchEngine not finding 'nosotros'`);
        console.log(`  Debug info:`, searchEngine.debugIndex());
      }
    }, 500);
    
    if (indexSize === 0) {
      console.error(`❌ WARNING: SearchEngine index is empty! This means content was not indexed properly.`);
    }
  }

  /**
   * Procesar consulta del usuario con IA
   */
  async processQuery(query: string, context?: any): Promise<AIResponse> {
    const startTime = Date.now();
    
    if (!this.config) {
      throw new Error('AI Service not initialized');
    }

    // Intentar OpenAI primero si está habilitado
    if (this.config.openai.enabled && this.config.openai.apiKey) {
      try {
        const openaiResponse = await this.queryOpenAI(query, context);
        return {
          ...openaiResponse,
          source: 'openai',
          processingTime: Date.now() - startTime
        };
      } catch (error) {
        console.warn('OpenAI failed, falling back to local search:', error);
      }
    }

    // Fallback a motor de búsqueda local
    if (this.config.fallback.enabled) {
      const localResponse = await this.queryLocal(query, context);
      return {
        ...localResponse,
        source: 'local',
        processingTime: Date.now() - startTime
      };
    }

    throw new Error('No AI service available');
  }

  /**
   * Consultar OpenAI ChatGPT
   */
  private async queryOpenAI(query: string, context?: any): Promise<AIResponse> {
    if (!this.config?.openai.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Buscar contenido relevante para contexto
    const relevantContent = searchEngine.search(query, { limit: 3 });
    
    // Construir prompt con contexto
    const systemPrompt = this.buildSystemPrompt(relevantContent, context);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.openai.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.openai.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: this.config.openai.temperature,
        max_tokens: this.config.openai.maxTokens
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI');
    }

    return {
      answer: data.choices[0].message.content || 'No se pudo generar respuesta',
      source: 'openai' as const,
      confidence: 0.9, // OpenAI generalmente tiene alta confianza
      relatedContent: relevantContent.map((r: any) => r.content),
      processingTime: 0, // Se calculará en processQuery
      tokens: {
        prompt: data.usage?.prompt_tokens || 0,
        completion: data.usage?.completion_tokens || 0,
        total: data.usage?.total_tokens || 0
      }
    };
  }

  /**
   * Motor de búsqueda local con IA básica
   */
  private async queryLocal(_query: string, _context?: any): Promise<AIResponse> {
    // Buscar contenido relevante
    const searchResults = searchEngine.search(_query, {
      limit: 5,
      threshold: 0.3 
    });

    if (searchResults.length === 0) {
      return {
        answer: 'Lo siento, no pude encontrar información relevante sobre tu consulta. ¿Podrías reformular tu pregunta?',
        confidence: 0.1,
        relatedContent: [],
        source: 'local' as const,
        processingTime: 0
      };
    }

    // Analizar tipo de consulta
    const queryType = this.analyzeQueryType(_query);
    
    // Generar respuesta basada en contenido encontrado
    const answer = this.generateLocalResponse(_query, searchResults, queryType);
    
    // Calcular confianza basada en relevancia del contenido
    const confidence = this.calculateConfidence(_query, searchResults);

    return {
      answer: answer || 'No se pudo generar respuesta',
      confidence,
      relatedContent: searchResults.map((r: any) => r.content),
      source: 'local' as const,
      processingTime: 0
    };
  }

  /**
   * Construir prompt del sistema para OpenAI
   */
  private buildSystemPrompt(relevantContent: any[], context?: any): string {
    let prompt = this.config?.system.prompt || `
      Eres un asistente virtual especializado en ayudar con preguntas sobre proyectos, servicios y contenido del sitio web.
      
      Responde de manera clara, concisa y útil. Si no tienes información específica, di que no la tienes.
    `;

    if (relevantContent.length > 0) {
      prompt += '\n\nContexto relevante:\n';
      relevantContent.forEach((content, index) => {
        prompt += `${index + 1}. ${JSON.stringify(content)}\n`;
      });
    }

    if (context) {
      prompt += `\n\nContexto adicional: ${JSON.stringify(context)}`;
    }

    return prompt;
  }

  /**
   * Analizar tipo de consulta
   */
  private analyzeQueryType(query: string): 'search' | 'question' | 'request' | 'greeting' {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('buscar') || lowerQuery.includes('encontrar') || lowerQuery.includes('mostrar')) {
      return 'search';
    }
    
    if (lowerQuery.includes('?') || lowerQuery.startsWith('qué') || lowerQuery.startsWith('cómo') || 
        lowerQuery.startsWith('cuál') || lowerQuery.startsWith('cuándo') || lowerQuery.startsWith('dónde')) {
      return 'question';
    }
    
    if (lowerQuery.includes('hola') || lowerQuery.includes('buenos') || lowerQuery.includes('saludos')) {
      return 'greeting';
    }
    
    return 'request';
  }

  /**
   * Generar respuesta local basada en contenido
   */
  private generateLocalResponse(_query: string, results: any[], queryType: string): string {
    if (queryType === 'greeting') {
      return '¡Hola! Soy el asistente virtual del sitio. ¿En qué puedo ayudarte hoy?';
    }

    if (results.length === 0) {
      return 'No encontré información específica sobre tu consulta. ¿Podrías ser más específico?';
    }

    let response = '';
    
    if (queryType === 'search') {
      response = 'Encontré el siguiente contenido relacionado:\n\n';
    } else {
      response = 'Basándome en la información disponible:\n\n';
    }

    // Tomar los mejores resultados
    const topResults = results.slice(0, 3);
    
    topResults.forEach((result) => {
      const content = result.content;
      
      // Manejar estructura de items con data anidada
      const data = content.data || content;
      
      // Extraer título
      const title = data.titulo || data.title || data.nombre || data.name || data.seccion;
      if (title) {
        response += `• **${title}**\n`;
      }
      
      // Extraer descripción/contenido
      const description = data.contenido_principal || data.descripcion || data.description || 
                         data.contenido || data.content || data.subtitulo;
      if (description) {
        // Limitar descripción a 200 caracteres
        const shortDesc = description.length > 200 ? 
          description.substring(0, 200) + '...' : description;
        response += `  ${shortDesc}\n`;
      }
      
      // Extraer enlace
      const link = data.enlace_externo || data.enlace || data.url || data.link;
      if (link && link !== '') {
        response += `  [${data.texto_enlace || 'Más información'}](${link})\n`;
      }
      response += '\n';
    });

    if (results.length > 3) {
      response += `Y ${results.length - 3} resultados más relacionados.`;
    }

    return response;
  }

  /**
   * Calcular confianza de la respuesta local
   */
  private calculateConfidence(_query: string, results: any[]): number {
    if (results.length === 0) return 0.1;
    
    // Confianza basada en número y relevancia de resultados
    const avgScore = results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length;
    const countFactor = Math.min(results.length / 5, 1); // Más resultados = más confianza
    
    return Math.min(avgScore * countFactor * 0.8, 0.9); // Máximo 90% para búsqueda local
  }

  /**
   * Obtener configuración actual
   */
  getConfig(): AIConfig | null {
    return this.config;
  }

  /**
   * Actualizar configuración
   */
  updateConfig(newConfig: Partial<AIConfig>) {
    if (this.config) {
      this.config = { ...this.config, ...newConfig };
    }
  }

  /**
   * Obtener estadísticas de uso
   */
  getStats() {
    return {
      knowledgeBaseSize: this.knowledgeBase.length,
      indexedContent: searchEngine.getIndexSize(),
      isOpenAIEnabled: this.config?.openai.enabled || false,
      isFallbackEnabled: this.config?.fallback.enabled || false
    };
  }
}

export const aiService = new AIService();