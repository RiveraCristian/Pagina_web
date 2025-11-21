# 🎯 Quick Start - Configuración por Tipo de Sitio

## ⚡ Inicio Rápido en 5 Minutos

### 1️⃣ Accede al Admin
```
http://localhost:5173/admin
Contraseña: admin123
```

### 2️⃣ Elige tu Tipo de Sitio
Selecciona el que más se ajuste a tu proyecto:

---

## 🏢 OPCIÓN 1: Sitio Corporativo

**Ideal para:** Empresas, agencias, consultoras, estudios profesionales

### Categorías Recomendadas

#### 📋 Categoría: "quienes-somos"
**Para:** Historia, Misión, Visión, Valores

**Campos sugeridos:**
```json
{
  "seccion": "text (ej: Historia, Misión, Visión)",
  "titulo": "text (título principal)",
  "contenido": "richtext (texto completo)",
  "imagen": "image (opcional)",
  "orden": "number (1, 2, 3...)"
}
```

**Cuántos items crear:** 3-5 secciones

---

#### 💼 Categoría: "proyectos"
**Para:** Portfolio, casos de éxito, trabajos realizados

**Campos sugeridos:**
```json
{
  "nombre": "text (nombre del proyecto)",
  "descripcion_corta": "textarea (resumen, max 200 caracteres)",
  "descripcion_completa": "richtext (detalles completos)",
  "cliente": "text (nombre del cliente)",
  "industria": "select (Tecnología, Salud, Finanzas...)",
  "tecnologias": "tags (React, Node.js, etc)",
  "imagen_principal": "image (obligatorio)",
  "fecha_inicio": "date",
  "fecha_fin": "date",
  "destacado": "boolean"
}
```

**Cuántos items crear:** 10-20 proyectos

---

#### 👥 Categoría: "equipo"
**Para:** Colaboradores, directivos, equipo de trabajo

**Campos sugeridos:**
```json
{
  "nombre_completo": "text",
  "cargo": "text (CEO, Designer, Developer...)",
  "area": "select (Dirección, Desarrollo, Diseño...)",
  "foto": "image (obligatorio, 512x512px)",
  "bio": "textarea (max 300 caracteres)",
  "especialidades": "tags",
  "email": "email",
  "linkedin": "url",
  "orden": "number"
}
```

**Cuántos items crear:** 5-15 personas

---

#### 🎯 Categoría: "servicios"
**Para:** Servicios ofrecidos

**Campos sugeridos:**
```json
{
  "nombre": "text",
  "descripcion": "richtext",
  "icono": "text (FaCode, FaPaintBrush...)",
  "imagen": "image",
  "precio_desde": "number",
  "destacado": "boolean"
}
```

**Cuántos items crear:** 4-8 servicios

---

## 🛍️ OPCIÓN 2: E-commerce

**Ideal para:** Tiendas online, marketplaces, catálogos

### Categorías Recomendadas

#### 🛒 Categoría: "productos"
**Para:** Catálogo de productos

**Campos sugeridos:**
```json
{
  "nombre": "text",
  "sku": "text (código único)",
  "descripcion": "richtext",
  "precio": "number (obligatorio)",
  "precio_oferta": "number (opcional)",
  "categoria": "select (Ropa, Electrónica, Hogar...)",
  "marca": "text",
  "stock": "number",
  "imagen_principal": "image (obligatorio)",
  "imagenes_adicionales": "textarea (URLs separadas por comas)",
  "tallas": "tags (S, M, L, XL)",
  "colores": "tags",
  "destacado": "boolean",
  "nuevo": "boolean",
  "envio_gratis": "boolean"
}
```

**Cuántos items crear:** 20-100+ productos

---

#### 🏷️ Categoría: "categorias-producto"
**Para:** Organizar el catálogo

**Campos sugeridos:**
```json
{
  "nombre": "text (Ropa, Electrónica...)",
  "descripcion": "textarea",
  "imagen": "image",
  "orden": "number"
}
```

**Cuántos items crear:** 5-15 categorías

---

#### ⭐ Categoría: "testimonios"
**Para:** Reseñas de clientes

