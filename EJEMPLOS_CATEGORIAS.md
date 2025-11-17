# 🎨 Ejemplos de Categorías - Framework Genérico

Este documento muestra ejemplos de diferentes categorías que puedes crear para distintos tipos de sitios web.

---

## 🏢 **Ejemplo 1: Sitio Web Corporativo**

### Categoría: "quienes-somos"
```json
{
  "id": "quienes-somos",
  "name": "Quiénes Somos",
  "description": "Secciones de la página Quiénes Somos",
  "icon": "FaInfoCircle",
  "fields": [
    {
      "id": "seccion",
      "name": "Nombre de la Sección",
      "type": "text",
      "required": true,
      "helpText": "Ej: Historia, Misión, Visión"
    },
    {
      "id": "titulo",
      "name": "Título",
      "type": "text",
      "required": true,
      "validation": { "maxLength": 100 }
    },
    {
      "id": "contenido",
      "name": "Contenido",
      "type": "richtext",
      "required": true,
      "helpText": "Texto completo de la sección"
    },
    {
      "id": "imagen",
      "name": "Imagen",
      "type": "image",
      "helpText": "Imagen representativa de la sección"
    },
    {
      "id": "orden",
      "name": "Orden de visualización",
      "type": "number",
      "required": true,
      "validation": { "min": 1 }
    },
    {
      "id": "destacado",
      "name": "Destacar esta sección",
      "type": "boolean"
    }
  ]
}
```

**Items de ejemplo:**
1. **Historia**: "Nuestra historia comenzó en 2010..."
2. **Misión**: "Transformar la industria mediante..."
3. **Visión**: "Ser líderes en innovación..."

---

### Categoría: "proyectos"
```json
{
  "id": "proyectos",
  "name": "Proyectos",
  "description": "Portfolio de proyectos realizados",
  "icon": "FaProjectDiagram",
  "fields": [
    {
      "id": "nombre",
      "name": "Nombre del Proyecto",
      "type": "text",
      "required": true
    },
    {
      "id": "descripcion_corta",
      "name": "Descripción Corta",
      "type": "textarea",
      "required": true,
      "validation": { "maxLength": 200 }
    },
    {
      "id": "descripcion_completa",
      "name": "Descripción Completa",
      "type": "richtext",
      "required": true
    },
    {
      "id": "cliente",
      "name": "Cliente/Empresa",
      "type": "text"
    },
    {
      "id": "industria",
      "name": "Industria",
      "type": "select",
      "validation": {
        "options": "Tecnología,Educación,Salud,Finanzas,Retail,Gobierno,Otros"
      }
    },
    {
      "id": "tecnologias",
      "name": "Tecnologías Utilizadas",
      "type": "tags",
      "helpText": "Separar por comas"
    },
    {
      "id": "imagen_principal",
      "name": "Imagen Principal",
      "type": "image",
      "required": true
    },
    {
      "id": "galeria",
      "name": "Galería de Imágenes",
      "type": "textarea",
      "helpText": "URLs separadas por comas"
    },
    {
      "id": "enlace_demo",
      "name": "Link Demo",
      "type": "url"
    },
    {
      "id": "fecha_inicio",
      "name": "Fecha de Inicio",
      "type": "date"
    },
    {
      "id": "fecha_fin",
      "name": "Fecha de Finalización",
      "type": "date"
    },
    {
      "id": "duracion_meses",
      "name": "Duración (meses)",
      "type": "number"
    },
    {
      "id": "equipo_personas",
      "name": "Tamaño del Equipo",
      "type": "number"
    },
    {
      "id": "presupuesto",
      "name": "Presupuesto",
      "type": "text",
      "helpText": "Ej: $50,000 - $100,000"
    },
    {
      "id": "destacado",
      "name": "Proyecto Destacado",
      "type": "boolean"
    }
  ]
}
```

**Items de ejemplo:**
1. **E-commerce Fashion Store**
2. **Sistema de Gestión Hospitalaria**
3. **App de Delivery de Comida**

---

