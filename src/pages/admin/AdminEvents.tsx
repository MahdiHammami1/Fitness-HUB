import { useState, useEffect } from 'react';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Textarea } from '@/component/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/component/ui/dialog';
import { Label } from '@/component/ui/label';
import { Checkbox } from '@/component/ui/checkbox';
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
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Event as EventType, EventRegistration } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';



type Tab = 'events' | 'registrations';

export const AdminEvents = () => {
  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    startAt: '',
    endAt: '',
    location: '',
    capacity: '',
    isFree: true,
    price: '',
    coverImageUrl: '',
    images: [] as string[],
    imageInput: '',
  });

  useEffect(() => {
    const loadEvents = async () => {
      setLoadingEvents(true);
      try {
        const res = await apiGet('/events');
        let list: any[] = [];
        if (Array.isArray(res)) list = res;
        else if (res && res.content) list = res.content;
        const normalized = list.map((e: any) => ({ ...e, startAt: e.startAt ? new Date(e.startAt) : new Date() })) as EventType[];
        setEvents(normalized);
        if (normalized.length) setSelectedEventId(prev => prev ?? normalized[0].id);
      } catch (err) {
        console.error('Failed to load admin events', err);
        toast.error('Failed to load events');
      } finally {
        setLoadingEvents(false);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    if (!selectedEventId || activeTab !== 'registrations') return;
    const loadRegs = async () => {
      try {
        const res = await apiGet(`/admin/events/${selectedEventId}/registrations?page=0&size=200`);
        let list: any[] = [];
        if (Array.isArray(res)) list = res;
        else if (res && res.content) list = res.content;
        const normalized = list.map((r: any) => ({ ...r, createdAt: r.createdAt ? new Date(r.createdAt) : r.createdAt })) as EventRegistration[];
        setRegistrations(normalized);
      } catch (err) {
        console.error('Failed to load registrations', err);
        toast.error('Failed to load registrations');
      }
    };
    loadRegs();
  }, [selectedEventId, activeTab]);

  const handleExportCSV = async () => {
    if (!selectedEventId) {
      toast.error('Select an event first');
      return;
    }
    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${base}/admin/events/${selectedEventId}/registrations/export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to export: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `registrations-${selectedEventId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('CSV exported successfully!');
    } catch (err: any) {
      console.error('Export failed', err);
      toast.error(err?.message || 'Failed to export CSV');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await apiDelete(`/events/${id}`);
      toast.success('Event deleted successfully!');
      const res = await apiGet('/events');
      let list: any[] = [];
      if (Array.isArray(res)) list = res;
      else if (res && res.content) list = res.content;
      const normalized = list.map((evt: any) => ({ ...evt, startAt: evt.startAt ? new Date(evt.startAt) : new Date() })) as EventType[];
      setEvents(normalized);
    } catch (err: any) {
      console.error('Failed to delete event', err);
      toast.error(err?.message || 'Failed to delete event');
    }
  };

  const handleEditEvent = (event: EventType) => {
    setEditingEventId(event.id);
    setCreateForm({
      title: event.title,
      description: event.description,
      startAt: event.startAt.toISOString().slice(0, 16),
      endAt: new Date(event.startAt).toISOString().slice(0, 16),
      location: event.location,
      capacity: String(event.capacity),
      isFree: event.isFree,
      price: String(event.price || ''),
      coverImageUrl: event.coverImageUrl || '',
      images: event.images || [],
      imageInput: '',
    });
    setShowCreateModal(true);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createForm.title || !createForm.description || !createForm.startAt || !createForm.endAt || !createForm.location || !createForm.capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreatingEvent(true);
    try {
      const payload = {
        title: createForm.title,
        description: createForm.description,
        startAt: new Date(createForm.startAt).toISOString(),
        endAt: new Date(createForm.endAt).toISOString(),
        location: createForm.location,
        capacity: parseInt(createForm.capacity),
        isFree: createForm.isFree,
        price: createForm.isFree ? 0 : parseFloat(createForm.price),
        coverImageUrl: createForm.coverImageUrl || '',
        images: createForm.images || [],
      };
      
      if (editingEventId) {
        // Update existing event
        await apiPut(`/events/${editingEventId}`, payload);
        toast.success('Event updated successfully!');
      } else {
        // Create new event
        await apiPost('/events', payload);
        toast.success('Event created successfully!');
      }
      
      setShowCreateModal(false);
      setEditingEventId(null);
      setCreateForm({
        title: '',
        description: '',
        startAt: '',
        endAt: '',
        location: '',
        capacity: '',
        isFree: true,
        price: '',
        coverImageUrl: '',
        images: [],
        imageInput: '',
      });
      // Reload events
      const res = await apiGet('/events');
      let list: any[] = [];
      if (Array.isArray(res)) list = res;
      else if (res && res.content) list = res.content;
      const normalized = list.map((evt: any) => ({ ...evt, startAt: evt.startAt ? new Date(evt.startAt) : new Date() })) as EventType[];
      setEvents(normalized);
    } catch (err: any) {
      console.error('Failed to save event', err);
      toast.error(err?.message || 'Failed to save event');
    } finally {
      setCreatingEvent(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-display text-4xl text-foreground mb-2">Events</h1>
          <p className="text-muted-foreground">Manage events and registrations.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedEventId ?? ''}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-md"
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
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
                      <Button variant="ghost" size="sm" onClick={() => handleEditEvent(event)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event.id)}>
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
                      {event.registrationsCount}/{event.capacity}
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
                  {registrations.map((reg) => {
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
                        <td className="p-4 text-sm text-muted-foreground">{reg.createdAt ? String(reg.createdAt) : ''}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      <Dialog open={showCreateModal} onOpenChange={(open) => {
        setShowCreateModal(open);
        if (!open) setEditingEventId(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEventId ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            <DialogDescription>{editingEventId ? 'Update event details' : 'Fill in the event details below'}</DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateEvent} className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-foreground">Title *</Label>
              <Input
                id="title"
                required
                value={createForm.title}
                onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Event title"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-foreground">Description *</Label>
              <Textarea
                id="description"
                required
                value={createForm.description}
                onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Event description"
                rows={4}
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-foreground">Location *</Label>
              <Input
                id="location"
                required
                value={createForm.location}
                onChange={(e) => setCreateForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Event location"
              />
            </div>

            {/* Start Date/Time */}
            <div>
              <Label htmlFor="startAt" className="text-foreground">Start Date & Time *</Label>
              <Input
                id="startAt"
                type="datetime-local"
                required
                value={createForm.startAt}
                onChange={(e) => setCreateForm(prev => ({ ...prev, startAt: e.target.value }))}
              />
            </div>

            {/* End Date/Time */}
            <div>
              <Label htmlFor="endAt" className="text-foreground">End Date & Time *</Label>
              <Input
                id="endAt"
                type="datetime-local"
                required
                value={createForm.endAt}
                onChange={(e) => setCreateForm(prev => ({ ...prev, endAt: e.target.value }))}
              />
            </div>

            {/* Capacity */}
            <div>
              <Label htmlFor="capacity" className="text-foreground">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                required
                min="1"
                value={createForm.capacity}
                onChange={(e) => setCreateForm(prev => ({ ...prev, capacity: e.target.value }))}
                placeholder="Number of spots"
              />
            </div>

            {/* Is Free */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="isFree"
                checked={createForm.isFree}
                onCheckedChange={(checked) => setCreateForm(prev => ({ ...prev, isFree: checked as boolean }))}
              />
              <Label htmlFor="isFree" className="text-foreground cursor-pointer">Free Event</Label>
            </div>

            {/* Price */}
            {!createForm.isFree && (
              <div>
                <Label htmlFor="price" className="text-foreground">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={createForm.price}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="Event price"
                />
              </div>
            )}

            {/* Cover Image URL */}
            <div>
              <Label htmlFor="coverImageUrl" className="text-foreground">Cover Image URL</Label>
              <Input
                id="coverImageUrl"
                type="url"
                value={createForm.coverImageUrl}
                onChange={(e) => setCreateForm(prev => ({ ...prev, coverImageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Gallery Images URLs */}
            <div>
              <Label htmlFor="imageInput" className="text-foreground">Gallery Images</Label>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="imageInput"
                    type="url"
                    value={createForm.imageInput}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, imageInput: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="sm:w-auto w-full"
                    onClick={() => {
                      if (createForm.imageInput.trim()) {
                        setCreateForm(prev => ({
                          ...prev,
                          images: [...(prev.images || []), prev.imageInput.trim()],
                          imageInput: '',
                        }));
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                
                {createForm.images && createForm.images.length > 0 && (
                  <div className="border border-border rounded-lg p-3 space-y-2 max-h-64 overflow-y-auto">
                    {createForm.images.map((image, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 bg-card rounded">
                        <span className="text-xs sm:text-sm text-muted-foreground break-all flex-1">{image}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => {
                            setCreateForm(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx),
                            }));
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive mr-1 sm:mr-0" />
                          <span className="sm:hidden">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingEventId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creatingEvent}
              >
                {creatingEvent ? (editingEventId ? 'Updating...' : 'Creating...') : (editingEventId ? 'Update Event' : 'Create Event')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvents;
