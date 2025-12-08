import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/component/layout/Layout';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Checkbox } from '@/component/ui/checkbox';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Download } from 'lucide-react';
import { events } from '@/data/mockData';
import { format } from 'date-fns';
import { toast } from 'sonner';

const EventDetail = () => {
  const { id } = useParams();
  const event = events.find(e => e.id === id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContact: '',
    acceptedTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  if (!event) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <h1 className="font-display text-4xl text-foreground mb-4">Event Not Found</h1>
          <Link to="/events">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isFull = event.currentRegistrations >= event.capacity;
  const isPast = event.status === 'past';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptedTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate registration
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsRegistered(true);
    toast.success('Registration successful! Check your email for confirmation.');
    setIsSubmitting(false);
  };

  const generateCalendarLink = () => {
    const startDate = format(event.startAt, "yyyyMMdd'T'HHmmss");
    const endDate = format(new Date(event.startAt.getTime() + 2 * 60 * 60 * 1000), "yyyyMMdd'T'HHmmss");
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
LOCATION:${event.location}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, '-')}.ics`;
    link.click();
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative">
        <div className="aspect-[21/9] bg-gradient-to-br from-primary/30 to-secondary relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Calendar className="h-24 w-24 text-primary/30" />
          </div>
          {event.isFree && !isPast && (
            <span className="absolute top-6 right-6 px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold uppercase">
              Free Event
            </span>
          )}
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-tight px-4">
          <Link to="/events" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                {event.title}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <Calendar className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">{format(event.startAt, 'MMM d, yyyy')}</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <Clock className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium text-foreground">{format(event.startAt, 'h:mm a')}</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <MapPin className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground truncate">{event.location}</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <Users className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Spots</p>
                  <p className="font-medium text-foreground">
                    {event.currentRegistrations}/{event.capacity}
                  </p>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h2 className="font-display text-2xl text-foreground">About This Event</h2>
                <p className="text-muted-foreground">{event.description}</p>
              </div>

              {isPast && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl text-foreground mb-6">Event Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square rounded-lg bg-card border border-border flex items-center justify-center">
                        <span className="text-muted-foreground/30">Photo {i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Registration Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-card border border-border p-6">
                {isPast ? (
                  <div className="text-center">
                    <h3 className="font-display text-xl text-foreground mb-2">Event Ended</h3>
                    <p className="text-muted-foreground text-sm">
                      This event has already taken place. Check out our upcoming events!
                    </p>
                    <Link to="/events" className="mt-4 inline-block">
                      <Button variant="outline" className="w-full">
                        View Upcoming Events
                      </Button>
                    </Link>
                  </div>
                ) : isRegistered ? (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-display text-xl text-foreground mb-2">You're Registered!</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Check your email for confirmation and event details.
                    </p>
                    <Button variant="outline" onClick={generateCalendarLink} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Add to Calendar
                    </Button>
                  </div>
                ) : isFull ? (
                  <div className="text-center">
                    <h3 className="font-display text-xl text-foreground mb-2">Sold Out</h3>
                    <p className="text-muted-foreground text-sm">
                      This event has reached capacity. Check back for future events!
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      {!event.isFree && (
                        <span className="font-display text-4xl text-primary">${event.price}</span>
                      )}
                      <h3 className="font-display text-xl text-foreground mt-2">Register Now</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.capacity - event.currentRegistrations} spots remaining
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="reg-name" className="block text-sm font-medium text-foreground mb-1">
                          Full Name *
                        </label>
                        <Input
                          id="reg-name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label htmlFor="reg-email" className="block text-sm font-medium text-foreground mb-1">
                          Email *
                        </label>
                        <Input
                          id="reg-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label htmlFor="reg-phone" className="block text-sm font-medium text-foreground mb-1">
                          Phone *
                        </label>
                        <Input
                          id="reg-phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label htmlFor="reg-emergency" className="block text-sm font-medium text-foreground mb-1">
                          Emergency Contact
                        </label>
                        <Input
                          id="reg-emergency"
                          value={formData.emergencyContact}
                          onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                          placeholder="Name & phone (optional)"
                        />
                      </div>

                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="terms"
                          checked={formData.acceptedTerms}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ ...prev, acceptedTerms: checked as boolean }))
                          }
                        />
                        <label htmlFor="terms" className="text-sm text-muted-foreground">
                          I agree to the event terms and conditions
                        </label>
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Registering...' : 'Complete Registration'}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EventDetail;
