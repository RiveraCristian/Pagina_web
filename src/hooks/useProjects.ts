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
      try {
        // Cargar proyectos desde el nuevo sistema JSON
        const response = await fetch('/src/data/items/proyectos.json');
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
              descripcion: projectData.descripcionLarga || projectData.descripcion || '',
              categoria: projectData.categoria || 'general',
              imagen: projectData.imagen || '',
              enlace: projectData.enlace || projectData.link,
              github: projectData.github,
              tecnologias: projectData.tecnologias 
                ? (typeof projectData.tecnologias === 'string' 
                  ? projectData.tecnologias.split(',').map((t: string) => t.trim())
                  : projectData.tecnologias)
                : [],
              destacado: projectData.destacado || false,
              tags: projectData.tags || [],
              // Pasar todos los campos adicionales
              ...projectData
            };
          });
        
        setProjects(convertedProjects);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError(err instanceof Error ? err : new Error('Failed to load projects'));
        
        // Fallback: array vacío o cargar desde PROJECTS legacy
        try {
          const { PROJECTS: legacyProjects } = await import('../data/projects');
          setProjects(legacyProjects as any);
        } catch {
          setProjects([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return { projects, loading, error };
}
