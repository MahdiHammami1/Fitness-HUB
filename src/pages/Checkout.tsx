import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/component/layout/Layout';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Textarea } from '@/component/ui/textarea';
import { ShoppingBag, ArrowLeft, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { apiPost } from '@/lib/api';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  if (items.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        items: items.map(item => ({
          productId: item.product.id,
          variantId: item.variant?.id,
          qty: item.qty,
          unitPrice: item.product.price,
        })),
        total: total,
      };
      
      const response = await apiPost('/orders', orderPayload);
      
      if (response && response.id) {
        setOrderId(response.id);
        setOrderComplete(true);
        clearCart();
        toast.success('Order placed successfully!');
      }
    } catch (err: any) {
      console.error('Order submission failed', err);
      toast.error(err?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <Layout>
        <section className="section-padding bg-background">
          <div className="container-tight px-4">
            <div className="max-w-lg mx-auto text-center py-16">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
              <h1 className="font-display text-4xl text-foreground mb-4">Order Confirmed!</h1>
              <p className="text-muted-foreground mb-2">
                Thank you for your order. We've sent a confirmation to your email.
              </p>
              <p className="text-lg font-medium text-primary mb-8">
                Order ID: {orderId}
              </p>

              <div className="p-6 rounded-xl bg-card border border-border text-left mb-8">
                <h3 className="font-display text-lg text-foreground mb-4">What happens next?</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">1</span>
                    <span>You'll receive an order confirmation email shortly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">2</span>
                    <span>We'll prepare your order and notify you when it's shipped</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">3</span>
                    <span>Track your delivery via the link in your email</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
                <Link to="/">
                  <Button>Back to Home</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-tight px-4">
          <Link to="/cart" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>

          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-8">
            CHECK<span className="text-primary">OUT</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Info */}
                <div className="rounded-xl bg-card border border-border p-6">
                  <h2 className="font-display text-xl text-foreground mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                        Phone *
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="rounded-xl bg-card border border-border p-6">
                  <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1">
                        Street Address *
                      </label>
                      <Textarea
                        id="address"
                        required
                        rows={2}
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1">
                          City *
                        </label>
                        <Input
                          id="city"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-foreground mb-1">
                          Postal Code
                        </label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-1">
                        Order Notes (optional)
                      </label>
                      <Textarea
                        id="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any special instructions..."
                      />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="rounded-xl bg-card border border-border p-6">
                  <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </h2>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="payment" className="text-primary" defaultChecked />
                      <div>
                        <span className="font-medium text-foreground">Cash on Delivery</span>
                        <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Online payment options (Stripe) coming soon.
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : `Place Order • $${total.toFixed(2)}`}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-card border border-border p-6">
                <h2 className="font-display text-xl text-foreground mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.variant?.id}`} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-muted-foreground/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.product.title}</p>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {item.variant.variantType}: {item.variant.value}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        ${(item.product.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-display text-lg text-foreground">Total</span>
                    <span className="font-display text-xl text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