### Categoría: "iniciativas"
```json
{
  "id": "iniciativas",
  "name": "Iniciativas",
  "description": "Iniciativas y programas especiales",
  "icon": "FaLightbulb",
  "fields": [
    {
      "id": "nombre",
      "name": "Nombre de la Iniciativa",
      "type": "text",
      "required": true
    },
    {
      "id": "descripcion",
      "name": "Descripción",
      "type": "richtext",
      "required": true
    },
    {
      "id": "tipo",
      "name": "Tipo de Iniciativa",
      "type": "select",
      "validation": {
        "options": "Social,Ambiental,Educativa,Tecnológica,Salud,Otra"
      }
    },
    {
      "id": "objetivo",
      "name": "Objetivo Principal",
      "type": "textarea"
    },
    {
      "id": "beneficiarios",
      "name": "Beneficiarios",
      "type": "text",
      "helpText": "Ej: 500 familias, 1000 estudiantes"
    },
    {
      "id": "estado",
      "name": "Estado",
      "type": "select",
      "validation": {
        "options": "En Planificación,En Ejecución,Completada,Pausada"
      }
    },
    {
      "id": "fecha_inicio",
      "name": "Fecha de Inicio",
      "type": "date",
      "required": true
    },
    {
      "id": "imagen",
      "name": "Imagen",
      "type": "image"
    },
    {
      "id": "impacto",
      "name": "Impacto Logrado",
      "type": "textarea",
      "helpText": "Métricas y resultados"
    },
    {
      "id": "aliados",
      "name": "Aliados/Partners",
      "type": "tags"
    }
  ]
}
```

**Items de ejemplo:**
1. **Programa de Reciclaje Comunitario**
2. **Becas para Jóvenes Talentos**
3. **Reforestación Urbana**

---

### Categoría: "colaboradores"
```json
{
  "id": "colaboradores",
  "name": "Colaboradores",
  "description": "Equipo de trabajo y colaboradores",
  "icon": "FaUsers",
  "fields": [
    {
      "id": "nombre_completo",
      "name": "Nombre Completo",
      "type": "text",
      "required": true
    },
    {
      "id": "cargo",
      "name": "Cargo/Posición",
      "type": "text",
      "required": true
    },
    {
      "id": "area",
      "name": "Área/Departamento",
      "type": "select",
      "validation": {
        "options": "Dirección,Desarrollo,Diseño,Marketing,Ventas,Administración,Operaciones"
      }
    },
    {
      "id": "foto",
      "name": "Foto de Perfil",
      "type": "image",
      "required": true
    },
    {
      "id": "bio",
      "name": "Biografía",
      "type": "textarea",
      "validation": { "maxLength": 300 }
    },
    {
      "id": "especialidades",
      "name": "Especialidades",
      "type": "tags",
      "helpText": "Habilidades principales"
    },
    {
      "id": "email",
      "name": "Email",
      "type": "email"
    },
    {
      "id": "linkedin",
      "name": "LinkedIn",
      "type": "url"
    },
    {
      "id": "twitter",
      "name": "Twitter",
      "type": "url"
    },
    {
      "id": "orden",
      "name": "Orden de visualización",
      "type": "number"
    },
    {
      "id": "mostrar_en_home",
      "name": "Mostrar en página principal",
      "type": "boolean"
    }
  ]
}
```

**Items de ejemplo:**
1. **Juan Pérez** - CEO
2. **María González** - Directora de Diseño
3. **Carlos López** - Lead Developer

---

## 🏪 **Ejemplo 2: E-commerce**

