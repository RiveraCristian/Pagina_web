# 🏢 Arquitectura Multi-Tenant: Plataforma de Búsqueda Interactiva por Voz

## 📋 Resumen Ejecutivo

Transformar la aplicación actual (específica para UDD) en una **plataforma SaaS multi-tenant** donde cualquier organización pueda:

- ✅ Crear su propia instancia personalizada
- ✅ Gestionar contenido desde un panel admin tipo WordPress
- ✅ Personalizar colores, temas y branding
- ✅ Definir categorías y campos personalizados
- ❌ **NO modificar** la lógica de búsqueda por voz (valor agregado protegido)
- ❌ **NO cambiar** estructura de páginas (experiencia consistente)

---

## 🎯 Casos de Uso

### Escenario 1: Universidad Del Desarrollo (UDD)
**Necesidad**: Buscar proyectos estudiantiles por voz
```yaml
Tenant: udd
URL: udd.voicesearch.app
Categorías:
  - Proyectos (título, descripción, facultad, año, keywords)
  - Noticias (título, resumen, fecha, categoría)
Colores: #00ff88 (verde neón), fondo oscuro
Logo: Logo UDD
```

### Escenario 2: Colabi (Empresa)
**Necesidad**: Catálogo de servicios con búsqueda inteligente
```yaml
Tenant: colabi
URL: colabi.voicesearch.app
Categorías:
  - Servicios (nombre, descripción, precio, duración, keywords)
  - Casos de Éxito (cliente, industria, resultado, testimonio)
  - Equipo (nombre, cargo, bio, foto)
Colores: #FF6B35 (naranja corporativo), fondo claro
Logo: Logo Colabi
```

### Escenario 3: Portafolio Personal (Designer)
**Necesidad**: Mostrar trabajos creativos
```yaml
Tenant: maria-designer
URL: maria.voicesearch.app
Categorías:
  - Portfolio (título, imagen, descripción, año, técnicas)
  - Clientes (nombre, logo, proyecto, testimonio)
Colores: #E91E63 (rosa), fondo blanco
Logo: Firma personal
```

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico Recomendado

```
Frontend (Current): React + TypeScript + Vite
Backend (New):      Node.js + Express + PostgreSQL
Admin Panel (New):  React Admin / Refine / Strapi
Auth:               Clerk / Auth0 / Supabase Auth
Storage:            AWS S3 / Cloudinary
Hosting:            Vercel (frontend) + Railway (backend)
```

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                        │
│              (Cloudflare / Vercel Edge)                 │
└────────────┬────────────────────────────────────────────┘
             │
             ├─── Tenant Detection (Subdomain/Domain)
             │
    ┌────────┴────────┐
    │                 │
┌───▼───┐         ┌───▼───┐         ┌─────────┐
│  UDD  │         │ Colabi│         │  Maria  │
│ App   │         │  App  │         │   App   │
│ (SPA) │         │ (SPA) │         │  (SPA)  │
└───┬───┘         └───┬───┘         └────┬────┘
    │                 │                   │
    └─────────────────┴───────────────────┘
                      │
                 ┌────▼────┐
                 │   API   │
                 │ Gateway │
                 │ (REST)  │
                 └────┬────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
    ┌───▼────┐   ┌────▼────┐   ┌───▼────┐
    │  Auth  │   │ Content │   │ Config │
    │Service │   │   API   │   │  API   │
    └────────┘   └────┬────┘   └───┬────┘
                      │             │
                 ┌────▼─────────────▼────┐
                 │    PostgreSQL DB      │
                 │  (Multi-tenant Data)  │
                 └───────────────────────┘
```

---

## 💾 Modelo de Datos

### 1. Tabla `tenants` (Organizaciones)

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,              -- 'udd', 'colabi'
  name VARCHAR(255) NOT NULL,                    -- 'Universidad Del Desarrollo'
  subdomain VARCHAR(50) UNIQUE,                  -- 'udd' -> udd.voicesearch.app
  custom_domain VARCHAR(255) UNIQUE,             -- 'search.udd.cl' (opcional)
  
  -- Branding
  logo_url TEXT,
  favicon_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#00ff88',    -- Hex color
  secondary_color VARCHAR(7),
  background_color VARCHAR(7),
  theme_mode VARCHAR(10) DEFAULT 'dark',         -- 'dark' | 'light' | 'auto'
  
  -- Metadatos
  status VARCHAR(20) DEFAULT 'active',           -- 'active' | 'suspended' | 'trial'
  plan VARCHAR(20) DEFAULT 'free',               -- 'free' | 'pro' | 'enterprise'
  max_items INT DEFAULT 100,
  max_categories INT DEFAULT 5,
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  og_image_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_subdomain ON tenants(subdomain);
```

