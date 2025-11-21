# 🎨 VoiceSearch Framework - Self-Hosted

## 📋 Resumen Ejecutivo

Convertir la aplicación actual en un **framework open-source self-hosted** que cualquiera pueda:

1. ✅ **Clonar** el repositorio desde GitHub
2. ✅ **Instalar** con `npm install`
3. ✅ **Ejecutar** con `npm run dev`
4. ✅ **Acceder** a `localhost:5173` (sitio público) y `localhost:5173/admin` (panel)
5. ✅ **Configurar** todo desde el panel admin visual
6. ✅ **Deployar** en cualquier servidor (Vercel, Netlify, VPS)

**NO requiere backend complejo, base de datos externa ni configuración técnica avanzada.**

---

## 🎯 Filosofía del Framework

### Lo que ES:
- 📦 **Framework listo para usar** (como Gatsby, Hugo, Jekyll)
- 🎨 **Panel admin integrado** (como Strapi, Ghost)
- 📝 **Contenido en archivos** (JSON/YAML) versionables en Git
- 🚀 **Deploy simple** en cualquier hosting estático
- 🔓 **Open-source y customizable**

### Lo que NO ES:
- ❌ No es un SaaS (no hay multi-tenancy)
- ❌ No requiere servidor Node.js en producción
- ❌ No necesita PostgreSQL ni backend complejo
- ❌ No tiene cuentas de usuario ni billing

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

```yaml
Frontend Público:
  - React 18 + TypeScript
  - Vite
  - React Router
  - Todo lo actual (búsqueda por voz, partículas, etc.)

Panel Admin:
  - React 18 + TypeScript
  - React Hook Form + Zod
  - TanStack Query
  - Monaco Editor (para JSON/Markdown)
  - React Beautiful DnD (drag & drop)

Almacenamiento:
  - JSON files en /src/data/
  - localStorage para drafts
  - Git para versionado

Build:
  - Vite (SPA)
  - Output: HTML + JS + CSS estáticos
  - Deploy: Vercel, Netlify, GitHub Pages, cualquier CDN
```

### Estructura del Proyecto

