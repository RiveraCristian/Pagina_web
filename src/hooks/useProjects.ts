/**
 * Hook para cargar proyectos desde el archivo de datos estático.
 * Para agregar o modificar proyectos, edita src/data/projects.ts
 */

import { useState, useEffect } from 'react';
import type { Project } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { PROJECTS } = await import('../data/projects');
        setProjects(PROJECTS);
        setError(null);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError(err instanceof Error ? err : new Error('Failed to load projects'));
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return { projects, loading, error };
}
