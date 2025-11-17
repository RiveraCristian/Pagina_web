# 🚀 Framework CMS Self-Hosted + Single Page Application

## ⚡ ¿Qué es esto?

Este proyecto incluye **DOS sistemas en uno:**

### 1️⃣ **Framework CMS Genérico** (Panel de Administración)
Un sistema de gestión de contenido **100% flexible** y sin base de datos que te permite crear **CUALQUIER tipo de sitio web** mediante categorías personalizables.

**✨ Características del Framework:**
- ✅ **100% Genérico** - No limitado a ningún sector específico
- ✅ **Sin Base de Datos** - Todo en archivos JSON versionables con Git
- ✅ **Schema Builder** - Crea categorías con 22 tipos de campos diferentes
- ✅ **Formularios Dinámicos** - Se generan automáticamente según tu configuración
- ✅ **Editor Visual de Diseño** - Personaliza colores, fuentes y efectos
- ✅ **Autenticación** - Panel protegido con login
- ✅ **TypeScript** - Tipado completo y validaciones en tiempo real
- ✅ **Modern Stack** - React 19, Vite 7, TanStack Query, React Hook Form

**📦 Tipos de sitios que puedes crear:**
- Sitios corporativos (empresas, agencias)
- E-commerce (tiendas online)
- Blogs y revistas
- Portfolios personales
- Instituciones educativas
- Clínicas y hospitales
- ONGs y fundaciones
- Restaurantes
- Inmobiliarias
- **¡Y cualquier cosa que imagines!**

**🔗 Documentación del Framework:**
- [README_FRAMEWORK_GENERICO.md](./README_FRAMEWORK_GENERICO.md) - Guía completa
- [QUICK_START.md](./QUICK_START.md) - Inicio rápido por tipo de sitio
- [EJEMPLOS_CATEGORIAS.md](./EJEMPLOS_CATEGORIAS.md) - Ejemplos detallados
- [FRAMEWORK_SELF_HOSTED.md](./FRAMEWORK_SELF_HOSTED.md) - Documentación técnica

---

### 2️⃣ **Single Page Application** (Frontend Público)
Una aplicación web minimalista con interacción de IA para mostrar proyectos relevantes.

**🎨 Características del Frontend:**
- **Diseño minimalista**: Fondo negro con interacciones elegantes
- **Interacción con IA**: Consultas inteligentes para sugerir proyectos
- **🎤 Entrada por voz**: Busca usando tu voz (Web Speech API)
- **Animaciones suaves**: Transiciones fluidas entre estados
- **Responsive**: Adaptado para móviles y desktop
- **TypeScript**: Tipado fuerte para mayor seguridad

## 📁 Estructura del Proyecto

```src/
├── components/
│   ├── LogoHero.tsx        # Logo principal y punto de entrada
│   ├── PromptBox.tsx       # Input para consultas del usuario
│   └── SceneView.tsx       # Galería de proyectos
├── data/
│   └── projects.ts         # Catálogo de proyectos
├── services/
│   └── aiSceneService.ts   # Servicio de IA (mock / backend)
├── styles/
│   ├── LogoHero.css
│   ├── PromptBox.css
│   └── SceneView.css
├── types/
│   └── index.ts            # Definiciones de tipos TypeScript
├── App.tsx                 # Componente principal
├── App.css                 # Estilos globales
├── main.tsx               # Punto de entrada
└── index.css              # Reset y estilos base

public/
└── img/
    └── proyectos/         # Imágenes de proyectos
```

## 🛠️ Instalación y Uso

### Requisitos previos