### Categoría: "productos"
```json
{
  "id": "productos",
  "name": "Productos",
  "description": "Catálogo de productos",
  "icon": "FaShoppingCart",
  "fields": [
    {
      "id": "nombre",
      "name": "Nombre del Producto",
      "type": "text",
      "required": true
    },
    {
      "id": "sku",
      "name": "SKU",
      "type": "text",
      "required": true
    },
    {
      "id": "descripcion",
      "name": "Descripción",
      "type": "richtext",
      "required": true
    },
    {
      "id": "precio",
      "name": "Precio",
      "type": "number",
      "required": true,
      "validation": { "min": 0 }
    },
    {
      "id": "precio_oferta",
      "name": "Precio en Oferta",
      "type": "number",
      "validation": { "min": 0 }
    },
    {
      "id": "categoria",
      "name": "Categoría",
      "type": "select",
      "validation": {
        "options": "Ropa,Electrónica,Hogar,Deportes,Belleza,Juguetes"
      }
    },
    {
      "id": "subcategoria",
      "name": "Subcategoría",
      "type": "text"
    },
    {
      "id": "marca",
      "name": "Marca",
      "type": "text"
    },
    {
      "id": "stock",
      "name": "Stock Disponible",
      "type": "number",
      "validation": { "min": 0 }
    },
    {
      "id": "imagen_principal",
      "name": "Imagen Principal",
      "type": "image",
      "required": true
    },
    {
      "id": "imagenes_adicionales",
      "name": "Imágenes Adicionales",
      "type": "textarea",
      "helpText": "URLs separadas por comas"
    },
    {
      "id": "tallas_disponibles",
      "name": "Tallas Disponibles",
      "type": "tags",
      "helpText": "Ej: S, M, L, XL"
    },
    {
      "id": "colores",
      "name": "Colores",
      "type": "tags"
    },
    {
      "id": "destacado",
      "name": "Producto Destacado",
      "type": "boolean"
    },
    {
      "id": "nuevo",
      "name": "Nuevo Ingreso",
      "type": "boolean"
    },
    {
      "id": "envio_gratis",
      "name": "Envío Gratis",
      "type": "boolean"
    }
  ]
}
```

---

## 📰 **Ejemplo 3: Blog/Revista**

### Categoría: "articulos"
```json
{
  "id": "articulos",
  "name": "Artículos",
  "description": "Artículos del blog",
  "icon": "FaNewspaper",
  "fields": [
    {
      "id": "titulo",
      "name": "Título",
      "type": "text",
      "required": true
    },
    {
      "id": "slug",
      "name": "URL Amigable",
      "type": "slug",
      "required": true
    },
    {
      "id": "resumen",
      "name": "Resumen",
      "type": "textarea",
      "validation": { "maxLength": 200 }
    },
    {
      "id": "contenido",
      "name": "Contenido",
      "type": "richtext",
      "required": true
    },
    {
      "id": "autor",
      "name": "Autor",
      "type": "text",
      "required": true
    },
    {
      "id": "categoria",
      "name": "Categoría",
      "type": "select",
      "validation": {
        "options": "Tecnología,Negocios,Lifestyle,Salud,Viajes,Cultura"
      }
    },
    {
      "id": "tags",
      "name": "Etiquetas",
      "type": "tags",
      "searchable": true
    },
    {
      "id": "imagen_portada",
      "name": "Imagen de Portada",
      "type": "image",
      "required": true
    },
    {
      "id": "fecha_publicacion",
      "name": "Fecha de Publicación",
      "type": "datetime",
      "required": true
    },
    {
      "id": "tiempo_lectura",
      "name": "Tiempo de Lectura (min)",
      "type": "number"
    },
    {
      "id": "destacado",
      "name": "Artículo Destacado",
      "type": "boolean"
    }
  ]
}
```

---

## 🎓 **Ejemplo 4: Instituto Educativo**

### Categoría: "cursos"
```json
{
  "id": "cursos",
  "name": "Cursos",
  "description": "Oferta de cursos y programas",
  "icon": "FaGraduationCap",
  "fields": [
    {
      "id": "nombre_curso",
      "name": "Nombre del Curso",
      "type": "text",
      "required": true
    },
    {
      "id": "codigo",
      "name": "Código del Curso",
      "type": "text",
      "required": true
    },
    {
      "id": "descripcion",
      "name": "Descripción",
      "type": "richtext",
      "required": true
    },
    {
      "id": "modalidad",
      "name": "Modalidad",
      "type": "select",
      "validation": {
        "options": "Presencial,Online,Híbrida"
      }
    },
    {
      "id": "nivel",
      "name": "Nivel",
      "type": "select",
      "validation": {
        "options": "Principiante,Intermedio,Avanzado"
      }
    },
    {
      "id": "duracion_horas",
      "name": "Duración (horas)",
      "type": "number"
    },
    {
      "id": "instructor",
      "name": "Instructor",
      "type": "text"
    },
    {
      "id": "precio",
      "name": "Precio",
      "type": "number"
    },
    {
      "id": "cupos",
      "name": "Cupos Disponibles",
      "type": "number"
    },
    {
      "id": "fecha_inicio",
      "name": "Fecha de Inicio",
      "type": "date"
    },
    {
      "id": "requisitos",
      "name": "Requisitos",
      "type": "textarea"
    },
    {
      "id": "certificacion",
      "name": "Incluye Certificación",
      "type": "boolean"
    }
  ]
}
```

