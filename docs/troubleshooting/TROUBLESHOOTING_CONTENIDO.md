# 🚨 Troubleshooting: Soluciones a Problemas Específicos

## ❌ **PROBLEMA 1: "Agregué una página y no funciona"**

### 🔍 **Diagnóstico Paso a Paso:**

#### 1️⃣ **Verificar que la página se creó correctamente**
```bash
# Verifica que existe el archivo:
src/data/pages.json
```

**El archivo debe contener tu página:**
```json
{
  "pages": [
    {
      "title": "Tu Página",
      "slug": "tu-pagina",          ← URL será /tu-pagina
      "content": "Contenido...",
      "status": "published",        ← DEBE ser "published"
      "id": "page-123456789",
      "createdAt": "2025-11-21T...",
      "updatedAt": "2025-11-21T..."
    }
  ]
}
```

#### 2️⃣ **Problemas Comunes y Soluciones:**

**❌ Estado incorrecto:**
```json
"status": "draft"     ← MAL (no se muestra)
"status": "published" ← BIEN (se muestra)
```

**❌ Slug con problemas:**
```json
"slug": "Mi Página"           ← MAL (espacios)
"slug": "mi página"           ← MAL (espacios)
"slug": "mi_página"           ← MAL (acentos)
"slug": "mi-pagina"           ← BIEN
```

**❌ Contenido vacío:**
```json
"content": ""                 ← MAL (vacío)
"content": "Contenido real"   ← BIEN
```

#### 3️⃣ **Cómo Solucionarlo:**
```
1. Ve a: Panel Admin > Páginas
2. Encuentra tu página en la lista
3. Haz clic en "✏️ Editar"
4. Verifica:
   - Estado = "Publicado"
   - Slug sin espacios ni acentos
   - Contenido no esté vacío
5. Clic en "Guardar Página"
6. Prueba la URL: http://localhost:5173/tu-slug
```

---

## ❌ **PROBLEMA 2: "Agregué categoría 'Sobre Nosotros' y no se muestra"**

### 🔍 **Diagnóstico Paso a Paso:**

#### 1️⃣ **Verificar la estructura de archivos**

**Después de crear "Sobre Nosotros" deben existir:**
```
src/data/
├── categories.json              ← Debe tener la categoría
└── items/
    └── nosotros.json           ← Debe tener contenido
```

#### 2️⃣ **Verificar categories.json**
```json
{
  "categories": [
    {
      "id": "nosotros",                    ← ID único
      "name": "Sobre Nosotros",           ← Nombre visible
      "slug": "nosotros",                 ← Para URLs
      "description": "Información sobre nosotros",
      "itemsFile": "items/nosotros.json", ← Archivo de contenido
      "searchWeight": 1,
      "displayOrder": 2,                   ← Orden de aparición
      "fields": [
        // Campos configurados...
      ]
    }
  ]
}
```

#### 3️⃣ **Verificar que existe contenido**

**El archivo `src/data/items/nosotros.json` debe existir:**
```json
{
  "items": [
    {
      "id": "sobre-colabi",
      "titulo": "Sobre Colabi Spa",
      "descripcion": "Colabi es una consultora...",
      "categoria": "nosotros",              ← DEBE coincidir con ID de categoría
      "keywords": ["colabi", "consultora", "tecnología"]
    }
  ]
}
```

#### 4️⃣ **Problemas Comunes:**

**❌ Archivo de items no existe:**
```
src/data/items/nosotros.json  ← No existe
```
**✅ Solución:**
```
1. Ve a: Panel Admin > Contenido
2. Selecciona categoría "Sobre Nosotros"
3. Clic en "+ Nuevo Elemento"
4. Completa al menos título y descripción
5. Guarda
```

**❌ Categoría sin elementos:**
```json
{
  "items": []  ← Array vacío = no aparece en búsqueda
}
```

**❌ Campo "categoria" no coincide:**
```json
// En categories.json:
"id": "nosotros"

// En nosotros.json:
"categoria": "sobre-nosotros"  ← MAL (no coincide)
"categoria": "nosotros"        ← BIEN (coincide)
```

#### 5️⃣ **Cómo Solucionarlo:**

**Opción A: Desde el Admin (Recomendado)**
```
1. Panel Admin > Categorías
2. Busca "Sobre Nosotros" en la lista
3. Si no está, crea nueva categoría:
   - Nombre: "Sobre Nosotros"  
   - ID: "nosotros"
   - Descripción: "Información sobre nosotros"
4. Agrega campos básicos (título, descripción)
5. Guarda categoría

6. Panel Admin > Contenido
7. Selecciona "Sobre Nosotros"
8. "+ Nuevo Elemento"
9. Completa información
10. Guarda
```

**Opción B: Verificación Manual**
```
1. Abre: src/data/categories.json
2. Busca tu categoría
3. Anota el "id" (ej: "nosotros")
4. Abre: src/data/items/[id].json
5. Verifica que existe y tiene contenido
6. Verifica que cada item tiene "categoria": "[id]"
```

