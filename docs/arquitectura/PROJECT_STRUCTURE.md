# 📁 Estructura del Proyecto - VoiceSearch Framework

## 🎯 Separación de Responsabilidades

```
src/
├── 🌐 FRONTEND PÚBLICO (Lo que ya existe - Sitio web visible)
│   ├── components/          → Componentes React del sitio público
│   ├── hooks/              → Custom hooks (useVoiceSearch, useTheme, etc.)
│   ├── utils/              → Utilidades (sanitize, cache, prefetch)
│   ├── styles/             → CSS del sitio público
│   ├── App.tsx             → Router y lógica principal del sitio
│   └── main.tsx            → Entry point de React
│
├── 🔧 PANEL ADMIN (Nuevo - Sistema de gestión)
│   ├── pages/              → Páginas del panel admin
│   ├── components/         → Componentes exclusivos del admin
│   ├── utils/              → Utilidades del admin (FileManager)
│   ├── styles/             → CSS del panel admin
│   └── AdminApp.tsx        → Router del panel admin
│
├── 📊 DATA (Nuevo - Configuración y contenido)
│   ├── config.json         → Configuración general del sitio
│   ├── theme.json          → Colores, fuentes, estilos
│   ├── categories.json     → Definición de categorías
│   ├── items/              → Contenido por categoría
│   │   ├── proyectos.json
│   │   ├── servicios.json
│   │   └── ...
│   └── templates/          → Plantillas de categorías
│
└── 🔤 TYPES (Nuevo - TypeScript definitions)
    └── schema.ts           → Tipos compartidos
```

---

## 📂 Estructura Detallada

### 🌐 Frontend Público (Actual)

```
src/
├── components/
│   ├── PromptBox.tsx              ✅ Caja de búsqueda por voz
│   ├── SceneView.tsx              ✅ Resultados de búsqueda
│   ├── ParticlesBackground.tsx    ✅ Animación de partículas
│   ├── LogoHero.tsx               ✅ Logo animado
│   ├── SearchAgainHint.tsx        ✅ Hint para nueva búsqueda
│   ├── SearchHistory.tsx          ✅ Historial de búsquedas
│   ├── EmptyState.tsx             ✅ Sin resultados
│   ├── BackToTopButton.tsx        ✅ Botón volver arriba
│   ├── KeyboardShortcutsHelp.tsx  ✅ Atajos de teclado
│   ├── ThemeToggle.tsx            ✅ Cambiar tema
│   ├── InstallPrompt.tsx          ✅ Instalar PWA
│   ├── LazyImage.tsx              ✅ Carga lazy de imágenes
│   ├── VirtualList.tsx            ✅ Virtual scrolling
│   ├── SkipLink.tsx               ✅ Accesibilidad
│   └── SearchTranscript.tsx       ✅ Transcripción de voz
│
├── hooks/
│   ├── useVoiceSearch.ts          ✅ Hook de búsqueda por voz
│   ├── useTheme.ts                ✅ Hook de tema
│   ├── useSwipeGesture.ts         ✅ Gestos táctiles
│   └── usePWA.ts                  ✅ PWA hooks
│
├── utils/
│   ├── sanitize.ts                ✅ XSS prevention
│   ├── cache.ts                   ✅ Cache manager
│   ├── prefetch.ts                ✅ Prefetch de recursos
│   └── search.ts                  ✅ Lógica de búsqueda
│
├── styles/
│   ├── App.css                    ✅ Estilos globales
│   ├── PromptBox.css              ✅ Estilos de búsqueda
│   ├── SceneView.css              ✅ Estilos de resultados
│   ├── LogoHero.css               ✅ Estilos del logo
│   ├── animations.css             ✅ Animaciones
│   ├── accessibility.css          ✅ Accesibilidad
│   └── ...                        ✅ Más estilos
│
├── App.tsx                        ✅ Componente principal
└── main.tsx                       ✅ Entry point
```

---

### 🔧 Panel Admin (Nuevo)

```
src/admin/
├── pages/
│   ├── Dashboard.tsx              🆕 Panel principal con stats
│   ├── Categories.tsx             🆕 Lista de categorías
│   ├── CategoryEdit.tsx           🆕 Editar/crear categoría
│   ├── Items.tsx                  🆕 Lista de items
│   ├── ItemEdit.tsx               🆕 Editar/crear item
│   ├── Design.tsx                 🆕 Editor de diseño
│   ├── Settings.tsx               🆕 Configuración general
│   └── Preview.tsx                🆕 Vista previa en tiempo real
│
├── components/
│   ├── Sidebar.tsx                🆕 Barra lateral de navegación
│   ├── Header.tsx                 🆕 Header con guardar/preview
│   ├── StatCard.tsx               🆕 Tarjetas de estadísticas
│   ├── CategoryBuilder.tsx        🆕 Constructor de categorías
│   ├── FieldBuilder.tsx           🆕 Constructor de campos
│   ├── ItemForm.tsx               🆕 Formulario dinámico
│   ├── FieldRenderer.tsx          🆕 Renderizador de campos
│   ├── ColorPicker.tsx            🆕 Selector de colores
│   ├── ImageUpload.tsx            🆕 Subir imágenes
│   ├── TagsInput.tsx              🆕 Input de tags
│   ├── JsonEditor.tsx             🆕 Editor JSON (Monaco)
│   ├── ThemePresets.tsx           🆕 Temas predefinidos
│   └── PreviewFrame.tsx           🆕 Iframe con preview
│
├── utils/
│   ├── fileManager.ts             🆕 CRUD de archivos JSON
│   ├── validation.ts              🆕 Validación Zod
│   └── storage.ts                 🆕 LocalStorage helpers
│
├── styles/
│   ├── AdminLayout.css            🆕 Layout del admin
│   ├── Dashboard.css              🆕 Estilos del dashboard
│   ├── Forms.css                  🆕 Estilos de formularios
│   └── Components.css             🆕 Componentes del admin
│
├── AdminLayout.tsx                🆕 Layout principal del admin
├── AdminApp.tsx                   🆕 Router del admin
└── AuthGuard.tsx                  🆕 Protección con contraseña
```

