# 📚 Guía Completa: Cómo Agregar Contenido a la Página Web

## 🎯 **Introducción**

Esta guía te enseña paso a paso cómo agregar contenido a tu página web a través del **Panel de Administración**. Aprenderás a crear categorías, páginas, contenido y configurar todo correctamente.

---

## 🏗️ **Estructura del Sistema**

### Tipos de Contenido:
1. **🏷️ Categorías** - Organizan el contenido por temas
2. **📄 Páginas** - Páginas estáticas del sitio
3. **📋 Elementos** - Contenido dentro de cada categoría
4. **⚙️ Configuración** - Ajustes generales del sitio

---

## 🚀 **PASO 1: Acceder al Panel de Administración**

### 1.1 Iniciar Sesión
```
1. Ve a: http://localhost:5173/admin
2. Ingresa la contraseña (por defecto: "admin123")
3. Haz clic en "Iniciar Sesión"
```

### 1.2 Navegación del Panel
- **🏠 Dashboard**: Resumen general
- **🏷️ Categorías**: Gestión de categorías
- **📋 Contenido**: Elementos dentro de categorías
- **📄 Páginas**: Páginas estáticas
- **⚙️ Configuración**: Ajustes del sitio
- **🎨 Diseño**: Personalización visual
- **🤖 IA y Búsqueda**: Configuración de búsqueda

---

## 🏷️ **PASO 2: Crear una Nueva Categoría**

### 2.1 Acceder a Categorías
```
Panel Admin > Categorías > + Nueva Categoría
```

### 2.2 Completar Formulario de Categoría
```
✅ Nombre: "Servicios" (será visible para usuarios)
✅ ID: "servicios" (identificador único, sin espacios)
✅ Descripción: "Nuestros servicios profesionales"
✅ Icono: "FaBriefcase" (opcional, ver lista de iconos)
✅ Orden: 2 (orden de aparición)
```

### 2.3 Configurar Campos de la Categoría
**Campos obligatorios que debes agregar:**

#### Campo Título:
- **ID**: `title`
- **Nombre**: `title`
- **Etiqueta**: `Título del Servicio`
- **Tipo**: `text`
- **Requerido**: ✅ Sí
- **Buscable**: ✅ Sí

#### Campo Descripción:
- **ID**: `description`
- **Nombre**: `description`
- **Etiqueta**: `Descripción`
- **Tipo**: `textarea`
- **Requerido**: ✅ Sí
- **Buscable**: ✅ Sí

#### Campo Imagen:
- **ID**: `image`
- **Nombre**: `image`
- **Etiqueta**: `Imagen`
- **Tipo**: `image`
- **Requerido**: ❌ No
- **Buscable**: ❌ No

### 2.4 Guardar Categoría
```
Clic en "Guardar Categoría"
```

---

## 📋 **PASO 3: Agregar Contenido a la Categoría**

### 3.1 Acceder al Contenido
```
Panel Admin > Contenido > Seleccionar categoría "Servicios"
```

### 3.2 Crear Nuevo Elemento
```
Clic en "+ Nuevo Elemento"
```

### 3.3 Completar el Formulario
```
✅ Título del Servicio: "Desarrollo Web"
✅ Descripción: "Creamos sitios web modernos y responsivos"
✅ Imagen: (subir archivo opcional)
✅ Palabras Clave: "web, desarrollo, frontend, backend"
```

### 3.4 Guardar Elemento
```
Clic en "Guardar"
```

---

## 📄 **PASO 4: Crear una Página Estática**

### 4.1 Acceder a Páginas
```
Panel Admin > Páginas > + Nueva Página
```

### 4.2 Completar Formulario de Página
```
✅ Título: "Contacto"
✅ Slug: "contacto" (URL: /contacto)
✅ Contenido: "Información de contacto de la empresa..."
✅ SEO Título: "Contacto - Colabi Spa"
✅ SEO Descripción: "Ponte en contacto con nosotros"
✅ Estado: "Publicado"
```

### 4.3 Guardar Página
```
Clic en "Guardar Página"
```

---

## 🔧 **PASO 5: Verificar que el Contenido Aparezca**

### 5.1 Estructura de Archivos Necesaria

**Después de crear la categoría "servicios", verifica estos archivos:**

```
src/data/
├── categories.json          ← Debe incluir la nueva categoría
├── items/
│   ├── proyectos.json      ← Ya existe
│   └── servicios.json      ← Se crea automáticamente
└── pages.json              ← Debe incluir la nueva página
```

### 5.2 Verificar categories.json
```json
{
  "categories": [
    {
      "id": "proyectos",
      "name": "Proyectos",
      // ... configuración existente
    },
    {
      "id": "servicios",           ← NUEVA CATEGORÍA
      "name": "Servicios",
      "slug": "servicios",
      "icon": "FaBriefcase",
      "description": "Nuestros servicios profesionales",
      "itemsFile": "items/servicios.json",
      "searchWeight": 1,
      "displayOrder": 2,
      "fields": [
        // ... campos configurados
      ]
    }
  ]
}
```

### 5.3 Verificar items/servicios.json
```json
{
  "items": [
    {
      "id": "desarrollo-web",
      "title": "Desarrollo Web",
      "description": "Creamos sitios web modernos y responsivos",
      "categoria": "servicios",
      "keywords": ["web", "desarrollo", "frontend", "backend"],
      "createdAt": "2025-11-21T14:00:00.000Z"
    }
  ]
}
```

---

## 🚨 **SOLUCIÓN DE PROBLEMAS COMUNES**

### ❌ **Problema 1: "La categoría no aparece en la búsqueda"**

**Causa:** El archivo `items/[categoria].json` no existe o está vacío.

