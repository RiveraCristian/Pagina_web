# 📖 Guía de Uso - Framework VoiceSearch Self-Hosted

## 🎯 Introducción

Este framework te permite crear y gestionar un sitio web con búsqueda por voz **sin necesidad de programar**. Todo el contenido se administra desde un panel de control visual y se almacena en archivos JSON versionables con Git.

---

## 🚀 Inicio Rápido

### 1. Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/tu-proyecto.git
cd tu-proyecto

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

**Accesos:**
- **Sitio público**: http://localhost:5173
- **Panel admin**: http://localhost:5173/admin

### 2. Primer Uso

1. Abre http://localhost:5173/admin
2. Ve a **"Categorías"** y crea tu primera categoría
3. Define los campos que tendrán tus contenidos
4. Ve a **"Items"** y crea tu primer contenido
5. Personaliza el diseño en **"Diseño"**
6. Configura el sitio en **"Configuración"**

---

## 🎨 Panel de Administración

### 📊 Dashboard

El dashboard muestra:
- **Estadísticas generales**: Total de categorías, items publicados, borradores
- **Items recientes**: Los últimos 5 contenidos modificados
- **Accesos rápidos**: Botones para crear categorías e items

**Acciones rápidas:**
- Crear nueva categoría
- Crear nuevo item
- Ver todas las categorías
- Ver todos los items

---

### 📁 Gestión de Categorías

Las categorías definen **tipos de contenido** (proyectos, testimonios, productos, etc.).

#### Crear una Categoría

1. **Navegación**: Admin → Categorías → "Nueva Categoría"
2. **Información básica**:
   - **ID**: Identificador único (ej: `proyectos`, `testimonios`)
   - **Nombre**: Nombre legible (ej: "Proyectos", "Testimonios")
   - **Descripción**: Explicación del tipo de contenido
   - **Ícono**: Código de ícono de Font Awesome (ej: `FaFolder`)

3. **Schema Builder** - Define los campos:

#### 📝 Tipos de Campo Disponibles (22)

| Campo | Descripción | Uso |
|-------|-------------|-----|
| `text` | Texto corto | Títulos, nombres |
| `textarea` | Texto largo | Descripciones, biografías |
| `number` | Números | Precios, cantidades |
| `email` | Email | Correos electrónicos |
| `url` | URL | Enlaces externos |
| `date` | Fecha | Fechas de publicación |
| `datetime` | Fecha y hora | Timestamps completos |
| `time` | Hora | Horarios |
| `select` | Lista desplegable | Categorías, opciones |
| `multiselect` | Selección múltiple | Tags, múltiples opciones |
| `radio` | Opciones exclusivas | Estado, tipo |
| `checkbox` | Casillas múltiples | Características |
| `boolean` | Sí/No | Destacado, activo |
| `image` | Imagen | Fotos, logos |
| `file` | Archivo | PDFs, documentos |
| `tags` | Etiquetas | Keywords, categorización |
| `color` | Color | Colores personalizados |
| `markdown` | Markdown | Contenido enriquecido |
| `richtext` | Editor WYSIWYG | Contenido HTML |
| `json` | JSON | Datos estructurados |
| `relation` | Relación | Referencias a otros items |
| `slug` | URL amigable | URLs SEO |

#### Validaciones Disponibles

Para cada campo puedes configurar:
- **Required**: Campo obligatorio
- **Searchable**: Incluir en búsquedas
- **maxLength**: Longitud máxima (texto)
- **min/max**: Valores mínimo/máximo (números)
- **options**: Opciones para select/radio (separadas por coma)
- **Help text**: Texto de ayuda
- **Placeholder**: Texto de ejemplo

#### Ejemplo: Categoría "Proyectos"

