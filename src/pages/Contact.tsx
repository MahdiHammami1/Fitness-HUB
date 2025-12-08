import { useState } from 'react';
import { Layout } from '@/component/layout/Layout';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Textarea } from '@/component/ui/textarea';
import { Mail, MessageCircle, Instagram, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="container-tight px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-5xl md:text-7xl text-foreground mb-6">
              GET IN <span className="text-primary">TOUCH</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a question? Want to join the team? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-tight px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-3xl text-foreground mb-8">
                LET'S <span className="text-primary">CONNECT</span>
              </h2>

              <div className="space-y-6 mb-10">
                <a
                  href="https://wa.me/212600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">Quick responses, personal support</p>
                  </div>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Instagram className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Instagram</h3>
                    <p className="text-sm text-muted-foreground">@wouhouch_hub</p>
                  </div>
                </a>

                <a
                  href="mailto:contact@wouhouch.com"
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Email</h3>
                    <p className="text-sm text-muted-foreground">contact@wouhouch.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Location</h3>
                    <p className="text-sm text-muted-foreground">Casablanca, Morocco</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                <h3 className="font-display text-xl text-foreground mb-2">Working Hours</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="text-foreground">6:00 AM - 10:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-foreground">8:00 AM - 8:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-foreground">10:00 AM - 6:00 PM</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl bg-card border border-border p-6 md:p-8">
              <h2 className="font-display text-2xl text-foreground mb-6">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
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
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
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
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