---

### 📊 Data (Nuevo - Archivos de Configuración)

```
src/data/
├── config.json                    🆕 Configuración del sitio
│   {
│     "site": { "name": "...", "url": "..." },
│     "seo": { "title": "...", "description": "..." },
│     "features": { "voiceSearch": true, ... },
│     "search": { "placeholder": "...", ... }
│   }
│
├── theme.json                     🆕 Tema visual
│   {
│     "mode": "dark",
│     "colors": { "primary": "#00ff88", ... },
│     "typography": { "fontFamily": "Inter", ... },
│     "effects": { "particles": true, ... }
│   }
│
├── categories.json                🆕 Definición de categorías
│   {
│     "categories": [
│       {
│         "id": "proyectos",
│         "name": "Proyectos",
│         "fields": [
│           { "name": "title", "type": "text", ... },
│           { "name": "description", "type": "textarea", ... }
│         ]
│       }
│     ]
│   }
│
├── items/                         🆕 Contenido de items
│   ├── proyectos.json            🆕 Items de "Proyectos"
│   │   {
│   │     "items": [
│   │       {
│   │         "id": "proyecto-1",
│   │         "data": { "title": "...", "description": "..." }
│   │       }
│   │     ]
│   │   }
│   │
│   ├── servicios.json            🆕 Items de "Servicios"
│   └── portfolio.json            🆕 Items de "Portfolio"
│
└── templates/                     🆕 Templates de categorías
    ├── projects.template.json    🆕 Template para proyectos
    ├── services.template.json    🆕 Template para servicios
    └── portfolio.template.json   🆕 Template para portfolio
```

---

### 🔤 Types (Nuevo - TypeScript)

```
src/types/
└── schema.ts                      🆕 Definiciones de tipos
    - ConfigSchema
    - ThemeSchema
    - CategorySchema
    - ItemSchema
    - FieldSchema
    - FieldType ('text' | 'textarea' | 'number' | ...)
```

---

## 🚀 Archivos de Configuración Root

```
├── vite-plugin-admin-api.ts       🆕 Plugin para API del admin
├── .env.example                   🆕 Variables de entorno
├── README.md                      🔄 Mejorar con nueva info
├── PROJECT_STRUCTURE.md           🆕 Este archivo
├── FRAMEWORK_SELF_HOSTED.md       🆕 Documentación técnica
├── ARQUITECTURA_MULTI_TENANT.md   ✅ Alternativa SaaS
└── MEJORAS_SUGERIDAS.md           ✅ Lista de mejoras
```

---

## 🎯 Flujo de Trabajo

### Desarrollo Local

```bash
npm run dev
# → Sitio público en http://localhost:5173
# → Panel admin en http://localhost:5173/admin
```

### Usuario edita en Admin Panel
```
1. Accede a /admin (con contraseña)
2. Edita colores, categorías, items
3. Click "Guardar" → Escribe archivos JSON
4. Vite HMR → Recarga automáticamente
5. Ve cambios en tiempo real
```

### Build para Producción
```bash
npm run build
# → Genera dist/ con todo estático
# → config.json "compilado" en el bundle
# → Deploy en Vercel/Netlify
```

---

## 📦 Dependencias Nuevas a Instalar

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",    // Estado async
    "react-hook-form": "^7.48.0",         // Formularios
    "zod": "^3.22.0",                     // Validación
    "@hookform/resolvers": "^3.3.0",      // Integración Zod
    "react-colorful": "^5.6.1"            // Color picker
  },
  "devDependencies": {
    "@monaco-editor/react": "^4.6.0"      // Editor JSON (opcional)
  }
}
```

---

## 🔄 Migración de Datos Actuales

### Antes (Actual)
```typescript
// src/data/projects.ts
export const projects = [
  { name: "Proyecto 1", description: "..." }
];
```

### Después (Nuevo)
```json
// src/data/items/proyectos.json
{
  "items": [
    {
      "id": "proyecto-1",
      "data": {
        "title": "Proyecto 1",
        "description": "..."
      }
    }
  ]
}
```

---

## 🎨 Separación Visual

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  🌐 FRONTEND PÚBLICO (localhost:5173)                  │
│  ─────────────────────────────────────                 │
│  • Sitio visible para usuarios finales                 │
│  • Búsqueda por voz                                    │
│  • Resultados de búsqueda                              │
│  • Todo lo que ya funciona                             │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                                                         │
│  🔧 PANEL ADMIN (localhost:5173/admin)                 │
│  ──────────────────────────────────                    │
│  • Solo accesible con contraseña                       │
│  • Editar categorías y contenido                       │
│  • Personalizar colores y diseño                       │
│  • Gestionar configuración                             │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                                                         │
│  📊 DATA (src/data/*.json)                             │
│  ───────────────────────                               │
│  • Archivos JSON editables                             │
│  • Versionados en Git                                  │
│  • Modificados desde el admin                          │
│  • Leídos por el frontend                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Estado Actual

```
✅ Estructura de carpetas creada
✅ Separación frontend/admin clara
⏳ Próximo: Crear archivos de configuración (config.json, theme.json, etc.)
⏳ Próximo: Implementar FileManager
⏳ Próximo: Crear Vite Plugin para API
```

---

**Actualizado**: Noviembre 2025  
**Estado**: En Desarrollo - Fase 1 (Estructura)