**Campos sugeridos:**
```json
{
  "nombre_cliente": "text",
  "testimonio": "textarea",
  "calificacion": "number (1-5)",
  "foto": "image (opcional)",
  "producto_relacionado": "text",
  "fecha": "date",
  "destacado": "boolean"
}
```

**Cuántos items crear:** 20-50 testimonios

---

## 📰 OPCIÓN 3: Blog/Revista

**Ideal para:** Publicaciones, medios, blogs personales

### Categorías Recomendadas

#### 📝 Categoría: "articulos"
**Para:** Posts del blog

**Campos sugeridos:**
```json
{
  "titulo": "text",
  "slug": "slug (URL amigable)",
  "resumen": "textarea (max 200 caracteres)",
  "contenido": "richtext (artículo completo)",
  "autor": "text",
  "categoria": "select (Tecnología, Negocios...)",
  "tags": "tags (palabras clave)",
  "imagen_portada": "image (obligatorio)",
  "fecha_publicacion": "datetime",
  "tiempo_lectura": "number (minutos)",
  "destacado": "boolean"
}
```

**Cuántos items crear:** 30-100+ artículos

---

#### ✍️ Categoría: "autores"
**Para:** Escritores y colaboradores

**Campos sugeridos:**
```json
{
  "nombre": "text",
  "bio": "textarea",
  "foto": "image",
  "especialidad": "text",
  "email": "email",
  "twitter": "url",
  "linkedin": "url"
}
```

**Cuántos items crear:** 3-10 autores

---

## 🎓 OPCIÓN 4: Instituto Educativo

**Ideal para:** Escuelas, universidades, academias, cursos online

### Categorías Recomendadas

#### 📚 Categoría: "cursos"
**Para:** Oferta académica

**Campos sugeridos:**
```json
{
  "nombre_curso": "text",
  "codigo": "text (único)",
  "descripcion": "richtext",
  "modalidad": "select (Presencial, Online, Híbrida)",
  "nivel": "select (Principiante, Intermedio, Avanzado)",
  "duracion_horas": "number",
  "instructor": "text",
  "precio": "number",
  "cupos": "number",
  "fecha_inicio": "date",
  "requisitos": "textarea",
  "certificacion": "boolean"
}
```

**Cuántos items crear:** 10-30 cursos

---

#### 👨‍🏫 Categoría: "profesores"
**Para:** Cuerpo docente

**Campos sugeridos:**
```json
{
  "nombre": "text",
  "especialidad": "text",
  "titulo_profesional": "text",
  "experiencia_anos": "number",
  "bio": "textarea",
  "foto": "image",
  "email": "email",
  "linkedin": "url"
}
```

**Cuántos items crear:** 10-50 profesores

---

## 🏥 OPCIÓN 5: Clínica/Hospital

**Ideal para:** Centros médicos, consultorios, clínicas

### Categorías Recomendadas

#### 🩺 Categoría: "servicios-medicos"
**Para:** Especialidades y servicios

**Campos sugeridos:**
```json
{
  "nombre_servicio": "text",
  "especialidad": "select (Pediatría, Cardiología...)",
  "descripcion": "richtext",
  "duracion_consulta": "number (minutos)",
  "precio": "number",
  "acepta_seguros": "boolean",
  "requiere_cita": "boolean"
}
```

**Cuántos items crear:** 10-20 servicios

---

#### 👨‍⚕️ Categoría: "medicos"
**Para:** Directorio de profesionales

**Campos sugeridos:**
```json
{
  "nombre": "text",
  "especialidad": "text",
  "matricula": "text",
  "experiencia_anos": "number",
  "bio": "textarea",
  "foto": "image",
  "horarios": "textarea",
  "email": "email"
}
```

**Cuántos items crear:** 5-30 médicos

---

## 🌟 OPCIÓN 6: ONG/Fundación

**Ideal para:** Organizaciones sin fines de lucro

### Categorías Recomendadas

#### 🎯 Categoría: "iniciativas"
**Para:** Proyectos y programas

