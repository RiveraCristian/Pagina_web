import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaFolder, FaSpinner } from 'react-icons/fa';
import { FileManager } from '../utils/fileManager';
import type { Category } from '@/types/schema';
import '../styles/Categories.css';

export default function Categories() {
  const queryClient = useQueryClient();

  // Cargar categorías
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        console.log('🔄 Loading categories...');
        const data = await FileManager.readCategories();
        console.log('📦 Raw categories data:', data);
        
        if (!data) {
          console.error('❌ No data received from FileManager');
          return [];
        }
        
        if (!data.categories) {
          console.error('❌ No categories property in data:', data);
          return [];
        }
        
        if (!Array.isArray(data.categories)) {
          console.error('❌ Categories is not an array:', typeof data.categories, data.categories);
          return [];
        }
        
        console.log('✅ Categories loaded successfully:', data.categories.length, 'categories');
        return data.categories;
      } catch (error) {
        console.error('❌ Error loading categories:', error);
        throw error;
      }
    },
  });

  // Mutación para eliminar categoría
  const deleteMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const data = await FileManager.readCategories();
      const updated = data.categories.filter(c => c.id !== categoryId);
      await FileManager.saveCategories({ categories: updated });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const handleDelete = async (category: Category) => {
    const items = await FileManager.readItems(category.id);
    const itemCount = items.length;

    const message = itemCount > 0
      ? `¿Eliminar la categoría "${category.name}"?\n\nEsto también eliminará ${itemCount} item(s) asociado(s).`
      : `¿Eliminar la categoría "${category.name}"?`;

    if (window.confirm(message)) {
      deleteMutation.mutate(category.id);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page">
        <h1 className="admin-page-title">Categorías</h1>
        <div className="categories-loading">
          <FaSpinner className="spin" />
          Cargando categorías...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page categories">
      <div className="categories-header">
        <div>
          <h1 className="admin-page-title">Categorías</h1>
          <p className="page-subtitle">
            Define los tipos de contenido y sus campos personalizados
          </p>
        </div>
        <Link to="/admin/categories/new" className="admin-button primary">
          <FaPlus />
          Nueva Categoría
        </Link>
      </div>

      {error && (
        <div className="error-state">
          <p style={{ color: 'red' }}>Error cargando categorías: {error.message}</p>
          <p style={{ fontSize: '0.9em', color: '#666' }}>Revisa la consola para más detalles</p>
        </div>
      )}

      {!error && (!Array.isArray(categories) || categories.length === 0) ? (
        <div className="empty-state">
          <FaFolder />
          <h3>No hay categorías</h3>
          <p>Crea tu primera categoría para comenzar a organizar contenido</p>
          <div style={{ fontSize: '0.8em', color: '#666', marginTop: '10px' }}>
            Debugging: categories = {JSON.stringify(categories, null, 2)}
          </div>
          <Link to="/admin/categories/new" className="admin-button primary">
            <FaPlus />
            Crear Primera Categoría
          </Link>
        </div>
      ) : error ? null : (
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-header">
                <div className="category-icon">
                  <FaFolder />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  {category.description && (
                    <p className="category-description">{category.description}</p>
                  )}
                </div>
              </div>

              <div className="category-meta">
                <div className="meta-item">
                  <span className="meta-label">ID:</span>
                  <code>{category.id}</code>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Campos:</span>
                  <span className="meta-value">{category.fields.length}</span>
                </div>
              </div>

              <div className="category-fields-preview">
                <div className="fields-label">Campos definidos:</div>
                <div className="fields-tags">
                  {category.fields.slice(0, 5).map((field) => (
                    <span key={field.id} className="field-tag" title={field.label}>
                      {field.label}
                      <span className="field-type">{field.type}</span>
                    </span>
                  ))}
                  {category.fields.length > 5 && (
                    <span className="field-tag more">
                      +{category.fields.length - 5} más
                    </span>
                  )}
                </div>
              </div>

              <div className="category-actions">
                <Link
                  to={`/admin/categories/${category.id}/edit`}
                  className="action-button edit"
                  title="Editar categoría"
                >
                  <FaEdit />
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(category)}
                  className="action-button delete"
                  disabled={deleteMutation.isPending}
                  title="Eliminar categoría"
                >
                  <FaTrash />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
