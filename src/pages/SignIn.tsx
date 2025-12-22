import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import AuthLayout from "@/component/auth/AuthLayout";
import { AuthInput } from "@/component/ui/auth-input";
import { Button } from "@/component/ui/button";
import { Checkbox } from "@/component/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { apiPost, apiGet, isAuthenticated } from "@/lib/api";

const SignIn = () => {
  const { toast } = useToast();
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiPost("/auth/signin", {
        email,
        password,
      });

      console.log("SignIn response:", response);

      // Store token immediately after successful signin
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        console.log("Token stored:", response.token);
      }

      // Fetch user info using the /auth/me endpoint now that token is stored
      let userData: any = null;
      try {
        console.log("Fetching user info from /auth/me");
        const userResponse = await apiGet("/auth/me");
        console.log("User info from backend:", userResponse);
        
        if (userResponse) {
          // Extract user data - handle nested responses
          userData = userResponse.data || userResponse;
        }
      } catch (fetchError) {
        console.error("Error fetching user info:", fetchError);
        // If fetch fails, we still have token stored, user can access app
        // but won't have full user data until next page load
        userData = null;
      }

      // If we got user data, process and store it
      if (userData) {
        // Ensure role exists and is properly set
        if (!userData.role) {
          userData.role = 'CUSTOMER';
        }
        
        // Ensure role is uppercase for proper comparison
        userData.role = userData.role.toUpperCase();
        
        console.log("Final user data with role:", userData);
        console.log("Role value:", userData.role);
        console.log("Is ADMIN:", userData.role === 'ADMIN');
        
        // Store user data in localStorage AND update context immediately
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      setIsLoading(false);
      // Redirect to home using React Router
      navigate("/home", { replace: true });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your fitness journey"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <AuthInput
            type="email"
            placeholder="Email address"
            icon={<Mail size={20} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <AuthInput
            type="password"
            placeholder="Password"
            icon={<Lock size={20} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor="remember"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Remember me
            </label>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground glow-primary transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-muted-foreground">
              or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-12 border-border hover:bg-secondary hover:border-muted-foreground/50 transition-all"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 border-border hover:bg-secondary hover:border-muted-foreground/50 transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            Facebook
          </Button>
        </div>

        <p className="text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