**Campos sugeridos:**
```json
{
  "nombre": "text",
  "descripcion": "richtext",
  "tipo": "select (Social, Ambiental, Educativa...)",
  "objetivo": "textarea",
  "beneficiarios": "text (Ej: 500 familias)",
  "estado": "select (En Ejecución, Completada...)",
  "fecha_inicio": "date",
  "imagen": "image",
  "impacto": "textarea (resultados)",
  "aliados": "tags",
  "destacado": "boolean"
}
```

**Cuántos items crear:** 5-15 iniciativas

---

#### 🤝 Categoría: "voluntarios"
**Para:** Oportunidades de colaboración

**Campos sugeridos:**
```json
{
  "titulo": "text",
  "descripcion": "richtext",
  "tipo_actividad": "select",
  "horas_semanales": "number",
  "requisitos": "textarea",
  "fecha_inicio": "date"
}
```

**Cuántos items crear:** 5-10 oportunidades

---

## 🎨 OPCIÓN 7: Portfolio Personal

**Ideal para:** Diseñadores, desarrolladores, fotógrafos, artistas

### Categorías Recomendadas

#### 💼 Categoría: "trabajos"
**Para:** Portfolio de proyectos

**Campos sugeridos:**
```json
{
  "titulo": "text",
  "descripcion": "richtext",
  "tipo": "select (Web, App, Diseño, Foto...)",
  "cliente": "text",
  "ano": "number",
  "tecnologias": "tags",
  "imagen_principal": "image",
  "galeria": "textarea (URLs)",
  "enlace_demo": "url",
  "destacado": "boolean"
}
```

**Cuántos items crear:** 10-30 trabajos

---

#### 🏆 Categoría: "habilidades"
**Para:** Skills y competencias

**Campos sugeridos:**
```json
{
  "nombre": "text (React, Photoshop...)",
  "categoria": "select (Desarrollo, Diseño...)",
  "nivel": "select (Básico, Intermedio, Experto)",
  "anos_experiencia": "number",
  "icono": "text (FaReact, FaFigma...)"
}
```

**Cuántos items crear:** 10-20 habilidades

---

## 📋 Pasos Siguientes

### Después de crear tus categorías:

1. **Agrega contenido**
   - Ve a `/admin/items`
   - Selecciona la categoría
   - Completa los formularios

2. **Personaliza el diseño**
   - Ve a `/admin/design`
   - Ajusta colores y fuentes

3. **Integra en el frontend**
   ```tsx
   import { useCategory } from '@/hooks/useAppConfig';
   
   const { items } = useCategory('tu-categoria');
   ```

---

## 💡 Tips Generales

### ✅ Mejores Prácticas

**IDs de categorías:**
- Usa minúsculas
- Sin espacios (usa guiones)
- Descriptivos (ej: `servicios-medicos`, no `sm`)

**Campos obligatorios:**
- Nombre/Título siempre `required: true`
- Al menos una imagen para visual
- Descripción o contenido

**Campos opcionales pero útiles:**
- `orden` (number) - para ordenar items
- `destacado` (boolean) - para resaltar items
- `fecha` (date) - para contenido temporal

**Validaciones:**
- Usa `maxLength` en textos cortos (200 chars)
- Usa `min` y `max` en números
- Define `options` claras en select

---

## 🚀 Checklist de Inicio

- [ ] Acceder al admin (`/admin`)
- [ ] Crear 2-4 categorías principales
- [ ] Agregar campos a cada categoría
- [ ] Crear al menos 3 items de prueba
- [ ] Configurar diseño básico
- [ ] Integrar en el frontend con hooks
- [ ] ¡Listo para producción!

---

## 📚 Recursos

- `README_FRAMEWORK_GENERICO.md` - Guía completa
- `EJEMPLOS_CATEGORIAS.md` - Más ejemplos
- `categories-examples.json` - Plantillas JSON
- `FRAMEWORK_SELF_HOSTED.md` - Documentación técnica

---

¿Tienes un tipo de sitio diferente? **¡No hay problema!**

El framework es 100% flexible. Crea las categorías que necesites con los campos que quieras. Los formularios se generan automáticamente. 🎉
