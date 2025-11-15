import type { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: "ciento01",
    categoria: "educacion",
    subcategoria: "Programación",
    nombre: "Ciento01: Lógica de programación",
    fraseDefault: "Plataforma interactiva para aprender lógica de programación.",
    imagenes: ["/img/proyectos/ciento01.png"],
    tecnologias: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    duracion: "6 meses",
    equipo: ["Equipo UDD Ingeniería", "Estudiantes colaboradores"],
    tags: ["Educación", "Web", "Interactivo", "Programación"],
    links: {
      demo: "https://ciento01.udd.cl",
      documentacion: "https://docs.ciento01.udd.cl"
    },
    galeria: [
      "/img/proyectos/ciento01.png",
      "/img/proyectos/ciento01-2.png",
      "/img/proyectos/ciento01-3.png"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    testimonios: [
      {
        autor: "Ana Martínez",
        cargo: "Estudiante de Ingeniería",
        texto: "Ciento01 cambió completamente mi forma de aprender programación. Las lecciones interactivas son increíbles.",
        avatar: "👩‍🎓"
      },
      {
        autor: "Carlos López",
        cargo: "Profesor de Informática",
        texto: "Una herramienta excepcional para enseñar lógica de programación. Mis estudiantes están más motivados.",
        avatar: "👨‍🏫"
      }
    ],
    estadisticas: {
      usuarios: 2500,
      proyectos: 450,
      satisfaccion: 94
    }
  },
  {
    id: "observatorio-maule",
    categoria: "sector_publico",
    subcategoria: "Datos Territoriales",
    nombre: "Observatorio de datos territoriales",
    fraseDefault: "Visualización de datos para decisiones regionales.",
    imagenes: ["/img/proyectos/omed1.png"],
    tecnologias: ["Vue.js", "D3.js", "Python", "FastAPI", "MongoDB"],
    duracion: "1 año",
    equipo: ["UDD Data Lab", "Gobierno Regional del Maule"],
    tags: ["Datos", "Visualización", "Gobierno", "Analytics"],
    links: {
      website: "https://observatorio.maule.cl",
      documentacion: "https://docs.observatorio.maule.cl"
    },
    galeria: [
      "/img/proyectos/omed1.png",
      "/img/proyectos/omed2.png",
      "/img/proyectos/omed3.png"
    ],
    testimonios: [
      {
        autor: "Pablo Fuentes",
        cargo: "Gobernador Regional",
        texto: "El Observatorio nos permite tomar decisiones basadas en datos reales. Una herramienta fundamental.",
        avatar: "👔"
      }
    ],
    estadisticas: {
      usuarios: 1200,
      proyectos: 85,
      satisfaccion: 91
    }
  },
  {
    id: "plataforma-educativa",
    categoria: "educacion",
    subcategoria: "Gestión Académica",
    nombre: "Sistema de gestión educativa",
    fraseDefault: "Plataforma integral para colegios y centros educativos.",
    imagenes: ["/img/proyectos/edu1.png"],
    tecnologias: ["Next.js", "React", "Prisma", "PostgreSQL", "AWS"],
    duracion: "8 meses",
    equipo: ["UDD EdTech", "Consultores pedagógicos"],
    tags: ["Educación", "Gestión", "Cloud", "Mobile"],
    links: {
      demo: "https://demo.edusystem.udd.cl"
    },
    galeria: [
      "/img/proyectos/edu1.png",
      "/img/proyectos/edu2.png",
      "/img/proyectos/edu3.png"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    testimonios: [
      {
        autor: "María González",
        cargo: "Directora de Colegio",
        texto: "Transformó nuestra gestión académica. Todo es más eficiente y transparente.",
        avatar: "👩‍💼"
      }
    ],
    estadisticas: {
      usuarios: 5800,
      satisfaccion: 89
    }
  },
  {
    id: "dashboard-analytics",
    categoria: "negocios",
    subcategoria: "Business Intelligence",
    nombre: "Dashboard de análisis empresarial",
    fraseDefault: "Visualización de KPIs y métricas de negocio en tiempo real.",
    imagenes: ["/img/proyectos/analytics1.png"],
    tecnologias: ["React", "Chart.js", "GraphQL", "Redis", "Docker"],
    duracion: "4 meses",
    equipo: ["UDD Business Analytics", "Data Scientists"],
    tags: ["Analytics", "Dashboard", "Real-time", "BI"],
    links: {
      demo: "https://analytics-demo.udd.cl",
      repositorio: "https://github.com/udd/analytics-dashboard"
    },
    galeria: [
      "/img/proyectos/analytics1.png",
      "/img/proyectos/analytics2.png",
      "/img/proyectos/analytics3.png"
    ],
    testimonios: [
      {
        autor: "Roberto Silva",
        cargo: "CEO Tech Startup",
        texto: "Visualizar nuestros KPIs en tiempo real ha mejorado nuestra toma de decisiones un 300%.",
        avatar: "👨‍💼"
      }
    ],
    estadisticas: {
      usuarios: 850,
      proyectos: 120,
      satisfaccion: 96
    }
  },
  {
    id: "quienes-somos",
    categoria: "institucional",
    subcategoria: "Universidad",
    nombre: "Universidad del Desarrollo",
    fraseDefault: "Institución de educación superior comprometida con la excelencia académica y la innovación.",
    imagenes: ["/img/proyectos/udd-campus.png"],
    tecnologias: ["Innovación", "Educación", "Investigación"],
    tags: ["Educación Superior", "Innovación", "Investigación", "Emprendimiento"],
    links: {
      website: "https://www.udd.cl"
    },
    estadisticas: {
      usuarios: 15000,
      satisfaccion: 93
    }
  }
];