### 2. Tabla `categories` (Secciones personalizadas)

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,                    -- 'Proyectos', 'Servicios'
  slug VARCHAR(100) NOT NULL,                    -- 'proyectos', 'servicios'
  icon VARCHAR(50),                               -- 'FaLightbulb', 'FaBriefcase'
  description TEXT,
  
  -- Campo schema (JSON con definición de campos)
  field_schema JSONB NOT NULL DEFAULT '[]',
  /*
  Ejemplo:
  [
    {
      "name": "titulo",
      "type": "text",
      "label": "Título del Proyecto",
      "required": true,
      "maxLength": 100
    },
    {
      "name": "descripcion",
      "type": "textarea",
      "label": "Descripción",
      "required": true
    },
    {
      "name": "imagen",
      "type": "image",
      "label": "Imagen Principal",
      "required": false
    },
    {
      "name": "keywords",
      "type": "tags",
      "label": "Palabras clave",
      "required": true
    }
  ]
  */
  
  display_order INT DEFAULT 0,
  is_searchable BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'active',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, slug)
);

CREATE INDEX idx_categories_tenant ON categories(tenant_id);
```

### 3. Tabla `items` (Contenido genérico)

```sql
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  
  -- Datos dinámicos (columna JSONB)
  data JSONB NOT NULL,
  /*
  Ejemplo para Proyecto UDD:
  {
    "titulo": "Sistema de Riego Inteligente",
    "descripcion": "IoT para agricultura",
    "facultad": "Ingeniería",
    "año": 2024,
    "keywords": ["iot", "agricultura", "sensores"],
    "imagen": "https://cdn.example.com/proyecto1.jpg"
  }
  
  Ejemplo para Servicio Colabi:
  {
    "nombre": "Consultoría Digital",
    "descripcion": "Transformación digital empresarial",
    "precio": 5000,
    "duracion": "3 meses",
    "keywords": ["digital", "estrategia", "innovación"]
  }
  */
  
  -- Campos de búsqueda (generados automáticamente)
  search_text TEXT GENERATED ALWAYS AS (
    data::text
  ) STORED,
  
  -- Metadatos
  status VARCHAR(20) DEFAULT 'published',        -- 'draft' | 'published' | 'archived'
  views INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Índices para búsqueda
CREATE INDEX idx_items_tenant ON items(tenant_id);
CREATE INDEX idx_items_category ON items(category_id);
CREATE INDEX idx_items_search ON items USING GIN(to_tsvector('spanish', search_text));
CREATE INDEX idx_items_data ON items USING GIN(data);
```

### 4. Tabla `users` (Administradores)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  
  role VARCHAR(20) DEFAULT 'editor',             -- 'owner' | 'admin' | 'editor' | 'viewer'
  
  -- Auth (si usas auth propio, sino delegar a Clerk/Auth0)
  password_hash TEXT,
  
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
```

### 5. Tabla `theme_presets` (Temas predefinidos)

