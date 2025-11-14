import type { SceneResponse } from "../types";

/**
 * Servicio que simula una llamada a IA para determinar qué escena mostrar
 * basándose en la consulta del usuario.
 * 
 * En el futuro, esto se reemplazará por una llamada real a un backend/LLM.
 */
export async function getSceneForQuery(query: string): Promise<SceneResponse> {
  // Simulamos un pequeño delay para que parezca una llamada real
  await new Promise(resolve => setTimeout(resolve, 800));

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
