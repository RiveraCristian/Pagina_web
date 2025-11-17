# 🎨 Framework Auto-Gestionable - Admin Panel

Panel de administración integrado para gestionar contenido sin tocar código.

## 🚀 Inicio Rápido

### 1. Instalación
```bash
# Clonar el repositorio
git clone <tu-repo>
cd Pagina_web

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### 2. Acceder al Admin Panel

**URL:** http://localhost:5173/admin

El panel de administración está disponible en `/admin` mientras el servidor de desarrollo está corriendo.

## 📁 Estructura del Proyecto

```
src/
├── admin/                 # Panel de administración
│   ├── pages/            # Páginas del admin
│   │   ├── Dashboard.tsx     # Panel principal con estadísticas
│   │   └── Settings.tsx      # Configuración general
│   ├── components/       # Componentes reutilizables
│   ├── styles/          # Estilos del admin
│   ├── utils/           # Utilidades (FileManager)
│   ├── AdminApp.tsx     # App del admin con routing
│   └── AdminLayout.tsx  # Layout principal
├── data/                # Contenido del sitio (JSON)
│   ├── config.json      # Configuración general
│   ├── theme.json       # Tema visual
│   ├── categories.json  # Definición de categorías
│   └── items/          # Contenido por categoría
│       └── proyectos.json
├── types/
│   └── schema.ts       # Tipos TypeScript
└── main.tsx            # Punto de entrada (rutas admin/público)
```

## 🎯 Características Implementadas

### ✅ Dashboard
- **Estadísticas en tiempo real:**
  - Total de categorías
  - Total de items
  - Items por estado (publicados, borradores, archivados)
- **Actividad reciente:** Últimos 10 items modificados
- **Acciones rápidas:** Links a las secciones principales

### ✅ Configuración General
- **Información del sitio:** Nombre, tagline, URL
- **SEO:** Título, descripción, keywords
- **Características:** Búsqueda por voz, modo oscuro, PWA
- **Búsqueda:** Placeholder, resultados máximos
- **Admin:** Habilitar/deshabilitar panel, ruta personalizada

### ✅ Sistema de Archivos
- **FileManager utility:** CRUD completo para todos los datos
- **API en desarrollo:** Endpoints REST via Vite plugin
- **Sin base de datos:** Todo en archivos JSON versionables

## 🛠️ Tecnologías del Admin

- **React Router DOM 6:** Navegación entre páginas
- **TanStack Query 5:** Gestión de estado asíncrono
- **React Hook Form 7:** Manejo de formularios
- **Zod 3:** Validación de esquemas
- **React Icons:** Iconografía
- **React Colorful:** Selector de colores (para editor de diseño)

## 📝 Datos y Configuración

### config.json
Configuración global del sitio:
```json
{
  "site": { "name": "UDD", "tagline": "...", "url": "..." },
  "seo": { "title": "...", "description": "...", "keywords": "..." },
  "features": { "voiceSearch": true, "darkMode": true, "pwa": true },
  "search": { "placeholder": "...", "maxResults": 10 },
  "admin": { "enabled": true, "path": "/admin" }
}
```

### theme.json
Tema visual con tokens de diseño:
```json
{
  "mode": "dark",
  "colors": { "primary": "#00ff88", "background": "#0a0a0f", ... },
  "typography": { "fontFamily": "...", "sizes": {...}, "weights": {...} },
  "spacing": { "xs": "0.25rem", ... },
  "borderRadius": { "sm": "0.25rem", ... },
  "effects": { "particles": true, "animations": true, "blur": true },
  "logo": { "path": "...", "width": "...", "height": "..." }
}
```

### categories.json
Definición de categorías con esquemas de campos dinámicos:
```json
{
  "categories": [
    {
      "id": "proyectos",
      "name": "Proyectos",
      "description": "...",
      "icon": "FaLaptopCode",
      "fields": [
        {
          "id": "titulo",
          "label": "Título",
          "type": "text",
          "required": true,
          "searchable": true,
          "validation": { "maxLength": 100 }
        },
        // ... más campos
      ]
    }
  ]
}
```

### items/{categoryId}.json
Contenido de cada categoría:
```json
{
  "items": [
    {
      "id": "unique-id",
      "categoryId": "proyectos",
      "status": "published",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "data": {
        "titulo": "Mi Proyecto",
        "descripcion": "...",
        // ... campos dinámicos según category.fields
      }
    }
  ]
}
```

## 🔌 API Endpoints (Desarrollo)

El Vite plugin provee estos endpoints durante `npm run dev`:

- `GET /api/config` - Leer configuración
- `POST /api/save-config` - Guardar configuración
- `GET /api/theme` - Leer tema
- `POST /api/save-theme` - Guardar tema
- `GET /api/categories` - Leer categorías
- `POST /api/save-categories` - Guardar categorías
- `GET /api/items/:categoryId` - Leer items de una categoría
- `POST /api/save-items/:categoryId` - Guardar items
- `POST /api/upload-image` - Subir imagen (multipart/form-data)
- `POST /api/delete-image` - Eliminar imagen

## 🎨 Navegación del Admin

```
/admin                           # Dashboard principal
/admin/settings                  # Configuración general
/admin/categories               # Gestión de categorías (pendiente)
/admin/categories/new           # Crear categoría (pendiente)
/admin/categories/:id/edit      # Editar categoría (pendiente)
/admin/items                    # Listado de items (pendiente)
/admin/items/:categoryId/new    # Crear item (pendiente)
/admin/items/:categoryId/:id/edit  # Editar item (pendiente)
/admin/design                   # Editor de diseño (pendiente)
```

## 🚧 Tareas Pendientes

- [ ] Gestión de Categorías (crear/editar/eliminar + Schema Builder)
- [ ] CRUD de Items (formularios dinámicos basados en fields)
- [ ] Editor de Diseño (color pickers, tipografía, espaciado)
- [ ] AuthGuard (protección con password)
- [ ] Adaptar frontend público para leer config/theme dinámicamente
- [ ] Componentes reutilizables (ColorPicker, ImageUpload, TagsInput, etc.)
- [ ] Script de migración de datos existentes
- [ ] Sistema de preview en tiempo real
- [ ] Validación completa con Zod en todos los formularios

## 🎯 Filosofía del Framework

Este framework permite que **cualquier persona** pueda:
1. Clonar el repositorio
2. Ejecutar `npm install` y `npm run dev`
3. Acceder a `/admin` y gestionar todo el contenido visualmente
4. Hacer commit de los cambios en JSON (versionable con Git)
5. Deployar estáticamente (Vercel, Netlify, GitHub Pages)

**Sin necesidad de:**
- Tocar código
- Conocimientos de programación
- Base de datos
- Backend server
- Configuración compleja

## 📦 Deployment

### Producción Estática
```bash
# Build optimizado
npm run build

# Los archivos JSON se compilan en el bundle
# Deploy la carpeta dist/ a cualquier hosting estático
```

### Vercel
```bash
vercel deploy
```

### Netlify
```bash
netlify deploy --prod
```

## 🤝 Contribuir

Este es un framework en desarrollo activo. Las próximas características incluyen:
- Editor visual de categorías con Schema Builder
- Formularios dinámicos para crear/editar items
- Editor de diseño con live preview
- Autenticación básica con password
- Sistema de preview iframe
- Migración de datos existentes

---

**Desarrollado con ❤️ usando React, TypeScript y Vite**
