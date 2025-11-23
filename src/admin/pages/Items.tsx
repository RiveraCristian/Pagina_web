import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaFilter, FaSpinner } from 'react-icons/fa';
import { FileManager } from '../utils/fileManager';
import type { Item } from '@/types/schema';
import '../styles/Items.css';

export default function Items() {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Cargar categorías
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => await FileManager.readCategories(),
  });

  const categories = categoriesData?.categories || [];

  // Cargar items de todas las categorías
  const { data: allItems = [], isLoading, error, refetch } = useQuery({
    queryKey: ['all-items', selectedCategory],
    queryFn: async () => {
      console.log('🔄 Loading items for all categories...');
      const items: Item[] = [];
      
      for (const category of categories) {
        try {
          console.log(`📁 Loading items for category: ${category.id}`);
          const categoryItems = await FileManager.readItems(category.id);
          console.log(`✅ Loaded ${categoryItems.length} items for ${category.id}`);
          items.push(...categoryItems);
        } catch (error) {
          console.error(`❌ Error loading items for ${category.id}:`, error);
        }
      }
      
      console.log(`🎯 Total items loaded: ${items.length}`);
      return items;
    },
    enabled: categories.length > 0,
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Auto-refresh cada 30 segundos
    staleTime: 10000, // Considera los datos stale después de 10 segundos
  });

  // Filtrar items
  const filteredItems = allItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const statusMatch = selectedStatus === 'all' || item.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  // Mutación para eliminar item
  const deleteMutation = useMutation({
    mutationFn: async ({ categoryId, itemId }: { categoryId: string; itemId: string }) => {
      await FileManager.deleteItem(categoryId, itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-items'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['recentItems'] });
    },
  });

  const handleDelete = (item: Item) => {
    if (window.confirm(`¿Eliminar "${getItemTitle(item)}"?`)) {
      deleteMutation.mutate({ categoryId: item.categoryId, itemId: item.id });
    }
  };

  const getItemTitle = (item: Item): string => {
    return item.data?.titulo || item.data?.title || item.data?.name || item.data?.nombre || `Item ${item.id}`;
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      published: { label: 'Publicado', className: 'published' },
      draft: { label: 'Borrador', className: 'draft' },
      archived: { label: 'Archivado', className: 'archived' },
    };
    return badges[status as keyof typeof badges] || { label: status, className: '' };
  };

  if (isLoading) {
    return (
      <div className="admin-page">
        <h1 className="admin-page-title">Contenido</h1>
        <div className="items-loading">
          <FaSpinner className="spin" />
          Cargando contenido...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <h1 className="admin-page-title">Contenido</h1>
        <div className="error-state">
          <p style={{ color: 'red' }}>Error cargando contenido: {error.message}</p>
          <button onClick={() => refetch()} className="admin-button primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page items">
      <div className="items-header">
        <div>
          <h1 className="admin-page-title">Gestión de Contenido</h1>
          <p className="page-subtitle">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            {selectedCategory !== 'all' && ` en ${getCategoryName(selectedCategory)}`}
          </p>
        </div>
        {categories.length > 0 && (
          <div className="create-buttons">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/admin/items/${category.id}/new`}
                className="admin-button primary small"
              >
                <FaPlus />
                Nuevo {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="items-filters">
        <div className="filter-group">
          <FaFilter />
          <label htmlFor="category-filter">Categoría:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Estado:</label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos</option>
            <option value="published">Publicado</option>
            <option value="draft">Borrador</option>
            <option value="archived">Archivado</option>
          </select>
        </div>

        <div className="filter-stats">
          Mostrando {filteredItems.length} de {allItems.length} items
        </div>
      </div>

      {/* Items List */}
      {categories.length === 0 ? (
        <div className="empty-state">
          <FaEye />
          <h3>No hay categorías</h3>
          <p>Primero debes crear una categoría antes de agregar contenido</p>
          <Link to="/admin/categories/new" className="admin-button primary">
            <FaPlus />
            Crear Primera Categoría
          </Link>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <FaEye />
          <h3>No hay contenido</h3>
          <p>
            {allItems.length === 0
              ? 'Comienza creando tu primer item de contenido'
              : 'No hay items que coincidan con los filtros seleccionados'}
          </p>
          {allItems.length === 0 && categories.length > 0 && (
            <Link to={`/admin/items/${categories[0].id}/new`} className="admin-button primary">
              <FaPlus />
              Crear Primer Item
            </Link>
          )}
        </div>
      ) : (
        <div className="items-table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Última Modificación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const badge = getStatusBadge(item.status);
                return (
                  <tr key={`${item.categoryId}-${item.id}`}>
                    <td className="item-title-cell">
                      <span className="item-title">{getItemTitle(item)}</span>
                    </td>
                    <td>
                      <span className="category-badge">{getCategoryName(item.categoryId)}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="item-date">{formatDate(item.updatedAt)}</td>
                    <td className="item-actions">
                      <Link
                        to={`/admin/items/${item.categoryId}/${item.id}/edit`}
                        className="action-btn edit"
                        title="Editar"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(item)}
                        className="action-btn delete"
                        disabled={deleteMutation.isPending}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
