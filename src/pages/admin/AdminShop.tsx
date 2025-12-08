import { useState } from 'react';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { 
  Search, 
  Download, 
  Plus,
  ShoppingBag,
  Edit,
  Trash2,
  Package
} from 'lucide-react';
import { products } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const mockOrders = [
  { id: 'WH-ABC123', customer: 'Mohamed L.', email: 'mohamed@email.com', total: 450, status: 'pending', items: 2, createdAt: '2024-01-15' },
  { id: 'WH-DEF456', customer: 'Fatima Z.', email: 'fatima@email.com', total: 199, status: 'prepared', items: 1, createdAt: '2024-01-14' },
  { id: 'WH-GHI789', customer: 'Youssef A.', email: 'youssef@email.com', total: 320, status: 'shipped', items: 3, createdAt: '2024-01-12' },
  { id: 'WH-JKL012', customer: 'Amina B.', email: 'amina@email.com', total: 580, status: 'delivered', items: 2, createdAt: '2024-01-10' },
];

type Tab = 'products' | 'orders';
type OrderStatus = 'pending' | 'paid' | 'prepared' | 'shipped' | 'delivered';

export const AdminShop = () => {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [searchQuery, setSearchQuery] = useState('');

  const handleExportCSV = () => {
    toast.success('Orders exported to CSV');
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    toast.success(`Order ${orderId} updated to ${newStatus}`);
  };

  const statusOptions: OrderStatus[] = ['pending', 'paid', 'prepared', 'shipped', 'delivered'];

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-display text-4xl text-foreground mb-2">Shop</h1>
          <p className="text-muted-foreground">Manage products and orders.</p>
        </div>
        {activeTab === 'products' && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {(['orders', 'products'] as Tab[]).map((tab) => (
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

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
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

          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div key={order.id} className="p-6 rounded-xl bg-card border border-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-display text-lg text-foreground">{order.id}</h3>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full capitalize",
                          order.status === 'pending' && "bg-yellow-500/20 text-yellow-500",
                          order.status === 'paid' && "bg-blue-500/20 text-blue-500",
                          order.status === 'prepared' && "bg-purple-500/20 text-purple-500",
                          order.status === 'shipped' && "bg-orange-500/20 text-orange-500",
                          order.status === 'delivered' && "bg-green-500/20 text-green-500"
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="text-right">
                      <p className="font-display text-xl text-primary">${order.total}</p>
                      <p className="text-xs text-muted-foreground">{order.items} items • {order.createdAt}</p>
                    </div>
                    
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status} className="capitalize">
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="rounded-xl bg-card border border-border overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-foreground line-clamp-1">{product.title}</h3>
                    <p className="text-primary font-display text-lg">${product.price}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Stock: {product.stock}
                  </span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    product.isActive 
                      ? "bg-green-500/20 text-green-500" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminShop;
