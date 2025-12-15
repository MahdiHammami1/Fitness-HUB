import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  ShoppingBag, 
  TrendingUp,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/component/ui/button';
import { apiGet } from '@/lib/api';
import type { Event, Order } from '@/types';
import { cn } from '@/lib/utils';

export const Dashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, ordersRes] = await Promise.all([
          apiGet('/events'),
          apiGet('/orders')
        ]);

        let eventList: Event[] = Array.isArray(eventsRes) ? eventsRes : eventsRes?.content || [];
        let orderList: Order[] = Array.isArray(ordersRes) ? ordersRes : ordersRes?.content || [];

        // Classify events
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

        setEvents(classified);
        setOrders(orderList.map((o: any) => ({
          ...o,
          createdAt: new Date(o.createdAt)
        })));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const totalRevenue = orders
    .filter(o => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      label: 'Upcoming Events',
      value: upcomingEvents.length.toString(),
      change: `${upcomingEvents.reduce((acc, e) => acc + e.registrationsCount, 0)} registrations`,
      icon: Calendar,
      href: '/admin/events'
    },
    {
      label: 'Pending Orders',
      value: pendingOrders.length.toString(),
      change: `${pendingOrders.reduce((acc, o) => acc + o.total, 0).toFixed(2)} total value`,
      icon: ShoppingBag,
      href: '/admin/shop'
    },
    {
      label: 'Total Products',
      value: '0',
      change: 'View all products',
      icon: ShoppingBag,
      href: '/admin/shop'
    },
    {
      label: 'Revenue (Delivered)',
      value: `$${totalRevenue.toFixed(2)}`,
      change: `${orders.filter(o => o.status === 'DELIVERED').length} delivered orders`,
      icon: TrendingUp,
      href: '/admin/shop'
    }
  ];

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

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
        {/* Recent Events */}
        <div className="rounded-xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-foreground">Upcoming Events</h2>
            <Link to="/admin/events">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-primary">{event.registrationsCount}/{event.capacity}</p>
                    <p className="text-xs text-muted-foreground">{new Date(event.startAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="rounded-xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-foreground">Recent Orders</h2>
            <Link to="/admin/shop">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium text-foreground">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg text-primary">${order.total.toFixed(2)}</p>
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      order.status === 'PENDING' && 'bg-yellow-500/20 text-yellow-500',
                      order.status === 'PAID' && 'bg-blue-500/20 text-blue-500',
                      order.status === 'PREPARED' && 'bg-purple-500/20 text-purple-500',
                      order.status === 'DELIVERED' && 'bg-green-500/20 text-green-500',
                      order.status === 'CANCELLED' && 'bg-red-500/20 text-red-500'
                    )}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
          <Link to="/admin/shop">
            <Button variant="outline">View Orders</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
