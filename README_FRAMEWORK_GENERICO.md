# 🚀 Framework CMS Genérico - Self-Hosted

## ¡IMPORTANTE! Este Framework es 100% Genérico 🎯

**Este NO es solo para universidades o proyectos educativos.**

Este es un framework **completamente flexible** que puedes usar para crear **CUALQUIER tipo de sitio web:**

- ✅ **Sitios Corporativos** (empresas, agencias, consultoras)
- ✅ **E-commerce** (tiendas online, marketplaces)
- ✅ **Blogs y Revistas** (publicaciones, medios de comunicación)
- ✅ **Portfolios** (diseñadores, desarrolladores, fotógrafos)
- ✅ **Instituciones Educativas** (escuelas, universidades, cursos online)
- ✅ **Clínicas y Hospitales** (servicios médicos, citas)
- ✅ **ONGs** (organizaciones sin fines de lucro, fundaciones)
- ✅ **Restaurantes** (menús, reservas, delivery)
- ✅ **Inmobiliarias** (propiedades, agentes)
- ✅ **Y CUALQUIER COSA que necesites!**

---

## 🎨 ¿Cómo Funciona?

### Concepto Clave: **Categorías Personalizadas**

No importa qué tipo de sitio necesites, el proceso es el mismo:

1. **Define tus categorías** (tipos de contenido)
2. **Diseña los campos** para cada categoría
3. **Agrega contenido** mediante formularios automáticos
4. **Personaliza el diseño** visualmente
5. **¡Listo!** Tu sitio está funcionando

### Ejemplo Real: Sitio Web de Agencia Creativa

**Necesitas mostrar:**
- Quiénes somos (3 secciones)
- Proyectos (15 casos de éxito)
- Iniciativas (5 programas especiales)
- Colaboradores (12 miembros del equipo)

**Con este framework:**

#### Paso 1: Crea las Categorías

**Categoría 1: "quienes-somos"**
- Campos: Sección, Título, Contenido, Imagen, Orden
- Items: Historia, Misión, Valores

**Categoría 2: "proyectos"**
- Campos: Nombre, Descripción, Cliente, Tecnologías, Imágenes, Fecha, Destacado
- Items: 15 proyectos diferentes

**Categoría 3: "iniciativas"**
- Campos: Nombre, Descripción, Tipo, Estado, Beneficiarios, Aliados
- Items: 5 iniciativas activas

**Categoría 4: "colaboradores"**
- Campos: Nombre, Cargo, Área, Foto, Bio, Especialidades, Email, LinkedIn
- Items: 12 miembros del equipo

#### Paso 2: Personaliza el Diseño
- Colores de marca
- Fuentes corporativas
- Efectos visuales

#### Paso 3: Usa el Contenido en el Frontend
```tsx
import { useCategory } from '@/hooks/useAppConfig';

// En cualquier componente:
const quienesSomos = useCategory('quienes-somos');
const proyectos = useCategory('proyectos');
const iniciativas = useCategory('iniciativas');
const colaboradores = useCategory('colaboradores');
```

---

## 📦 Tipos de Campos Disponibles (22 tipos)

**El framework incluye 22 tipos de campos diferentes:**

| Tipo | Uso |
|------|-----|
| `text` | Textos cortos (títulos, nombres) |
| `textarea` | Textos largos (descripciones) |
| `richtext` | Texto con formato (editor WYSIWYG) |
| `number` | Números (precios, cantidades) |
| `email` | Emails con validación |
| `url` | Links con validación |
| `phone` | Teléfonos |
| `date` | Fechas |
| `datetime` | Fecha y hora |
| `time` | Solo hora |
| `select` | Lista desplegable |
| `radio` | Opciones únicas |
| `checkbox` | Opciones múltiples |
| `boolean` | Sí/No (switches) |
| `color` | Selector de color |
| `image` | Imágenes |
| `file` | Archivos |
| `slug` | URLs amigables |
| `tags` | Etiquetas/tags |
| `json` | Datos estructurados |
| `markdown` | Texto con Markdown |
| `code` | Código con sintaxis |

