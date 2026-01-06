import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Truck, 
  Shield, 
  Package,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const CartSummary = ({ onCheckout, loading = false }) => {
  const { cart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  const cartTotal = getCartTotal();
  const deliveryCharge = cartTotal > 500 ? 0 : 50;
  const grandTotal = cartTotal + deliveryCharge;

  // Calculate savings (if any)
  const savings = cartTotal > 1000 ? cartTotal * 0.1 : 0; // 10% off for orders above 1000

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      // Show login modal or redirect
      return;
    }
    onCheckout?.();
  };

  return (
    <div className="bg-card border rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>

      {/* Order Items Preview */}
      <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
        {cart.slice(0, 3).map((item) => (
          <div key={item.product._id} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0">
              {item.product.images?.[0]?.url ? (
                <img
                  src={item.product.images[0].url}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-sm">🥛</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
              <p className="text-xs text-muted-foreground">
                ₨{item.product.price} × {item.quantity}
              </p>
            </div>
            <div className="font-medium text-sm">
              ₨{(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
        
        {cart.length > 3 && (
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              + {cart.length - 3} more item{cart.length - 3 !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal ({cart.length} items)</span>
          <span className="font-medium">₨{cartTotal.toFixed(2)}</span>
        </div>
        
        {savings > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Savings (10% off)</span>
            <span className="font-medium">-₨{savings.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          <span className={`font-medium ${deliveryCharge === 0 ? 'text-green-600' : ''}`}>
            {deliveryCharge === 0 ? 'FREE' : `₨${deliveryCharge}`}
          </span>
        </div>

        {deliveryCharge > 0 && cartTotal < 500 && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            Add ₨{(500 - cartTotal).toFixed(2)} more for free delivery
          </div>
        )}

        <Separator className="my-4" />

        <div className="flex justify-between text-lg font-bold">
          <span>Total Amount</span>
          <div className="text-right">
            {savings > 0 && (
              <p className="text-sm text-muted-foreground line-through mb-1">
                ₨{(cartTotal + deliveryCharge).toFixed(2)}
              </p>
            )}
            <p className="text-primary">₨{(grandTotal - savings).toFixed(2)}</p>
          </div>
        </div>

        {savings > 0 && (
          <Badge className="w-full justify-center bg-green-100 text-green-800 border-green-200">
            You save ₨{savings.toFixed(2)}!
          </Badge>
        )}
      </div>

      {/* Checkout Button */}
      <Button 
        size="lg" 
        className="w-full mt-6"
        onClick={handleProceedToCheckout}
        disabled={loading || cart.length === 0}
      >
        {loading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Processing...
          </>
        ) : (
          <>
            {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      {!isAuthenticated && (
        <p className="text-xs text-center text-muted-foreground mt-3">
          Login required for checkout
        </p>
      )}

      {/* Payment Methods */}
      <div className="mt-6">
        <p className="text-sm font-medium mb-3 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Options
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="border rounded p-2 text-center">
            <p className="font-medium text-sm">Cash on Delivery</p>
            <p className="text-xs text-muted-foreground">Pay when delivered</p>
          </div>
          <div className="border rounded p-2 text-center opacity-50">
            <p className="font-medium text-sm">Online Payment</p>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </div>
        </div>
      </div>

      {/* Guarantees */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Same Day Delivery</p>
            <p className="text-xs text-muted-foreground">Order before 12 PM</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-100 text-green-600">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Freshness Guarantee</p>
            <p className="text-xs text-muted-foreground">24-hour return policy</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-purple-100 text-purple-600">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Safe Packaging</p>
            <p className="text-xs text-muted-foreground">Vacuum sealed & insulated</p>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Your payment information is secure. We use encryption to protect your data.
          </p>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="mt-6">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/products">
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;