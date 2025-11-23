import type { SceneResponse } from "../types";
import { aiService } from "./aiService";

/**
 * Servicio integrado de IA que usa el nuevo sistema de OpenAI + fallback local
 * para determinar qué escena mostrar basándose en la consulta del usuario.
 */
export async function getSceneForQuery(query: string): Promise<SceneResponse> {
  console.log('🔍 Procesando consulta:', query);
  
  try {
    // Intentar usar el servicio de IA avanzado
    console.log('🚀 Llamando al servicio de IA...');
    const aiResponse = await aiService.processQuery(query);
    
    console.log('📋 Respuesta del AI Service:', {
      source: aiResponse.source,
      confidence: aiResponse.confidence,
      answerLength: aiResponse.answer.length,
      relatedContentCount: aiResponse.relatedContent?.length || 0
    });
    console.log('💬 Respuesta completa:', aiResponse.answer);
    
    // Parsear respuesta de IA para extraer información estructurada
    const parsedResponse = parseAIResponse(aiResponse.answer, query);
    
    if (parsedResponse) {
      console.log(`✅ Respuesta generada por ${aiResponse.source} (confianza: ${(aiResponse.confidence * 100).toFixed(1)}%)`);
      console.log('🎯 Respuesta final:', parsedResponse);
      return parsedResponse;
    } else {
      console.log('⚠️ No se pudo parsear la respuesta de IA, usando fallback');
    }
  } catch (error) {
    console.error('❌ AI service failed, using fallback logic:', error);
  }

  // Fallback a lógica local si la IA falla
  console.log('🔄 Usando lógica de fallback');
  const fallbackResponse = getFallbackResponse(query);
  console.log('🎯 Respuesta de fallback:', fallbackResponse);
  return fallbackResponse;
}

/**
 * Parsear respuesta de IA para extraer información estructurada
 */
function parseAIResponse(aiAnswer: string, originalQuery: string): SceneResponse | null {
  try {
    console.log('🔍 Parseando respuesta de IA:', aiAnswer.substring(0, 200) + '...');
    
    // Si la IA devolvió contenido específico, usarlo tal como es
    if (aiAnswer && aiAnswer.length > 20) {
      const queryLower = originalQuery.toLowerCase();
      
      // Para consultas sobre nosotros/empresa, buscar en contenido indexado
      if (queryLower.includes("quienes") || queryLower.includes("quien") || 
          queryLower.includes("nosotros") || queryLower.includes("colabi") || 
          queryLower.includes("empresa") || queryLower.includes("consultora")) {
        
        console.log('✅ Consulta sobre empresa detectada - buscando en contenido indexado');
        
        // Intentar buscar contenido estructurado primero
        try {
          const searchEngine = (window as any).searchEngine;
          if (searchEngine) {
            const results = searchEngine.search(originalQuery, { limit: 1, threshold: 0.3 });
            if (results.length > 0 && results[0].content) {
              const content = results[0].content;
              const data = content.data || content;
              
              if (data.titulo && data.contenido_principal) {
                console.log('✅ Contenido estructurado encontrado:', data.titulo);
                
                const response: any = {
                  titulo: data.titulo || "Acerca de Nosotros",
                  subtitulo: data.subtitulo || "Información sobre nuestra empresa",
                  contenido: data.contenido_principal + (data.contenido_secundario ? `\n\n${data.contenido_secundario}` : ''),
                  proyectos: []
                };
                
                // Agregar enlaces si están disponibles
                if (data.enlace_externo && data.texto_enlace) {
                  response.enlaces = [{
                    url: data.enlace_externo,
                    texto: data.texto_enlace
                  }];
                }
                
                // Agregar información de contacto si está disponible
                if (data.datos_contacto) {
                  try {
                    const contactoData = typeof data.datos_contacto === 'string' 
                      ? JSON.parse(data.datos_contacto) 
                      : data.datos_contacto;
                    response.contacto = contactoData;
                  } catch (e) {
                    response.contacto = data.datos_contacto;
                  }
                }
                
                return response;
              }
            }
          }
        } catch (error) {
          console.log('⚠️ Error buscando contenido estructurado:', error);
        }
        
        // Fallback a respuesta de IA si no se encuentra contenido estructurado
        return {
          titulo: generateTitle(originalQuery, aiAnswer),
          subtitulo: aiAnswer,
          proyectos: []
        };
      }
      
      // Para otras consultas, usar respuesta de IA pero NO sugerir proyectos inexistentes
      const detectedProjects = detectProjectsFromResponse(aiAnswer);
      
      return {
        titulo: generateTitle(originalQuery, aiAnswer),
        subtitulo: aiAnswer,
        proyectos: detectedProjects.length > 0 ? detectedProjects.map(id => ({ id })) : [] // NO sugerir proyectos si no se detectan
      };
    }

    return null;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return null;
  }
}

