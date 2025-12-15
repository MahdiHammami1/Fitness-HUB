import { Link } from 'react-router-dom';
import { Button } from '@/component/ui/button';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api';
import type { Event } from '@/types';

export const EventsPreview = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await apiGet('/events');
        let eventList: Event[] = Array.isArray(res) ? res : res?.content || [];
        
        // Classify events and filter upcoming
        const classified = eventList.map((e: any) => {
          const startDate = new Date(e.startAt);
          startDate.setHours(0, 0, 0, 0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return {
            ...e,
            startAt: new Date(e.startAt),
            status: startDate < today ? 'past' : 'upcoming'
          };
        });
        
        const upcoming = classified.filter(e => e.status === 'upcoming').slice(0, 3);
        setEvents(upcoming);
      } catch (err) {
        console.error('Failed to fetch events', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const upcomingEvents = events;

  return (
    <section className="section-padding bg-background">
      <div className="container-tight px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            UPCOMING <span className="text-primary">EVENTS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our workshops, seminars, and bootcamps. Learn, train, and connect with the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No upcoming events at this time.</p>
            </div>
          ) : (
            upcomingEvents.map((event) => (
            <Link to={`/events/${event.id}`} key={event.id}>
              <div className="group h-full rounded-2xl bg-card border border-border overflow-hidden card-hover">
                {/* Image */}
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary relative overflow-hidden">
                  {event.coverImageUrl ? (
                    <img
                      src={event.coverImageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-primary/50" />
                    </div>
                  )}
                  {event.isFree && (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase">
                      Free
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-display text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{format(event.startAt, 'MMM d, yyyy • h:mm a')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.registrationsCount}/{event.capacity} spots</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {!event.isFree && (
                      <span className="font-display text-xl text-primary">${event.price}</span>
                    )}
                    <Button variant="ghost" size="sm" className="ml-auto group/btn">
                      Register
                      <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))
          )}
        </div>

        <div className="text-center mt-10">
          <Link to="/events">
            <Button variant="outline" className="group">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
