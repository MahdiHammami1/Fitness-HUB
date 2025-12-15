import { Link } from 'react-router-dom';
import { Button } from '@/component/ui/button';
import { ArrowRight, Dumbbell, Calendar, ShoppingBag } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export const HeroSection = () => {
  const { settings } = useSiteSettings();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container-tight relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Transform Your Life
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {settings.heroTitle.split(' ')[0]}
            <br />
            <span className="text-primary">{settings.heroTitle.split(' ').slice(1).join(' ')}</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {settings.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/coaching">
              <Button variant="hero" className="w-full sm:w-auto group">
                Start Coaching
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="heroOutline" className="w-full sm:w-auto">
                Shop Now
              </Button>
            </Link>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/coaching" className="group">
              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <Dumbbell className="h-8 w-8 text-primary mb-4 mx-auto" />
                <h3 className="font-display text-xl text-foreground mb-2">Personal Coaching</h3>
                <p className="text-sm text-muted-foreground">
                  1:1 training tailored to your goals
                </p>
              </div>
            </Link>

            <Link to="/events" className="group">
              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <Calendar className="h-8 w-8 text-primary mb-4 mx-auto" />
                <h3 className="font-display text-xl text-foreground mb-2">Live Events</h3>
                <p className="text-sm text-muted-foreground">
                  Workshops, seminars & bootcamps
                </p>
              </div>
            </Link>

            <Link to="/shop" className="group">
              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <ShoppingBag className="h-8 w-8 text-primary mb-4 mx-auto" />
                <h3 className="font-display text-xl text-foreground mb-2">Premium Gear</h3>
                <p className="text-sm text-muted-foreground">
                  Supplements, apparel & equipment
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
