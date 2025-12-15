import { Link } from 'react-router-dom';
import { Button } from '@/component/ui/button';
import { ArrowRight, MessageCircle } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-primary/20 via-background to-background relative overflow-hidden">
      {/* Animated elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />

      <div className="container-tight px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl text-foreground mb-6">
            READY TO <span className="text-primary">TRANSFORM?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10">
            Take the first step today. Contact Coach Yassine and start your journey to becoming the best version of yourself.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/coaching">
              <Button variant="hero" className="w-full sm:w-auto group">
                Start Coaching
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a
              href="https://wa.me/21623630102"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="heroOutline" className="w-full sm:w-auto">
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