---

## 🎯 Ejemplos de Categorías Según Tipo de Sitio

### 1️⃣ Sitio Corporativo

**Categorías sugeridas:**
- `quienes-somos`: Historia, Misión, Visión, Valores
- `servicios`: Lista de servicios ofrecidos
- `proyectos`: Portfolio de trabajos realizados
- `equipo`: Colaboradores y directivos
- `testimonios`: Opiniones de clientes
- `blog`: Artículos y noticias
- `contacto`: Oficinas y sucursales

### 2️⃣ E-commerce

**Categorías sugeridas:**
- `productos`: Catálogo de productos
- `categorias-producto`: Organización del catálogo
- `marcas`: Marcas disponibles
- `promociones`: Ofertas especiales
- `testimonios`: Reseñas de clientes
- `faqs`: Preguntas frecuentes
- `politicas`: Términos, envíos, devoluciones

### 3️⃣ Blog/Revista

**Categorías sugeridas:**
- `articulos`: Posts del blog
- `autores`: Escritores y colaboradores
- `categorias`: Temas del blog
- `featured`: Artículos destacados
- `newsletter`: Suscripciones
- `podcasts`: Episodios de audio

### 4️⃣ Instituto Educativo

**Categorías sugeridas:**
- `cursos`: Oferta académica
- `profesores`: Cuerpo docente
- `testimonios`: Experiencias de alumnos
- `noticias`: Novedades institucionales
- `eventos`: Calendario académico
- `recursos`: Material de estudio
- `admisiones`: Proceso de inscripción

### 5️⃣ Clínica/Hospital

**Categorías sugeridas:**
- `servicios-medicos`: Especialidades médicas
- `medicos`: Directorio de profesionales
- `horarios`: Horarios de atención
- `convenios`: Obras sociales y seguros
- `noticias`: Novedades médicas
- `turnos`: Sistema de citas
- `instalaciones`: Áreas y equipamiento

### 6️⃣ ONG/Fundación

**Categorías sugeridas:**
- `mision`: Propósito y objetivos
- `proyectos`: Iniciativas en curso
- `impacto`: Resultados logrados
- `voluntarios`: Oportunidades de colaboración
- `donaciones`: Cómo ayudar
- `noticias`: Actualizaciones
- `aliados`: Partners y colaboradores

### 7️⃣ Restaurant

**Categorías sugeridas:**
- `menu`: Carta de platos
- `bebidas`: Cartas de vinos y bebidas
- `promociones`: Ofertas especiales
- `eventos`: Reservas para eventos
- `chef`: Equipo de cocina
- `galeria`: Fotos del local y platos
- `reservas`: Sistema de reservas

### 8️⃣ Inmobiliaria

**Categorías sugeridas:**
- `propiedades`: Catálogo de inmuebles
- `agentes`: Asesores comerciales
- `tipos-propiedad`: Casas, deptos, locales
- `barrios`: Zonas disponibles
- `testimonios`: Opiniones de clientes
- `guias`: Tips para comprar/vender
- `servicios`: Servicios adicionales

---

## 🛠️ Cómo Empezar con Tu Proyecto

### Paso 1: Identifica tus Necesidades

**Hazte estas preguntas:**
- ¿Qué tipos de contenido necesito mostrar?
- ¿Qué información necesito de cada tipo?
- ¿Cómo quiero organizarlo?
- ¿Qué quiero que los usuarios vean y hagan?

### Paso 2: Define tus Categorías

**Por cada tipo de contenido:**
1. Asígnale un ID único (ej: `proyectos`, `equipo`, `servicios`)
2. Un nombre descriptivo (ej: "Proyectos", "Equipo", "Servicios")
3. Una descripción clara
4. Un ícono representativo

### Paso 3: Diseña los Campos

**Por cada categoría, define:**
- Qué información necesitas capturar
- Qué tipo de campo usar (texto, imagen, fecha, etc.)
- Cuáles son obligatorios
- Validaciones necesarias

### Paso 4: Crea las Categorías en el Admin

