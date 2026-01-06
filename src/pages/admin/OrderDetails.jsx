import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Package, 
  Truck,
  CheckCircle,
  XCircle,
  Printer,
  MessageSquare,
  Clock,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const OrderDetails = ({ order }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'out-for-delivery':
        return <Truck className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setLoading(true);
      const response = await apiService.updateOrderStatus(order._id, newStatus);
      if (response.success) {
        toast({
          title: 'Order Updated',
          description: `Order status updated to ${newStatus}`,
        });
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update order status',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const statusFlow = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'packed', label: 'Packed' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' }
  ];

  const currentStatusIndex = statusFlow.findIndex(s => s.value === order.orderStatus);

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-bold">Order #{order.orderNumber}</h2>
            <Badge className={`flex items-center gap-1 ${getStatusColor(order.orderStatus)}`}>
              {getStatusIcon(order.orderStatus)}
              <span className="capitalize">
                {order.orderStatus.replace(/-/g, ' ')}
              </span>
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrintInvoice}>
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
          
        </div>
      </div>

      <Separator />

      {/* Status Flow */}
      <div>
        <h3 className="font-semibold mb-4">Order Status</h3>
        <div className="flex items-center justify-between">
          {statusFlow.map((status, index) => (
            <div key={status.value} className="flex flex-col items-center relative">
              {/* Line between statuses */}
              
              
              {/* Status circle */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center z-10
                ${index <= currentStatusIndex ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}
              `}>
                {index + 1}
              </div>
              
              {/* Status label */}
              <span className={`text-xs mt-2 ${
                index <= currentStatusIndex ? 'text-primary font-medium' : 'text-gray-500'
              }`}>
                {status.label}
              </span>
            </div>
          ))}
        </div>

        {/* Status Actions */}
        <div className="mt-6 flex flex-wrap gap-2">
          {order.orderStatus === 'pending' && (
            <Button onClick={() => handleUpdateStatus('confirmed')} disabled={loading}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Order
            </Button>
          )}
          {order.orderStatus === 'confirmed' && (
            <Button onClick={() => handleUpdateStatus('packed')} disabled={loading}>
              <Package className="h-4 w-4 mr-2" />
              Mark as Packed
            </Button>
          )}
          {order.orderStatus === 'packed' && (
            <Button onClick={() => handleUpdateStatus('out-for-delivery')} disabled={loading}>
              <Truck className="h-4 w-4 mr-2" />
              Dispatch for Delivery
            </Button>
          )}
          {order.orderStatus === 'out-for-delivery' && (
            <Button onClick={() => handleUpdateStatus('delivered')} disabled={loading}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Delivered
            </Button>
          )}
          {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
            <Button 
              variant="destructive" 
              onClick={() => handleUpdateStatus('cancelled')}
              disabled={loading}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Customer & Delivery Info */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div>
          <h3 className="font-semibold mb-4">Customer Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">{order.user?.name || 'Customer'}</p>
                <p className="text-sm text-muted-foreground">{order.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">{order.contactNumber || 'No phone provided'}</p>
                <p className="text-sm text-muted-foreground">Contact Number</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div>
          <h3 className="font-semibold mb-4">Delivery Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">{order.deliveryAddress?.street}</p>
                <p className="text-sm text-muted-foreground">
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state} -{' '}
                  {order.deliveryAddress?.zipCode}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">
                  {new Date(order.deliveryDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">Delivery Date</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Order Items */}
      <div>
        <h3 className="font-semibold mb-4">Order Items</h3>
        <div className="border rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-medium">Product</th>
                  <th className="text-left p-3 font-medium">Price</th>
                  <th className="text-left p-3 font-medium">Quantity</th>
                  <th className="text-left p-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.product?.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">₨{item.price?.toFixed(2)}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3 font-medium">
                      ₨{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="flex justify-end">
        <div className="w-full md:w-80 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₨{order.totalAmount?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Charge</span>
            <span className={order.totalAmount > 500 ? 'text-green-600' : ''}>
              {order.totalAmount > 500 ? 'FREE' : '₨50'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Payment Method</span>
            <div className="flex items-center gap-2">
              {order.paymentMethod === 'card' ? (
                <>
                  <CreditCard className="h-4 w-4" />
                  <span>Credit/Debit Card</span>
                  {order.isPaid && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Paid</span>}
                  {!order.isPaid && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>}
                </>
              ) : (
                <>
                  <span>Cash on Delivery</span>
                  {order.isPaid && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Paid</span>}
                </>
              )}
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount</span>
            <span>₨{order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      {order.notes && (
        <div>
          <h3 className="font-semibold mb-2">Customer Notes</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm">{order.notes}</p>
          </div>
        </div>
      )}

      {order.cancellationReason && (
        <div>
          <h3 className="font-semibold mb-2 text-red-600">Cancellation Reason</h3>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <p className="text-sm">{order.cancellationReason}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;