```json
{
  "id": "proyectos",
  "name": "Proyectos",
  "description": "Proyectos estudiantiles y profesionales",
  "icon": "FaProjectDiagram",
  "fields": [
    {
      "id": "titulo",
      "name": "Título",
      "type": "text",
      "required": true,
      "searchable": true,
      "validation": { "maxLength": 100 }
    },
    {
      "id": "descripcion",
      "name": "Descripción",
      "type": "textarea",
      "required": true,
      "searchable": true
    },
    {
      "id": "categoria",
      "name": "Categoría",
      "type": "select",
      "required": true,
      "validation": {
        "options": "educacion,negocios,sector_publico,institucional"
      }
    },
    {
      "id": "imagen",
      "name": "Imagen principal",
      "type": "image",
      "required": true
    },
    {
      "id": "tecnologias",
      "name": "Tecnologías",
      "type": "tags",
      "helpText": "Separar por comas"
    },
    {
      "id": "destacado",
      "name": "Proyecto destacado",
      "type": "boolean"
    }
  ]
}
```

#### Editar/Eliminar Categorías

- **Editar**: Click en el botón "Editar" de la categoría
- **Eliminar**: Click en "Eliminar" (confirma si tiene items asociados)
- ⚠️ **Precaución**: Eliminar una categoría NO elimina sus items automáticamente

---

### 📝 Gestión de Items (Contenidos)

Los items son los contenidos que creas para cada categoría.

#### Crear un Item

1. **Navegación**: Admin → Items → "Nuevo Item"
2. **Seleccionar categoría**: Elige el tipo de contenido
3. **Rellenar formulario**: El formulario se genera automáticamente según la categoría
4. **Seleccionar estado**:
   - **📝 Borrador**: No visible en el sitio público
   - **✅ Publicado**: Visible en el sitio
   - **📦 Archivado**: Oculto pero conservado

#### Ejemplo: Crear un Proyecto

```
Categoría: Proyectos
Estado: Publicado

Campos:
- Título: "Ciento01: Lógica de programación"
- Descripción: "Plataforma interactiva para aprender"
- Categoría: educacion
- Imagen: /img/proyectos/ciento01.png
- Tecnologías: React, TypeScript, Node.js
- Destacado: ✓
```

#### Filtrar Items

En la vista de items puedes filtrar por:
- **Categoría**: Mostrar solo items de un tipo
- **Estado**: Published, Draft, Archived, o todos

#### Editar/Eliminar Items

- **Editar**: Click en el ícono de lápiz
- **Eliminar**: Click en el ícono de papelera (confirma la acción)

---

### 🎨 Editor de Diseño

Personaliza la apariencia visual del sitio sin tocar CSS.

#### Tab 1: Colores

Define la paleta de colores completa:
- **Primary**: Color principal (botones, links)
- **Secondary**: Color secundario
- **Background**: Fondo de la página
- **Surface**: Fondo de tarjetas y componentes
- **Text**: Color del texto principal
- **Text Secondary**: Color del texto secundario
- **Accent**: Color de acento (highlight)
- **Success**: Color de éxito (verde)
- **Warning**: Color de advertencia (amarillo)
- **Error**: Color de error (rojo)
- **Info**: Color de información (azul)

**Cómo usar:**
- Click en el cuadro de color
- Usa el selector visual o ingresa código hex
- Los cambios se aplican al guardar

#### Tab 2: Tipografía

Configura las fuentes y tamaños:

**Familias de fuente:**
- **Primary**: Fuente del cuerpo (texto general)
- **Heading**: Fuente de títulos
- **Mono**: Fuente monoespaciada (código)

**Tamaños de fuente:**
- xs, sm, base, lg, xl, 2xl, 3xl, 4xl

**Pesos de fuente:**
- Light, Normal, Medium, Semibold, Bold

#### Tab 3: Espaciado

Define el sistema de espaciado:
- **Spacing**: xs, sm, md, lg, xl, 2xl, 3xl
- **Border Radius**: Bordes redondeados (sm, md, lg, xl, full)

#### Tab 4: Efectos

Configura efectos visuales:

**Partículas:**
- Enabled: Activar/desactivar
- Count: Cantidad de partículas (1-200)
- Color: Color de las partículas
- Speed: Velocidad (0.1-2)
- Size: Tamaño (1-10)

