import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  Calendar,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Home,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

const Profile = () => {
  const { user, updateProfile, addAddress, updateAddress, deleteAddress, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [addressForm, setAddressForm] = useState({
    type: 'home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    isDefault: true
  });
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await apiService.getOrders();
      if (response.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const result = await updateProfile(profileForm);
      
      if (result.success) {
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully',
        });
        setEditingProfile(false);
      } else {
        toast({
          title: 'Update Failed',
          description: result.error || 'Failed to update profile',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      setLoading(true);
      
      // Check if user already has an address
      if (user.addresses && user.addresses.length > 0) {
        toast({
          title: 'Address Limit Reached',
          description: 'You can only have one delivery address. Please edit your existing address.',
          variant: 'destructive'
        });
        return;
      }
      
      const result = await addAddress(addressForm);
      
      if (result.success) {
        toast({
          title: 'Address Added',
          description: 'Delivery address has been saved successfully',
        });
        setAddressForm({
          type: 'home',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Pakistan',
          isDefault: true
        });
      } else {
        toast({
          title: 'Failed',
          description: result.error || 'Failed to add address',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add address',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (addressId) => {
    try {
      setLoading(true);
      const result = await updateAddress(addressId, addressForm);
      
      if (result.success) {
        toast({
          title: 'Address Updated',
          description: 'Address has been updated successfully',
        });
        setEditingAddress(null);
        setAddressForm({
          type: 'home',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Pakistan',
          isDefault: true
        });
      } else {
        toast({
          title: 'Update Failed',
          description: result.error || 'Failed to update address',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update address',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete your delivery address?')) return;

    try {
      const result = await deleteAddress(addressId);
      if (result.success) {
        toast({
          title: 'Address Deleted',
          description: 'Address has been deleted successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete address',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
    });
  };

  const getOrderStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      packed: 'bg-purple-100 text-purple-800',
      'out-for-delivery': 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      confirmed: <CheckCircle className="h-4 w-4" />,
      packed: <Package className="h-4 w-4" />,
      'out-for-delivery': <Truck className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
      cancelled: <X className="h-4 w-4" />
    };
    return icons[status] || null;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const hasAddress = user.addresses && user.addresses.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                    {user.role === 'admin' ? 'Admin' : 'Customer'}
                  </Badge>
                  <Badge variant="outline">
                    Member since {new Date(user.createdAt).getFullYear()}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Full-width Tabs */}
        <div className="w-full">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="w-full">
                <User className="h-4 w-6 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="addresses" className="w-full">
                <MapPin className="h-4 w-6 mr-2" />
                Address
              </TabsTrigger>
              <TabsTrigger value="orders" className="w-full">
                <ShoppingBag className="h-4 w-6 mr-2" />
                Orders
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab - Full Width */}
            <TabsContent value="profile" className="mt-6">
              <Card className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details and contact information
                      </CardDescription>
                    </div>
                    {!editingProfile ? (
                      <Button variant="outline" onClick={() => setEditingProfile(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setEditingProfile(false)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={handleProfileUpdate} disabled={loading}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {editingProfile ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Email Address</Label>
                        <Input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <Input
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Full Name</span>
                          </div>
                          <p className="font-medium">{user.name}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>Email Address</span>
                          </div>
                          <p className="font-medium">{user.email}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>Phone Number</span>
                          </div>
                          <p className="font-medium">{user.phone || 'Not provided'}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Member Since</span>
                          </div>
                          <p className="font-medium">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Address Tab - Single Address Only */}
            <TabsContent value="addresses" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Address Display */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Delivery Address</CardTitle>
                    <CardDescription>
                      Your single delivery address for all orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {hasAddress ? (
                      user.addresses.map((address) => (
                        <div key={address._id} className="space-y-4">
                          <div className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                {address.type === 'home' ? (
                                  <Home className="h-4 w-4 text-primary" />
                                ) : address.type === 'work' ? (
                                  <Briefcase className="h-4 w-4 text-primary" />
                                ) : null}
                                <span className="font-medium capitalize">{address.type}</span>
                                <Badge className="text-xs bg-green-100 text-green-800">
                                  Primary Address
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingAddress(address._id);
                                    setAddressForm(address);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAddress(address._id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="mb-1">{address.street}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} - {address.zipCode}
                            </p>
                            <p className="text-sm text-muted-foreground">{address.country}</p>
                          </div>
                          
                          {/* Address Info Note */}
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                              <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Note:</p>
                                <p>This is your primary delivery address. All orders will be delivered to this address.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-semibold text-lg mb-2">No Address Saved</h3>
                        <p className="text-muted-foreground mb-4">
                          Add your delivery address to place orders
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Address Form */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>
                      {editingAddress ? 'Update Address' : hasAddress ? 'Edit Address' : 'Add Address'}
                    </CardTitle>
                    <CardDescription>
                      {editingAddress || hasAddress 
                        ? 'Update your delivery address details' 
                        : 'Set up your delivery address'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Address Type</Label>
                        <div className="flex gap-2 mt-2">
                          {['home', 'work', 'other'].map((type) => (
                            <Button
                              key={type}
                              type="button"
                              variant={addressForm.type === type ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setAddressForm(prev => ({ ...prev, type }))}
                              className="capitalize"
                            >
                              {type}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Street Address *</Label>
                        <Input
                          value={addressForm.street}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                          placeholder="House no, street, area"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>City *</Label>
                          <Input
                            value={addressForm.city}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label>State *</Label>
                          <Input
                            value={addressForm.state}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>ZIP Code *</Label>
                          <Input
                            value={addressForm.zipCode}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, zipCode: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label>Country</Label>
                          <Input
                            value={addressForm.country}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        {(editingAddress || hasAddress) && (
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setEditingAddress(null);
                              if (hasAddress) {
                                const userAddress = user.addresses[0];
                                setAddressForm(userAddress);
                              } else {
                                setAddressForm({
                                  type: 'home',
                                  street: '',
                                  city: '',
                                  state: '',
                                  zipCode: '',
                                  country: 'Pakistan',
                                  isDefault: true
                                });
                              }
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          className="flex-1"
                          onClick={() => 
                            editingAddress || hasAddress
                              ? handleUpdateAddress(editingAddress || user.addresses[0]._id)
                              : handleAddAddress()
                          }
                          disabled={loading || (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipCode)}
                        >
                          {editingAddress || hasAddress ? 'Update Address' : 'Save Address'}
                        </Button>
                      </div>
                      
                      {/* Address Limit Note */}
                      <div className="bg-yellow-50 p-3 rounded-lg mt-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div className="text-sm text-yellow-800">
                            <p className="font-medium mb-1">One Address Limit</p>
                            <p>You can only have one delivery address. Update your existing address if needed.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Orders Tab - Full Width */}
            <TabsContent value="orders" className="mt-6">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    Track and manage your dairy orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={getOrderStatusColor(order.orderStatus)}>
                                  <span className="flex items-center gap-1">
                                    {getStatusIcon(order.orderStatus)}
                                    {order.orderStatus.split('-').map(word => 
                                      word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ')}
                                  </span>
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  Order #{order.orderNumber}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0">
                              <p className="text-lg font-bold">₨{order.totalAmount.toFixed(2)}</p>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={item.product?._id || item._id} className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                                  {item.product?.images?.[0]?.url ? (
                                    <img
                                      src={`https://dairydrop.onrender.com${item.product.images[0].url}`}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <span className="text-sm">🥛</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    ₨{item.price} × {item.quantity}
                                  </p>
                                </div>
                                <div className="text-sm font-medium">
                                  ₨{(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-end mt-4">
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/order/${order._id}`}>
                                View Details
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold text-lg mb-2">No Orders Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't placed any orders yet
                      </p>
                      <Button asChild>
                        <a href="/products">Start Shopping</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Add these missing icon imports at the top
import { Info, AlertCircle } from 'lucide-react';

export default Profile;