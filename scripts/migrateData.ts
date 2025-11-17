/**
 * Script de Migración: projects.ts → proyectos.json
 * 
 * Convierte los proyectos existentes en src/data/projects.ts
 * al nuevo formato JSON en src/data/items/proyectos.json
 * 
 * Ejecutar con: npm run migrate
 */

import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { PROJECTS } from '../src/data/projects';
import type { Item } from '../src/types/schema';

interface LegacyProject {
  id: string;
  categoria: string;
  nombre: string;
  fraseDefault: string;
  descripcion?: string;
  tags?: string[];
  link?: string;
  github?: string;
  imagenes: string[];
  tecnologias?: string[];
  fecha?: string;
  destacado?: boolean;
}

function generateId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${timestamp}_${random}`;
}

function migrateProject(project: LegacyProject): Item {
  const now = new Date().toISOString();
  
  return {
    id: generateId(),
    categoryId: 'proyectos',
    status: 'published',
    createdAt: project.fecha || now,
    updatedAt: now,
    data: {
      titulo: project.nombre,
      descripcion: project.fraseDefault,
      descripcionLarga: project.descripcion || project.fraseDefault,
      categoria: project.categoria,
      imagen: project.imagenes[0] || '',
      enlace: project.link || '',
      github: project.github || '',
      tecnologias: Array.isArray(project.tecnologias) 
        ? project.tecnologias.join(', ') 
        : (project.tags || []).join(', '),
      destacado: project.destacado || false,
    }
  };
}

function migrate() {
  console.log('🚀 Iniciando migración de proyectos...\n');

  // Convertir proyectos
  const migratedItems = PROJECTS.map((project: any) => {
    console.log(`  ✓ Migrando: ${project.nombre}`);
    return migrateProject(project as LegacyProject);
  });

  // Crear estructura JSON
  const output = {
    items: migratedItems
  };

  // Guardar archivo
  const outputPath = resolve(process.cwd(), 'src/data/items/proyectos.json');
  writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`\n✅ Migración completada!`);
  console.log(`   ${migratedItems.length} proyectos migrados`);
  console.log(`   Archivo guardado en: ${outputPath}\n`);

  // Mostrar resumen por categoría
  const byCategory = migratedItems.reduce((acc: Record<string, number>, item: Item) => {
    const cat = (item.data as any).categoria || 'sin-categoria';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('📊 Resumen por categoría:');
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} proyecto(s)`);
  });

  console.log('\n💡 Próximos pasos:');
  console.log('   1. Revisa el archivo generado en src/data/items/proyectos.json');
  console.log('   2. Verifica que los datos sean correctos');
  console.log('   3. Accede al admin panel: http://localhost:5173/admin/items');
  console.log('   4. Edita y personaliza los proyectos según necesites\n');
}

// Ejecutar migración
try {
  migrate();
} catch (error) {
  console.error('❌ Error durante la migración:', error);
  process.exit(1);
}
