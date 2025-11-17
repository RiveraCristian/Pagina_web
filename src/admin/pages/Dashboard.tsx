import { useQuery } from '@tanstack/react-query';
import { FaFolder, FaFileAlt, FaCheckCircle, FaClock, FaArchive } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FileManager } from '../utils/fileManager';
import '../styles/Dashboard.css';

export default function Dashboard() {
  // Consultar estadísticas
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      return await FileManager.getStats();
    },
  });

  // Consultar items recientes
  const { data: recentItems = [], isLoading: loadingRecent } = useQuery({
    queryKey: ['recentItems'],
    queryFn: async () => {
      return await FileManager.getRecentItems();
    },
  });

  if (loadingStats || loadingRecent) {
    return (
      <div className="admin-page">
        <h1 className="admin-page-title">Dashboard</h1>
        <div className="dashboard-loading">Cargando...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      published: 'Publicado',
      draft: 'Borrador',
      archived: 'Archivado',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <FaCheckCircle className="status-icon published" />;
      case 'draft':
        return <FaClock className="status-icon draft" />;
      case 'archived':
        return <FaArchive className="status-icon archived" />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-page dashboard">
      <h1 className="admin-page-title">Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaFolder />
          </div>
          <div className="stat-info">
            <div className="stat-label">Categorías</div>
            <div className="stat-value">{stats?.totalCategories || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaFileAlt />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Items</div>
            <div className="stat-value">{stats?.totalItems || 0}</div>
          </div>
        </div>

        <div className="stat-card published">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <div className="stat-label">Publicados</div>
            <div className="stat-value">{stats?.publishedItems || 0}</div>
          </div>
        </div>

        <div className="stat-card draft">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-info">
            <div className="stat-label">Borradores</div>
            <div className="stat-value">{stats?.draftItems || 0}</div>
          </div>
        </div>

        <div className="stat-card archived">
          <div className="stat-icon">
            <FaArchive />
          </div>
          <div className="stat-info">
            <div className="stat-label">Archivados</div>
            <div className="stat-value">{stats?.archivedItems || 0}</div>
          </div>
        </div>
      </div>

      {/* Recent Items */}
      <div className="admin-section">
        <h2>Actividad Reciente</h2>
        {recentItems.length === 0 ? (
          <div className="empty-state">
            <FaFileAlt />
            <p>No hay contenido aún</p>
            <Link to="/admin/items" className="admin-button primary">
              Crear Primer Item
            </Link>
          </div>
        ) : (
          <div className="recent-items-table">
            <table>
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
                {recentItems.map((item) => (
                  <tr key={item.id}>
                    <td className="item-title">
                      {item.data?.titulo || item.data?.title || item.data?.name || 'Sin título'}
                    </td>
                    <td>
                      <span className="category-badge">{item.categoryId}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${item.status}`}>
                        {getStatusIcon(item.status)}
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="item-date">{formatDate(item.updatedAt)}</td>
                    <td>
                      <Link
                        to={`/admin/items/${item.categoryId}/${item.id}/edit`}
                        className="action-link"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="admin-section">
        <h2>Acciones Rápidas</h2>
        <div className="quick-actions">
          <Link to="/admin/categories" className="quick-action-card">
            <FaFolder />
            <h3>Gestionar Categorías</h3>
            <p>Crea y edita categorías de contenido</p>
          </Link>

          <Link to="/admin/items" className="quick-action-card">
            <FaFileAlt />
            <h3>Crear Contenido</h3>
            <p>Añade nuevos items a tus categorías</p>
          </Link>

          <Link to="/admin/design" className="quick-action-card">
            <FaCheckCircle />
            <h3>Personalizar Diseño</h3>
            <p>Cambia colores, tipografías y estilos</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
