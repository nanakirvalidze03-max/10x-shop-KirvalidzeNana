import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Simple learning guard: guests are sent to /login and remember where they wanted to go.
export default function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
