import { useState } from 'react';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { 
  Search, 
  Download, 
  Plus,
  Calendar,
  Users,
  MapPin,
  Edit,
  Trash2
} from 'lucide-react';
import { events } from '@/data/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const mockRegistrations = [
  { id: '1', eventId: '1', name: 'Ahmed K.', email: 'ahmed@email.com', phone: '+212 600 111 222', createdAt: '2024-01-15' },
  { id: '2', eventId: '1', name: 'Sara M.', email: 'sara@email.com', phone: '+212 600 333 444', createdAt: '2024-01-14' },
  { id: '3', eventId: '2', name: 'Karim B.', email: 'karim@email.com', phone: '+212 600 555 666', createdAt: '2024-01-12' },
];

type Tab = 'events' | 'registrations';

export const AdminEvents = () => {
  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [searchQuery, setSearchQuery] = useState('');

  const handleExportCSV = () => {
    toast.success('Registrations exported to CSV');
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-display text-4xl text-foreground mb-2">Events</h1>
          <p className="text-muted-foreground">Manage events and registrations.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {(['events', 'registrations'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px",
              activeTab === tab 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="grid gap-6">
          {events.map((event) => (
            <div key={event.id} className="p-6 rounded-xl bg-card border border-border">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image placeholder */}
                <div className="w-full md:w-48 h-32 rounded-lg bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-8 w-8 text-primary/50" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-display text-xl text-foreground">{event.title}</h3>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        event.status === 'upcoming' && "bg-primary/20 text-primary",
                        event.status === 'past' && "bg-muted text-muted-foreground"
                      )}>
                        {event.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      {format(event.startAt, 'MMM d, yyyy h:mm a')}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-primary" />
                      {event.currentRegistrations}/{event.capacity}
                    </span>
                    {!event.isFree && (
                      <span className="text-primary font-medium">${event.price}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Registrations Tab */}
      {activeTab === 'registrations' && (
        <div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search registrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-card">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contact</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Event</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockRegistrations.map((reg) => {
                    const event = events.find(e => e.id === reg.eventId);
                    return (
                      <tr key={reg.id} className="hover:bg-card/50">
                        <td className="p-4">
                          <p className="font-medium text-foreground">{reg.name}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-foreground">{reg.email}</p>
                          <p className="text-xs text-muted-foreground">{reg.phone}</p>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-primary">{event?.title || 'Unknown'}</span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{reg.createdAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
