import { useState } from 'react';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { 
  Search, 
  Download, 
  Eye,
  Check,
  X,
  MessageSquare
} from 'lucide-react';
import { coachingOffers } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const mockLeads = [
  { id: '1', name: 'Ahmed K.', email: 'ahmed@email.com', phone: '+212 600 111 222', message: 'I want to lose 10kg and build muscle', program: '1:1 Coaching', status: 'new', createdAt: '2024-01-15' },
  { id: '2', name: 'Sara M.', email: 'sara@email.com', phone: '+212 600 333 444', message: 'Looking for group training options', program: 'Group Coaching', status: 'contacted', createdAt: '2024-01-14' },
  { id: '3', name: 'Karim B.', email: 'karim@email.com', phone: '+212 600 555 666', message: 'Interested in the online program', program: 'Online Program', status: 'converted', createdAt: '2024-01-12' },
];

const mockTestimonials = [
  { id: '1', name: 'Mohamed L.', text: 'Amazing transformation!', rating: 5, approved: false, consent: true },
  { id: '2', name: 'Fatima Z.', text: 'Coach Yassine is the best!', rating: 5, approved: true, consent: true },
];

type Tab = 'leads' | 'offers' | 'testimonials';

export const AdminCoaching = () => {
  const [activeTab, setActiveTab] = useState<Tab>('leads');
  const [searchQuery, setSearchQuery] = useState('');

  const handleExportCSV = () => {
    toast.success('Leads exported to CSV');
  };

  const handleApproveTestimonial = (id: string) => {
    toast.success('Testimonial approved');
  };

  const handleRejectTestimonial = (id: string) => {
    toast.success('Testimonial rejected');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-foreground mb-2">Coaching</h1>
        <p className="text-muted-foreground">Manage leads, offers, and testimonials.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {(['leads', 'offers', 'testimonials'] as Tab[]).map((tab) => (
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

      {/* Leads Tab */}
      {activeTab === 'leads' && (
        <div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
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
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Program</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-card/50">
                      <td className="p-4">
                        <p className="font-medium text-foreground">{lead.name}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-foreground">{lead.email}</p>
                        <p className="text-xs text-muted-foreground">{lead.phone}</p>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-primary">{lead.program}</span>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          lead.status === 'new' && "bg-primary/20 text-primary",
                          lead.status === 'contacted' && "bg-yellow-500/20 text-yellow-500",
                          lead.status === 'converted' && "bg-green-500/20 text-green-500"
                        )}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{lead.createdAt}</td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Offers Tab */}
      {activeTab === 'offers' && (
        <div className="grid gap-6">
          {coachingOffers.map((offer) => (
            <div key={offer.id} className="p-6 rounded-xl bg-card border border-border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-display text-xl text-foreground">{offer.title}</h3>
                  <p className="text-primary">${offer.price} / {offer.duration}</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>
              <div className="flex flex-wrap gap-2">
                {offer.features.map((feature, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          {mockTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="p-6 rounded-xl bg-card border border-border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">"{testimonial.text}"</p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < testimonial.rating ? 'text-primary' : 'text-muted'}>★</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!testimonial.approved ? (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => handleApproveTestimonial(testimonial.id)}>
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleRejectTestimonial(testimonial.id)}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">Approved</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCoaching;