```
voicesearch-framework/
├── public/
│   ├── logo.svg                    # Logo por defecto
│   └── favicon.ico
│
├── src/
│   ├── admin/                      # 🆕 Panel de administración
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Categories.tsx
│   │   │   ├── Items.tsx
│   │   │   ├── Design.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Preview.tsx
│   │   ├── components/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── CategoryBuilder.tsx
│   │   │   ├── ItemForm.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   └── JsonEditor.tsx
│   │   └── AdminLayout.tsx
│   │
│   ├── data/                       # 🆕 Datos configurables
│   │   ├── config.json             # Configuración general
│   │   ├── theme.json              # Colores y estilos
│   │   ├── categories.json         # Definición de categorías
│   │   ├── items/
│   │   │   ├── proyectos.json      # Items de "Proyectos"
│   │   │   ├── servicios.json      # Items de "Servicios"
│   │   │   └── portfolio.json
│   │   └── templates/              # Templates de categorías
│   │       ├── projects.template.json
│   │       ├── services.template.json
│   │       └── portfolio.template.json
│   │
│   ├── components/                 # Componentes actuales
│   │   ├── PromptBox.tsx
│   │   ├── SceneView.tsx
│   │   ├── ParticlesBackground.tsx
│   │   └── ...
│   │
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── App.tsx                     # Router principal
│   └── main.tsx
│
├── .env.example                    # Variables de entorno
├── README.md                       # Guía de instalación
├── CUSTOMIZATION.md                # Guía de personalización
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 📄 Archivos de Configuración

### 1. `src/data/config.json` - Configuración General

```json
{
  "site": {
    "name": "Universidad Del Desarrollo",
    "shortName": "UDD",
    "tagline": "Busca proyectos con tu voz",
    "description": "Explora proyectos estudiantiles usando búsqueda por voz impulsada por IA",
    "url": "https://proyectos.udd.cl",
    "language": "es",
    "timezone": "America/Santiago"
  },
  "seo": {
    "title": "UDD Proyectos - Búsqueda por Voz",
    "description": "Encuentra proyectos estudiantiles de la UDD con búsqueda por voz",
    "keywords": ["proyectos", "universidad", "búsqueda por voz", "UDD"],
    "ogImage": "/og-image.jpg",
    "twitterHandle": "@UDDChile"
  },
  "features": {
    "voiceSearch": true,
    "textSearch": true,
    "darkMode": true,
    "particles": true,
    "animations": true,
    "pwa": true,
    "analytics": false
  },
  "search": {
    "placeholder": "Busca proyectos, nombres, facultades...",
    "voiceButtonText": "Buscar con voz",
    "maxResults": 12,
    "fuzzySearch": true,
    "searchInFields": ["title", "description", "keywords", "faculty"]
  },
  "admin": {
    "enabled": true,
    "path": "/admin",
    "password": "admin123",  // ⚠️ Cambiar en producción
    "allowJsonEdit": true,
    "allowFileUpload": true
  }
}
```

### 2. `src/data/theme.json` - Tema Visual

```json
{
  "mode": "dark",
  "colors": {
    "primary": "#00ff88",
    "secondary": "#0d1b2a",
    "background": "#000814",
    "surface": "#1a1a2e",
    "text": "#ffffff",
    "textSecondary": "#a0a0a0",
    "accent": "#00ff88",
    "error": "#ff4444",
    "success": "#00ff88",
    "warning": "#ffaa00"
  },
  "typography": {
    "fontFamily": "Inter, system-ui, sans-serif",
    "headingFamily": "Poppins, sans-serif",
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
      "4xl": "3rem"
    }
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem"
  },
  "borderRadius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px",
    "full": "9999px"
  },
  "effects": {
    "particles": {
      "enabled": true,
      "count": 100,
      "color": "#00ff88",
      "speed": 0.5
    },
    "animations": {
      "level": "medium",  // "none" | "low" | "medium" | "high"
      "duration": "0.3s",
      "easing": "cubic-bezier(0.4, 0, 0.2, 1)"
    }
  },
  "logo": {
    "path": "/logo.svg",
    "width": 200,
    "height": 80
  }
}
```

### 3. `src/data/categories.json` - Definición de Categorías

```json
{
  "categories": [
    {
      "id": "proyectos",
      "name": "Proyectos",
      "slug": "proyectos",
      "icon": "FaLightbulb",
      "description": "Proyectos estudiantiles innovadores",
      "itemsFile": "items/proyectos.json",
      "searchWeight": 1.0,
      "fields": [
        {
          "id": "title",
          "name": "title",
          "label": "Título del Proyecto",
          "type": "text",
          "required": true,
          "searchable": true,
          "maxLength": 100,
          "placeholder": "Ej: Sistema de Riego Inteligente"
        },
        {
          "id": "description",
          "name": "description",
          "label": "Descripción",
          "type": "textarea",
          "required": true,
          "searchable": true,
          "maxLength": 500,
          "rows": 4
        },
        {
          "id": "faculty",
          "name": "faculty",
          "label": "Facultad",
          "type": "select",
          "required": true,
          "searchable": true,
          "options": [
            "Ingeniería",
            "Diseño",
            "Medicina",
            "Arquitectura",
            "Negocios",
            "Comunicación"
          ]
        },
        {
          "id": "year",
          "name": "year",
          "label": "Año",
          "type": "number",
          "required": false,
          "searchable": false,
          "min": 2000,
          "max": 2030
        },
        {
          "id": "image",
          "name": "image",
          "label": "Imagen Principal",
          "type": "image",
          "required": false,
          "searchable": false,
          "accept": "image/*",
          "maxSize": 5242880
        },
        {
          "id": "keywords",
          "name": "keywords",
          "label": "Palabras Clave",
          "type": "tags",
          "required": true,
          "searchable": true,
          "maxTags": 10,
          "placeholder": "Presiona Enter para agregar"
        },
        {
          "id": "url",
          "name": "url",
          "label": "Enlace (opcional)",
          "type": "url",
          "required": false,
          "searchable": false,
          "placeholder": "https://..."
        },
        {
          "id": "featured",
          "name": "featured",
          "label": "Destacado",
          "type": "boolean",
          "required": false,
          "searchable": false,
          "default": false
        }
      ]
    },
    {
      "id": "servicios",
      "name": "Servicios",
      "slug": "servicios",
      "icon": "FaBriefcase",
      "description": "Servicios ofrecidos",
      "itemsFile": "items/servicios.json",
      "searchWeight": 0.8,
      "fields": [
        {
          "id": "name",
          "name": "name",
          "label": "Nombre del Servicio",
          "type": "text",
          "required": true,
          "searchable": true,
          "maxLength": 100
        },
        {
          "id": "description",
          "name": "description",
          "label": "Descripción",
          "type": "textarea",
          "required": true,
          "searchable": true,
          "maxLength": 500
        },
        {
          "id": "price",
          "name": "price",
          "label": "Precio (USD)",
          "type": "number",
          "required": false,
          "searchable": false,
          "min": 0
        },
        {
          "id": "duration",
          "name": "duration",
          "label": "Duración",
          "type": "text",
          "required": false,
          "searchable": false,
          "placeholder": "Ej: 3 meses"
        },
        {
          "id": "keywords",
          "name": "keywords",
          "label": "Palabras Clave",
          "type": "tags",
          "required": true,
          "searchable": true
        }
      ]
    }
  ]
}
```

### 4. `src/data/items/proyectos.json` - Contenido de Items

```json
{
  "items": [
    {
      "id": "proyecto-1",
      "categoryId": "proyectos",
      "status": "published",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "data": {
        "title": "Sistema de Riego Inteligente",
        "description": "Proyecto IoT que utiliza sensores de humedad y clima para optimizar el uso de agua en cultivos agrícolas.",
        "faculty": "Ingeniería",
        "year": 2024,
        "image": "/images/projects/riego-inteligente.jpg",
        "keywords": ["iot", "agricultura", "sensores", "sostenibilidad", "arduino"],
        "url": "https://github.com/usuario/riego-inteligente",
        "featured": true
      }
    },
    {
      "id": "proyecto-2",
      "categoryId": "proyectos",
      "status": "published",
      "createdAt": "2023-11-20T14:30:00Z",
      "updatedAt": "2023-11-20T14:30:00Z",
      "data": {
        "title": "App de Movilidad Urbana",
        "description": "Aplicación móvil para optimizar rutas de transporte público en Santiago.",
        "faculty": "Diseño",
        "year": 2023,
        "image": "/images/projects/movilidad.jpg",
        "keywords": ["app", "transporte", "ux", "react native", "mapas"],
        "url": null,
        "featured": false
      }
    },
    {
      "id": "proyecto-3",
      "categoryId": "proyectos",
      "status": "draft",
      "createdAt": "2024-02-01T09:00:00Z",
      "updatedAt": "2024-02-05T16:00:00Z",
      "data": {
        "title": "Plataforma de Telemedicina",
        "description": "Sistema de consultas médicas remotas con IA para triaje.",
        "faculty": "Medicina",
        "year": 2024,
        "image": null,
        "keywords": ["salud", "telemedicina", "ia", "web", "pacientes"],
        "url": null,
        "featured": false
      }
    }
  ]
}
```

---

## 🎨 Panel de Administración

### Rutas del Admin

```typescript
// src/admin/routes.tsx
import { Routes, Route } from 'react-router-dom';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/:id" element={<CategoryEdit />} />
        <Route path="items" element={<Items />} />
        <Route path="items/:categoryId/new" element={<ItemCreate />} />
        <Route path="items/:categoryId/:id" element={<ItemEdit />} />
        <Route path="design" element={<Design />} />
        <Route path="settings" element={<Settings />} />
        <Route path="preview" element={<Preview />} />
      </Route>
    </Routes>
  );
}
```

### Interfaz del Panel Admin

```typescript
// src/admin/AdminLayout.tsx
import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  FaHome, FaFolder, FaFileAlt, FaPalette, 
  FaCog, FaEye, FaSave 
} from 'react-icons/fa';