```sql
CREATE TABLE theme_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name VARCHAR(100) NOT NULL,                    -- 'Neon Dark', 'Corporate Light'
  thumbnail_url TEXT,
  
  -- Configuración de tema
  config JSONB NOT NULL,
  /*
  {
    "primaryColor": "#00ff88",
    "secondaryColor": "#0d1b2a",
    "backgroundColor": "#000814",
    "textColor": "#ffffff",
    "accentColor": "#00ff88",
    "borderRadius": "12px",
    "fontFamily": "Inter",
    "particlesEnabled": true,
    "animationsLevel": "high"
  }
  */
  
  is_premium BOOLEAN DEFAULT false,
  category VARCHAR(50),                          -- 'dark', 'light', 'colorful', 'minimal'
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎨 Panel de Administración

### Estructura del Admin Panel

```
/admin
├── /dashboard              → Estadísticas generales
├── /content
│   ├── /categorias        → Gestión de categorías
│   └── /items             → CRUD de items por categoría
├── /design
│   ├── /branding          → Logo, colores, favicon
│   ├── /themes            → Temas predefinidos
│   └── /preview           → Vista previa en tiempo real
├── /settings
│   ├── /general           → Nombre, dominio, SEO
│   ├── /users             → Gestión de usuarios/roles
│   └── /plan              → Plan actual, billing
└── /analytics              → Métricas de uso (cuando se implemente)
```

### Wireframe del Panel Admin

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  VoiceSearch Admin          [👤 Admin] [🔔] [⚙️]  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📊 Dashboard   📝 Contenido   🎨 Diseño   ⚙️ Config        │
│                                                               │
├──────────────┬────────────────────────────────────────────────┤
│              │                                                │
│ 📂 Categorías│  ┌──────────────────────────────────────────┐ │
│   → Proyectos│  │  Categoría: Proyectos (24 items)        │ │
│   → Noticias │  │                                          │ │
│              │  │  [+ Nuevo Proyecto]          [⚙️ Config]│ │
│ ➕ Nueva     │  │                                          │ │
│              │  │  ┌────────────────────────────────────┐ │ │
│              │  │  │ 📋 Sistema de Riego Inteligente   │ │ │
│              │  │  │ 📅 2024 | Ingeniería | ✅ Publicado│ │ │
│              │  │  │ [✏️ Editar] [🗑️ Eliminar]         │ │ │
│              │  │  └────────────────────────────────────┘ │ │
│              │  │                                          │ │
│              │  │  ┌────────────────────────────────────┐ │ │
│              │  │  │ 📋 App de Movilidad Urbana        │ │ │
│              │  │  │ 📅 2023 | Diseño | ⏸️ Borrador    │ │ │
│              │  │  │ [✏️ Editar] [🗑️ Eliminar]         │ │ │
│              │  │  └────────────────────────────────────┘ │ │
│              │  │                                          │ │
│              │  │  [1] [2] [3] ... [10]                  │ │
│              │  └──────────────────────────────────────────┘ │
│              │                                                │
└──────────────┴────────────────────────────────────────────────┘
```

### Formulario de Edición de Item (Dinámico)

```
┌────────────────────────────────────────────────┐
│  ✏️ Editar Proyecto                            │
├────────────────────────────────────────────────┤
│                                                │
│  Título *                                      │
│  [Sistema de Riego Inteligente            ]   │
│                                                │
│  Descripción *                                 │
│  ┌──────────────────────────────────────────┐ │
│  │ Proyecto IoT que utiliza sensores para  │ │
│  │ optimizar el uso de agua en cultivos.   │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  Facultad *                                    │
│  [Ingeniería                          ▼]      │
│                                                │
│  Año                                           │
│  [2024                                    ]    │
│                                                │
│  Imagen Principal                              │
│  [📎 Subir Imagen] proyecto-riego.jpg ✅      │
│                                                │
│  Keywords *                                    │
│  [iot] [agricultura] [sensores] [+]           │
│                                                │
│  Estado                                        │
│  ⚪ Borrador  🟢 Publicado  ⚫ Archivado       │
│                                                │
│  [❌ Cancelar]              [💾 Guardar]      │
└────────────────────────────────────────────────┘
```

### Editor de Categorías (Schema Builder)

```
┌──────────────────────────────────────────────────┐
│  ⚙️ Configurar Categoría: Proyectos             │
├──────────────────────────────────────────────────┤
│                                                  │
│  Información Básica                              │
│  ─────────────────                               │
│  Nombre:     [Proyectos                     ]    │
│  Slug:       [proyectos                     ] 🔒 │
│  Ícono:      [FaLightbulb               ▼]      │
│  Descripción:                                    │
│  [Proyectos estudiantiles innovadores      ]    │
│                                                  │
│  ────────────────────────────────────────────    │
│                                                  │
│  Campos Personalizados                           │
│  ─────────────────────                           │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ 1. Título                            [⬆️⬇️]│ │
│  │    Tipo: Texto corto | Requerido: ✅       │ │
│  │    [✏️ Editar] [🗑️ Eliminar]              │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ 2. Descripción                       [⬆️⬇️]│ │
│  │    Tipo: Texto largo | Requerido: ✅       │ │
│  │    [✏️ Editar] [🗑️ Eliminar]              │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ 3. Facultad                          [⬆️⬇️]│ │
│  │    Tipo: Selección | Opciones: 5          │ │
│  │    [✏️ Editar] [🗑️ Eliminar]              │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  [+ Agregar Campo]                               │
│                                                  │
│  Tipos disponibles:                              │
│  📝 Texto corto  📄 Texto largo  🔢 Número      │
│  📅 Fecha  📧 Email  🔗 URL  🏷️ Tags           │
│  📷 Imagen  📁 Archivo  ☑️ Checkbox             │
│  📋 Selección  🎨 Color                         │
│                                                  │
│  [❌ Cancelar]              [💾 Guardar]        │
└──────────────────────────────────────────────────┘
```

