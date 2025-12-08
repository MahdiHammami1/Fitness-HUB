import { Link } from 'react-router-dom';
import { Button } from '@/component/ui/button';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { products } from '@/data/mockData';
import { useCart } from '@/context/CartContext';

export const ProductsPreview = () => {
  const { addItem } = useCart();
  const featuredProducts = products.slice(0, 6);

  return (
    <section className="section-padding bg-card">
      <div className="container-tight px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            SHOP <span className="text-primary">GEAR</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Premium supplements and apparel to fuel your training and represent the grind.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group">
              <Link to={`/shop/${product.id}`}>
                <div className="aspect-square rounded-xl bg-gradient-to-br from-secondary to-muted relative overflow-hidden mb-4 card-hover">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-full bg-background/80 text-xs font-medium text-muted-foreground">
                      {product.collection === 'SUPPLEMENTS_GEAR' ? 'Supplements' : 'Apparel'}
                    </span>
                  </div>
                </div>
              </Link>
              
              <div className="space-y-2">
                <Link to={`/shop/${product.id}`}>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl text-primary">${product.price}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addItem(product)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/shop">
            <Button variant="outline" className="group">
              View Full Catalog
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