export function AdminLayout() {
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    // Guardar cambios en archivos JSON
    saveAllChanges();
    setHasChanges(false);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>⚙️ Panel Admin</h2>
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/admin" end>
            <FaHome /> Dashboard
          </NavLink>
          <NavLink to="/admin/categories">
            <FaFolder /> Categorías
          </NavLink>
          <NavLink to="/admin/items">
            <FaFileAlt /> Contenido
          </NavLink>
          <NavLink to="/admin/design">
            <FaPalette /> Diseño
          </NavLink>
          <NavLink to="/admin/settings">
            <FaCog /> Configuración
          </NavLink>
        </nav>
        
        <div className="admin-footer">
          <button onClick={handleSave} disabled={!hasChanges}>
            <FaSave /> Guardar Cambios
          </button>
          <a href="/" target="_blank">
            <FaEye /> Ver Sitio
          </a>
        </div>
      </aside>

      {/* Content Area */}
      <main className="admin-content">
        <Outlet context={{ setHasChanges }} />
      </main>
    </div>
  );
}
```

### Sistema de Archivos (File Manager)

```typescript
// src/admin/utils/fileManager.ts
import configData from '@/data/config.json';
import themeData from '@/data/theme.json';
import categoriesData from '@/data/categories.json';

/**
 * Sistema de gestión de archivos JSON
 * En desarrollo: Lee/escribe archivos directamente
 * En producción: Genera archivos estáticos en build
 */
