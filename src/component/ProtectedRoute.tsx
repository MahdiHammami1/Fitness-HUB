import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { isAuthenticated } from "@/lib/api";

interface ProtectedRouteProps {
  element: JSX.Element;
  requiredAuth?: boolean;
  allowAuthUsers?: boolean;
}

/**
 * Protected Route Component
 * - Auth pages: Can redirect to home if already authenticated (unless allowAuthUsers=true)
 * - Protected pages: Redirects to sign-in if not authenticated
 * - Public pages without auth: Redirects to sign-in if not authenticated
 */
export const ProtectedRoute = ({ 
  element, 
  requiredAuth = true,
  allowAuthUsers = false
}: ProtectedRouteProps) => {
  const authenticated = isAuthenticated();
  const { loading } = useUser();

  // Still loading user data - show nothing (don't redirect yet)
  if (loading) {
    return null;
  }

  // If auth is NOT required (auth pages like sign-in, sign-up)
  if (!requiredAuth) {
    // If user is authenticated and allowAuthUsers is false, redirect to home
    if (authenticated && !allowAuthUsers) {
      return <Navigate to="/home" replace />;
    }
    // Allow access to auth pages
    return element;
  }

  // If auth IS required (protected routes and public routes when not auth page)
  if (requiredAuth && !authenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return element;
};

export default ProtectedRoute;
