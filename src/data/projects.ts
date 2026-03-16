import type { Project } from '../types';

/**
 * Proyectos del sitio - edita este archivo para agregar, modificar o quitar proyectos.
 */
export const PROJECTS: Project[] = [
  {
    id: "ejemplo_demo_1",
    categoria: "demo",
    nombre: "Proyecto de Ejemplo",
    fraseDefault: "Este es un proyecto de ejemplo",
    imagenes: ["/img/placeholder.png"],
    tecnologias: ["React", "TypeScript", "Vite"],
    links: {
      demo: "https://ejemplo.com",
      repositorio: "https://github.com/ejemplo/proyecto"
    }
  },
  {
    id: "1763743145668-fmoy9ms",
    categoria: "educacion",
    nombre: "Ciento-01",
    fraseDefault: "Programación en papel - Una metodología innovadora para aprender lógica de programación",
    imagenes: ["/img/ciento01-placeholder.jpg"],
    tecnologias: ["Pedagogía", "Lógica", "Programación"],
    links: {
      demo: "https://ciento01.colabi.tech"
    },
    tags: ["Educación", "Programación", "Metodología"],
    estadisticas: {}
  }
];
