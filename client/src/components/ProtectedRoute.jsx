import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  // Redirect to /login if not authenticated, otherwise render children via Outlet
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;