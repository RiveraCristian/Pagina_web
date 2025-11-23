// Definición de tipos para el proyecto

export interface Project {
  id: string;
  categoria: string;        // ej: "seguros", "educacion", "sector_publico", etc.
  nombre: string;
  fraseDefault: string;
  imagenes: string[];       // rutas relativas a /public/img/...
  // Nuevos campos para mejora #21
  tecnologias?: string[];   // ej: ["React", "TypeScript", "Node.js"]
  duracion?: string;        // ej: "3 meses", "1 año"
  equipo?: string[];        // ej: ["Juan Pérez", "María González"]
  links?: {
    demo?: string;
    repositorio?: string;
    documentacion?: string;
    website?: string;
  };
  // Mejora #22: Galería múltiple
  galeria?: string[];       // Imágenes adicionales para carousel
  // Mejora #23: Video
  videoUrl?: string;        // URL de YouTube/Vimeo
  // Mejora #24: Testimonios
  testimonios?: {
    autor: string;
    cargo?: string;
    texto: string;
    avatar?: string;
  }[];
  estadisticas?: {
    usuarios?: number;
    proyectos?: number;
    satisfaccion?: number;  // 0-100
  };
  // Mejora #26: Categorización detallada
  tags?: string[];          // ej: ["Web", "Mobile", "IA", "Dashboard"]
  subcategoria?: string;    // ej: "Gestión Académica", "Analytics"
}

export interface SceneProject {
  id: string;         // debe existir en PROJECTS
  frase?: string;     // opcional, si no viene usamos fraseDefault del catálogo
}

export interface SceneResponse {
  titulo: string;
  subtitulo: string;
  proyectos: SceneProject[];
}

export interface ResolvedSceneProject {
  id: string;
  nombre: string;
  frase: string;
  imagenes: string[];
  tecnologias?: string[];
  duracion?: string;
  equipo?: string[];
  links?: {
    demo?: string;
    repositorio?: string;
    documentacion?: string;
    website?: string;
  };
  galeria?: string[];
  videoUrl?: string;
  testimonios?: {
    autor: string;
    cargo?: string;
    texto: string;
    avatar?: string;
  }[];
  estadisticas?: {
    usuarios?: number;
    proyectos?: number;
    satisfaccion?: number;
  };
  tags?: string[];
  subcategoria?: string;
}

export interface SceneResponseWithResolvedProjects {
  titulo: string;
  subtitulo: string;
  contenido?: string; // Para contenido corporativo
  enlaces?: Array<{ url: string; texto: string }>; // Enlaces externos
  contacto?: any; // Información de contacto
  proyectos: ResolvedSceneProject[];
}
