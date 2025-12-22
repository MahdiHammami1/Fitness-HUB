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
  ShoppingBag,
  Edit,
  Trash2,
  Package
} from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Product, Order, ProductCollection } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';


type Tab = 'products' | 'orders';
type OrderStatus = 'PENDING' | 'PAID' | 'PREPARED' | 'DELIVERED' | 'CANCELLED';

export const AdminShop = () => {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    price: '',
    collection: 'SUPPLEMENTS_GEAR' as ProductCollection,
    stock: '',
    hasVariants: false,
    isActive: true,
    images: [] as Array<{ url: string; altText: string; title: string; position?: number }>,
    imageUrl: '',
    imageAltText: '',
    imageTitle: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await apiGet('/products');
        let list: any[] = [];
        if (Array.isArray(res)) list = res;
        else if (res && res.content) list = res.content;
        setProducts(list as Product[]);
      } catch (err) {
        console.error('Failed to load products', err);
        toast.error('Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await apiGet('/orders');
        let list: any[] = [];
        if (Array.isArray(res)) list = res;
        else if (res && res.content) list = res.content;
        setOrders(list as Order[]);
      } catch (err) {
        console.error('Failed to load orders', err);
        toast.error('Failed to load orders');
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleExportCSV = async () => {
    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${base}/orders/export`, {
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
      link.download = 'orders.csv';
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

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Get the current order details
      const currentOrder = orders.find(o => o.id === orderId);
      if (!currentOrder) {
        toast.error('Order not found');
        return;
      }

      // Update order with new status
      const updatedOrder = await apiPut(`/orders/${orderId}`, { ...currentOrder, status: newStatus });
      
      // Update local state with the response from backend
      setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
      toast.success(`Order updated to ${newStatus}`);
    } catch (err: any) {
      console.error('Failed to update order', err);
      toast.error(err?.message || 'Failed to update order status');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiDelete(`/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully!');
    } catch (err: any) {
      console.error('Failed to delete product', err);
      toast.error(err?.message || 'Failed to delete product');
    }
  };

  const handleAddImage = () => {
    if (!createForm.imageUrl) {
      toast.error('Please enter an image URL');
      return;
    }
    const newImage = {
      url: createForm.imageUrl,
      altText: createForm.imageAltText || 'Product image',
      title: createForm.imageTitle || '',
      position: createForm.images.length,
    };
    setCreateForm({
      ...createForm,
      images: [...createForm.images, newImage],
      imageUrl: '',
      imageAltText: '',
      imageTitle: '',
    });
    toast.success('Image added');
  };

  const handleRemoveImage = (index: number) => {
    setCreateForm({
      ...createForm,
      images: createForm.images.filter((_, i) => i !== index),
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setCreateForm({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      collection: product.collection,
      stock: product.stock?.toString() || '',
      hasVariants: product.hasVariants || false,
      isActive: product.isActive,
      images: (product.images || []).map(img => ({
        url: img.url,
        altText: img.altText,
        title: img.title || '',
        position: img.position,
      })),
      imageUrl: '',
      imageAltText: '',
      imageTitle: '',
    });
    setShowCreateModal(true);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createForm.title || !createForm.description || !createForm.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!createForm.hasVariants && !createForm.stock) {
      toast.error('Please enter stock quantity');
      return;
    }

    setCreatingProduct(true);
    try {
      const payload = {
        title: createForm.title,
        description: createForm.description,
        price: parseFloat(createForm.price),
        collection: createForm.collection,
        hasVariants: createForm.hasVariants,
        stock: createForm.hasVariants ? null : parseInt(createForm.stock),
        isActive: createForm.isActive,
        images: createForm.images,
      };

      if (editingProductId) {
        // Update existing product
        await apiPut(`/products/${editingProductId}`, payload);
        toast.success('Product updated successfully!');
      } else {
        // Create new product
        await apiPost('/products', payload);
        toast.success('Product created successfully!');
      }

      setShowCreateModal(false);
      setEditingProductId(null);
      setCreateForm({
        title: '',
        description: '',
        price: '',
        collection: 'SUPPLEMENTS_GEAR',
        stock: '',
        hasVariants: false,
        isActive: true,
        images: [],
        imageUrl: '',
        imageAltText: '',
        imageTitle: '',
      });
      // Reload products
      const res = await apiGet('/products');
      let list: any[] = [];
      if (Array.isArray(res)) list = res;
      else if (res && res.content) list = res.content;
      setProducts(list as Product[]);
    } catch (err: any) {
      console.error('Failed to save product', err);
      toast.error(err?.message || 'Failed to save product');
    } finally {
      setCreatingProduct(false);
    }
  };

  const statusOptions: OrderStatus[] = ['PENDING', 'PAID', 'PREPARED', 'DELIVERED', 'CANCELLED'];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground mb-2">Shop</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage products and orders.</p>
        </div>
        {activeTab === 'products' && (
          <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
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

          {loadingOrders ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="font-display text-2xl text-foreground mb-2">Loading orders...</h2>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="font-display text-2xl text-foreground mb-2">No orders found</h2>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
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
                            order.status === 'PENDING' && "bg-yellow-500/20 text-yellow-500",
                            order.status === 'PAID' && "bg-blue-500/20 text-blue-500",
                            order.status === 'PREPARED' && "bg-purple-500/20 text-purple-500",
                            order.status === 'DELIVERED' && "bg-green-500/20 text-green-500",
                            order.status === 'CANCELLED' && "bg-red-500/20 text-red-500"
                          )}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="text-right">
                        <p className="font-display text-xl text-primary">${order.total}</p>
                        <p className="text-xs text-muted-foreground">{order.items?.length || 0} items • {new Date(order.createdAt).toLocaleDateString()}</p>
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
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          {loadingProducts ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="font-display text-2xl text-foreground mb-2">Loading products...</h2>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="font-display text-2xl text-foreground mb-2">No products found</h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="rounded-xl bg-card border border-border overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].altText || product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-foreground line-clamp-1">{product.title}</h3>
                        <p className="text-primary font-display text-lg">${product.price}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)}>
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
      )}

      {/* Create/Edit Product Modal */}
      <Dialog open={showCreateModal} onOpenChange={(open) => {
        setShowCreateModal(open);
        if (!open) {
          setEditingProductId(null);
          setCreateForm({
            title: '',
            description: '',
            price: '',
            collection: 'SUPPLEMENTS_GEAR',
            stock: '',
            hasVariants: false,
            isActive: true,
            images: [],
            imageUrl: '',
            imageAltText: '',
            imageTitle: '',
          });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProductId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProductId ? 'Update product details' : 'Create a new product for your shop'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                placeholder="e.g. Protein Powder"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="Product description"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={createForm.price}
                onChange={(e) => setCreateForm({ ...createForm, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="hasVariants"
                checked={createForm.hasVariants}
                onCheckedChange={(checked) => setCreateForm({ ...createForm, hasVariants: checked as boolean })}
              />
              <Label htmlFor="hasVariants" className="font-normal cursor-pointer">
                Has Variants (sizes, colors, etc.)
              </Label>
            </div>

            {!createForm.hasVariants && (
              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={createForm.stock}
                  onChange={(e) => setCreateForm({ ...createForm, stock: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="collection">Collection *</Label>
              <select
                id="collection"
                value={createForm.collection}
                onChange={(e) => setCreateForm({ ...createForm, collection: e.target.value as ProductCollection })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="SUPPLEMENTS_GEAR">Supplements & Gear</option>
                <option value="APPAREL">Apparel</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={createForm.isActive}
                onCheckedChange={(checked) => setCreateForm({ ...createForm, isActive: checked as boolean })}
              />
              <Label htmlFor="isActive" className="font-normal cursor-pointer">
                Active
              </Label>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-medium text-foreground mb-3">Product Images</h3>
              
              <div className="space-y-2 mb-3 p-3 bg-secondary/50 rounded-lg">
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={createForm.imageUrl}
                    onChange={(e) => setCreateForm({ ...createForm, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="imageAltText">Alt Text (for accessibility)</Label>
                  <Input
                    id="imageAltText"
                    value={createForm.imageAltText}
                    onChange={(e) => setCreateForm({ ...createForm, imageAltText: e.target.value })}
                    placeholder="e.g. Product front view"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="imageTitle">Image Title (optional)</Label>
                  <Input
                    id="imageTitle"
                    value={createForm.imageTitle}
                    onChange={(e) => setCreateForm({ ...createForm, imageTitle: e.target.value })}
                    placeholder="e.g. Front view"
                    className="text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddImage}
                  className="w-full text-sm"
                >
                  Add Image
                </Button>
              </div>

              {createForm.images.length > 0 && (
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  <h4 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-1">Added Images ({createForm.images.length})</h4>
                  {createForm.images.map((img, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-secondary gap-2 min-w-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{img.url}</p>
                        <p className="text-xs text-muted-foreground truncate">{img.altText}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveImage(idx)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 sticky bottom-0 bg-background">
              <Button
                type="submit"
                disabled={creatingProduct}
                className="flex-1"
              >
                {creatingProduct ? 'Saving...' : editingProductId ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingProductId(null);
                  setCreateForm({
                    title: '',
                    description: '',
                    price: '',
                    collection: 'SUPPLEMENTS_GEAR',
                    stock: '',
                    hasVariants: false,
                    isActive: true,
                    images: [],
                    imageUrl: '',
                    imageAltText: '',
                    imageTitle: '',
                  });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminShop;
