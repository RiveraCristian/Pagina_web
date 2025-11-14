// Definición de tipos para el proyecto

export interface Project {
  id: string;
  categoria: string;        // ej: "seguros", "educacion", "sector_publico", etc.
  nombre: string;
  fraseDefault: string;
  imagenes: string[];       // rutas relativas a /public/img/...
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
}

export interface SceneResponseWithResolvedProjects {
  titulo: string;
  subtitulo: string;
  proyectos: ResolvedSceneProject[];
}
