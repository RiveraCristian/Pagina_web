import type { SceneResponse } from "../types";
import { aiService } from "./aiService";

/**
 * Servicio integrado de IA que usa el nuevo sistema de OpenAI + fallback local
 * para determinar qué escena mostrar basándose en la consulta del usuario.
 */
export async function getSceneForQuery(query: string): Promise<SceneResponse> {
  try {
    // Intentar usar el servicio de IA avanzado
    const aiResponse = await aiService.processQuery(query);
    
    // Parsear respuesta de IA para extraer información estructurada
    const parsedResponse = parseAIResponse(aiResponse.answer, query);
    
    if (parsedResponse) {
      console.log(`🤖 Respuesta generada por ${aiResponse.source} (confianza: ${(aiResponse.confidence * 100).toFixed(1)}%)`);
      return parsedResponse;
    }
  } catch (error) {
    console.warn('AI service failed, using fallback logic:', error);
  }

  // Fallback a lógica local si la IA falla
  return getFallbackResponse(query);
}

/**
 * Parsear respuesta de IA para extraer información estructurada
 */
function parseAIResponse(aiAnswer: string, originalQuery: string): SceneResponse | null {
  try {
    // La IA debería devolver información sobre proyectos relevantes
    // Intentar detectar proyectos mencionados en la respuesta
    const detectedProjects = detectProjectsFromResponse(aiAnswer);
    
    // Si encontramos proyectos específicos, crear escena
    if (detectedProjects.length > 0) {
      return {
        titulo: generateTitle(originalQuery, aiAnswer),
        subtitulo: aiAnswer.split('\n')[0] || aiAnswer.substring(0, 200) + '...',
        proyectos: detectedProjects.map(id => ({ id }))
      };
    }

    // Si no hay proyectos específicos pero hay una respuesta útil
    if (aiAnswer.length > 20) {
      return {
        titulo: `Respuesta a: ${originalQuery}`,
        subtitulo: aiAnswer,
        proyectos: suggestRelevantProjects(originalQuery)
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
  
  // Buscar menciones directas de IDs o nombres
  if (responseLower.includes('ciento') || responseLower.includes('programación') || responseLower.includes('lógica')) {
    detectedIds.push('ciento01');
  }
  
  if (responseLower.includes('observatorio') || responseLower.includes('maule') || responseLower.includes('datos')) {
    detectedIds.push('observatorio-maule');
  }
  
  if (responseLower.includes('educativa') || responseLower.includes('colegio') || responseLower.includes('estudiantes')) {
    detectedIds.push('plataforma-educativa');
  }
  
  if (responseLower.includes('dashboard') || responseLower.includes('analytics') || responseLower.includes('negocio')) {
    detectedIds.push('dashboard-analytics');
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

/**
 * Sugerir proyectos relevantes basado en keywords
 */
function suggestRelevantProjects(query: string): { id: string }[] {
  const queryLower = query.toLowerCase();
  const suggestions: { id: string }[] = [];
  
  if (queryLower.includes('programación') || queryLower.includes('código') || queryLower.includes('lógica')) {
    suggestions.push({ id: 'ciento01' });
  }
  
  if (queryLower.includes('datos') || queryLower.includes('visualización') || queryLower.includes('gobierno')) {
    suggestions.push({ id: 'observatorio-maule' });
  }
  
  if (queryLower.includes('educación') || queryLower.includes('colegio') || queryLower.includes('estudiantes')) {
    suggestions.push({ id: 'plataforma-educativa' });
  }
  
  if (queryLower.includes('empresa') || queryLower.includes('negocio') || queryLower.includes('analytics')) {
    suggestions.push({ id: 'dashboard-analytics' });
  }
  
  // Si no hay sugerencias específicas, mostrar algunos proyectos principales
  if (suggestions.length === 0) {
    return [
      { id: 'ciento01' },
      { id: 'observatorio-maule' }
    ];
  }
  
  return suggestions.slice(0, 3); // Máximo 3 proyectos sugeridos
}

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
    q.includes("que es udd") ||
    q.includes("qué es udd") ||
    q.includes("quienes somos") ||
    q.includes("quiénes somos") ||
    q.includes("sobre ustedes") ||
    q.includes("cuentame de") ||
    q.includes("cuéntame de")
  ) {
    return {
      titulo: "¿Quiénes Somos?",
      subtitulo: "Universidad del Desarrollo - Innovación y excelencia académica al servicio de Chile.",
      proyectos: [
        { 
          id: "quienes-somos",
          frase: "Somos una universidad comprometida con la formación de profesionales de excelencia, impulsando la innovación, el emprendimiento y el desarrollo del país."
        }
      ]
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

  if (q.includes("colegio") || q.includes("educación") || q.includes("educacion") || q.includes("escuela") || q.includes("estudiante")) {
    return {
      titulo: "Tecnología para el sector educativo",
      subtitulo: "Sistemas integrales que facilitan la gestión y comunicación en instituciones educativas.",
      proyectos: [
        { id: "ciento01" },
        { id: "plataforma-educativa" }
      ]
    };
  }

  if (q.includes("gobierno") || q.includes("público") || q.includes("publico") || q.includes("municipal")) {
    return {
      titulo: "Soluciones para el sector público",
      subtitulo: "Herramientas de visualización y gestión de datos para la toma de decisiones.",
      proyectos: [
        { id: "observatorio-maule" }
      ]
    };
  }

  if (q.includes("negocio") || q.includes("empresa") || q.includes("ventas") || q.includes("analytics") || q.includes("dashboard")) {
    return {
      titulo: "Inteligencia de negocios",
      subtitulo: "Dashboards y herramientas para optimizar tus procesos empresariales.",
      proyectos: [
        { id: "dashboard-analytics" }
      ]
    };
  }

  // Caso por defecto: mostrar proyectos principales
  return {
    titulo: "Proyectos Innovadores UDD",
    subtitulo: "Descubre algunos de nuestros proyectos tecnológicos y educativos.",
    proyectos: [
      { id: "ciento01" },
      { id: "observatorio-maule" },
      { id: "plataforma-educativa" }
    ]
  };
}
