import { useState } from 'react';
import { Layout } from '@/component/layout/Layout';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Textarea } from '@/component/ui/textarea';
import { Check, Award, MessageCircle, Instagram, ArrowRight } from 'lucide-react';
import { coachingOffers, coachProfile, testimonials } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import yassine_saidani from '@/assets/yassine_saidani.jpeg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const Coaching = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: 'Coaching Inquiry',
          message: formData.message,
          phone: formData.phone,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('Thank you! Coach Yassine will contact you within 24 hours.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="container-tight px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-5xl md:text-7xl text-foreground mb-6">
              TRANSFORM WITH <span className="text-primary">YASSINE</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Expert coaching designed to unlock your full potential. Whether you're starting out or looking to break through plateaus.
            </p>
          </div>
        </div>
      </section>

      {/* Coach Profile */}
      <section className="section-padding bg-card">
        <div className="container-tight px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center overflow-hidden">
              <img 
                src={yassine_saidani} 
                alt="Yassine Saidani" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h2 className="font-display text-4xl text-foreground mb-2">
                {coachProfile.name}
              </h2>
              <p className="text-primary font-medium mb-6">{coachProfile.title}</p>
              
              <p className="text-muted-foreground mb-6 whitespace-pre-line">
                {coachProfile.bio}
              </p>
              
              <blockquote className="border-l-4 border-primary pl-4 italic text-foreground mb-8">
                "{coachProfile.philosophy}"
              </blockquote>

              <div className="space-y-4">
                <h3 className="font-display text-xl text-foreground flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Certifications
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {coachProfile.certifications.map((cert, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
                {Object.entries(coachProfile.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="font-display text-3xl text-primary">{value}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-background">
        <div className="container-tight px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              COACHING <span className="text-primary">PROGRAMS</span>
            </h2>
            <p className="text-muted-foreground">
              Choose the program that fits your goals and budget.
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

                <Button
                  variant={offer.popular ? "default" : "outline"}
                  className="w-full"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-card">
        <div className="container-tight px-4">
          <h2 className="font-display text-4xl text-foreground text-center mb-12">
            WHAT CLIENTS <span className="text-primary">SAY</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.filter(t => t.approved).map((testimonial) => (
              <div key={testimonial.id} className="p-6 rounded-xl bg-background border border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < (testimonial.rating || 5) ? 'text-primary' : 'text-muted'}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                <p className="font-display text-lg text-primary">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="section-padding bg-background">
        <div className="container-tight px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display text-4xl text-foreground mb-4">
                START YOUR <span className="text-primary">JOURNEY</span>
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and Coach Yassine will get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name *
                  </label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Phone (WhatsApp)
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+216 23 630 102"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Tell us about your goals *
                </label>
                <Textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="What are your fitness goals? What program interests you?"
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>

            <div className="flex justify-center gap-4 mt-8">
              <a
                href="https://wa.me/21623630102"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/wouhouch_events/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Coaching;
