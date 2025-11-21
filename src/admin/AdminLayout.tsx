/**
 * AdminLayout - Layout principal del panel de administración
 */

import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaFolder,
  FaFileAlt,
  FaPalette,
  FaEye,
  FaSave,
  FaTimes,
  FaSignOutAlt,
  FaRobot,
  FaGlobe,
  FaCog,
} from 'react-icons/fa';
import { FileManager } from './utils/fileManager';
import { logout } from './utils/auth';
import './styles/admin-theme.css';
import './styles/AdminLayout.css';

export function AdminLayout() {
  const navigate = useNavigate();
  const [hasChanges, setHasChanges] = useState(FileManager.hasUnsavedChanges());
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Los cambios ya están guardados por cada componente individual
      // Este botón es principalmente para sincronizar y confirmar
      FileManager.clearChanges();
      setHasChanges(false);
      setSaveMessage('✅ Cambios guardados exitosamente');
      
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
      setSaveMessage('❌ Error al guardar cambios');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    if (hasChanges) {
      const confirm = window.confirm(
        '⚠️ Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar sesión?'
      );
      if (!confirm) return;
    }

    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout admin-light-theme">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>⚙️ Admin Panel</h2>
          <p className="admin-subtitle">VoiceSearch Framework</p>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')}>
            <FaHome />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/categories" className={({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')}>
            <FaFolder />
            <span>Categorías</span>
          </NavLink>

          <NavLink to="/admin/items" className={({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')}>
            <FaFileAlt />
            <span>Contenido</span>
          </NavLink>

          <NavLink to="/admin/pages" className={({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')}>
            <FaGlobe />
            <span>Páginas</span>
          </NavLink>

          <NavLink to="/admin/config" className={({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')}>
            <FaCog />
            <span>Configuración</span>
          </NavLink>

          <NavLink to="/admin/design" className={({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')}>
            <FaPalette />
            <span>Diseño</span>
          </NavLink>

          <NavLink to="/admin/ai" className={({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')}>
            <FaRobot />
            <span>IA y Búsqueda</span>
          </NavLink>

          <NavLink to="/admin/search-engine" className={({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')}>
            <FaRobot />
            <span>Motor de Búsqueda</span>
          </NavLink>
        </nav>

        <div className="admin-footer">
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="save-button"
            >
              <FaSave />
              <span>{isSaving ? 'Guardando...' : 'Guardar Todo'}</span>
            </button>
          )}

          <Link to="/" target="_blank" className="preview-button">
            <FaEye />
            <span>Ver Sitio</span>
          </Link>

          <button onClick={handleLogout} className="logout-button admin-button-danger">
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            {/* El título lo pondrá cada página */}
          </div>

          <div className="header-right">
            {saveMessage && (
              <div className={`save-message ${saveMessage.includes('❌') ? 'error' : 'success'}`}>
                {saveMessage}
                <button onClick={() => setSaveMessage(null)} className="close-message">
                  <FaTimes />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-page-content">
          <Outlet context={{ setHasChanges }} />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
