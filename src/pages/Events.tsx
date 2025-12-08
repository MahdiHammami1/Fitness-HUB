import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/component/layout/Layout';
import { Button } from '@/component/ui/button';
import { Calendar, MapPin, Users, ArrowRight, Filter } from 'lucide-react';
import { events } from '@/data/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'free' | 'paid';
type StatusFilter = 'upcoming' | 'past';

const Events = () => {
  const [priceFilter, setPriceFilter] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('upcoming');

  const filteredEvents = events.filter(event => {
    if (statusFilter === 'upcoming' && event.status !== 'upcoming') return false;
    if (statusFilter === 'past' && event.status !== 'past') return false;
    if (priceFilter === 'free' && !event.isFree) return false;
    if (priceFilter === 'paid' && event.isFree) return false;
    return true;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="container-tight px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-5xl md:text-7xl text-foreground mb-6">
              LIVE <span className="text-primary">EVENTS</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Join our workshops, seminars, and bootcamps. Learn, train, and connect with the Wouhouch community.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-card border-b border-border sticky top-16 md:top-20 z-40">
        <div className="container-tight px-4">
          <div className="flex flex-wrap items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            
            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'upcoming' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('upcoming')}
              >
                Upcoming
              </Button>
              <Button
                variant={statusFilter === 'past' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('past')}
              >
                Past
              </Button>
            </div>

            <div className="h-6 w-px bg-border" />

            {/* Price Filter */}
            <div className="flex gap-2">
              <Button
                variant={priceFilter === 'all' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setPriceFilter('all')}
              >
                All
              </Button>
              <Button
                variant={priceFilter === 'free' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setPriceFilter('free')}
              >
                Free
              </Button>
              <Button
                variant={priceFilter === 'paid' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setPriceFilter('paid')}
              >
                Paid
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="section-padding bg-background">
        <div className="container-tight px-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="font-display text-2xl text-foreground mb-2">No Events Found</h2>
              <p className="text-muted-foreground">
                {statusFilter === 'upcoming' 
                  ? 'Check back soon for upcoming events!' 
                  : 'No past events match your filter.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "group rounded-2xl bg-card border border-border overflow-hidden card-hover",
                    event.status === 'past' && "opacity-75"
                  )}
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Image */}
                    <div className="aspect-video md:aspect-auto bg-gradient-to-br from-primary/20 to-secondary relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="h-12 w-12 text-primary/50" />
                      </div>
                      {event.isFree && event.status === 'upcoming' && (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase">
                          Free
                        </span>
                      )}
                      {event.status === 'past' && (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase">
                          Past Event
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="md:col-span-2 p-6 flex flex-col">
                      <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3 group-hover:text-primary transition-colors">
                        {event.title}
                      </h2>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{format(event.startAt, 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4 text-primary" />
                          <span>
                            {event.currentRegistrations}/{event.capacity} spots
                            {event.currentRegistrations >= event.capacity && (
                              <span className="text-primary ml-1">(Full)</span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          {!event.isFree && (
                            <span className="font-display text-2xl text-primary">${event.price}</span>
                          )}
                        </div>
                        
                        {event.status === 'upcoming' && (
                          <Link to={`/events/${event.id}`}>
                            <Button 
                              variant={event.currentRegistrations >= event.capacity ? 'secondary' : 'default'}
                              disabled={event.currentRegistrations >= event.capacity}
                              className="group/btn"
                            >
                              {event.currentRegistrations >= event.capacity ? 'Sold Out' : 'Register Now'}
                              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        )}
                        
                        {event.status === 'past' && (
                          <Link to={`/events/${event.id}`}>
                            <Button variant="ghost">
                              View Gallery
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Events;
