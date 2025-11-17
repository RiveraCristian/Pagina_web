# Guía de Uso - Single Page Application

## 🎯 Flujo de Usuario

### 1. Pantalla Inicial

Al cargar la aplicación, verás:

- Fondo negro completo
- Logo "COLABI" centrado con subtítulo "Innovación Tecnológica"
- Texto "Haz clic para comenzar" parpadeando suavemente

### 2. Activar el Input

Haz clic en cualquier parte del logo y verás:
- El input de texto aparece con animación suave debajo del logo
- El cursor se posiciona automáticamente en el input
- Placeholder: "Cuéntame a qué te dedicas o qué estás buscando…"

### 3. Realizar una Consulta
Escribe algo relacionado con tu actividad o necesidad, por ejemplo:
- "soy corredor de seguros"
- "trabajo en un colegio"
- "necesito un dashboard para mi empresa"
- "soy del sector público"

Presiona **Enter** para enviar la consulta.

### 4. Ver Resultados
Después de un breve momento (simulando procesamiento IA):
- Aparece una sección en la parte inferior de la pantalla
- Se muestra un título contextual basado en tu consulta
- Un subtítulo descriptivo
- Una galería horizontal de proyectos relevantes

### 5. Explorar Proyectos
Cada tarjeta de proyecto muestra:
- Una imagen representativa (o placeholder si no existe)
- Nombre del proyecto
- Descripción breve personalizada

Puedes:
- Hacer scroll horizontal para ver más proyectos
- Hacer hover sobre las tarjetas para ver efectos de zoom
- Escribir nuevas consultas en cualquier momento

## 🔍 Ejemplos de Consultas

### Para Seguros
```
"soy corredor de seguros"
"trabajo con garantías"
"necesito cotizador"
```
**Resultado**: Mostrará proyectos de plataformas de seguros y cotizadores

### Para Educación
```
"trabajo en un colegio"
"soy director de escuela"
"necesito sistema educativo"
```
**Resultado**: Mostrará plataformas educativas

### Para Sector Público
```
"trabajo en el gobierno"
"soy de la municipalidad"
"sector público"
```
**Resultado**: Mostrará observatorios de datos y herramientas para gobierno

### Para Negocios
```
"necesito un dashboard"
"analytics para mi empresa"
"quiero ver métricas de ventas"
```
**Resultado**: Mostrará dashboards de análisis empresarial

### Consulta General
```
"quiero ver proyectos"
"qué hacen ustedes"
"cuéntame más"
```
**Resultado**: Mostrará un mix de proyectos variados

## ⚙️ Configuración Avanzada

### Agregar Imágenes Reales

1. Navega a la carpeta `public/img/proyectos/`
2. Agrega tus imágenes con los nombres especificados en `src/data/projects.ts`:
   - `pri1.png` y `pri2.png` - Plataforma de seguros
   - `omed1.png` - Observatorio de datos
   - `edu1.png` - Plataforma educativa
   - `analytics1.png` - Dashboard de analytics

3. Recomendaciones para las imágenes:
   - Formato: PNG o JPG
   - Resolución: 800x600px o similar (ratio 4:3)
   - Peso: Menos de 500KB
   - Contenido: Screenshots de los proyectos reales

### Agregar Más Proyectos

Edita `src/data/projects.ts` y agrega nuevos objetos al array:

```typescript
{
  id: "nuevo-proyecto-id",           // ID único
  categoria: "categoria",             // Para filtrado interno
  nombre: "Nombre del Proyecto",      // Se muestra en la tarjeta
  fraseDefault: "Descripción...",     // Texto por defecto
  imagenes: ["/img/proyectos/img.png"] // Array de imágenes
}
```

### Personalizar Reglas de IA

Edita `src/services/aiSceneService.ts` para agregar más reglas:

```typescript
if (q.includes("palabra clave")) {
  return {
    titulo: "Título personalizado",
    subtitulo: "Subtítulo descriptivo",
    proyectos: [
      { id: "id-del-proyecto" },
      { id: "otro-proyecto", frase: "Frase custom" }
    ]
  };
}
```

### Cambiar Nombre de la Empresa

Edita `src/components/LogoHero.tsx`:

```tsx
<h1 className="logo-text">TU EMPRESA</h1>
<p className="logo-subtitle">Tu Tagline</p>
```

### Personalizar Colores

Edita las variables en los archivos CSS:

**Logo** (`src/styles/LogoHero.css`):
```css
background: linear-gradient(135deg, #ffffff 0%, #888888 100%);
```

**Input** (`src/styles/PromptBox.css`):
```css
border: 2px solid rgba(255, 255, 255, 0.1);
```

**Tarjetas** (`src/styles/SceneView.css`):
```css
background: rgba(255, 255, 255, 0.03);
```

## 🚀 Deployment

### Build de Producción

```bash
npm run build
```

Esto genera una carpeta `dist/` con todos los archivos optimizados.

### Opciones de Hosting

**Vercel** (Recomendado):
1. Instala Vercel CLI: `npm i -g vercel`
2. Ejecuta: `vercel`
3. Sigue las instrucciones

**Netlify**:
1. Arrastra la carpeta `dist/` a netlify.com/drop
2. O conecta tu repositorio de Git

**GitHub Pages**:
1. Configura en `vite.config.ts`: `base: '/nombre-repo/'`
2. Build: `npm run build`
3. Deploy la carpeta `dist/`

**Servidor Propio**:
1. Copia el contenido de `dist/` a tu servidor
2. Configura tu servidor web (Apache, Nginx, etc.) para servir archivos estáticos

## 🐛 Solución de Problemas

### Las imágenes no se cargan
- Verifica que las rutas en `projects.ts` coincidan con los archivos en `public/img/proyectos/`
- Las rutas deben empezar con `/img/...` (no incluir `public`)
- La aplicación mostrará un placeholder automático si falta la imagen

### El servidor no inicia
```bash
# Reinstala dependencias
rm -rf node_modules package-lock.json
npm install

# Intenta en otro puerto
npm run dev -- --port 3000
```

### Errores de TypeScript
```bash
# Verifica la configuración
npm run type-check

# Si persiste, reinicia el servidor
```

### La IA no responde correctamente
- Revisa `src/services/aiSceneService.ts`
- Agrega más palabras clave o ajusta las reglas existentes
- Verifica la consola del navegador para errores

## 💡 Tips y Trucos

1. **Testing rápido**: Abre las DevTools (F12) y revisa la consola para ver logs de debug

2. **Múltiples proyectos**: Puedes devolver varios proyectos en una respuesta:
   ```typescript
   proyectos: [
     { id: "proyecto-1" },
     { id: "proyecto-2" },
     { id: "proyecto-3" }
   ]
   ```

3. **Frases personalizadas**: Usa el campo `frase` en la respuesta de la IA para customizar la descripción:
   ```typescript
   proyectos: [
     { id: "proyecto-1", frase: "Texto personalizado para este contexto" }
   ]
   ```

4. **Animaciones**: Todas las animaciones están definidas en CSS con `@keyframes`, puedes ajustar velocidades y efectos

5. **Responsive**: La app es responsive por defecto, pero puedes ajustar breakpoints en los archivos CSS

## 📞 Soporte

Si tienes dudas o problemas:
1. Revisa la documentación en `README.md`
2. Consulta los comentarios en el código fuente
3. Verifica la consola del navegador para errores
4. Revisa que todas las dependencias estén instaladas correctamente

---

**¡Disfruta tu nueva Single Page Application con IA!** 🎉
