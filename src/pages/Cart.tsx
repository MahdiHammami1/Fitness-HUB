import { Link } from 'react-router-dom';
import { Layout } from '@/component/layout/Layout';
import { Button } from '@/component/ui/button';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <section className="section-padding bg-background">
          <div className="container-tight px-4">
            <div className="max-w-lg mx-auto text-center py-16">
              <div className="w-24 h-24 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <h1 className="font-display text-4xl text-foreground mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/shop">
                <Button size="lg">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding bg-background pt-20 sm:pt-24 md:pt-32">
        <div className="container-tight px-3 sm:px-4">
          <h1 className="font-display text-4xl sm:text-5xl md:text-5xl text-foreground mb-8">
            YOUR <span className="text-primary">CART</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant?.id}`}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-card border border-border"
                >
                  {/* Product Image */}
                  <Link to={`/shop/${item.product.id}`} className="flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-secondary overflow-hidden flex items-center justify-center">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.images[0].altText || item.product.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
                      <div className="min-w-0">
                        <Link to={`/shop/${item.product.id}`}>
                          <h3 className="font-medium text-foreground hover:text-primary transition-colors text-sm sm:text-base truncate">
                            {item.product.title}
                          </h3>
                        </Link>
                        {item.variant && (
                          <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                            {item.variant.variantType}: {item.variant.value}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.variant?.id)}
                        className="text-muted-foreground hover:text-primary transition-colors w-fit"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>

                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 mt-3 sm:mt-4">
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.qty - 1, item.variant?.id)}
                          className="p-2 hover:bg-secondary transition-colors"
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <span className="w-8 sm:w-10 text-center font-medium text-sm">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.qty + 1, item.variant?.id)}
                          className="p-2 hover:bg-secondary transition-colors"
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>

                      <span className="font-display text-lg sm:text-xl text-primary font-medium">
                        ${(item.product.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row justify-between gap-2 pt-4">
                <Link to="/shop" className="w-full sm:w-auto">
                  <Button variant="ghost" className="w-full sm:w-auto text-sm sm:text-base">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
                <Button variant="ghost" onClick={clearCart} className="w-full sm:w-auto text-sm sm:text-base">
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 sm:top-24 rounded-2xl bg-card border border-border p-4 sm:p-6">
                <h2 className="font-display text-lg sm:text-2xl text-foreground mb-4 sm:mb-6">Order Summary</h2>

                <div className="space-y-3 sm:space-y-4 mb-6">
                  <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-display text-base sm:text-xl text-foreground">Total</span>
                    <span className="font-display text-xl sm:text-2xl text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="block w-full">
                  <Button size="lg" className="w-full text-sm sm:text-base">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure checkout powered by industry-standard encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
