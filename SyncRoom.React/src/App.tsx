import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AuthProvider } from '@/context/AuthContext';
import {
  AdminRoute,
  LoginRoute,
  RegisterRoute,
  RoomDetailRoute,
  RoomsRoute,
} from '@/pages/RouteContainers';
import { store, useAppDispatch } from '@/store';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { getProfile } from './store/slices/authSlice';

export default function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <Provider store={store}>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginRoute />} />
              <Route path="/register" element={<RegisterRoute />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/rooms" element={<RoomsRoute />} />
                  <Route path="/rooms/:id" element={<RoomDetailRoute />} />

                  <Route element={<ProtectedRoute requireAdmin />}>
                    <Route path="/admin" element={<AdminRoute />} />
                  </Route>
                </Route>
              </Route>

              <Route path="/" element={<Navigate to="/rooms" replace />} />
              <Route path="*" element={<Navigate to="/rooms" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
     </ToastProvider>
    </Provider>
  );
}