**Animaciones:**
- Level: none, low, medium, high
- Duration: Duración de transiciones
- Easing: Curva de animación

**Blur:**
- Enabled: Activar desenfoque de fondo
- Amount: Intensidad del blur

#### Tab 5: Logo

Configura el logo del sitio:
- **Path**: Ruta del archivo de logo
- **Width/Height**: Dimensiones normales
- **Compact Width/Height**: Dimensiones en modo compacto (móvil)

---

### ⚙️ Configuración General

Configura parámetros globales del sitio.

#### Información del Sitio

- **Name**: Nombre completo del sitio
- **Short Name**: Nombre corto (para PWA)
- **Tagline**: Lema o frase característica
- **Description**: Descripción del sitio
- **URL**: URL del sitio en producción
- **Language**: Código de idioma (es, en, etc.)
- **Timezone**: Zona horaria

#### SEO

- **Title**: Título para motores de búsqueda
- **Description**: Meta descripción
- **Keywords**: Palabras clave (separadas por coma)
- **OG Image**: Imagen para compartir en redes
- **Twitter Handle**: Usuario de Twitter

#### Características

Activa/desactiva funcionalidades:
- ✓ Voice Search: Búsqueda por voz
- ✓ Text Search: Búsqueda por texto
- ✓ Dark Mode: Modo oscuro
- ✓ Particles: Partículas de fondo
- ✓ Animations: Animaciones
- ✓ PWA: Progressive Web App
- ✓ Analytics: Google Analytics

#### Búsqueda

- **Placeholder**: Texto del input de búsqueda
- **Voice Button Text**: Texto del botón de voz
- **Max Results**: Resultados máximos a mostrar
- **Fuzzy Search**: Búsqueda difusa (tolerante a errores)
- **Search in Fields**: Campos donde buscar

---

## 📂 Estructura de Archivos

### Archivos de Datos (JSON)

```
src/data/
├── config.json          # Configuración del sitio
├── theme.json           # Tema y estilos
├── categories.json      # Definición de categorías
└── items/
    ├── proyectos.json   # Items de la categoría "proyectos"
    ├── testimonios.json # Items de otras categorías
    └── ...
```

### Archivos Importantes

```
src/
├── admin/              # Panel de administración
│   ├── AdminApp.tsx    # Router del admin
│   ├── AdminLayout.tsx # Layout con sidebar
│   ├── pages/          # Páginas del admin
│   ├── styles/         # Estilos del admin
│   └── utils/          # FileManager
├── components/         # Componentes del sitio público
├── hooks/              # React hooks
│   ├── useAppConfig.ts # Lee config.json
│   ├── useThemeConfig.ts # Lee theme.json
│   └── useProjects.ts  # Lee items
├── data/               # Archivos JSON
└── App.tsx             # Aplicación principal
```

---

## 🔄 Migración de Datos

Si tienes datos existentes en `src/data/projects.ts`, usa el script de migración:

```bash
npm run migrate
```

Este script:
1. Lee `src/data/projects.ts`
2. Convierte cada proyecto a formato JSON
3. Genera IDs únicos
4. Guarda en `src/data/items/proyectos.json`

**Revisión post-migración:**
1. Abre `src/data/items/proyectos.json`
2. Verifica que los datos sean correctos
3. Accede al admin: http://localhost:5173/admin/items
4. Edita y personaliza según necesites

---

## 🚀 Despliegue en Producción

### 1. Build de Producción

```bash
npm run build
```

Esto genera la carpeta `dist/` con todos los archivos optimizados.

### 2. Despliegue

#### Vercel / Netlify

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

**Configuración:**
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18+

