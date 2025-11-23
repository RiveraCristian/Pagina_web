/**
 * Versión simplificada del aiSceneService para debugging
 */

import { aiService } from './aiService';

export interface SceneResponse {
  titulo: string;
  subtitulo: string;
  contenido?: string;
  enlaces?: Array<{ url: string; texto: string }>;
  contacto?: any;
  proyectos: Array<{ id: string; frase?: string }>;
}

/**
 * VERSIÓN ULTRA SIMPLIFICADA - Solo para testing
 */
export async function getSceneForQuery(query: string): Promise<SceneResponse> {
  console.log('🔍 [SIMPLE] Procesando consulta:', query);
  
  const q = query.toLowerCase();
  
  // Respuestas hardcodeadas para testing
  if (q.includes('nosotros') || q.includes('quienes') || q.includes('colabi')) {
    console.log('✅ [SIMPLE] Detectada consulta sobre nosotros');
    return {
      titulo: "Quiénes Somos",
      subtitulo: "Información sobre Colabi",
      contenido: "Colabi es una consultora de desarrollo tecnológico y educación que impulsa la innovación a través de tecnología avanzada y diseño estratégico. Creamos soluciones a medida para empresas, instituciones y proyectos educativos.",
      enlaces: [{
        url: "https://colabi.tech/",
        texto: "Página Web"
      }],
      contacto: {
        telefono: "+56123456789"
      },
      proyectos: []
    };
  }
  
  if (q.includes('programacion') || q.includes('programación') || q.includes('ciento')) {
    console.log('✅ [SIMPLE] Detectada consulta sobre programación');
    return {
      titulo: "Proyectos de Programación",
      subtitulo: "Recursos para aprender programación",
      proyectos: [
        { id: "1763743145668-fmoy9ms", frase: "Aprende programación en papel" }
      ]
    };
  }
  
  if (q.includes('proyecto')) {
    console.log('✅ [SIMPLE] Detectada consulta general de proyectos');
    return {
      titulo: "Nuestros Proyectos",
      subtitulo: "Todos los proyectos disponibles",
      proyectos: [
        { id: "ejemplo_demo_1", frase: "Proyecto de demostración" },
        { id: "1763743145668-fmoy9ms", frase: "Proyecto Ciento-01" }
      ]
    };
  }
  
  // Fallback default
  console.log('⚠️ [SIMPLE] Sin coincidencias específicas, respuesta genérica');
  return {
    titulo: "Resultados para: " + query,
    subtitulo: "No encontramos información específica para tu consulta. ¿Podrías reformular tu pregunta?",
    proyectos: []
  };
}