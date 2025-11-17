/**
 * Hook para cargar la configuración del sitio desde config.json
 * Gestiona el estado de carga y errores
 */

import { useState, useEffect } from 'react';
import type { SiteConfig } from '../types/schema';

export function useAppConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        // En desarrollo: cargar desde el archivo JSON
        const response = await fetch('/src/data/config.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        console.error('Error loading config:', err);
        setError(err instanceof Error ? err : new Error('Failed to load config'));
        
        // Fallback: configuración por defecto
        setConfig({
          site: {
            name: 'Mi Sitio',
            shortName: 'MS',
            tagline: 'Busca proyectos con tu voz',
            description: 'Explora proyectos usando búsqueda por voz',
            url: 'https://example.com',
            language: 'es',
            timezone: 'America/Santiago'
          },
          seo: {
            title: 'Mi Sitio - Búsqueda por Voz',
            description: 'Encuentra proyectos con búsqueda por voz',
            keywords: ['proyectos', 'búsqueda'],
            ogImage: '/og-image.jpg',
            twitterHandle: '@example'
          },
          features: {
            voiceSearch: true,
            textSearch: true,
            darkMode: true,
            particles: true,
            animations: true,
            pwa: true,
            analytics: false
          },
          search: {
            placeholder: 'Busca proyectos...',
            voiceButtonText: 'Buscar con voz',
            maxResults: 12,
            fuzzySearch: true,
            searchInFields: ['title', 'description']
          },
          admin: {
            enabled: true,
            path: '/admin',
            allowJsonEdit: true,
            allowFileUpload: true
          }
        });
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, loading, error };
}