### Editor de Branding

```
┌─────────────────────────────────────────────────────┐
│  🎨 Diseño y Branding                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Logo y Marca                                       │
│  ────────────                                       │
│  Logo:        [📎 Subir] logo-udd.svg ✅           │
│  Favicon:     [📎 Subir] favicon.ico ✅            │
│                                                     │
│  Colores del Tema                                   │
│  ─────────────────                                  │
│  Color Primario:     [#00ff88] 🟢                  │
│  Color Secundario:   [#0d1b2a] 🔵                  │
│  Fondo:              [#000814] ⚫                   │
│  Texto:              [#ffffff] ⚪                   │
│                                                     │
│  O elige un tema predefinido:                       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │
│  │ Neon │ │ Corp │ │ Light│ │ Ocean│             │
│  │ Dark │ │ Blue │ │Minimal│ │ Blue │             │
│  └──────┘ └──────┘ └──────┘ └──────┘             │
│                                                     │
│  Modo por Defecto                                   │
│  ⚪ Claro  🟢 Oscuro  ⚪ Automático                │
│                                                     │
│  Efectos Visuales                                   │
│  ─────────────────                                  │
│  ☑️ Partículas de fondo                            │
│  ☑️ Animaciones                                     │
│  Nivel: ⚪ Bajo  🟢 Medio  ⚪ Alto                 │
│                                                     │
│  ────────────────────────────────────────────       │
│                                                     │
│  Vista Previa en Tiempo Real                        │
│  ┌─────────────────────────────────────────────┐   │
│  │ [Logo]  Busca con tu voz                    │   │
│  │                                             │   │
│  │         "Proyectos de ingeniería"          │   │
│  │           [🎤 Buscar]                       │   │
│  │                                             │   │
│  │  ┌──────────────┐  ┌──────────────┐       │   │
│  │  │   Proyecto   │  │   Proyecto   │       │   │
│  │  └──────────────┘  └──────────────┘       │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [❌ Cancelar]              [💾 Guardar]           │
└─────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### Base URL
```
https://api.voicesearch.app/v1
```

### Autenticación
```http
Authorization: Bearer <JWT_TOKEN>
X-Tenant-ID: <tenant_uuid>
```

### Endpoints Principales

#### 1. **Tenants**

```typescript
// GET /tenants/me
// Obtener información del tenant actual
Response: {
  id: string;
  slug: string;
  name: string;
  branding: {
    logoUrl: string;
    primaryColor: string;
    themeMode: 'dark' | 'light' | 'auto';
  };
  plan: 'free' | 'pro' | 'enterprise';
  limits: {
    maxItems: number;
    maxCategories: number;
  };
}

// PATCH /tenants/me
// Actualizar configuración del tenant
Body: {
  name?: string;
  branding?: {
    primaryColor?: string;
    logoUrl?: string;
  };
}
```

#### 2. **Categories**

```typescript
// GET /categories
// Listar todas las categorías del tenant
Response: {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    icon: string;
    itemCount: number;
    fieldSchema: Array<FieldDefinition>;
  }>;
}

// POST /categories
// Crear nueva categoría
Body: {
  name: string;
  slug: string;
  icon?: string;
  fieldSchema: Array<{
    name: string;
    type: 'text' | 'textarea' | 'number' | 'date' | 'image' | 'tags';
    label: string;
    required: boolean;
    options?: string[]; // Para tipo 'select'
  }>;
}

// PUT /categories/:id
// Actualizar categoría
Body: { /* mismo que POST */ }

// DELETE /categories/:id
// Eliminar categoría (y todos sus items)
```

#### 3. **Items**

```typescript
// GET /items
// Listar items (con filtros)
Query: {
  categoryId?: string;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
  page?: number;
  limit?: number;
}
Response: {
  items: Array<{
    id: string;
    categoryId: string;
    data: Record<string, any>; // Datos dinámicos
    status: string;
    createdAt: string;
  }>;
  total: number;
  page: number;
  pageCount: number;
}

