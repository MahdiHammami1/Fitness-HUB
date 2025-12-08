import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/api";

interface ProtectedRouteProps {
  element: JSX.Element;
  requiredAuth?: boolean;
}

/**
 * Protected Route Component
 * - Auth pages: Redirects to home if already authenticated
 * - Protected pages: Redirects to sign-in if not authenticated
 * - Public pages without auth: Redirects to sign-in if not authenticated
 */
export const ProtectedRoute = ({ 
  element, 
  requiredAuth = true 
}: ProtectedRouteProps) => {
  const authenticated = isAuthenticated();

  // If auth is NOT required (auth pages like sign-in, sign-up)
  if (!requiredAuth) {
    // If user is authenticated, redirect to home
    if (authenticated) {
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
