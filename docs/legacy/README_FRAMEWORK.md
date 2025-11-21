# 🎤 VoiceSearch Framework - Sistema Self-Hosted

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Framework de contenido sin código con panel de administración integrado**

[Demo](#) • [Documentación](./FRAMEWORK_SELF_HOSTED.md) • [Guía de Uso](./USER_GUIDE.md)

</div>

---

## ✨ Características Principales

### 🎨 Panel de Administración Completo
- ✅ **Dashboard** con estadísticas en tiempo real
- ✅ **Schema Builder** para definir tipos de contenido personalizados
- ✅ **Gestión de Contenido** con formularios dinámicos
- ✅ **Editor Visual de Diseño** con selector de colores
- ✅ **Configuración Global** del sitio
- ✅ **22 tipos de campos** (text, textarea, select, boolean, image, etc.)

### 🚀 Sistema de Datos
- 📝 **Archivos JSON** versionables con Git
- 🔄 **Sin base de datos** - Todo en archivos
- 💾 **Script de migración** desde TypeScript a JSON
- 🔍 **Validación automática** con Zod
- ⚡ **Caché inteligente** con TanStack Query

### 🎯 Características del Sitio
- 🎤 **Búsqueda por voz** con IA
- 🔍 **Búsqueda por texto** con sanitización
- 🌓 **Modo oscuro/claro** automático
- ✨ **Partículas animadas** configurables
- 📱 **PWA ready** - Instalable como app
- ♿ **Accesible** (WCAG 2.1)
- 🚀 **Optimizado** (Lazy loading, code splitting)

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────┐
│              Sitio Público                      │
│  http://localhost:5173                          │
│  - Búsqueda por voz                             │
│  - Visualización de proyectos                   │
│  - Tema dinámico desde JSON                     │
└─────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│           Panel de Administración                │
│  http://localhost:5173/admin                     │
│  - Gestión de categorías y contenido            │
│  - Editor visual de diseño                       │
│  - Configuración global                          │
└─────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│              Sistema de Datos                    │
│  src/data/*.json                                 │
│  - config.json (configuración)                   │
│  - theme.json (tema visual)                      │
│  - categories.json (esquemas)                    │
│  - items/*.json (contenido)                      │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+ 
- npm 9+
- Git

### Instalación

```bash
# Clonar el repositorio
git clone <tu-repo-url>
cd Pagina_web

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Accesos

- **Sitio público**: http://localhost:5173
- **Admin panel**: http://localhost:5173/admin

---

## 📚 Guías de Uso

### Para Usuarios (No técnicos)

📖 **[Guía de Uso Completa](./USER_GUIDE.md)**

Aprende a:
- Crear categorías con el Schema Builder
- Gestionar contenido con formularios dinámicos
- Personalizar colores y diseño
- Configurar el sitio

### Para Desarrolladores

📘 **[Documentación Técnica](./FRAMEWORK_SELF_HOSTED.md)**

Detalles sobre:
- Arquitectura del sistema
- API del FileManager
- Estructura de archivos
- Extensión y personalización

---

## 🎨 Capturas de Pantalla

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Schema Builder
![Schema Builder](docs/screenshots/categories.png)

### Editor de Diseño
![Design Editor](docs/screenshots/design.png)

### Formularios Dinámicos
![Dynamic Forms](docs/screenshots/items.png)

---

## 📦 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.2.0 | Framework UI |
| TypeScript | 5.9.3 | Tipado estático |
| Vite | 7.2.2 | Build tool + Dev server |
| TanStack Query | 5.90.9 | Estado asíncrono |
| React Hook Form | 7.66.0 | Formularios |
| React Router | 7.9.6 | Navegación |
| Zod | 4.1.12 | Validación |
| React Colorful | 5.6.1 | Selector de colores |
| React Icons | 5.5.0 | Iconos |

---

## 📂 Estructura del Proyecto

```
Pagina_web/
├── src/
│   ├── admin/                    # Panel de administración
│   │   ├── pages/                # Páginas del admin
│   │   │   ├── Dashboard.tsx     # Dashboard principal
│   │   │   ├── Categories.tsx    # Lista de categorías
│   │   │   ├── CategoryForm.tsx  # Schema Builder
│   │   │   ├── Items.tsx         # Lista de items
│   │   │   ├── ItemForm.tsx      # Formularios dinámicos
│   │   │   ├── Design.tsx        # Editor de diseño
│   │   │   └── Settings.tsx      # Configuración
│   │   ├── styles/               # Estilos del admin
│   │   ├── utils/
│   │   │   └── fileManager.ts    # API de archivos
│   │   ├── AdminLayout.tsx       # Layout con sidebar
│   │   └── AdminApp.tsx          # Router del admin
│   ├── components/               # Componentes públicos
│   ├── hooks/                    # React hooks
│   │   ├── useAppConfig.ts       # Lee config.json
│   │   ├── useThemeConfig.ts     # Lee theme.json
│   │   └── useProjects.ts        # Lee items
│   ├── data/                     # Archivos JSON
│   │   ├── config.json           # Configuración
│   │   ├── theme.json            # Tema
│   │   ├── categories.json       # Categorías
│   │   └── items/                # Contenido
│   │       └── proyectos.json    # Items de proyectos
│   ├── types/
│   │   └── schema.ts             # Tipos TypeScript
│   ├── App.tsx                   # App principal
│   └── main.tsx                  # Entry point
├── scripts/
│   └── migrateData.ts            # Script de migración
├── vite-plugin-admin-api.ts      # Plugin API de Vite
├── FRAMEWORK_SELF_HOSTED.md      # Docs para devs
├── USER_GUIDE.md                 # Guía de uso
└── package.json
```

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Build
npm run build            # Compilar para producción
npm run preview          # Preview del build

# Utilidades
npm run migrate          # Migrar datos de TS a JSON
npm run lint             # Linter de código
```

---

## 🎯 Casos de Uso

### 1. Portfolio de Proyectos
- Categoría "Proyectos" con campos personalizados
- Galería de imágenes
- Tecnologías usadas
- Links a demo y código

### 2. Sitio de Testimonios
- Categoría "Testimonios" 
- Foto del cliente
- Texto del testimonio
- Empresa y cargo

### 3. Blog/Noticias
- Categoría "Artículos"
- Contenido enriquecido (Markdown/HTML)
- Categorización y tags
- Fechas de publicación

### 4. Catálogo de Productos
- Categoría "Productos"
- Precio, stock, categorías
- Múltiples imágenes
- Características y especificaciones

---

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel --prod
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Configuración

**Comando de build**: `npm run build`  
**Directorio de salida**: `dist`  
**Node version**: `18+`

---

## 🔐 Seguridad

### Estado Actual
- ⚠️ **Admin sin protección** - Solo para desarrollo local
- ✅ Sanitización de inputs
- ✅ Rate limiting
- ✅ Validación de datos

### Próximas Mejoras (v1.1)
- 🔐 Autenticación con password
- 🔑 JWT tokens
- 👥 Múltiples usuarios
- 📝 Logs de auditoría

**Para producción:** Usa nginx con autenticación básica mientras se implementa el sistema de auth.

```nginx
location /admin {
    auth_basic "Admin Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
    try_files $uri /index.html;
}
```

---

## 📊 Progreso del Proyecto

**Completado: 11/12 tareas (92%)**

- ✅ Estructura de datos JSON
- ✅ FileManager con CRUD completo
- ✅ Vite Plugin API
- ✅ Panel de administración
- ✅ Dashboard con estadísticas
- ✅ Gestión de categorías (Schema Builder)
- ✅ CRUD de items (formularios dinámicos)
- ✅ Editor visual de diseño
- ✅ Configuración global
- ✅ Script de migración
- ✅ Hooks para frontend dinámico
- ⏳ AuthGuard (pendiente)

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

### Guía de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Formato de código
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Mantenimiento

---

## 📝 Changelog

### [1.0.0] - 2025-11-15

#### Added
- Sistema completo de categorías con Schema Builder
- 22 tipos de campos disponibles
- Formularios dinámicos que se generan desde schemas
- Editor visual de diseño (5 tabs)
- Selector de colores con HexColorPicker
- Dashboard con estadísticas
- Script de migración de datos
- Hooks para carga dinámica de config/theme/items
- Sistema de archivos JSON versionable

#### Changed
- App.tsx ahora lee configuración desde JSON
- Tema se aplica dinámicamente via CSS variables
- Proyectos se cargan desde items/proyectos.json

#### Fixed
- Validación de formularios mejorada
- Manejo de errores en carga de archivos
- TypeScript strict mode compatible

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- [React](https://react.dev) - Framework UI
- [Vite](https://vitejs.dev) - Build tool increíble
- [TanStack Query](https://tanstack.com/query) - Estado asíncrono
- [React Hook Form](https://react-hook-form.com) - Formularios eficientes
- [React Colorful](https://github.com/omgovich/react-colorful) - Selector de colores
- Font Awesome - Iconos hermosos

---

## 📬 Contacto

**Proyecto**: VoiceSearch Framework  
**Repository**: https://github.com/RiveraCristian/Pagina_web

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub! ⭐**

Hecho con ❤️ por [Cristian Rivera](https://github.com/RiveraCristian)

</div>
