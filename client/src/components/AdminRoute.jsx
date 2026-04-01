import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  // 1. If the user is not authenticated, redirect them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. If the user is authenticated but doesn't have admin rights, redirect to the home page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 3. If the user is an admin, render the child routes (Outlet)
  return <Outlet />;
};

export default AdminRoute;