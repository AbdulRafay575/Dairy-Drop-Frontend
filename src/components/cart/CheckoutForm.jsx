import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Home, 
  Briefcase,
  Clock,
  Calendar,
  MessageSquare,
  Truck,
  Shield,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CheckoutForm = ({ 
  onSubmit, 
  loading = false,
  initialData = {}
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('morning');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');

  const deliveryTimes = [
    { 
      value: 'morning', 
      label: 'Morning', 
      time: '7 AM - 10 AM',
      icon: '🌅',
      description: 'Perfect for breakfast'
    },
    { 
      value: 'afternoon', 
      label: 'Afternoon', 
      time: '12 PM - 3 PM',
      icon: '☀️',
      description: 'Lunch time delivery'
    },
    { 
      value: 'evening', 
      label: 'Evening', 
      time: '5 PM - 8 PM',
      icon: '🌇',
      description: 'Evening delivery'
    },
    { 
      value: 'flexible', 
      label: 'Flexible', 
      time: 'Anytime',
      icon: '⏰',
      description: "We'll choose the best time"
    }
  ];

  // Set default delivery date to tomorrow
  React.useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeliveryDate(tomorrow.toISOString().split('T')[0]);

    // Set default address
    if (user?.addresses?.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
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

    if (!contactPhone.trim()) {
      toast({
        title: 'Phone Number Required',
        description: 'Please provide a contact number',
        variant: 'destructive'
      });
      return;
    }

    const orderData = {
      address: selectedAddress,
      deliveryDate,
      deliveryTime,
      deliveryNotes,
      contactPhone
    };

    onSubmit(orderData);
  };

  const isTodayDeliveryAvailable = () => {
    const now = new Date();
    return now.getHours() < 12; // Orders before 12 PM get same day delivery
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Customer Information */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Contact Information</h2>
            <p className="text-sm text-muted-foreground">Primary contact for delivery updates</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>Full Name</Label>
            <Input 
              value={user?.name || ''} 
              readOnly 
              className="mt-2 bg-muted/50"
            />
            <p className="text-xs text-muted-foreground mt-1">From your profile</p>
          </div>
          <div>
            <Label>Email Address</Label>
            <Input 
              value={user?.email || ''} 
              readOnly 
              className="mt-2 bg-muted/50"
            />
            <p className="text-xs text-muted-foreground mt-1">Order updates will be sent here</p>
          </div>
        </div>

        <div className="mt-6">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contact Phone Number *
          </Label>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1">
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setContactPhone(user?.phone || '')}
              disabled={!user?.phone}
            >
              Use Profile
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Delivery executive will call this number
          </p>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Delivery Address</h2>
            <p className="text-sm text-muted-foreground">Where should we deliver your dairy?</p>
          </div>
        </div>

        {user?.addresses?.length > 0 ? (
          <div className="space-y-4">
            <RadioGroup
              value={selectedAddress?._id}
              onValueChange={(value) => {
                const address = user.addresses.find(addr => addr._id === value);
                setSelectedAddress(address);
              }}
              className="space-y-3"
            >
              {user.addresses.map((address) => (
                <div key={address._id} className="flex items-start space-x-3">
                  <RadioGroupItem value={address._id} id={`address-${address._id}`} />
                  <Label
                    htmlFor={`address-${address._id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className={`p-4 border rounded-lg hover:border-primary transition-colors ${
                      selectedAddress?._id === address._id ? 'border-primary bg-primary/5' : ''
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {address.type === 'home' ? (
                          <Home className="h-4 w-4 text-primary" />
                        ) : address.type === 'work' ? (
                          <Briefcase className="h-4 w-4 text-primary" />
                        ) : null}
                        <span className="font-medium capitalize">{address.type}</span>
                        {address.isDefault && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="mb-1">{address.street}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.state} - {address.zipCode}
                      </p>
                      <p className="text-sm text-muted-foreground">{address.country}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full" asChild>
                <a href="/profile?tab=addresses">
                  + Add New Address or Manage Addresses
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Address Added</h3>
            <p className="text-muted-foreground mb-6">
              Add a delivery address to continue with checkout
            </p>
            <Button asChild>
              <a href="/profile?tab=addresses">
                Add Delivery Address
              </a>
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
          <div>
            <h2 className="text-xl font-bold">Delivery Schedule</h2>
            <p className="text-sm text-muted-foreground">When would you like your dairy delivered?</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Delivery Date */}
          <div>
            <Label className="mb-3 block flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Delivery Date
            </Label>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="flex-1"
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {isTodayDeliveryAvailable() && deliveryDate === new Date().toISOString().split('T')[0] ? (
                    <Badge className="bg-green-100 text-green-800">
                      ✓ Available for same-day delivery
                    </Badge>
                  ) : deliveryDate === new Date().toISOString().split('T')[0] ? (
                    <Badge variant="outline" className="text-amber-600 border-amber-200">
                      ⚠️ Order before 12 PM for same-day delivery
                    </Badge>
                  ) : null}
                </p>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">Quick Select</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      setDeliveryDate(today.toISOString().split('T')[0]);
                    }}
                    disabled={!isTodayDeliveryAvailable()}
                  >
                    Today
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      setDeliveryDate(tomorrow.toISOString().split('T')[0]);
                    }}
                  >
                    Tomorrow
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const dayAfter = new Date();
                      dayAfter.setDate(dayAfter.getDate() + 2);
                      setDeliveryDate(dayAfter.toISOString().split('T')[0]);
                    }}
                  >
                    Day After
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Time Slot */}
          <div>
            <Label className="mb-3 block">Preferred Time Slot</Label>
            <RadioGroup
              value={deliveryTime}
              onValueChange={setDeliveryTime}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
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
                    className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  >
                    <span className="text-2xl mb-2">{time.icon}</span>
                    <span className="font-medium text-center">{time.label}</span>
                    <span className="text-xs text-muted-foreground text-center mt-1">{time.time}</span>
                    <span className="text-xs text-muted-foreground text-center mt-1">{time.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Delivery Notes */}
          <div>
            <Label className="mb-3 block flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Delivery Instructions (Optional)
            </Label>
            <Textarea
              placeholder="Any specific instructions for the delivery executive? (e.g., 'Leave at doorstep', 'Call before delivery', 'No-contact delivery preferred')"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              These instructions will be shared with our delivery team
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="border rounded-lg p-6 bg-gradient-to-r from-primary/5 to-green-50">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Delivery Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estimated Delivery</span>
                <span className="font-medium">
                  {deliveryDate === new Date().toISOString().split('T')[0] && isTodayDeliveryAvailable()
                    ? 'Today'
                    : new Date(deliveryDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Time Slot</span>
                <span className="font-medium">
                  {deliveryTimes.find(t => t.value === deliveryTime)?.time}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Delivery Address</span>
                <span className="font-medium text-right">
                  {selectedAddress ? (
                    <>
                      {selectedAddress.city}, {selectedAddress.state}
                      <br />
                      <span className="text-sm text-muted-foreground">{selectedAddress.street}</span>
                    </>
                  ) : 'Not selected'}
                </span>
              </div>
            </div>

            {/* Delivery Guarantee */}
            <div className="mt-6 p-4 bg-white border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Freshness Guarantee</p>
                  <p className="text-sm text-muted-foreground">
                    Your dairy will be delivered fresh and chilled. If unsatisfied, we offer 24-hour returns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                By proceeding, you agree to our terms and confirm your delivery details.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={loading}
            >
              Back to Cart
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={loading || !selectedAddress || !deliveryDate || !contactPhone}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Processing Order...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Place Order
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;