/**
 * Detectar proyectos mencionados en la respuesta de IA
 */
function detectProjectsFromResponse(response: string): string[] {
  const detectedIds: string[] = [];
  
  const responseLower = response.toLowerCase();
  
  // Buscar menciones directas de IDs o nombres con los IDs reales
  if (responseLower.includes('ciento') || responseLower.includes('programación') || responseLower.includes('lógica') || responseLower.includes('programacion')) {
    detectedIds.push('1763743145668-fmoy9ms'); // ID real del proyecto Ciento-01
  }
  
  if (responseLower.includes('ejemplo') || responseLower.includes('demo')) {
    detectedIds.push('ejemplo_demo_1'); // ID del proyecto de ejemplo
  }
  
  return [...new Set(detectedIds)]; // Remover duplicados
}

/**
 * Generar título basado en la consulta y respuesta
 */
function generateTitle(query: string, aiResponse: string): string {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('quién') || queryLower.includes('quien') || queryLower.includes('qué es')) {
    return 'Información Solicitada';
  }
  
  if (queryLower.includes('cómo') || queryLower.includes('como')) {
    return 'Guía Paso a Paso';
  }
  
  if (queryLower.includes('proyecto') || queryLower.includes('mostrar')) {
    return 'Proyectos Relevantes';
  }
  
  // Intentar extraer el tema principal de la respuesta
  const sentences = aiResponse.split('.')[0];
  if (sentences.length > 10 && sentences.length < 60) {
    return sentences;
  }
  
  return `Resultados para: ${query}`;
}

// Función eliminada: suggestRelevantProjects ya no se usa
// Las consultas sobre "nosotros" ahora devuelven respuestas directas sin proyectos

/**
 * Respuesta de fallback cuando la IA no funciona
 */
