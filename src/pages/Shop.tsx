import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/component/layout/Layout';
import { Button } from '@/component/ui/button';
import { ShoppingBag, Filter } from 'lucide-react';
import { apiGet } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { Product, ProductCollection } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type FilterType = 'all' | ProductCollection;

const Shop = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    return product.collection === filter;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background pt-20 sm:pt-24 md:pt-32">
        <div className="container-tight px-3 sm:px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-foreground mb-4 sm:mb-6">
              SHOP <span className="text-primary">GEAR</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-2">
              Premium supplements and apparel to fuel your training and represent the grind.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 sm:py-6 bg-card border-b border-border sticky top-14 sm:top-16 md:top-20 z-40">
        <div className="container-tight px-3 sm:px-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Filter:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
                className="text-xs sm:text-sm"
              >
                All Products
              </Button>
              <Button
                variant={filter === 'SUPPLEMENTS_GEAR' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('SUPPLEMENTS_GEAR')}
                className="text-xs sm:text-sm"
              >
                Supplements & Gear
              </Button>
              <Button
                variant={filter === 'APPAREL' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('APPAREL')}
                className="text-xs sm:text-sm"
              >
                Apparel
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-background">
        <div className="container-tight px-3 sm:px-4">
          {loading ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="font-display text-xl sm:text-2xl text-foreground mb-2">Loading products...</h2>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="font-display text-2xl text-foreground mb-2">No Products Found</h2>
              <p className="text-muted-foreground">Try adjusting your filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group">
                <Link to={`/shop/${product.id}`}>
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-secondary to-muted relative overflow-hidden mb-4 card-hover">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].altText || product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 rounded-full bg-background/80 text-xs font-medium text-muted-foreground">
                        {product.collection === 'SUPPLEMENTS_GEAR' ? 'Supplements' : 'Apparel'}
                      </span>
                    </div>

                    {product.stock <= 10 && product.stock > 0 && (
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2 py-1 rounded-full bg-primary/90 text-xs font-medium text-primary-foreground">
                          Low Stock
                        </span>
                      </div>
                    )}

                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <span className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-medium">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {/* Quick add button */}
                    {product.stock > 0 && !product.variants?.length && (
                      <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            addItem(product);
                          }}
                        >
                          Quick Add
                        </Button>
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="space-y-2">
                  <Link to={`/shop/${product.id}`}>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl text-primary">${product.price}</span>
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

export default Shop;
