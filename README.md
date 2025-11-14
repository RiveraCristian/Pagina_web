# Single Page Application - Portafolio Interactivo con IA

Una aplicación web minimalista construida con React + Vite que utiliza IA para mostrar proyectos relevantes basados en consultas del usuario.

## 🚀 Características

- **Diseño minimalista**: Fondo negro con interacciones elegantes
- **Interacción con IA**: El usuario describe su necesidad y la IA sugiere proyectos relevantes
- **🎤 Entrada por voz**: Busca usando tu voz además de texto (Web Speech API)
- **Animaciones suaves**: Transiciones fluidas entre estados
- **Responsive**: Adaptado para dispositivos móviles y desktop
- **TypeScript**: Tipado fuerte para mayor seguridad y mantenibilidad

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

## 🔄 Próximas mejoras

- [ ] Integración con API de IA real (OpenAI, Claude, etc.)
- [ ] Sistema de filtros avanzados
- [ ] Modo claro/oscuro
- [ ] Historial de búsquedas
- [ ] Animaciones más elaboradas
- [ ] Panel de administración para gestionar proyectos

## 📝 Notas

- Las imágenes de los proyectos deben colocarse en `public/img/proyectos/`
- Si una imagen no existe, se muestra un placeholder automático
- El servicio de IA actual es un mock que usa reglas simples
- La estructura está diseñada para escalar fácilmente
- **Entrada por voz**: Funciona en Chrome, Edge y Safari. Ver `VOICE_FEATURE.md` para más detalles

## 📄 Licencia

MIT
