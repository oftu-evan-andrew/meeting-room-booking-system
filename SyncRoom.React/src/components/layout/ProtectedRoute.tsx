import { useAppSelector } from '@/store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function ProtectedRoute({ requireAdmin = false }: { requireAdmin?: boolean }) {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated)  {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isSuperAdmin = user?.role === 'SuperAdmin';

  if (requireAdmin && !isSuperAdmin) { 
    return <Navigate to="/rooms" replace />;
  }

  return <Outlet />;
}