// POST /items
// Crear nuevo item
Body: {
  categoryId: string;
  data: Record<string, any>;
  status?: 'draft' | 'published';
}

// PUT /items/:id
// Actualizar item
Body: { /* mismo que POST */ }

// DELETE /items/:id
// Eliminar item
```

#### 4. **Search** (Endpoint público)

```typescript
// POST /search
// Búsqueda por voz/texto
Headers: {
  X-Tenant-Slug: 'udd' // O leer desde subdomain
}
Body: {
  query: string;
  categoryIds?: string[]; // Filtrar por categorías
}
Response: {
  results: Array<{
    id: string;
    category: string;
    data: Record<string, any>;
    relevance: number;
  }>;
  totalResults: number;
  queryTime: number;
}
```

#### 5. **Media Upload**

```typescript
// POST /media/upload
// Subir archivos (imágenes, documentos)
Body: FormData {
  file: File;
  folder?: string; // 'logos', 'projects', 'avatars'
}
Response: {
  url: string;
  thumbnailUrl?: string;
  fileSize: number;
  mimeType: string;
}
```

---

## 🚀 Roadmap de Implementación

### Fase 1: Backend y Base de Datos (4 semanas)

**Semana 1-2: Setup inicial**
- [ ] Crear proyecto Node.js + Express + TypeScript
- [ ] Configurar PostgreSQL con schemas multi-tenant
- [ ] Implementar modelos de datos (Tenants, Categories, Items)
- [ ] Setup de migraciones con Prisma/TypeORM
- [ ] Dockerizar backend + DB

**Semana 3-4: API Core**
- [ ] Autenticación JWT con refresh tokens
- [ ] Middleware de tenant isolation
- [ ] CRUD de Categories con field schema validation
- [ ] CRUD de Items con validación dinámica
- [ ] Endpoint de búsqueda con full-text search
- [ ] Tests unitarios y de integración

### Fase 2: Panel de Administración (4 semanas)

**Semana 5-6: UI Base**
- [ ] Setup React Admin / Refine
- [ ] Dashboard con métricas básicas
- [ ] Autenticación y roles
- [ ] Navegación y layout responsivo

**Semana 7-8: Gestión de Contenido**
- [ ] CRUD de Categorías con Schema Builder
- [ ] CRUD de Items con formularios dinámicos
- [ ] Upload de imágenes con preview
- [ ] Vista previa de cambios en tiempo real

### Fase 3: Personalización (3 semanas)

**Semana 9-10: Branding Editor**
- [ ] Editor de colores con color picker
- [ ] Upload de logo y favicon
- [ ] Selector de temas predefinidos
- [ ] Vista previa live del frontend

**Semana 11: Multi-tenant Frontend**
- [ ] Refactor del frontend actual para cargar config dinámica
- [ ] Crear endpoint `/api/config/:tenantSlug`
- [ ] Lazy load de assets por tenant
- [ ] Cache de configuración

### Fase 4: Deploy y Optimización (2 semanas)

**Semana 12: Infraestructura**
- [ ] Deploy backend en Railway/Render
- [ ] Deploy frontend en Vercel con multi-tenant routing
- [ ] Setup CDN para assets (Cloudinary)
- [ ] SSL y dominios personalizados
- [ ] Backups automatizados

**Semana 13: Optimización**
- [ ] Caching con Redis
- [ ] Rate limiting por tenant
- [ ] Monitoreo con Sentry
- [ ] Tests E2E con Playwright

### Fase 5: Features Avanzadas (Opcional)

- [ ] Import/Export de contenido (JSON, CSV)
- [ ] Versionado de cambios
- [ ] Webhooks para notificaciones
- [ ] Analytics integrado (Plausible/Umami)
- [ ] API pública con API keys
- [ ] Marketplace de temas y plugins

---

## 💰 Modelo de Negocio (SaaS)

### Planes Sugeridos

| Plan         | Precio/mes | Items | Categorías | Usuarios | Features                         |
|--------------|------------|-------|------------|----------|----------------------------------|
| **Free**     | $0         | 100   | 3          | 1        | Subdomain, Temas básicos         |
| **Pro**      | $29        | 1,000 | 10         | 5        | Dominio custom, Temas premium    |
| **Business** | $99        | 10,000| 50         | 20       | API access, Webhooks, Prioridad  |
| **Enterprise**| Custom    | ∞     | ∞          | ∞        | SLA, Soporte 24/7, On-premise    |

### Métricas Clave (KPIs)

```typescript
interface TenantMetrics {
  // Uso
  totalItems: number;
  totalSearches: number;
  activeUsers: number;
  
