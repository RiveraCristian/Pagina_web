import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminLayout from './AdminLayout';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { login } from './utils/auth';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Categories from './pages/Categories';
import CategoryForm from './pages/CategoryForm';
import Items from './pages/Items';
import ItemForm from './pages/ItemForm';
import Design from './pages/Design';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

export default function AdminApp() {
  const handleLogin = async (password: string): Promise<boolean> => {
    return login(password);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública de login */}
          <Route path="/admin/login" element={<Login onLogin={handleLogin} />} />
          
          {/* Rutas protegidas del admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/:id/edit" element={<CategoryForm />} />
            <Route path="items" element={<Items />} />
            <Route path="items/:categoryId/new" element={<ItemForm />} />
            <Route path="items/:categoryId/:id/edit" element={<ItemForm />} />
            <Route path="design" element={<Design />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