1. Accede a `/admin` (usa contraseña: `admin123`)
2. Ve a "Categorías"
3. Click "Nueva Categoría"
4. Completa el formulario
5. Agrega los campos necesarios
6. Guarda

### Paso 5: Agrega Contenido

1. Ve a "Items"
2. Selecciona la categoría
3. Click "Nuevo Item"
4. Rellena el formulario (se genera automáticamente según los campos)
5. Guarda

### Paso 6: Personaliza el Diseño

1. Ve a "Diseño"
2. Ajusta colores, fuentes, efectos
3. Previsualiza los cambios
4. Guarda

### Paso 7: Integra en el Frontend

```tsx
// En cualquier componente React:
import { useCategory } from '@/hooks/useAppConfig';

export function MiComponente() {
  const { items, loading } = useCategory('tu-categoria');
  
  if (loading) return <div>Cargando...</div>;
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <h2>{item.nombre}</h2>
          <p>{item.descripcion}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 📋 Plantilla de Categoría Vacía

**Usa esto como base para crear cualquier categoría:**

```json
{
  "id": "tu-categoria-aqui",
  "name": "Nombre Descriptivo",
  "description": "Descripción de qué contendrá",
  "icon": "FaIconoApropiado",
  "fields": [
    {
      "id": "campo_1",
      "name": "Nombre del Campo 1",
      "type": "text",
      "required": true,
      "searchable": true,
      "helpText": "Ayuda para entender qué poner aquí"
    },
    {
      "id": "campo_2",
      "name": "Nombre del Campo 2",
      "type": "textarea",
      "required": false,
      "validation": {
        "maxLength": 500
      }
    },
    {
      "id": "campo_3",
      "name": "Nombre del Campo 3",
      "type": "select",
      "validation": {
        "options": "Opción 1,Opción 2,Opción 3"
      }
    },
    {
      "id": "imagen",
      "name": "Imagen",
      "type": "image",
      "required": false
    },
    {
      "id": "destacado",
      "name": "Destacar",
      "type": "boolean",
      "helpText": "Marcar si debe aparecer en posición destacada"
    }
  ]
}
```

---

## 🎨 Ejemplos Completos Listos para Usar

**Incluimos archivos con ejemplos completos:**

📁 `EJEMPLOS_CATEGORIAS.md` - Documentación con múltiples ejemplos
📁 `src/data/categories-examples.json` - Categorías listas para importar

**Categorías de ejemplo incluidas:**
1. **quienes-somos** - Secciones institucionales
2. **proyectos** - Portfolio completo
3. **iniciativas** - Programas y acciones
4. **colaboradores** - Equipo de trabajo

**¡Puedes copiarlas y adaptarlas a tus necesidades!**

---

## 💡 Ventajas de Este Framework

### ✅ Sin Código
No necesitas programar para agregar contenido. Todo desde el admin panel.

### ✅ 100% Flexible
Crea CUALQUIER tipo de categoría con CUALQUIER estructura de campos.

### ✅ Self-Hosted
Tus datos en archivos JSON versionables con Git. Sin bases de datos.

### ✅ Dinámico
Los formularios se generan automáticamente según tu configuración.

### ✅ Tipado
TypeScript + validación en tiempo real.

### ✅ Moderno
React 19, Vite 7, TanStack Query, React Hook Form.

### ✅ Seguro
Panel de administración protegido con login.

### ✅ Rápido
Vite para desarrollo ultra-rápido.

### ✅ Escalable
Agrega categorías sin límites.

---

## 🚀 Casos de Uso Reales

### Caso 1: Agencia de Marketing Digital

**Necesidad:**
"Queremos mostrar nuestros casos de éxito, equipo, servicios y blog."

**Solución:**
- Categoría `casos-exito`: 20 proyectos con métricas
- Categoría `equipo`: 15 especialistas con roles
- Categoría `servicios`: 8 servicios con descripciones
- Categoría `blog`: 50+ artículos con tags

**Tiempo de setup: 2 horas** ✅

---

### Caso 2: E-commerce de Ropa

**Necesidad:**
"Necesitamos un catálogo de productos con filtros por talla, color y categoría."

**Solución:**
- Categoría `productos`: Con campos de precio, tallas, colores, stock, imágenes
- Categoría `categorias`: Hombre, Mujer, Niños, Accesorios
- Categoría `marcas`: Marcas disponibles
- Categoría `promociones`: Ofertas temporales

**Tiempo de setup: 3 horas** ✅

---

### Caso 3: Instituto de Idiomas

**Necesidad:**
"Queremos mostrar cursos, profesores, horarios y precios."

**Solución:**
- Categoría `cursos`: Idiomas, niveles, horarios, precios
- Categoría `profesores`: Nativos, experiencia, especialidades
- Categoría `modalidades`: Presencial, online, híbrido
- Categoría `testimonios`: Experiencias de alumnos

**Tiempo de setup: 2.5 horas** ✅

---

### Caso 4: Clínica Médica

**Necesidad:**
"Portal con médicos, especialidades, turnos y convenios."

**Solución:**
- Categoría `medicos`: Especialidad, horarios, foto, bio
- Categoría `especialidades`: Servicios médicos
- Categoría `convenios`: Obras sociales aceptadas
- Categoría `noticias`: Novedades médicas

**Tiempo de setup: 3 horas** ✅

---

## 📚 Recursos Adicionales

### Documentación Completa
- `README.md` - Información general
- `FRAMEWORK_SELF_HOSTED.md` - Arquitectura técnica
- `GUIA_DE_USO.md` - Manual de usuario
- `EJEMPLOS_CATEGORIAS.md` - Ejemplos de categorías
- `categories-examples.json` - Plantillas listas

### Archivos de Configuración
- `.env.example` - Variables de entorno
- `src/data/` - Datos del sitio
- `src/admin/` - Panel de administración
- `src/hooks/` - Hooks para el frontend

---

## 🎯 Resumen: ¿Por Qué Este Framework es Genérico?

### ❌ NO está limitado a:
- Universidades
- Proyectos educativos
- Tipos específicos de contenido

### ✅ SÍ permite crear:
- **CUALQUIER tipo de categoría**
- **CUALQUIER estructura de campos**
- **CUALQUIER tipo de sitio web**
- **CUALQUIER cantidad de contenido**

### 🔑 La Clave está en:
1. **Categorías personalizables** - Define tus propios tipos
2. **Campos dinámicos** - 22 tipos de campos disponibles
3. **Formularios auto-generados** - Sin código
4. **Integración fácil** - Hooks listos para usar

---

## 🚀 ¡Empieza Ahora!

1. **Instala dependencias:**
```bash
npm install
```

2. **Inicia el servidor:**
```bash
npm run dev
```

3. **Accede al admin:**
```
http://localhost:5173/admin
Usuario: (no requerido)
Contraseña: admin123
```

4. **Crea tu primera categoría:**
   - Ve a "Categorías"
   - Click "Nueva Categoría"
   - Define los campos
   - ¡Listo!

5. **Agrega contenido:**
   - Ve a "Items"
   - Selecciona la categoría
   - Agrega items

6. **Personaliza el diseño:**
   - Ve a "Diseño"
   - Ajusta colores y fuentes

7. **Integra en tu sitio:**
```tsx
import { useCategory } from '@/hooks/useAppConfig';

const { items } = useCategory('tu-categoria');
```

---

## 💬 ¿Necesitas Ayuda?

**Revisa la documentación completa:**
- `GUIA_DE_USO.md` - Guía paso a paso
- `EJEMPLOS_CATEGORIAS.md` - Ejemplos listos

**¿Tienes dudas?**
El framework está diseñado para ser intuitivo. Experimenta creando categorías y viendo cómo se generan los formularios automáticamente.

---

## 🎉 ¡Disfruta de tu Framework Genérico y Flexible!

**Recuerda:** Este framework puede adaptarse a CUALQUIER proyecto. No hay límites en los tipos de categorías que puedes crear. ¡Sé creativo!
