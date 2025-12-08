import { Link } from 'react-router-dom';
import { Button } from '@/component/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { coachingOffers } from '@/data/mockData';
import { cn } from '@/lib/utils';

export const CoachingPreview = () => {
  return (
    <section className="section-padding bg-card">
      <div className="container-tight px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            COACHING <span className="text-primary">PROGRAMS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the program that fits your goals. Every journey starts with a single step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {coachingOffers.map((offer) => (
            <div
              key={offer.id}
              className={cn(
                "relative p-6 md:p-8 rounded-2xl border transition-all duration-300 card-hover",
                offer.popular
                  ? "bg-gradient-to-b from-primary/10 to-transparent border-primary/50"
                  : "bg-card border-border"
              )}
            >
              {offer.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="font-display text-2xl text-foreground mb-2">{offer.title}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-display text-4xl text-primary">${offer.price}</span>
                  <span className="text-muted-foreground">/{offer.duration}</span>
                </div>
              </div>

              <p className="text-muted-foreground text-sm mb-6 text-center">
                {offer.description}
              </p>

              <ul className="space-y-3 mb-8">
                {offer.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/coaching">
                <Button
                  variant={offer.popular ? "default" : "outline"}
                  className="w-full"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/coaching">
            <Button variant="ghost" className="group">
              View All Details
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
