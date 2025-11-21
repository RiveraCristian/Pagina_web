import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaPlus, FaEdit, FaTrash, FaEye, FaGlobe } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Pages.css';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  template?: 'default' | 'about' | 'contact' | 'services';
  featured?: boolean;
}

export default function Pages() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  // Cargar páginas
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/pages');
        if (!response.ok) {
          throw new Error('Failed to load pages');
        }
        const data = await response.json();
        return data.pages || [];
      } catch (error) {
        console.error('Error loading pages:', error);
        return [];
      }
    }
  });

  // Mutación para eliminar página
  const deleteMutation = useMutation({
    mutationFn: async (pageId: string) => {
      const response = await fetch('/api/delete-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pageId })
      });

      if (!response.ok) {
        throw new Error('Failed to delete page');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    }
  });

  const handleDelete = (page: Page) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la página "${page.title}"?`)) {
      deleteMutation.mutate(page.id);
    }
  };

  const filteredPages = pages.filter((page: Page) => {
    if (filter === 'all') return true;
    return page.status === filter;
  });

  const getStatusBadge = (status: Page['status']) => {
    const statusConfig = {
      published: { label: 'Publicada', className: 'status-published' },
      draft: { label: 'Borrador', className: 'status-draft' },
      archived: { label: 'Archivada', className: 'status-archived' }
    };

    const config = statusConfig[status];
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  if (isLoading) {
    return (
      <div className="admin-page">
        <h1 className="admin-page-title">Páginas</h1>
        <div className="loading">Cargando páginas...</div>
      </div>
    );
  }

  return (
    <div className="admin-page pages-page">
      <div className="page-header">
        <h1 className="admin-page-title">
          <FaGlobe />
          Gestión de Páginas
        </h1>
        <Link to="/admin/pages/new" className="admin-button primary">
          <FaPlus />
          Nueva Página
        </Link>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-buttons">
          <button
            onClick={() => setFilter('all')}
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          >
            Todas ({pages.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`filter-button ${filter === 'published' ? 'active' : ''}`}
          >
            Publicadas ({pages.filter((p: Page) => p.status === 'published').length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`filter-button ${filter === 'draft' ? 'active' : ''}`}
          >
            Borradores ({pages.filter((p: Page) => p.status === 'draft').length})
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`filter-button ${filter === 'archived' ? 'active' : ''}`}
          >
            Archivadas ({pages.filter((p: Page) => p.status === 'archived').length})
          </button>
        </div>
      </div>

      {/* Lista de páginas */}
      <div className="pages-list">
        {filteredPages.length === 0 ? (
          <div className="empty-state">
            <FaGlobe className="empty-icon" />
            <h3>No hay páginas</h3>
            <p>
              {filter === 'all' 
                ? 'Aún no has creado ninguna página. ¡Crea la primera!'
                : `No hay páginas con estado "${filter}".`
              }
            </p>
            <Link to="/admin/pages/new" className="admin-button primary">
              <FaPlus />
              Crear Primera Página
            </Link>
          </div>
        ) : (
          <div className="pages-grid">
            {filteredPages.map((page: Page) => (
              <div key={page.id} className="page-card">
                <div className="page-header-info">
                  <div className="page-title-section">
                    <h3 className="page-title">{page.title}</h3>
                    <div className="page-meta">
                      <span className="page-slug">/{page.slug}</span>
                      {getStatusBadge(page.status)}
                      {page.template && (
                        <span className="template-badge">{page.template}</span>
                      )}
                      {page.featured && (
                        <span className="featured-badge">Destacada</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="page-content-preview">
                  <p>{page.seoDescription || page.content.substring(0, 150)}...</p>
                </div>

                <div className="page-dates">
                  <small>Creada: {new Date(page.createdAt).toLocaleDateString()}</small>
                  <small>Actualizada: {new Date(page.updatedAt).toLocaleDateString()}</small>
                </div>

                <div className="page-actions">
                  {page.status === 'published' && (
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-button view"
                      title="Ver página"
                    >
                      <FaEye />
                    </a>
                  )}
                  
                  <Link
                    to={`/admin/pages/${page.id}/edit`}
                    className="action-button edit"
                    title="Editar página"
                  >
                    <FaEdit />
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(page)}
                    disabled={deleteMutation.isPending}
                    className="action-button delete"
                    title="Eliminar página"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}