---

## 🔧 **HERRAMIENTAS DE DIAGNÓSTICO**

### 1️⃣ **Verificador de Estructura**
```javascript
// Abrir consola del navegador (F12) y ejecutar:

// Verificar categorías
fetch('/api/categories')
  .then(r => r.json())
  .then(data => console.log('Categorías:', data));

// Verificar items de una categoría
fetch('/api/items/nosotros')
  .then(r => r.json())
  .then(data => console.log('Items nosotros:', data));

// Verificar páginas
fetch('/api/pages')
  .then(r => r.json())
  .then(data => console.log('Páginas:', data));
```

### 2️⃣ **Verificador de Búsqueda**
```javascript
// En la consola del navegador:
// Probar búsqueda directa
fetch('/api/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'nosotros' })
})
.then(r => r.json())
.then(data => console.log('Resultados búsqueda:', data));
```

### 3️⃣ **Verificador de Archivos**
```bash
# En terminal, desde la carpeta del proyecto:

# Listar archivos de datos
ls -la src/data/
ls -la src/data/items/

# Ver contenido de categories.json
cat src/data/categories.json

# Ver contenido de items específicos
cat src/data/items/nosotros.json
```

---

## ⚡ **SOLUCIONES RÁPIDAS**

### 🚀 **Fix Rápido 1: Recrear la categoría "Sobre Nosotros"**

```
1. Panel Admin > Categorías > + Nueva Categoría

Datos a llenar:
✅ Nombre: "Sobre Nosotros"
✅ ID: "nosotros"
✅ Descripción: "Información sobre nuestra empresa"
✅ Icono: "FaInfoCircle"
✅ Orden: 1

Campos a agregar:
- ID: "titulo", Tipo: "text", Requerido: Sí, Buscable: Sí
- ID: "descripcion", Tipo: "textarea", Requerido: Sí, Buscable: Sí

2. Guardar Categoría

3. Panel Admin > Contenido > Sobre Nosotros > + Nuevo Elemento

✅ Título: "Acerca de Colabi Spa"  
✅ Descripción: "Colabi es una consultora de desarrollo tecnológico..."

4. Guardar Elemento
```

### 🚀 **Fix Rápido 2: Página que no funciona**

```
1. Panel Admin > Páginas > Tu Página > Editar

Verificar:
✅ Estado: "Publicado" (no "Borrador")
✅ Slug: sin espacios (ej: "contacto", no "con tacto")  
✅ Contenido: no esté vacío
✅ Título: esté completo

2. Guardar Página

3. Probar URL: http://localhost:5173/tu-slug
```

### 🚀 **Fix Rápido 3: Reset completo del contenido**

```bash
# Si todo está muy roto, resetea los datos:

# 1. Parar el servidor
Ctrl + C

# 2. Limpiar datos
rm src/data/items/*.json
# (Deja solo proyectos.json si quieres conservarlo)

# 3. Reiniciar servidor  
npm run dev

# 4. Recrear todo desde Panel Admin
```

---

## 📋 **CHECKLIST DE VERIFICACIÓN**

### ✅ **Para Categorías que no aparecen:**
- [ ] Existe en `src/data/categories.json`
- [ ] Tiene un ID único válido (sin espacios, acentos)
- [ ] El archivo `src/data/items/[id].json` existe
- [ ] El archivo de items NO está vacío
- [ ] Cada item tiene `"categoria": "[id]"` correcto
- [ ] Los campos están configurados como "buscables"

### ✅ **Para Páginas que no funcionan:**
- [ ] Existe en `src/data/pages.json`  
- [ ] Estado es `"published"`
- [ ] Slug está bien formateado (sin espacios/acentos)
- [ ] Contenido no está vacío
- [ ] URL funciona: `http://localhost:5173/[slug]`

### ✅ **Para Contenido que no se encuentra:**
- [ ] Elemento guardado correctamente
- [ ] Campos "title" y "description" completos
- [ ] Palabras clave agregadas
- [ ] Campos marcados como "buscables" en la categoría
- [ ] Servidor reiniciado después de cambios

---

## 🆘 **SI NADA FUNCIONA**

### Último Recurso: Reset Total
```bash
# 1. Respaldar lo que quieras conservar
cp src/data/categories.json backup-categories.json
cp src/data/items/proyectos.json backup-proyectos.json

# 2. Parar servidor
Ctrl + C

# 3. Limpiar todo
rm -rf src/data/items/*.json
# Editar categories.json y dejar solo las categorías básicas

# 4. Reiniciar
npm run dev

# 5. Recrear desde cero usando Panel Admin
```

### Contacto de Emergencia:
```
Si sigues teniendo problemas:
1. Toma screenshot del error
2. Copia el contenido de categories.json
3. Anota los pasos exactos que seguiste
4. Busca ayuda con esa información específica
```

---

*Guarda esta guía como referencia para solucionar problemas rápidamente. La mayoría de problemas se solucionan siguiendo estos pasos.*