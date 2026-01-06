import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Package, 
  Truck, 
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import Payment from '@/components/Payment'; // Make sure this path is correct

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrder(orderId);
      
      if (response.success) {
        const orderData = response.data.order;
        setOrder(orderData);
        
        // Check payment status
        if (orderData.paymentStatus === 'paid') {
          setPaymentStatus('paid');
        } else if (orderData.paymentStatus === 'failed') {
          setPaymentStatus('failed');
        } else {
          setPaymentStatus('pending');
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: 'Error',
        description: 'Failed to load order details',
        variant: 'destructive'
      });
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    // Update local state
    setPaymentStatus('paid');
    
    // Fetch updated order details
    setTimeout(() => {
      navigate(`/order-confirmation/${orderId}`);
    }, 3000);
  };

  const handlePaymentCancel = () => {
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/orders')}>View My Orders</Button>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'paid') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Payment Already Processed
            </h1>
            <p className="text-gray-600 mb-8">
              Order #{order.orderNumber} has already been paid on{' '}
              {new Date(order.paidAt).toLocaleDateString()}.
            </p>
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate(`/order-confirmation/${orderId}`)}
              >
                View Order Confirmation
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate('/orders')}
              >
                View All Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(`/order/${orderId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Order
          </Button>

          <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
          <p className="text-muted-foreground">
            Order #{order.orderNumber} • Total: ₨{order.totalAmount}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Order Summary */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                  <Package className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Order Summary</h2>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image ? (
                        <img
                          src={`https://dairydrop.onrender.com${item.image}`}
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
                      <p className="text-xs text-gray-500">
                        ₨{item.price} × {item.quantity}
                      </p>
                    </div>
                    <div className="font-medium">
                      ₨{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold">₨{order.totalAmount}</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-green-50 text-green-600">
                  <Truck className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Delivery Information</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="font-medium">
                    {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Date</p>
                  <p className="font-medium">
                    {new Date(order.deliveryDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium">{order.contactNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-8">
              <Payment
                orderId={orderId}
                amount={order.totalAmount}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            </div>

            {/* Security Info */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Secure Payment</h3>
              </div>
              <ul className="space-y-3 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span>256-bit SSL encryption for secure transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span>We do not store your card details</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span>PCI DSS compliant payment processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt=1.5"></div>
                  <span>Instant payment confirmation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;