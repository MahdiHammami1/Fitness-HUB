import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/component/layout/Layout';
import { Button } from '@/component/ui/button';
import { ArrowLeft, ShoppingBag, Minus, Plus, AlertTriangle, Info } from 'lucide-react';
import { products } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { ProductVariant } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addItem } = useCart();
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <h1 className="font-display text-4xl text-foreground mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock === 0;

  const handleAddToCart = () => {
    if (product.variants?.length && !selectedVariant) {
      toast.error('Please select a variant');
      return;
    }
    addItem(product, selectedVariant, quantity);
  };

  // Group variants by type
  const variantsByType = product.variants?.reduce((acc, variant) => {
    if (!acc[variant.variantType]) {
      acc[variant.variantType] = [];
    }
    acc[variant.variantType].push(variant);
    return acc;
  }, {} as Record<string, ProductVariant[]>);

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-tight px-4">
          <Link to="/shop" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                <ShoppingBag className="h-24 w-24 text-muted-foreground/30" />
              </div>
              
              {/* Thumbnail strip placeholder */}
              <div className="flex gap-4 mt-4">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-20 h-20 rounded-lg bg-card border-2 flex items-center justify-center cursor-pointer transition-colors",
                      i === 1 ? "border-primary" : "border-border hover:border-primary/50"
                    )}
                  >
                    <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
                {product.collection === 'SUPPLEMENTS_GEAR' ? 'Supplements & Gear' : 'Apparel'}
              </span>

              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
                {product.title}
              </h1>

              <p className="font-display text-3xl text-primary mb-6">
                ${product.price}
              </p>

              <p className="text-muted-foreground mb-8">
                {product.description}
              </p>

              {/* Variants */}
              {variantsByType && Object.entries(variantsByType).map(([type, variants]) => (
                <div key={type} className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-3 capitalize">
                    Select {type}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={variant.stock === 0}
                        className={cn(
                          "px-4 py-2 rounded-lg border-2 font-medium transition-all",
                          selectedVariant?.id === variant.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-foreground hover:border-primary/50",
                          variant.stock === 0 && "opacity-50 cursor-not-allowed line-through"
                        )}
                      >
                        {variant.value}
                        {variant.stock <= 5 && variant.stock > 0 && (
                          <span className="ml-1 text-xs text-primary">({variant.stock} left)</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-secondary transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      className="p-3 hover:bg-secondary transition-colors"
                      disabled={quantity >= currentStock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentStock} available
                  </span>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                size="xl"
                className="w-full mb-6"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              {/* Product Details */}
              {(product.ingredients || product.usage || product.warnings) && (
                <div className="space-y-4 pt-8 border-t border-border">
                  {product.ingredients && (
                    <div>
                      <h3 className="flex items-center gap-2 font-medium text-foreground mb-2">
                        <Info className="h-4 w-4 text-primary" />
                        Ingredients
                      </h3>
                      <p className="text-sm text-muted-foreground">{product.ingredients}</p>
                    </div>
                  )}

                  {product.usage && (
                    <div>
                      <h3 className="flex items-center gap-2 font-medium text-foreground mb-2">
                        <Info className="h-4 w-4 text-primary" />
                        Usage
                      </h3>
                      <p className="text-sm text-muted-foreground">{product.usage}</p>
                    </div>
                  )}

                  {product.warnings && (
                    <div>
                      <h3 className="flex items-center gap-2 font-medium text-foreground mb-2">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                        Warnings
                      </h3>
                      <p className="text-sm text-muted-foreground">{product.warnings}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
