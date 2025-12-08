import { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/component/ui/button';
import { testimonials } from '@/data/mockData';

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const approvedTestimonials = testimonials.filter(t => t.approved);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % approvedTestimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [approvedTestimonials.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + approvedTestimonials.length) % approvedTestimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % approvedTestimonials.length);
  };

  if (approvedTestimonials.length === 0) return null;

  const current = approvedTestimonials[currentIndex];

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container-tight px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            SUCCESS <span className="text-primary">STORIES</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real transformations from real people. Join hundreds who've changed their lives.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative bg-card rounded-2xl border border-border p-8 md:p-12">
            <Quote className="absolute top-6 left-6 h-8 w-8 text-primary/20" />
            
            <div className="text-center">
              {current.rating && (
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < current.rating! ? 'text-primary fill-primary' : 'text-muted'}`}
                    />
                  ))}
                </div>
              )}

              <blockquote className="text-lg md:text-xl text-foreground mb-6 leading-relaxed">
                "{current.text}"
              </blockquote>

              <div>
                <p className="font-display text-xl text-primary">{current.name}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button variant="ghost" size="icon" onClick={goToPrev} aria-label="Previous testimonial">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex gap-2">
                {approvedTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? 'bg-primary w-6' : 'bg-muted'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <Button variant="ghost" size="icon" onClick={goToNext} aria-label="Next testimonial">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
