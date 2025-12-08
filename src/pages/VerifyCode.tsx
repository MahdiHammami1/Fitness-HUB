import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/component/auth/AuthLayout";
import { Button } from "@/component/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiPost } from "@/lib/api";

const VerifyCode = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });
    setCode(newCode);

    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the complete 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await apiPost("/auth/verify", {
        code: fullCode,
      });

      setIsVerified(true);
      toast({
        title: "Email verified!",
        description: "Your account has been successfully verified.",
      });
      setIsLoading(false);

      // Redirect to sign-in after showing success
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Verification failed",
        description: error.message || "Invalid or expired code",
        variant: "destructive",
      });
    }
  };

  const handleResend = async () => {
    try {
      // Get email from localStorage or session
      const email = localStorage.getItem("signupEmail");
      if (!email) {
        toast({
          title: "Error",
          description: "Email not found. Please sign up again.",
          variant: "destructive",
        });
        return;
      }

      await apiPost("/auth/signup", {
        email,
        password: localStorage.getItem("signupPassword") || "",
        fullName: localStorage.getItem("signupFullName") || "",
      });

      toast({
        title: "Code resent!",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code",
        variant: "destructive",
      });
    }
  };

  if (isVerified) {
    return (
      <AuthLayout
        title="Email verified!"
        subtitle="Your account has been successfully verified"
      >
        <div className="space-y-6 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-pulse-glow">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Redirecting you to sign in...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-digit code sent to your email"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-center gap-3">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold rounded-lg border border-border bg-secondary/50 
                         focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                         hover:border-muted-foreground/50 transition-all duration-200"
            />
          ))}
        </div>

        <Button
          type="submit"
          className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground glow-primary transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Verifying...
            </div>
          ) : (
            "Verify Email"
          )}
        </Button>

        <p className="text-center text-muted-foreground">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Resend code
          </button>
        </p>

        <Link
          to="/sign-up"
          className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
          Back to sign up
        </Link>
      </form>
    </AuthLayout>
  );
};

export default VerifyCode;