- Node.js 18+
- npm o yarn

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5174/`

### Build para producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

### Preview del build

```bash
npm run preview
```

## 💡 Cómo funciona

1. **Pantalla inicial**: El usuario ve el logo UDD centrado en fondo negro
2. **Click en el logo**: Aparece un input para escribir o hablar
3. **Envío de consulta**:
   - **Opción texto**: El usuario escribe algo como "¿quién eres?" o "necesito aprender programación"
   - **Opción voz** 🎤: El usuario hace clic en el micrófono y habla
   - La aplicación llama al servicio de IA (`aiSceneService.ts`)
   - La IA analiza la consulta y devuelve proyectos relevantes
4. **Renderizado**: Se muestra una galería horizontal de proyectos con:
   - Título contextual
   - Subtítulo descriptivo
   - Tarjetas de proyecto con imágenes y descripciones

### Ejemplos de consultas:
- "¿Quién eres?" → Muestra información sobre la UDD
- "Quiero aprender programación" → Muestra Ciento01
- "Necesito un dashboard" → Muestra herramientas de analytics

## 🎨 Personalización

### Agregar nuevos proyectos

Edita `src/data/projects.ts`:

```typescript
export const PROJECTS: Project[] = [
  {
    id: "mi-nuevo-proyecto",
    categoria: "categoria-ejemplo",
    nombre: "Nombre del Proyecto",
    fraseDefault: "Descripción breve del proyecto",
    imagenes: ["/img/proyectos/imagen1.png"]
  },
  // ... más proyectos
];
```

### Modificar la lógica de IA

Edita `src/services/aiSceneService.ts`:

**Versión actual**: Mock con reglas basadas en palabras clave

**Versión futura**: Integración con backend real o LLM:

```typescript
export async function getSceneForQuery(query: string): Promise<SceneResponse> {
  const response = await fetch('https://tu-api.com/analyze', {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: { 'Content-Type': 'application/json' }
  });
  
  return await response.json();
}
```

### Cambiar colores y estilos

Los estilos están en archivos CSS separados:

- `src/App.css` - Estilos globales
- `src/styles/LogoHero.css` - Estilos del logo
- `src/styles/PromptBox.css` - Estilos del input
- `src/styles/SceneView.css` - Estilos de la galería

## 📦 Dependencias principales

- **React 18** - Librería UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server

## 🎯 Panel de Administración

### 🔐 Acceso al Admin

```bash
npm run dev
# Visita: http://localhost:5173/admin
# Contraseña: admin123 (cambiar en .env)
```

### ✅ Características Completas del Admin (100% Implementado)

#### 1. **Sistema de Autenticación** 🔒
- Login protegido con contraseña (variable de entorno)
- Sesión de 24 horas con auto-renovación
- Logout con confirmación si hay cambios sin guardar

#### 2. **Dashboard** 📊
- Estadísticas en tiempo real
- Resumen de contenido
- Accesos rápidos

#### 3. **Gestión de Categorías** 🏗️
- **Schema Builder** con 22 tipos de campos
- Crear categorías personalizadas (proyectos, equipo, servicios, etc.)
- Configurar campos con validaciones
- Preview en tiempo real

#### 4. **CRUD de Items** 📝
- Formularios **dinámicos generados automáticamente**
- Create, Read, Update, Delete
- Validación en tiempo real
- Búsqueda y filtros

#### 5. **Editor de Diseño** 🎨
- Configuración visual de colores
- Tipografías personalizables
- Efectos y animaciones
- Preview en vivo
- Exportación de CSS

#### 6. **Configuración General** ⚙️
- SEO (meta tags, Open Graph)
- Features toggleables
- Búsqueda y filtros

#### 7. **Sistema de Archivos** 📁
- Almacenamiento en JSON
- Sin base de datos requerida
- Versionable con Git
- Backup automático

---

## 🚀 Guía de Inicio Rápido - Framework CMS

### Para Diferentes Tipos de Sitios

El framework incluye **ejemplos listos para usar** según tu tipo de proyecto:

#### 📋 Ejemplos Incluidos en `categories-examples.json`

1. **Quienes Somos** - Secciones institucionales (Historia, Misión, Visión)
2. **Proyectos** - Portfolio completo con 20+ campos configurables
3. **Iniciativas** - Programas y acciones especiales
4. **Colaboradores** - Equipo de trabajo con perfiles completos

#### 🎯 Cómo Importar Categorías de Ejemplo

**Opción 1: Manual en el Admin**
```
1. Ve a /admin/categories
2. Click "Nueva Categoría"
3. Copia la estructura desde categories-examples.json
4. Pega y guarda
```

**Opción 2: Directamente en el código**
```typescript
// src/data/categories.json
// Copia el contenido de categories-examples.json
```

#### 📚 Documentación por Tipo de Sitio

Ve a **[QUICK_START.md](./QUICK_START.md)** para guías específicas:

- 🏢 **Sitio Corporativo** - Empresas, agencias, consultoras
- 🛍️ **E-commerce** - Tiendas online, marketplaces
- 📰 **Blog/Revista** - Publicaciones, medios
- 🎓 **Instituto Educativo** - Escuelas, universidades
- 🏥 **Clínica/Hospital** - Servicios médicos
- 🌟 **ONG/Fundación** - Organizaciones sin fines de lucro
- 🎨 **Portfolio Personal** - Diseñadores, desarrolladores

Cada guía incluye:
- Categorías recomendadas
- Estructura de campos sugerida
- Cantidad de items ideales
- Ejemplos de contenido

---

## � Ejemplo de Uso del Framework

### Caso: Crear un Sitio Corporativo

**1. Crea la categoría "proyectos" en el admin:**
```json
{
  "id": "proyectos",
  "name": "Proyectos",
  "fields": [
    { "id": "nombre", "type": "text", "required": true },
    { "id": "descripcion", "type": "richtext" },
    { "id": "imagen", "type": "image" },
    { "id": "tecnologias", "type": "tags" },
    { "id": "destacado", "type": "boolean" }
  ]
}
```

**2. Agrega items desde el admin:**
- Ve a `/admin/items`
- Selecciona "proyectos"
- Completa el formulario (se genera automáticamente)

**3. Usa en tu frontend:**
```tsx
import { useCategory } from '@/hooks/useAppConfig';

export function ProjectsPage() {
  const { items, loading } = useCategory('proyectos');
  
  return (
    <div>
      {items.filter(p => p.destacado).map(proyecto => (
        <ProjectCard key={proyecto.id} {...proyecto} />
      ))}
    </div>
  );
}
```

**¡Sin tocar base de datos! Todo en JSON versionable con Git.**

---

## 🔄 Estado del Proyecto

### ✅ Framework CMS (100% Completo)
- [x] Autenticación y login
- [x] Schema Builder (22 tipos de campos)
- [x] Gestión de categorías
- [x] CRUD de items con formularios dinámicos
- [x] Editor visual de diseño
- [x] Configuración general
- [x] Sistema de archivos JSON
- [x] Hooks para frontend
- [x] Script de migración
- [x] Documentación completa

### ✅ Frontend Público (Funcional)
- [x] Single Page Application
- [x] Interacción con IA
- [x] Entrada por voz
- [x] Galería de proyectos
- [x] Responsive design

### 🔮 Mejoras Futuras
- [ ] Integración con IA real (OpenAI, Claude)
- [ ] Multi-idioma
- [ ] Sistema de permisos granular
- [ ] Editor de contenido colaborativo
- [ ] API REST para integraciones

## 📝 Notas

- Las imágenes de los proyectos deben colocarse en `public/img/proyectos/`
- Si una imagen no existe, se muestra un placeholder automático
- El servicio de IA actual es un mock que usa reglas simples
- La estructura está diseñada para escalar fácilmente
- **Entrada por voz**: Funciona en Chrome, Edge y Safari. Ver `VOICE_FEATURE.md` para más detalles

## 📄 Licencia

MIT
