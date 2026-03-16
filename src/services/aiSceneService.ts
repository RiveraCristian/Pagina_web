import type { SceneResponse } from "../types";
import { aiService } from "./aiService";

/**
 * Normaliza una cadena: minúsculas y sin acentos.
 */
function normalizeQuery(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Servicio integrado de IA que usa el nuevo sistema de OpenAI + fallback local
 * para determinar qué escena mostrar basándose en la consulta del usuario.
 */
export async function getSceneForQuery(query: string): Promise<SceneResponse> {
  console.log('🔍 Procesando consulta:', query);
  const qNorm = normalizeQuery(query);

  // ── Detección de intención temprana ──────────────────────────────────────
  // Proyectos: devolver todos los proyectos sin pasar por la pipeline de IA.
  if (
    qNorm.includes('proyecto') ||
    qNorm.includes('portafolio') ||
    qNorm.includes('portfolio') ||
    qNorm.includes('trabajos') ||
    qNorm.includes('trabajo')
  ) {
    console.log('🗂️ Consulta sobre proyectos detectada temprano');
    return buildProjectsScene();
  }

  // Sobre nosotros: servir el contenido estructurado directamente.
  if (
    qNorm.includes('quienes') ||
    qNorm.includes('quien') ||
    qNorm.includes('nosotros') ||
    qNorm.includes('colabi') ||
    qNorm.includes('empresa') ||
    qNorm.includes('consultora') ||
    qNorm.includes('sobre ustedes') ||
    qNorm.includes('acerca')
  ) {
    console.log('🏢 Consulta sobre empresa detectada temprano');
    return buildAboutUsScene(query);
  }
  // ─────────────────────────────────────────────────────────────────────────

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
 * Construye una escena con todos los proyectos disponibles en el índice.
 */
function buildProjectsScene(): SceneResponse {
  const projectIds: string[] = [];

  try {
    const searchEngine = (window as any).searchEngine;
    if (searchEngine) {
      // Buscar items indexados como proyectos por categoryId o categoria
      const allContent: any[] = searchEngine.getAllContent?.() || [];
      allContent.forEach((item: any) => {
        // Items with categoryId='proyectos' (from proyectos.json)
        // OR items without categoryId but with categoria (catalog Projects)
        const isProject = item.categoryId !== undefined
          ? item.categoryId === 'proyectos'
          : item.categoria !== undefined;
        if (isProject) {
          const id = item.id;
          if (id && !projectIds.includes(id)) {
            projectIds.push(id);
          }
        }
      });
    }
  } catch (e) {
    console.warn('⚠️ No se pudo acceder al índice de proyectos:', e);
  }

  // Fallback al ID conocido si no se encontró nada dinámicamente
  if (projectIds.length === 0) {
    projectIds.push('1763743145668-fmoy9ms');
  }

  return {
    titulo: 'Nuestros Proyectos',
    subtitulo: 'Aquí encontrarás los proyectos que hemos desarrollado.',
    proyectos: projectIds.map(id => ({ id }))
  };
}

/**
 * Construye una escena con la información de "Quiénes Somos" desde el índice.
 */
function buildAboutUsScene(query: string): SceneResponse {
  try {
    const searchEngine = (window as any).searchEngine;
    if (searchEngine) {
      const results = searchEngine.search(query, { limit: 1, threshold: 0.1 });
      if (results.length === 0) {
        // Búsqueda amplia si la consulta específica no retorna nada
        const fallbackResults = searchEngine.search('nosotros empresa colabi', { limit: 1, threshold: 0.1 });
        if (fallbackResults.length > 0) {
          return extractAboutUsFromResult(fallbackResults[0]);
        }
      } else {
        return extractAboutUsFromResult(results[0]);
      }
    }
  } catch (e) {
    console.warn('⚠️ No se pudo buscar contenido de empresa:', e);
  }

  // Fallback genérico
  return {
    titulo: 'Acerca de Nosotros',
    subtitulo: 'Somos una consultora especializada en desarrollo tecnológico e innovación educativa.',
    proyectos: []
  };
}

/**
 * Extrae los campos de "nosotros" de un resultado del motor de búsqueda.
 */
function extractAboutUsFromResult(result: any): SceneResponse {
  const content = result.content;
  const data = content.data || content;

  const response: any = {
    titulo: data.titulo || 'Quiénes Somos',
    subtitulo: data.subtitulo || 'Información sobre nuestra empresa',
    contenido: [data.contenido_principal, data.contenido_secundario]
      .filter(Boolean)
      .join('\n\n'),
    proyectos: []
  };

  if (data.enlace_externo && data.texto_enlace) {
    response.enlaces = [{ url: data.enlace_externo, texto: data.texto_enlace }];
  }

  if (data.datos_contacto) {
    try {
      response.contacto =
        typeof data.datos_contacto === 'string'
          ? JSON.parse(data.datos_contacto)
          : data.datos_contacto;
    } catch {
      response.contacto = data.datos_contacto;
    }
  }

  return response;
}

/**
 * Parsear respuesta de IA para extraer información estructurada
 */
function parseAIResponse(aiAnswer: string, originalQuery: string): SceneResponse | null {
  try {
    console.log('🔍 Parseando respuesta de IA:', aiAnswer.substring(0, 200) + '...');

    // Si la IA indica que no encontró nada, dejar que getFallbackResponse lo maneje
    const answerLower = aiAnswer.toLowerCase();
    if (
      answerLower.includes('no pude encontrar') ||
      answerLower.includes('no encontré') ||
      answerLower.includes('no encontre') ||
      answerLower.includes('no tengo información') ||
      answerLower.includes('no tengo informacion') ||
      aiAnswer.trim().length < 20
    ) {
      console.log('⚠️ La IA no encontró resultados, usando fallback');
      return null;
    }

    if (aiAnswer && aiAnswer.length > 20) {
      // Para otras consultas, detectar proyectos en la respuesta
      const detectedProjects = detectProjectsFromResponse(aiAnswer);

      return {
        titulo: generateTitle(originalQuery, aiAnswer),
        subtitulo: aiAnswer,
        proyectos: detectedProjects.length > 0 ? detectedProjects.map(id => ({ id })) : []
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
  const responseLower = normalizeQuery(response);

  if (
    responseLower.includes('ciento') ||
    responseLower.includes('programacion') ||
    responseLower.includes('logica')
  ) {
    detectedIds.push('1763743145668-fmoy9ms');
  }

  return [...new Set(detectedIds)];
}

/**
 * Generar título basado en la consulta y respuesta
 */
function generateTitle(query: string, aiResponse: string): string {
  const qNorm = normalizeQuery(query);

  if (qNorm.includes('quien') || qNorm.includes('que es')) {
    return 'Información Solicitada';
  }

  if (qNorm.includes('como')) {
    return 'Guía Paso a Paso';
  }

  if (qNorm.includes('proyecto') || qNorm.includes('mostrar')) {
    return 'Proyectos Relevantes';
  }

  // Intentar extraer el tema principal de la respuesta
  const firstSentence = aiResponse.split('.')[0];
  if (firstSentence.length > 10 && firstSentence.length < 60) {
    return firstSentence;
  }

  return `Resultados para: ${query}`;
}

/**
 * Respuesta de fallback cuando la IA no funciona o no encontró resultados.
 * Usa normalización de acentos para cubrir variantes con/sin tilde.
 */
function getFallbackResponse(query: string): SceneResponse {
  const q = normalizeQuery(query);

  // Consultas sobre la empresa / nosotros
  if (
    q.includes('quien eres') ||
    q.includes('quienes son') ||
    q.includes('sobre ustedes') ||
    q.includes('cuentame de') ||
    q.includes('quienes somos') ||
    q.includes('nosotros') ||
    q.includes('colabi') ||
    q.includes('empresa') ||
    q.includes('consultora') ||
    q.includes('acerca')
  ) {
    console.log('🏢 Consulta sobre empresa en fallback');
    return buildAboutUsScene(query);
  }

  // Proyectos
  if (q.includes('proyecto') || q.includes('portafolio') || q.includes('portfolio') || q.includes('trabajos') || q.includes('trabajo')) {
    console.log('🗂️ Consulta sobre proyectos en fallback');
    return buildProjectsScene();
  }

  // Programación y lógica
  if (
    q.includes('programacion') ||
    q.includes('logica') ||
    q.includes('codigo') ||
    q.includes('aprender a programar')
  ) {
    return {
      titulo: 'Aprendizaje de Programación',
      subtitulo: 'Plataformas interactivas para desarrollar habilidades de programación y lógica computacional.',
      proyectos: [
        { id: '1763743145668-fmoy9ms', frase: 'Aprende lógica de programación de forma interactiva y práctica.' }
      ]
    };
  }

  if (q.includes('educacion') || q.includes('aprender') || q.includes('curso') || q.includes('formacion')) {
    return {
      titulo: 'Servicios Educativos',
      subtitulo: 'Contenido y recursos educativos disponibles en nuestro sitio.',
      proyectos: [
        { id: '1763743145668-fmoy9ms', frase: 'Proyecto Ciento-01' }
      ]
    };
  }

  if (q.includes('servicio') || q.includes('servicios') || q.includes('publico')) {
    return {
      titulo: 'Nuestros Servicios',
      subtitulo: 'Descubre los servicios que ofrecemos a nuestros clientes.',
      proyectos: []
    };
  }

  if (q.includes('negocio') || q.includes('ventas') || q.includes('analytics') || q.includes('dashboard')) {
    return {
      titulo: 'Soluciones Empresariales',
      subtitulo: 'Herramientas y servicios para optimizar procesos de negocio.',
      proyectos: []
    };
  }

  // Caso por defecto
  return {
    titulo: `Resultados para: ${query}`,
    subtitulo: 'No encontramos información específica para tu consulta. ¿Podrías reformular tu pregunta?',
    proyectos: []
  };
}
