import { ReactNode } from "react";
import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, hsl(220 20% 6% / 0.7), hsl(220 20% 6% / 0.9)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80')`,
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center glow-primary">
              <Dumbbell className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Wouhouch</span>
          </Link>
          
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Transform Your Body,<br />
              <span className="text-gradient">Elevate Your Life</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Join thousands of members achieving their fitness goals with personalized training programs and expert guidance.
            </p>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <div>
              <div className="text-3xl font-bold text-foreground">10K+</div>
              <div>Active Members</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-3xl font-bold text-foreground">500+</div>
              <div>Workout Plans</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-3xl font-bold text-foreground">50+</div>
              <div>Expert Trainers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        {/* Mobile logo */}
        <div className="lg:hidden flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Wouhouch</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
