import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  ShoppingBag, 
  TrendingUp,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/component/ui/button';
import { events, products } from '@/data/mockData';

const stats = [
  {
    label: 'New Leads',
    value: '12',
    change: '+3 this week',
    icon: MessageSquare,
    href: '/admin/coaching'
  },
  {
    label: 'Upcoming Events',
    value: events.filter(e => e.status === 'upcoming').length.toString(),
    change: `${events.reduce((acc, e) => acc + e.currentRegistrations, 0)} registrations`,
    icon: Calendar,
    href: '/admin/events'
  },
  {
    label: 'Pending Orders',
    value: '5',
    change: '2 ready to ship',
    icon: ShoppingBag,
    href: '/admin/shop'
  },
  {
    label: 'Revenue (MTD)',
    value: '$4,250',
    change: '+15% vs last month',
    icon: TrendingUp,
    href: '/admin/shop'
  }
];

const recentLeads = [
  { name: 'Ahmed K.', email: 'ahmed@email.com', program: '1:1 Coaching', time: '2h ago' },
  { name: 'Sara M.', email: 'sara@email.com', program: 'Group Coaching', time: '5h ago' },
  { name: 'Karim B.', email: 'karim@email.com', program: 'Online Program', time: '1d ago' },
];

const recentOrders = [
  { id: 'WH-ABC123', customer: 'Mohamed L.', total: 450, status: 'pending' },
  { id: 'WH-DEF456', customer: 'Fatima Z.', total: 199, status: 'prepared' },
  { id: 'WH-GHI789', customer: 'Youssef A.', total: 320, status: 'shipped' },
];

export const Dashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.href}
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="font-display text-3xl text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xs text-primary mt-2">{stat.change}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <div className="rounded-xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-foreground">Recent Leads</h2>
            <Link to="/admin/coaching">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentLeads.map((lead, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-medium text-foreground">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary">{lead.program}</p>
                  <p className="text-xs text-muted-foreground">{lead.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-foreground">Recent Orders</h2>
            <Link to="/admin/shop">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-medium text-foreground">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg text-primary">${order.total}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                    order.status === 'prepared' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-green-500/20 text-green-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
        <h2 className="font-display text-xl text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/events">
            <Button variant="outline">Create Event</Button>
          </Link>
          <Link to="/admin/shop">
            <Button variant="outline">Add Product</Button>
          </Link>
          <Link to="/admin/coaching">
            <Button variant="outline">View Leads</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