export class FileManager {
  // Leer configuración
  static async readConfig() {
    return configData;
  }

  // Guardar configuración
  static async saveConfig(data: any) {
    // En desarrollo: Usar Vite HMR + fs API
    if (import.meta.env.DEV) {
      await fetch('/api/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    
    // Actualizar en memoria para preview inmediato
    Object.assign(configData, data);
  }

  // Leer items de una categoría
  static async readItems(categoryId: string) {
    const module = await import(`@/data/items/${categoryId}.json`);
    return module.default.items;
  }

  // Guardar items
  static async saveItems(categoryId: string, items: any[]) {
    const data = { items };
    
    if (import.meta.env.DEV) {
      await fetch(`/api/save-items/${categoryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
  }

  // Subir imagen
  static async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });

    const { url } = await response.json();
    return url;
  }
}
```

### Server de Desarrollo (Vite Plugin)

```typescript
// vite-plugin-admin-api.ts
import { Plugin } from 'vite';
import fs from 'fs/promises';
import path from 'path';

/**
 * Plugin de Vite para el panel admin
 * Permite guardar archivos JSON durante desarrollo
 */
export function adminApiPlugin(): Plugin {
  return {
    name: 'admin-api',
    configureServer(server) {
      server.middlewares.use('/api/save-config', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const filePath = path.join(__dirname, 'src/data/config.json');
            
            await fs.writeFile(
              filePath,
              JSON.stringify(data, null, 2),
              'utf-8'
            );

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error.message }));
          }
        });
      });

      server.middlewares.use('/api/save-items/:categoryId', async (req, res) => {
        // Similar al anterior, guarda items por categoría
        // ...
      });

      server.middlewares.use('/api/upload-image', async (req, res) => {
        // Guardar imágenes en /public/images/
        // ...
      });
    }
  };
}

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { adminApiPlugin } from './vite-plugin-admin-api';

export default defineConfig({
  plugins: [react(), adminApiPlugin()],
  // ...
});
```

---

## 🎯 Páginas del Panel Admin

### Dashboard (Vista Principal)

```tsx
// src/admin/pages/Dashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileManager } from '../utils/fileManager';

export function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const categories = await FileManager.readCategories();
      const config = await FileManager.readConfig();
      
      let totalItems = 0;
      for (const cat of categories.categories) {
        const items = await FileManager.readItems(cat.id);
        totalItems += items.length;
      }

      return {
        totalCategories: categories.categories.length,
        totalItems,
        publishedItems: totalItems, // TODO: Filtrar por status
        siteName: config.site.name
      };
    }
  });

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Categorías</h3>
          <p className="stat-value">{stats?.totalCategories}</p>
        </div>
        
        <div className="stat-card">
          <h3>Items Totales</h3>
          <p className="stat-value">{stats?.totalItems}</p>
        </div>
        
        <div className="stat-card">
          <h3>Publicados</h3>
          <p className="stat-value">{stats?.publishedItems}</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <button onClick={() => navigate('/admin/items/proyectos/new')}>
          + Nuevo Proyecto
        </button>
        <button onClick={() => navigate('/admin/categories')}>
          ⚙️ Gestionar Categorías
        </button>
        <button onClick={() => navigate('/admin/design')}>
          🎨 Personalizar Diseño
        </button>
      </div>

      <div className="recent-items">
        <h2>Items Recientes</h2>
        {/* Listar últimos 5 items editados */}
      </div>
    </div>
  );
}
```

### Editor de Diseño

```tsx
// src/admin/pages/Design.tsx
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FileManager } from '../utils/fileManager';
import { HexColorPicker } from 'react-colorful';

export function Design() {
  const { data: theme, refetch } = useQuery({
    queryKey: ['theme'],
    queryFn: () => FileManager.readTheme()
  });

  const [colors, setColors] = useState(theme?.colors || {});
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const saveMutation = useMutation({
    mutationFn: (newTheme: any) => FileManager.saveTheme(newTheme),
    onSuccess: () => {
      refetch();
      alert('Tema guardado exitosamente');
    }
  });

  const handleSave = () => {
    saveMutation.mutate({
      ...theme,
      colors
    });
  };

  return (
    <div className="design-editor">
      <header>
        <h1>Diseño y Tema</h1>
        <button onClick={handleSave}>💾 Guardar Cambios</button>
      </header>

      <div className="design-layout">
        {/* Panel de Controles */}
        <aside className="design-controls">
          <section>
            <h2>Colores</h2>
            
            <div className="color-field">
              <label>Color Primario</label>
              <HexColorPicker
                color={colors.primary}
                onChange={(color) => setColors({ ...colors, primary: color })}
              />
              <input
                type="text"
                value={colors.primary}
                onChange={(e) => setColors({ ...colors, primary: e.target.value })}
              />
            </div>

            <div className="color-field">
              <label>Fondo</label>
              <HexColorPicker
                color={colors.background}
                onChange={(color) => setColors({ ...colors, background: color })}
              />
            </div>

            {/* Más campos de color... */}
          </section>

          <section>
            <h2>Temas Predefinidos</h2>
            <div className="theme-presets">
              <button onClick={() => applyPreset('neon-dark')}>
                Neon Dark
              </button>
              <button onClick={() => applyPreset('corporate')}>
                Corporativo
              </button>
              <button onClick={() => applyPreset('minimal-light')}>
                Minimal Light
              </button>
            </div>
          </section>

          <section>
            <h2>Logo</h2>
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
            {theme?.logo?.path && (
              <img src={theme.logo.path} alt="Logo" className="logo-preview" />
            )}
          </section>

          <section>
            <h2>Efectos</h2>
            <label>
              <input
                type="checkbox"
                checked={theme?.effects?.particles?.enabled}
                onChange={(e) => toggleParticles(e.target.checked)}
              />
              Partículas de fondo
            </label>
            
            <label>
              Nivel de animaciones
              <select
                value={theme?.effects?.animations?.level}
                onChange={(e) => setAnimationLevel(e.target.value)}
              >
                <option value="none">Ninguna</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </label>
          </section>
        </aside>

        {/* Vista Previa en Tiempo Real */}
        <div className="design-preview">
          <div className="preview-toolbar">
            <button
              className={previewMode === 'desktop' ? 'active' : ''}
              onClick={() => setPreviewMode('desktop')}
            >
              🖥️ Desktop
            </button>
            <button
              className={previewMode === 'mobile' ? 'active' : ''}
              onClick={() => setPreviewMode('mobile')}
            >
              📱 Mobile
            </button>
          </div>

          <iframe
            src="/?preview=true"
            className={`preview-frame preview-${previewMode}`}
            style={{
              '--primary-color': colors.primary,
              '--background-color': colors.background,
              // Inyectar CSS variables
            } as any}
          />
        </div>
      </div>
    </div>
  );
}
```

### Editor de Items (Formulario Dinámico)

```tsx
// src/admin/pages/ItemEdit.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export function ItemEdit() {
  const { categoryId, id } = useParams();
  const navigate = useNavigate();

  // Cargar definición de la categoría
  const { data: category } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const categories = await FileManager.readCategories();
      return categories.categories.find(c => c.id === categoryId);
    }
  });

  // Cargar item existente (si es edición)
  const { data: item } = useQuery({
    queryKey: ['item', categoryId, id],
    queryFn: async () => {
      if (!id) return null;
      const items = await FileManager.readItems(categoryId);
      return items.find(i => i.id === id);
    },
    enabled: !!id
  });

  // Generar schema de validación dinámicamente
  const validationSchema = React.useMemo(() => {
    if (!category) return z.object({});

    const shape: any = {};
    
    for (const field of category.fields) {
      let fieldSchema: any;

      switch (field.type) {
        case 'text':
          fieldSchema = z.string();
          if (field.maxLength) {
            fieldSchema = fieldSchema.max(field.maxLength);
          }
          break;
        
        case 'number':
          fieldSchema = z.number();
          if (field.min !== undefined) {
            fieldSchema = fieldSchema.min(field.min);
          }
          if (field.max !== undefined) {
            fieldSchema = fieldSchema.max(field.max);
          }
          break;
        
        case 'email':
          fieldSchema = z.string().email();
          break;
        
        case 'url':
          fieldSchema = z.string().url();
          break;
        
        case 'tags':
          fieldSchema = z.array(z.string());
          break;
        
        default:
          fieldSchema = z.any();
      }

      if (!field.required) {
        fieldSchema = fieldSchema.optional();
      }

      shape[field.name] = fieldSchema;
    }

    return z.object(shape);
  }, [category]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: item?.data || {}
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const items = await FileManager.readItems(categoryId);
      
      if (id) {
        // Actualizar existente
        const index = items.findIndex(i => i.id === id);
        items[index] = {
          ...items[index],
          data,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Crear nuevo
        items.push({
          id: generateId(),
          categoryId,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          data
        });
      }

      await FileManager.saveItems(categoryId, items);
    },
    onSuccess: () => {
      navigate('/admin/items');
    }
  });

  const onSubmit = (data: any) => {
    saveMutation.mutate(data);
  };

  if (!category) return <div>Cargando...</div>;

  return (
    <div className="item-edit">
      <header>
        <h1>{id ? 'Editar' : 'Crear'} {category.name}</h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        {category.fields.map((field) => (
          <div key={field.id} className="form-field">
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>

            {/* Renderizar campo según tipo */}
            {field.type === 'text' && (
              <input
                type="text"
                id={field.name}
                {...register(field.name)}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                id={field.name}
                {...register(field.name)}
                placeholder={field.placeholder}
                rows={field.rows || 4}
              />
            )}

            {field.type === 'number' && (
              <input
                type="number"
                id={field.name}
                {...register(field.name, { valueAsNumber: true })}
                min={field.min}
                max={field.max}
              />
            )}

            {field.type === 'select' && (
              <select id={field.name} {...register(field.name)}>
                <option value="">Seleccionar...</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {field.type === 'image' && (
              <ImageUpload
                name={field.name}
                accept={field.accept}
                maxSize={field.maxSize}
              />
            )}

            {field.type === 'tags' && (
              <TagsInput
                name={field.name}
                maxTags={field.maxTags}
                placeholder={field.placeholder}
              />
            )}

            {errors[field.name] && (
              <span className="error">{errors[field.name]?.message}</span>
            )}
          </div>
        ))}

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/items')}>
            Cancelar
          </button>
          <button type="submit">
            {id ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

## 🚀 Instalación y Uso

### Para Usuarios (Quick Start)

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/voicesearch-framework.git
cd voicesearch-framework

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# - Sitio público: http://localhost:5173
# - Panel admin: http://localhost:5173/admin
```

### Configuración Inicial

```bash
# 1. Editar información básica
nano src/data/config.json

# 2. Personalizar colores
nano src/data/theme.json

# 3. O usar el panel admin (más fácil)
# Ir a http://localhost:5173/admin
```

### Deploy en Vercel

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# Tu sitio estará en: https://tu-proyecto.vercel.app
```

### Deploy en Netlify

```bash
# 1. Build del proyecto
npm run build

# 2. Deploy la carpeta dist/
netlify deploy --prod --dir=dist
```

### Deploy en VPS (Linux)

```bash
# 1. Build
npm run build

# 2. Copiar a servidor
scp -r dist/* user@server:/var/www/html/

# 3. Configurar Nginx
server {
  listen 80;
  server_name misitio.cl;
  root /var/www/html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 🔧 Personalización Avanzada

### Crear un Tema Personalizado

```json
// src/data/themes/mi-tema.json
{
  "name": "Mi Tema Corporativo",
  "colors": {
    "primary": "#FF6B35",
    "background": "#FFFFFF",
    "text": "#2C3E50"
  },
  "typography": {
    "fontFamily": "Roboto, sans-serif"
  }
}
```

### Agregar un Nuevo Tipo de Campo

```typescript
// src/admin/components/fields/GalleryField.tsx
export function GalleryField({ value, onChange }) {
  const [images, setImages] = useState(value || []);

  const handleAddImage = async (file: File) => {
    const url = await FileManager.uploadImage(file);
    setImages([...images, url]);
    onChange([...images, url]);
  };

  return (
    <div className="gallery-field">
      <div className="gallery-grid">
        {images.map((url, i) => (
          <img key={i} src={url} alt={`Image ${i + 1}`} />
        ))}
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          Array.from(e.target.files).forEach(handleAddImage);
        }}
      />
    </div>
  );
}

// Registrar en src/admin/utils/fieldTypes.ts
export const fieldTypes = {
  text: TextField,
  textarea: TextAreaField,
  number: NumberField,
  image: ImageField,
  gallery: GalleryField, // 👈 Nuevo tipo
  // ...
};
```

### Integrar con CMS Externo (Opcional)

```typescript
// src/utils/dataProvider.ts
export class DataProvider {
  // Por defecto: archivos JSON locales
  static source: 'local' | 'strapi' | 'contentful' = 'local';

  static async fetchItems(categoryId: string) {
    if (this.source === 'local') {
      return FileManager.readItems(categoryId);
    }
    
    if (this.source === 'strapi') {
      const response = await fetch(`${STRAPI_URL}/api/${categoryId}`);
      return response.json();
    }
    
    // Más proveedores...
  }
}
```

---

## 📦 Scripts de NPM

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "admin": "vite --open /admin",
    "export": "node scripts/export-config.js",
    "import": "node scripts/import-config.js",
    "reset": "node scripts/reset-to-default.js"
  }
}
```

### Script de Exportación

```javascript
// scripts/export-config.js
import fs from 'fs';
import path from 'path';

// Exportar toda la configuración a un solo archivo
const config = {
  site: JSON.parse(fs.readFileSync('src/data/config.json', 'utf-8')),
  theme: JSON.parse(fs.readFileSync('src/data/theme.json', 'utf-8')),
  categories: JSON.parse(fs.readFileSync('src/data/categories.json', 'utf-8')),
  items: {}
};

// Leer todos los items
const itemsDir = 'src/data/items';
const files = fs.readdirSync(itemsDir);

for (const file of files) {
  const categoryId = file.replace('.json', '');
  config.items[categoryId] = JSON.parse(
    fs.readFileSync(path.join(itemsDir, file), 'utf-8')
  );
}

// Guardar backup
const timestamp = new Date().toISOString().replace(/:/g, '-');
fs.writeFileSync(
  `backups/config-${timestamp}.json`,
  JSON.stringify(config, null, 2)
);

console.log('✅ Configuración exportada a backups/');
```

---

## 🎓 Documentación para Usuarios

### README.md del Proyecto

````markdown
# 🎤 VoiceSearch Framework

Framework self-hosted para crear sitios web con búsqueda por voz.

## 🚀 Quick Start

```bash
git clone https://github.com/tu-usuario/voicesearch-framework.git
cd voicesearch-framework
npm install
npm run dev
```

Abre http://localhost:5173/admin para empezar a personalizar.

## 📖 Guías

- [Instalación](docs/installation.md)
- [Configuración](docs/configuration.md)
- [Personalización](docs/customization.md)
- [Deploy](docs/deployment.md)

## 🎨 Features

- ✅ Búsqueda por voz con IA
- ✅ Panel admin visual (sin código)
- ✅ Temas personalizables
- ✅ Categorías dinámicas
- ✅ PWA ready
- ✅ Deploy en cualquier hosting

## 📝 Licencia

MIT
````

---

## 🔐 Seguridad del Panel Admin

### Protección con Contraseña

```typescript
// src/admin/AuthGuard.tsx
import React, { useState } from 'react';

export function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('admin_auth') === 'true'
  );
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    
    if (password === correctPassword) {
      localStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="admin-login">
      <form onSubmit={handleLogin}>
        <h1>🔒 Panel Admin</h1>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
```

### Variables de Entorno

```bash
# .env
VITE_ADMIN_PASSWORD=tu-password-segura
VITE_SITE_URL=https://misitio.cl
```

### Proteger Panel en Producción

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        admin: 'admin.html' // Separar admin en otro entry point
      }
    }
  }
});
```

---

## 🎯 Ventajas de este Enfoque

### ✅ Pros

1. **Simple**: Solo `git clone` + `npm install`
2. **Sin servidor**: Deploy en Vercel/Netlify gratis
3. **Rápido**: Todo estático, ultra rápido
4. **Versionado**: Cambios en Git = rollback fácil
5. **Portable**: Funciona en cualquier lugar
6. **Económico**: No necesitas hosting costoso
7. **Offline**: Puede funcionar sin internet (PWA)
8. **Customizable**: Código abierto, modifica lo que quieras

### ⚠️ Contras

1. **No multi-tenant**: Cada sitio es una instancia separada
2. **Edición local**: No puedes editar desde cualquier lugar (a menos que uses Git)
3. **Escalabilidad**: Para miles de items puede ser lento
4. **Colaboración**: Múltiples editores requieren Git workflow

---

## 🚀 Roadmap

### v1.0 (MVP)

- [x] Panel admin básico
- [x] Gestión de categorías
- [x] CRUD de items
- [x] Editor de diseño
- [x] Deploy estático

### v1.1

- [ ] Editor Markdown integrado
- [ ] Versionado de cambios
- [ ] Preview de cambios antes de publicar
- [ ] Búsqueda avanzada en admin

### v2.0

- [ ] Multi-idioma
- [ ] Plugins system
- [ ] Marketplace de temas
- [ ] Integración con Strapi/Contentful
- [ ] CLI para scaffolding

---

**Creado por**: Colabi Tech
**Licencia**: MIT
**Versión**: 1.0.0
