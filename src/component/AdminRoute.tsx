import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { isAuthenticated } from "@/lib/api";

interface AdminRouteProps {
  element: JSX.Element;
}

/**
 * Admin Route Component
 * Requires both authentication AND admin role
 */
export const AdminRoute = ({ element }: AdminRouteProps) => {
  const authenticated = isAuthenticated();
  const { user } = useUser();

  // Not authenticated - redirect to sign-in
  if (!authenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  // Authenticated but not admin - redirect to home
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/home" replace />;
  }

  // Admin access granted
  return element;
};

export default AdminRoute;
