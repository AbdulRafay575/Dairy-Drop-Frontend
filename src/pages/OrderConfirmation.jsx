import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, CreditCard, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await apiService.getOrder(orderId);
        if (res && res.success) {
          setOrder(res.data.order);
        } else {
          throw new Error(res.message || 'Order not found');
        }
      } catch (err) {
        console.error('Failed to load order:', err);
        toast({ title: 'Error', description: 'Unable to load order details', variant: 'destructive' });
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading order confirmation...</p>
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
          <p className="text-gray-600 mb-6">We couldn't find that order.</p>
          <Button onClick={() => navigate('/orders')}>View My Orders</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-2">Thank you — Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">Order #{order.orderNumber} • {new Date(order.createdAt).toLocaleString()}</p>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                <Package className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">Order Summary</h2>
            </div>

            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.image ? (
                      <img src={`https://dairydrop.onrender.com${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">🥛</div>
                    )}
                  </div>

                  <div className="flex-1 text-left">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">₨{item.price} × {item.quantity}</p>
                  </div>

                  <div className="font-medium">₨{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Paid</span>
              <span className="text-2xl font-bold">₨{order.totalAmount}</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button variant="outline" className="w-full" onClick={() => navigate('/orders')}>
              View My Orders
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p className="mb-1">A confirmation email has been sent to <span className="font-medium">{order.user?.email || 'your email'}</span>.</p>
            <p className="flex items-center justify-center gap-2 mt-3"> 
              <Truck className="h-4 w-4 text-gray-600" /> Estimated delivery: <span className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
