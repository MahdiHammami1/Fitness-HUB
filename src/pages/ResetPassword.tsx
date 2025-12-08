import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import AuthLayout from "@/component/auth/AuthLayout";
import { AuthInput } from "@/component/ui/auth-input";
import { Button } from "@/component/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiPost } from "@/lib/api";

const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!code) {
      newErrors.code = "Invalid reset link";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await apiPost("/auth/reset", {
        code,
        newPassword: password,
      });

      toast({
        title: "Password reset!",
        description: "Your password has been successfully reset.",
      });

      setIsLoading(false);
      navigate("/sign-in");
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your new password"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <AuthInput
            type="password"
            placeholder="New password"
            icon={<Lock size={20} />}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
            error={errors.password}
            required
          />
          <AuthInput
            type="password"
            placeholder="Confirm password"
            icon={<Lock size={20} />}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }
            }}
            error={errors.confirmPassword}
            required
          />
        </div>

        {errors.code && (
          <p className="text-sm text-destructive">{errors.code}</p>
        )}

        <Button
          type="submit"
          className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground glow-primary transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Resetting...
            </div>
          ) : (
            "Reset Password"
          )}
        </Button>

        <Link
          to="/sign-in"
          className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
          Back to sign in
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
