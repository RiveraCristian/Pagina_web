/**
 * Hook para cargar proyectos desde el nuevo sistema JSON
 * Lee los items de la categoría "proyectos"
 */

import { useState, useEffect } from 'react';
import type { Item } from '../types/schema';

interface Project {
  id: string;
  nombre: string;
  fraseDefault: string;
  descripcion: string;
  categoria: string;
  imagen: string;
  enlace?: string;
  github?: string;
  tecnologias?: string[];
  destacado?: boolean;
  tags?: string[];
  // Campos adicionales que puedan existir
  [key: string]: any;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      
      try {
        // Intentar cargar desde fallback primero (más confiable)
        console.log('🔄 Cargando proyectos desde projects.ts...');
        const { PROJECTS: legacyProjects } = await import('../data/projects');
        console.log('✅ Proyectos cargados exitosamente:', legacyProjects.length);
        setProjects(legacyProjects as any);
        setError(null);
      } catch (fallbackErr) {
        console.error('Error loading projects from fallback:', fallbackErr);
        console.log('🔄 Intentando desde API...');
        
        try {
          // Si falla el fallback, intentar la API
          const response = await fetch('/api/items/proyectos');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
        
          // Convertir items a formato de proyecto
          const convertedProjects: Project[] = data.items
            .filter((item: Item) => item.status === 'published')
            .map((item: Item) => {
              const projectData = item.data as any;
              
              return {
                id: item.id,
                nombre: projectData.titulo || projectData.nombre || 'Sin título',
                fraseDefault: projectData.descripcion || projectData.frase || '',
                categoria: projectData.categoria || 'general',
                imagenes: projectData.imagen ? [projectData.imagen] : [],
                tecnologias: projectData.tecnologias 
                  ? (typeof projectData.tecnologias === 'string' 
                    ? projectData.tecnologias.split(',').map((t: string) => t.trim())
                    : projectData.tecnologias)
                  : [],
                duracion: projectData.duracion,
                equipo: projectData.equipo || [],
                links: {
                  demo: projectData.enlace || projectData.demo,
                  repositorio: projectData.github || projectData.repositorio,
                  documentacion: projectData.documentacion,
                  website: projectData.website
                },
                galeria: projectData.galeria || (projectData.imagen ? [projectData.imagen] : []),
                videoUrl: projectData.videoUrl,
                testimonios: projectData.testimonios || [],
                estadisticas: projectData.estadisticas || {},
                tags: projectData.tags || [],
                subcategoria: projectData.subcategoria,
                // Mantener campos adicionales para compatibilidad
                ...projectData
              };
            });
        
          setProjects(convertedProjects);
          setError(null);
          console.log('✅ Proyectos cargados desde API:', convertedProjects.length);
        } catch (apiErr) {
          console.error('Error loading projects from API:', apiErr);
          console.log('🔄 Intentando desde archivo JSON público...');
          
          try {
            // Última opción: archivo JSON público
            const response = await fetch('/data/projects.json');
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const publicData = await response.json();
            console.log('✅ Proyectos cargados desde archivo público:', publicData.projects.length);
            setProjects(publicData.projects);
            setError(null);
          } catch (publicErr) {
            console.error('Error loading projects from public JSON:', publicErr);
            setError(apiErr instanceof Error ? apiErr : new Error('Failed to load projects'));
            setProjects([]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return { projects, loading, error };
}
