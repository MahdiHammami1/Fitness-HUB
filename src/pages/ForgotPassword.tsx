import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import AuthLayout from "@/component/auth/AuthLayout";
import { AuthInput } from "@/component/ui/auth-input";
import { Button } from "@/component/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiPost } from "@/lib/api";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiPost("/auth/forgot", {
        email,
      });

      toast({
        title: "Reset link sent!",
        description: "Please check your email for password reset instructions.",
      });
      setIsLoading(false);
      setIsSent(true);
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: error.message || "Failed to send reset link",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthLayout
      title={isSent ? "Check your email" : "Forgot password?"}
      subtitle={
        isSent
          ? `We've sent a password reset link to ${email}`
          : "No worries, we'll send you reset instructions"
      }
    >
      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            type="email"
            placeholder="Email address"
            icon={<Mail size={20} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground glow-primary transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              "Send Reset Link"
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
      ) : (
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-10 h-10 text-primary" />
          </div>

          <p className="text-center text-muted-foreground">
            Didn't receive the email?{" "}
            <button
              onClick={() => setIsSent(false)}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Click to resend
            </button>
          </p>

          <Link
            to="/sign-in"
            className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            Back to sign in
          </Link>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