**Solución:**
```
1. Ve a: Panel Admin > Contenido
2. Selecciona tu categoría
3. Agrega al menos 1 elemento
4. Guarda el elemento
5. Verifica que se creó: src/data/items/[categoria].json
```

### ❌ **Problema 2: "La página no se encuentra"**

**Causa:** La página no está publicada o el slug es incorrecto.

**Solución:**
```
1. Ve a: Panel Admin > Páginas
2. Encuentra tu página
3. Verifica que Estado = "Publicado"
4. Verifica que el Slug no tenga espacios ni caracteres especiales
5. Guarda los cambios
```

### ❌ **Problema 3: "El contenido no aparece en la búsqueda"**

**Causa:** Los campos no están marcados como "buscables" o faltan keywords.

**Solución:**
```
1. Ve a: Panel Admin > Categorías
2. Edita la categoría
3. Verifica que los campos importantes tengan "Buscable = Sí"
4. Ve a: Panel Admin > Contenido
5. Edita el elemento
6. Agrega palabras clave relevantes
7. Guarda los cambios
```

### ❌ **Problema 4: "Error al guardar"**

**Causa:** Campos requeridos vacíos o problemas de conexión.

**Solución:**
```
1. Verifica que todos los campos marcados como "Requeridos" estén completos
2. Verifica que el servidor esté ejecutándose (npm run dev)
3. Revisa la consola del navegador para errores
4. Recarga la página e intenta nuevamente
```

---

## 🎯 **MEJORES PRÁCTICAS**

### 📝 **Para Categorías:**
```
✅ Usa nombres descriptivos y claros
✅ IDs en minúsculas, sin espacios (usa guiones: "sobre-nosotros")
✅ Siempre incluye campos "title" y "description" como buscables
✅ Ordena las categorías lógicamente (displayOrder)
```

### 📝 **Para Contenido:**
```
✅ Títulos descriptivos y únicos
✅ Descripciones detalladas (mínimo 50 caracteres)
✅ Usa palabras clave relevantes
✅ Agrega imágenes para mejor presentación
✅ Mantén el contenido actualizado
```

### 📝 **Para Páginas:**
```
✅ URLs amigables (slug sin espacios ni caracteres especiales)
✅ Títulos SEO optimizados
✅ Descripciones meta informativas
✅ Contenido estructurado con párrafos
✅ Estado "Publicado" para que sea visible
```

---

## 🔍 **VERIFICACIÓN FINAL**

### Checklist de Contenido Publicado:

#### ✅ **Para Categorías:**
- [ ] Categoría creada en Panel Admin
- [ ] Archivo `src/data/categories.json` actualizado
- [ ] Campos configurados correctamente
- [ ] Al menos 1 elemento agregado

#### ✅ **Para Elementos:**
- [ ] Elemento creado en Panel Admin
- [ ] Archivo `src/data/items/[categoria].json` creado
- [ ] Campos requeridos completados
- [ ] Palabras clave agregadas

#### ✅ **Para Páginas:**
- [ ] Página creada en Panel Admin
- [ ] Archivo `src/data/pages.json` actualizado
- [ ] Estado = "Publicado"
- [ ] Slug configurado correctamente

### Prueba Final:
```
1. Ve a: http://localhost:5173
2. Haz clic en el logo para activar búsqueda
3. Busca términos de tu contenido nuevo
4. Verifica que aparezca en los resultados
```

---

## 📞 **¿Necesitas Ayuda?**

Si sigues teniendo problemas:

1. **Verifica el servidor:**
   ```bash
   npm run dev
   ```

2. **Revisa la consola del navegador:**
   ```
   F12 > Consola > Busca errores en rojo
   ```

3. **Verifica los archivos JSON:**
   ```
   Asegúrate de que no hay errores de sintaxis
   ```

4. **Reinicia el servidor:**
   ```bash
   Ctrl + C (para parar)
   npm run dev (para iniciar)
   ```

---

## 🎉 **¡Listo!**

Siguiendo esta guía paso a paso, podrás agregar cualquier tipo de contenido a tu página web. El sistema está diseñado para ser intuitivo y potente, permitiendo crear sitios web dinámicos y completamente buscables.

**Recuerda:** Siempre guarda los cambios y verifica que el contenido aparezca tanto en el admin como en la búsqueda del sitio principal.

---

## 📋 **Ejemplo Completo: Agregar Sección "Equipo"**

### Paso a Paso Completo:

#### 1. Crear Categoría "Equipo"
```
Panel Admin > Categorías > + Nueva Categoría

✅ Nombre: "Equipo"
✅ ID: "equipo"  
✅ Descripción: "Conoce a nuestro equipo profesional"
✅ Icono: "FaUsers"
✅ Orden: 3

Campos a agregar:
- title (texto, requerido, buscable)
- description (textarea, requerido, buscable)
- position (texto, requerido, buscable) - "Cargo"
- image (imagen, opcional)
- email (email, opcional)
- linkedin (url, opcional)
```

#### 2. Agregar Miembro del Equipo
```
Panel Admin > Contenido > Equipo > + Nuevo Elemento

✅ Título: "María González"
✅ Descripción: "Desarrolladora Full Stack con 5 años de experiencia..."
✅ Cargo: "Lead Developer"
✅ Email: "maria@colabi.tech"
✅ LinkedIn: "https://linkedin.com/in/mariagonzalez"
✅ Imagen: (subir foto)
```

#### 3. Verificar Resultado
```
1. Guardar elemento
2. Ir a sitio principal: http://localhost:5173
3. Buscar "María" o "desarrolladora" 
4. Verificar que aparece en resultados
```

¡Con esto tendrás una sección completa de equipo funcionando!

---

*Esta documentación cubre todos los casos de uso principales. Guárdala como referencia para futuros agregados de contenido.*