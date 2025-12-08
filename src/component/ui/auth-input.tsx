import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface AuthInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";

    return (
      <div className="relative">
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            type={isPassword && showPassword ? "text" : type}
            className={cn(
              "flex h-14 w-full rounded-lg border border-border bg-secondary/50 px-4 py-2 text-base transition-all duration-200",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "hover:border-muted-foreground/50",
              icon && "pl-12",
              isPassword && "pr-12",
              error && "border-destructive focus:ring-destructive/50",
              className
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
AuthInput.displayName = "AuthInput";

export { AuthInput };
