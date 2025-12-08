import { useNavigate } from "react-router-dom";
import { clearAuthToken } from "@/lib/api";
import { useToast } from "./use-toast";
import { useUser } from "@/context/UserContext";

/**
 * useLogout hook
 * Handles logout functionality
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();

  const logout = () => {
    try {
      clearAuthToken();
      setUser(null);
      localStorage.removeItem("user");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/sign-in");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return { logout };
};