---

## 🏥 **Ejemplo 5: Clínica/Hospital**

### Categoría: "servicios-medicos"
```json
{
  "id": "servicios-medicos",
  "name": "Servicios Médicos",
  "description": "Servicios y especialidades médicas",
  "icon": "FaHospital",
  "fields": [
    {
      "id": "nombre_servicio",
      "name": "Nombre del Servicio",
      "type": "text",
      "required": true
    },
    {
      "id": "especialidad",
      "name": "Especialidad",
      "type": "select",
      "validation": {
        "options": "Medicina General,Pediatría,Cardiología,Dermatología,Traumatología,Psicología,Nutrición"
      }
    },
    {
      "id": "descripcion",
      "name": "Descripción",
      "type": "richtext",
      "required": true
    },
    {
      "id": "imagen",
      "name": "Imagen",
      "type": "image"
    },
    {
      "id": "duracion_consulta",
      "name": "Duración Consulta (min)",
      "type": "number"
    },
    {
      "id": "precio",
      "name": "Precio",
      "type": "number"
    },
    {
      "id": "acepta_seguros",
      "name": "Acepta Seguros",
      "type": "boolean"
    },
    {
      "id": "requiere_cita",
      "name": "Requiere Cita Previa",
      "type": "boolean"
    }
  ]
}
```

---

## 💡 **Cómo Usar Este Framework para CUALQUIER Sitio**

### Paso 1: Identifica tus Necesidades
Pregúntate:
- ¿Qué tipos de contenido necesito? (Ejemplo: proyectos, equipo, servicios)
- ¿Qué información necesito de cada uno?
- ¿Cómo quiero organizarlo?

### Paso 2: Crea las Categorías
Para cada tipo de contenido:
1. Ve a `/admin/categories`
2. Click "Nueva Categoría"
3. Define los campos que necesitas
4. Guarda

### Paso 3: Agrega Contenido
1. Ve a `/admin/items`
2. Selecciona la categoría
3. Rellena el formulario
4. Publica

### Paso 4: Personaliza el Diseño
1. Ve a `/admin/design`
2. Ajusta colores, fuentes, etc.
3. Guarda

---

## 🎯 **Configuración Perfecta para Tu Sitio**

### Ejemplo: Sitio Web de Agencia Creativa

**Categorías recomendadas:**
1. **quienes-somos** (3 items: Historia, Misión, Valores)
2. **proyectos** (10-20 items: Portfolio)
3. **servicios** (5-8 items: Lo que ofrecen)
4. **equipo** (10-15 items: Colaboradores)
5. **testimonios** (15-30 items: Reseñas de clientes)
6. **blog** (50+ items: Artículos)

**Configuración visual:**
- Colores de marca
- Fuente corporativa
- Efectos visuales acordes

---

## 📝 **Plantilla de Categoría Vacía**

Usa esto como base para crear cualquier categoría:

```json
{
  "id": "tu-categoria",
  "name": "Tu Categoría",
  "description": "Descripción de qué contendrá",
  "icon": "FaIcono",
  "fields": [
    {
      "id": "campo1",
      "name": "Nombre del Campo",
      "type": "text|textarea|number|email|url|date|select|boolean|image|etc",
      "required": true|false,
      "searchable": true|false,
      "helpText": "Ayuda para el editor",
      "placeholder": "Ejemplo...",
      "validation": {
        "maxLength": 100,
        "min": 0,
        "max": 100,
        "options": "opcion1,opcion2,opcion3"
      }
    }
  ]
}
```

---

## 🚀 **El Framework es 100% Flexible**

**Puedes crear un sitio para:**
- ✅ Empresa corporativa
- ✅ E-commerce
- ✅ Blog/Revista
- ✅ Portfolio personal
- ✅ Instituto educativo
- ✅ Clínica/Hospital
- ✅ ONG
- ✅ Restaurant
- ✅ Inmobiliaria
- ✅ Y CUALQUIER COSA que imagines!

**Todo sin tocar código** 🎉