#### Servidor Propio (Nginx)

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/tu-proyecto/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /admin {
        try_files $uri /index.html;
    }
}
```

### 3. Variables de Entorno

Crea `.env.production`:

```env
VITE_API_URL=https://tu-api.com
VITE_ADMIN_PASSWORD=tu-password-seguro
```

---

## 🔐 Seguridad

### Protección del Admin (Próximamente)

El sistema incluirá autenticación simple con password. Mientras tanto:

1. **No expongas el admin públicamente** en producción sin protección
2. Usa un **reverse proxy** con autenticación básica:

```nginx
location /admin {
    auth_basic "Admin Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
    try_files $uri /index.html;
}
```

3. Genera el archivo de passwords:

```bash
htpasswd -c /etc/nginx/.htpasswd admin
```

---

## 🎯 Flujo de Trabajo Recomendado

### Desarrollo de Contenido

1. **Planifica tus categorías**
   - Define qué tipos de contenido necesitas
   - Piensa en los campos que requiere cada uno

2. **Crea las categorías**
   - Define campos con validaciones apropiadas
   - Añade help text para facilitar la edición

3. **Crea contenido de prueba**
   - Crea 2-3 items por categoría
   - Verifica que se muestren correctamente

4. **Personaliza el diseño**
   - Ajusta colores a tu marca
   - Configura tipografía y espaciado
   - Activa/desactiva efectos según preferencia

5. **Configura el sitio**
   - Completa información SEO
   - Activa características necesarias
   - Configura búsqueda

6. **Producción**
   - Crea todo el contenido real
   - Revisa en dispositivos móviles
   - Despliega a producción

### Control de Versiones

```bash
# Después de cambios importantes
git add src/data/*.json
git commit -m "feat: agregar nuevos proyectos"
git push
```

**Ventajas:**
- ✅ Historial completo de cambios
- ✅ Rollback fácil si algo falla
- ✅ Trabajo en equipo con branches
- ✅ Sincronización entre ambientes

---

## 🆘 Solución de Problemas

### Error: "Failed to load config"

**Causa**: No se encuentra `config.json`
**Solución**: Verifica que existe `src/data/config.json`

### Los items no aparecen

**Causa**: Estado es "draft" en lugar de "published"
**Solución**: Edita el item y cambia estado a "Published"

### Los colores no se aplican

**Causa**: Las CSS variables no se están inyectando
**Solución**: 
1. Verifica que `theme.json` existe
2. Revisa la consola del navegador
3. Recarga con Ctrl+Shift+R

### El admin no carga

**Causa**: Rutas del router no configuradas
**Solución**: Verifica que `AdminApp.tsx` tiene todas las rutas

### Error de TypeScript

**Causa**: Tipos no coinciden
**Solución**: Ejecuta `npm run build` para ver errores completos

---

## 📚 Recursos Adicionales

### Documentación de Referencia

- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **React Hook Form**: https://react-hook-form.com
- **TanStack Query**: https://tanstack.com/query

### Iconos

Usa Font Awesome icons: https://fontawesome.com/icons

Ejemplo de iconos comunes:
- `FaFolder` - Carpeta
- `FaProjectDiagram` - Proyectos
- `FaUsers` - Usuarios
- `FaComments` - Testimonios
- `FaShoppingCart` - Productos
- `FaNewspaper` - Blog

---

## 🤝 Soporte

¿Necesitas ayuda?

1. Revisa esta guía completa
2. Busca en la sección "Solución de Problemas"
3. Revisa los archivos de ejemplo en `src/data/`
4. Consulta el código de componentes en `src/admin/pages/`

---

## 📝 Changelog

### Versión 1.0.0 (Nov 2025)
- ✅ Sistema de categorías con Schema Builder
- ✅ CRUD completo de items
- ✅ Editor de diseño visual
- ✅ Configuración global
- ✅ Panel de administración completo
- ✅ Sistema de archivos JSON
- ✅ Script de migración
- ✅ Hooks para cargar datos dinámicamente

### Próximas Características
- 🔐 Autenticación con password
- 📤 Upload de imágenes
- 🔍 Búsqueda en el admin
- 📊 Estadísticas avanzadas
- 🌐 Multiidioma
- 📱 App móvil para admin

---

**¡Disfruta creando contenido sin límites! 🚀**