  // Engagement
  avgSearchesPerDay: number;
  avgSessionDuration: number;
  topSearchedKeywords: string[];
  
  // Performance
  avgSearchResponseTime: number;
  voiceSearchSuccessRate: number;
  
  // Límites
  itemsUsed: number;
  itemsLimit: number;
  storageUsed: number; // MB
  storageLimit: number;
}
```

---

## 🔐 Seguridad Multi-Tenant

### Tenant Isolation

```typescript
// Middleware para aislar datos por tenant
export async function tenantIsolationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Opción 1: Leer desde subdomain
  const subdomain = req.hostname.split('.')[0];
  
  // Opción 2: Leer desde header
  const tenantId = req.headers['x-tenant-id'];
  
  // Validar que el tenant existe
  const tenant = await db.tenant.findUnique({
    where: { subdomain }
  });
  
  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }
  
  // Inyectar tenant en el request
  req.tenant = tenant;
  next();
}

// En todas las queries, filtrar por tenant
const items = await db.item.findMany({
  where: {
    tenantId: req.tenant.id, // ⚠️ CRÍTICO: Siempre filtrar
    status: 'published'
  }
});
```

### Row-Level Security (PostgreSQL)

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Política: usuarios solo ven datos de su tenant
CREATE POLICY tenant_isolation ON items
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- En cada request, setear el tenant actual
SET app.current_tenant_id = 'uuid-del-tenant';
```

### Rate Limiting por Tenant

```typescript
import rateLimit from 'express-rate-limit';

// Límites diferentes según plan
const rateLimiters = {
  free: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100 // 100 requests
  }),
  pro: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000
  }),
  enterprise: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000
  })
};

app.use('/api', (req, res, next) => {
  const limiter = rateLimiters[req.tenant.plan];
  limiter(req, res, next);
});
```

---

## 🎯 Ejemplo de Migración: UDD → Colabi

### Paso 1: Crear nuevo tenant

```bash
curl -X POST https://api.voicesearch.app/v1/tenants \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "slug": "colabi",
    "name": "Colabi",
    "subdomain": "colabi",
    "branding": {
      "primaryColor": "#FF6B35",
      "logoUrl": "https://cdn.colabi.com/logo.svg",
      "themeMode": "light"
    }
  }'
```

### Paso 2: Definir categorías de Colabi

```bash
# Crear categoría "Servicios"
curl -X POST https://api.voicesearch.app/v1/categories \
  -H "X-Tenant-ID: colabi-uuid" \
  -d '{
    "name": "Servicios",
    "slug": "servicios",
    "icon": "FaBriefcase",
    "fieldSchema": [
      {
        "name": "nombre",
        "type": "text",
        "label": "Nombre del Servicio",
        "required": true,
        "maxLength": 100
      },
      {
        "name": "descripcion",
        "type": "textarea",
        "label": "Descripción",
        "required": true
      },
      {
        "name": "precio",
        "type": "number",
        "label": "Precio (USD)",
        "required": false
      },
      {
        "name": "duracion",
        "type": "text",
        "label": "Duración",
        "required": false
      },
      {
        "name": "keywords",
        "type": "tags",
        "label": "Palabras clave",
        "required": true
      }
    ]
  }'
```

### Paso 3: Cargar contenido

```bash
# Crear un servicio
curl -X POST https://api.voicesearch.app/v1/items \
  -H "X-Tenant-ID: colabi-uuid" \
  -d '{
    "categoryId": "servicios-uuid",
    "data": {
      "nombre": "Consultoría Digital",
      "descripcion": "Transformación digital para empresas",
      "precio": 5000,
      "duracion": "3 meses",
      "keywords": ["digital", "estrategia", "innovación"]
    },
    "status": "published"
  }'
```

### Paso 4: Acceder a la instancia

```
https://colabi.voicesearch.app
```

