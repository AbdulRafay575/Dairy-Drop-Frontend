import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Calendar, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  X,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiService } from '@/services/api';
import { formatCurrency, formatDate, formatOrderStatus } from '@/utils/formatters';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getOrders();
      
      if (response.success) {
        setOrders(response.data.orders || []);
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.items.some(item =>
          item.name.toLowerCase().includes(query)
        )
      );
    }

    // Sort by latest first
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredOrders(filtered);
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await apiService.cancelOrder(orderId, 'Cancelled by customer');
      
      if (response.success) {
        // Update the order in state
        setOrders(prev => prev.map(order =>
          order._id === orderId
            ? { ...order, orderStatus: 'cancelled' }
            : order
        ));
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order. Please try again.');
    }
  };

  const getStatusColor = (status) => {
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

  const canCancelOrder = (order) => {
    return ['pending', 'confirmed'].includes(order.orderStatus);
  };

  const getOrderProgress = (status) => {
    const steps = [
      { key: 'pending', label: 'Ordered', icon: <ShoppingBag className="h-4 w-4" /> },
      { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle className="h-4 w-4" /> },
      { key: 'packed', label: 'Packed', icon: <Package className="h-4 w-4" /> },
      { key: 'out-for-delivery', label: 'Out for Delivery', icon: <Truck className="h-4 w-4" /> },
      { key: 'delivered', label: 'Delivered', icon: <CheckCircle className="h-4 w-4" /> }
    ];

    const currentIndex = steps.findIndex(step => step.key === status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <LoadingSpinner message="Loading your orders..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <EmptyState
            icon={<X className="h-12 w-12" />}
            title="Error Loading Orders"
            description={error}
            action={
              <Button onClick={fetchOrders}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage all your dairy orders
            </p>
          </div>
          
          <Button variant="outline" asChild>
            <Link to="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order number or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="packed">Packed</SelectItem>
                    <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" onClick={fetchOrders}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
              </p>
              
              {(searchQuery || statusFilter !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-12 w-12" />}
            title="No Orders Found"
            description={
              searchQuery || statusFilter !== 'all'
                ? "Try adjusting your filters or search"
                : "You haven't placed any orders yet"
            }
            action={
              <Button asChild>
                <Link to="/products">
                  Start Shopping
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onCancel={handleCancelOrder}
                onViewDetails={() => setSelectedOrder(order)}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                canCancel={canCancelOrder}
                getOrderProgress={getOrderProgress}
              />
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            getOrderProgress={getOrderProgress}
          />
        )}
      </div>
    </div>
  );
};

const OrderCard = ({ order, onCancel, onViewDetails, getStatusColor, getStatusIcon, canCancel, getOrderProgress }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* Order Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={getStatusColor(order.orderStatus)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(order.orderStatus)}
                  {formatOrderStatus(order.orderStatus)}
                </span>
              </Badge>
              <span className="text-sm font-medium">{order.orderNumber}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{formatCurrency(order.totalAmount)}</p>
            <p className="text-sm text-muted-foreground">
              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Order Progress */}
        <div className="mb-6">
          <OrderProgress steps={getOrderProgress(order.orderStatus)} />
        </div>

        {/* Order Items Preview */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Items</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
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
                  <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
                <div className="text-sm font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
            
            {order.items.length > 2 && (
              <div className="flex items-center justify-center p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">
                  +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Actions */}
        <div className="flex flex-wrap gap-3">
          <Button size="sm" onClick={onViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          
          {canCancel(order) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(order._id)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Order
            </Button>
          )}
          
          <Button variant="ghost" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Invoice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const OrderProgress = ({ steps }) => {
  return (
    <div className="relative">
      {/* Progress line */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200"></div>
      
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              step.completed
                ? 'bg-primary text-primary-foreground'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {step.icon}
            </div>
            <span className={`text-xs text-center ${
              step.completed ? 'text-primary font-medium' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderDetailsModal = ({ order, onClose, getStatusColor, getStatusIcon, getOrderProgress }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Order Details</h2>
              <div className="flex items-center gap-3 mt-2">
                <Badge className={getStatusColor(order.orderStatus)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(order.orderStatus)}
                    {formatOrderStatus(order.orderStatus)}
                  </span>
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {order.orderNumber}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[70vh]">
          {/* Order Progress */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Order Status</h3>
            <OrderProgress steps={getOrderProgress(order.orderStatus)} />
          </div>

          {/* Delivery Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold mb-3">Delivery Information</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Date:</span>{' '}
                  {formatDate(order.deliveryDate)}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Address:</span>{' '}
                  {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.zipCode}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Contact:</span>{' '}
                  {order.contactNumber}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Payment Information</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Method:</span>{' '}
                  Cash on Delivery
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Status:</span>{' '}
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Order Date:</span>{' '}
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
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
                    <h4 className="font-medium mb-1">{item.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.product?.brand || 'Dairy Mart'}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Price: {formatCurrency(item.price)}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>Total: {formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 max-w-md ml-auto">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.totalAmount - (order.deliveryCharge || 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className={order.deliveryCharge === 0 ? 'text-green-600' : ''}>
                  {order.deliveryCharge === 0 ? 'FREE' : formatCurrency(order.deliveryCharge || 0)}
                </span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-muted/20">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;