function getFallbackResponse(query: string): SceneResponse {
  const q = query.toLowerCase();

  // Respuesta a "¿Quién eres?" y variantes
  if (
    q.includes("quien eres") || 
    q.includes("quién eres") || 
    q.includes("quienes son") || 
    q.includes("quiénes son") ||
    q.includes("sobre ustedes") ||
    q.includes("cuentame de") ||
    q.includes("cuéntame de") ||
    q.includes("quienes somos") ||
    q.includes("quiénes somos") ||
    q.includes("nosotros") ||
    q.includes("colabi") ||
    q.includes("empresa") ||
    q.includes("consultora")
  ) {
    console.log('🏢 Consulta sobre empresa en fallback - intentando buscar contenido indexado');
    
    // Intentar buscar en el contenido indexado primero
    try {
      const searchEngine = (window as any).searchEngine;
      if (searchEngine) {
        const results = searchEngine.search(query, { limit: 1, threshold: 0.3 });
        if (results.length > 0 && results[0].content) {
          const content = results[0].content;
          const data = content.data || content;
          
          if (data.titulo && data.contenido_principal) {
            console.log('✅ Contenido encontrado en índice:', data.titulo);
            
            // Crear una respuesta más completa usando el contenido indexado
            let fullResponse = `**${data.titulo}**\n\n${data.contenido_principal}`;
            
            // Agregar contenido secundario si existe
            if (data.contenido_secundario) {
              fullResponse += `\n\n${data.contenido_secundario}`;
            }
            
            // Agregar enlace si existe
            if (data.enlace_externo && data.texto_enlace) {
              fullResponse += `\n\n[${data.texto_enlace}](${data.enlace_externo})`;
            }
            
            // Crear respuesta estructurada para la tarjeta corporativa
            const response: any = {
              titulo: data.titulo || "Acerca de Nosotros",
              subtitulo: data.subtitulo || "Información sobre nuestra empresa",
              contenido: data.contenido_principal + (data.contenido_secundario ? `\n\n${data.contenido_secundario}` : ''),
              proyectos: [] // No mostrar proyectos específicos para consultas sobre nosotros
            };
            
            // Agregar enlaces si están disponibles
            if (data.enlace_externo && data.texto_enlace) {
              response.enlaces = [{
                url: data.enlace_externo,
                texto: data.texto_enlace
              }];
            }
            
            // Agregar información de contacto si está disponible
            if (data.datos_contacto) {
              try {
                const contactoData = typeof data.datos_contacto === 'string' 
                  ? JSON.parse(data.datos_contacto) 
                  : data.datos_contacto;
                response.contacto = contactoData;
              } catch (e) {
                response.contacto = data.datos_contacto;
              }
            }
            
            return response;
          }
        }
      }
    } catch (error) {
      console.log('⚠️ No se pudo acceder al contenido indexado:', error);
    }
    
    // Fallback a respuesta por defecto
    return {
      titulo: "Acerca de Nosotros",
      subtitulo: "Somos una consultora especializada en desarrollo tecnológico. Para información más detallada, por favor verifica que el contenido esté correctamente configurado en el panel de administrador.",
      proyectos: [] // No mostrar proyectos específicos para consultas sobre nosotros
    };
  }

  // Programación y lógica
  if (
    q.includes("programación") || 
    q.includes("programacion") || 
    q.includes("lógica") ||
    q.includes("logica") ||
    q.includes("código") ||
    q.includes("codigo") ||
    q.includes("aprender a programar")
  ) {
    return {
      titulo: "Aprendizaje de Programación",
      subtitulo: "Plataformas interactivas para desarrollar habilidades de programación y lógica computacional.",
      proyectos: [
        { id: "ciento01", frase: "Aprende lógica de programación de forma interactiva y práctica." }
      ]
    };
  }

  if (q.includes("educación") || q.includes("educacion") || q.includes("aprender") || q.includes("curso") || q.includes("formación")) {
    return {
      titulo: "Servicios Educativos",
      subtitulo: "Contenido y recursos educativos disponibles en nuestro sitio.",
      proyectos: [
        { id: "ejemplo_demo_1" }
      ]
    };
  }

  if (q.includes("servicio") || q.includes("servicios") || q.includes("público") || q.includes("publico")) {
    return {
      titulo: "Nuestros Servicios",
      subtitulo: "Descubre los servicios que ofrecemos a nuestros clientes.",
      proyectos: [
        { id: "ejemplo_demo_1" }
      ]
    };
  }

  if (q.includes("negocio") || q.includes("empresa") || q.includes("ventas") || q.includes("analytics") || q.includes("dashboard")) {
    return {
      titulo: "Soluciones Empresariales",
      subtitulo: "Herramientas y servicios para optimizar procesos de negocio.",
      proyectos: [
        { id: "ejemplo_demo_1" }
      ]
    };
  }

  // Caso por defecto: mostrar contenido principal
  return {
    titulo: "Contenido Destacado",
    subtitulo: "Explora nuestro contenido y servicios disponibles.",
    proyectos: [
      { id: "ejemplo_demo_1" }
    ]
  };
}