El frontend automáticamente carga:
- Logo de Colabi
- Colores corporativos (#FF6B35)
- Categorías personalizadas (Servicios, Casos de Éxito)
- Items específicos de Colabi

---

## 📚 Stack Tecnológico Completo

### Backend
```json
{
  "runtime": "Node.js 20",
  "framework": "Express 4.18",
  "language": "TypeScript 5.3",
  "database": "PostgreSQL 16",
  "orm": "Prisma 5.8",
  "auth": "Clerk / Auth0",
  "storage": "AWS S3 / Cloudinary",
  "cache": "Redis 7",
  "search": "PostgreSQL Full-Text / Typesense",
  "queue": "BullMQ (para jobs async)"
}
```

### Frontend Admin
```json
{
  "framework": "React 18",
  "admin": "React Admin / Refine",
  "ui": "MUI / Ant Design",
  "forms": "React Hook Form + Zod",
  "upload": "React Dropzone",
  "preview": "React Live",
  "state": "TanStack Query",
  "routing": "React Router 6"
}
```

### Frontend Público (Actual)
```json
{
  "framework": "React 18 + Vite",
  "language": "TypeScript",
  "routing": "React Router",
  "api": "Fetch / Axios",
  "config": "Cargado dinámicamente desde API"
}
```

### DevOps
```json
{
  "hosting": {
    "frontend": "Vercel",
    "backend": "Railway / Render",
    "database": "Supabase / Neon"
  },
  "ci_cd": "GitHub Actions",
  "monitoring": "Sentry + LogRocket",
  "analytics": "Plausible / Umami",
  "cdn": "Cloudflare / Cloudinary"
}
```

---

## 🧪 Testing

### Backend Tests
```typescript
// tests/integration/items.test.ts
describe('Items API - Multi-tenant', () => {
  it('should isolate items between tenants', async () => {
    // Crear item para UDD
    const uddItem = await createItem('udd-tenant-id', {
      categoryId: 'proyectos',
      data: { titulo: 'Proyecto UDD' }
    });
    
    // Intentar acceder desde Colabi (debe fallar)
    const response = await request(app)
      .get(`/items/${uddItem.id}`)
      .set('X-Tenant-ID', 'colabi-tenant-id');
    
    expect(response.status).toBe(404);
  });
});
```

---

## 🎓 Guía para Desarrolladores

### Cómo agregar un nuevo tipo de campo

```typescript
// admin/src/types/fieldTypes.ts
export type FieldType = 
  | 'text' 
  | 'textarea'
  | 'number'
  | 'date'
  | 'image'
  | 'tags'
  | 'url'
  | 'color'      // 👈 Nuevo tipo
  | 'markdown'; // 👈 Nuevo tipo

// admin/src/components/FieldRenderer.tsx
export function FieldRenderer({ field, value, onChange }) {
  switch (field.type) {
    case 'color':
      return <ColorPicker value={value} onChange={onChange} />;
    
    case 'markdown':
      return <MarkdownEditor value={value} onChange={onChange} />;
    
    // ... otros tipos
  }
}
```

---

## 🚨 Consideraciones Importantes

### 1. **Performance con muchos tenants**
- Usar connection pooling en PostgreSQL
- Implementar caching agresivo (Redis)
- Lazy loading de configuraciones
- CDN para assets estáticos

### 2. **Escalabilidad**
- Sharding por tenant (si hay millones de items)
- Separar DB por tier (free vs enterprise)
- Auto-scaling en backend (Kubernetes)

### 3. **Backups y Disaster Recovery**
- Backup diario de PostgreSQL
- Retention: 30 días para Pro, 90 para Enterprise
- Point-in-time recovery
- Export manual desde admin panel

### 4. **Compliance**
- GDPR: derecho al olvido (soft delete)
- Data residency (EU vs US servers)
- Audit logs de cambios críticos

---

## 📞 Próximos Pasos

1. **Validar la propuesta** con stakeholders
2. **Definir MVP**: ¿Cuáles features son críticas para v1?
3. **Estimar recursos**: ¿Cuántos devs? ¿Cuánto tiempo?
4. **Diseñar prototipos** del admin panel
5. **Setup de infraestructura** (repos, CI/CD, staging)

---

## 📖 Referencias

- [Multi-tenancy Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/multi-tenancy)
- [React Admin Docs](https://marmelab.com/react-admin/)
- [Prisma Multi-schema](https://www.prisma.io/docs/guides/database/multi-schema)
- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

---

**Creado por**: Colabi Tech
**Fecha**: Noviembre 2025  
**Versión**: 1.0.0  
**Estado**: 🚀 Propuesta Lista para Implementación
