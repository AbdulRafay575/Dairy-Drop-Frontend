import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Truck, 
  CreditCard, 
  Calendar,
  MapPin,
  User,
  Phone,
  Home,
  Briefcase,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('morning');
  const [notes, setNotes] = useState('');

  // Calculate totals
  const cartTotal = getCartTotal();
  const deliveryCharge = cartTotal > 500 ? 0 : 50;
  const grandTotal = cartTotal + deliveryCharge;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (cart.length === 0) {
      navigate('/cart');
      return;
    }

    // Set default delivery date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeliveryDate(tomorrow.toISOString().split('T')[0]);

    // Set default address if available
    if (user?.addresses?.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [isAuthenticated, cart, user, navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({
        title: 'Address Required',
        description: 'Please select a delivery address',
        variant: 'destructive'
      });
      return;
    }

    if (!deliveryDate) {
      toast({
        title: 'Delivery Date Required',
        description: 'Please select a delivery date',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        deliveryAddress: {
          type: selectedAddress.type,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country || 'India'
        },
        contactNumber: user?.phone || '',
        deliveryDate: new Date(deliveryDate).toISOString(),
        notes
      };

      const response = await apiService.createOrder(orderData);

      if (response.success) {
        toast({
          title: 'Order Placed Successfully!',
          description: `Your order #${response.data.order.orderNumber} has been confirmed`,
        });

        // Clear cart
        clearCart();

        // Navigate to order confirmation
        // navigate(`/order-confirmation/${response.data.order._id}`);
        navigate(`/`);

      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast({
        title: 'Order Failed',
        description: error.message || 'Failed to place order. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const deliveryTimes = [
    { value: 'morning', label: 'Morning (7 AM - 10 AM)', icon: '🌅' },
    { value: 'afternoon', label: 'Afternoon (12 PM - 3 PM)', icon: '☀️' },
    { value: 'evening', label: 'Evening (5 PM - 8 PM)', icon: '🌇' }
  ];

  if (!isAuthenticated || cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/cart')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>

        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground mb-8">
          Complete your order with fresh dairy delivery
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Delivery Address</h2>
              </div>

              {user?.addresses?.length > 0 ? (
                <div className="space-y-4">
                  <RadioGroup
                    value={selectedAddress?._id}
                    onValueChange={(value) => {
                      const address = user.addresses.find(addr => addr._id === value);
                      setSelectedAddress(address);
                    }}
                  >
                    {user.addresses.map((address) => (
                      <div key={address._id} className="flex items-start space-x-3">
                        <RadioGroupItem value={address._id} id={`address-${address._id}`} />
                        <Label
                          htmlFor={`address-${address._id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className={`p-4 border rounded-lg ${selectedAddress?._id === address._id ? 'border-primary' : ''}`}>
                            <div className="flex items-center gap-2 mb-2">
                              {address.type === 'home' ? (
                                <Home className="h-4 w-4 text-primary" />
                              ) : address.type === 'work' ? (
                                <Briefcase className="h-4 w-4 text-primary" />
                              ) : null}
                              <span className="font-medium capitalize">{address.type}</span>
                              {address.isDefault && (
                                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm mb-1">{address.street}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} - {address.zipCode}
                            </p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <Button
                    variant="outline"
                    onClick={() => navigate('/profile?tab=addresses')}
                    className="w-full"
                  >
                    + Add New Address
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Address Added</h3>
                  <p className="text-muted-foreground mb-6">
                    Add a delivery address to continue
                  </p>
                  <Button onClick={() => navigate('/profile?tab=addresses')}>
                    Add Address
                  </Button>
                </div>
              )}
            </div>

            {/* Delivery Schedule */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Delivery Schedule</h2>
              </div>

              <div className="space-y-6">
                {/* Delivery Date */}
                <div>
                  <Label className="mb-3 block">Delivery Date</Label>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Orders placed before 12 PM will be delivered the same day
                  </p>
                </div>

                {/* Delivery Time */}
                <div>
                  <Label className="mb-3 block">Preferred Delivery Time</Label>
                  <RadioGroup
                    value={deliveryTime}
                    onValueChange={setDeliveryTime}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3"
                  >
                    {deliveryTimes.map((time) => (
                      <div key={time.value}>
                        <RadioGroupItem
                          value={time.value}
                          id={`time-${time.value}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`time-${time.value}`}
                          className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer hover:border-primary peer-data-[state=checked]:border-primary"
                        >
                          <span className="text-2xl mb-2">{time.icon}</span>
                          <span className="font-medium text-center">{time.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Additional Information</h2>
              </div>

              <div>
                <Label className="mb-3 block">Contact Information</Label>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label>Name</Label>
                    <Input value={user?.name || ''} readOnly />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input value={user?.phone || ''} readOnly />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Delivery Instructions (Optional)</Label>
                  <Textarea
                    placeholder="Any specific instructions for delivery..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
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
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ₹{item.product.price} × {item.quantity}
                      </p>
                    </div>
                    <div className="font-medium">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Price Summary */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={`font-medium ${deliveryCharge === 0 ? 'text-green-600' : ''}`}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>

                {deliveryCharge > 0 && cartTotal < 500 && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    Add ₹{(500 - cartTotal).toFixed(2)} more for free delivery
                  </div>
                )}

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-8 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">Payment Method</h3>
                </div>
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-bold text-primary">₹</span>
                    </div>
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        Pay when your order arrives
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                size="lg"
                className="w-full"
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress || !deliveryDate}
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Place Order (₹{grandTotal.toFixed(2)})
                  </>
                )}
              </Button>

              {/* Guarantees */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Freshness Guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Same Day Delivery Available</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span>Free Delivery on Orders Above ₹500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;