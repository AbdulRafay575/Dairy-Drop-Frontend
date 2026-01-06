import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  Shield,
  Package,
  Heart,
  ArrowLeft,
  Sparkles,
  Clock,
  Award,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart, moveToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please Login',
        description: 'You need to login to proceed to checkout',
        variant: 'destructive'
      });
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: 'Cart Empty',
        description: 'Add items to cart before checkout',
        variant: 'destructive'
      });
      return;
    }

    navigate('/checkout');
  };

  const handleQuantityChange = (productId, type) => {
    const item = cart.find(item => item.product._id === productId);
    if (!item) return;

    const newQuantity = type === 'increment' ? item.quantity + 1 : item.quantity - 1;
    
    if (newQuantity < 1) {
      removeFromCart(productId);
      toast({
        title: 'Removed',
        description: 'Item removed from cart',
      });
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast({
      title: 'Removed',
      description: 'Item removed from cart',
    });
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
      toast({
        title: 'Cart Cleared',
        description: 'All items removed from cart',
      });
    }
  };

  const cartTotal = getCartTotal();
  const deliveryCharge = cartTotal > 500 ? 0 : 50;
  const grandTotal = cartTotal + deliveryCharge;

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-md mx-auto text-center"
          >
            <motion.div variants={fadeInUp}>
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-xl">
                <ShoppingCart className="h-16 w-16 text-gray-400" />
              </div>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4 text-gray-900">
              Your Cart is Empty
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-gray-600 mb-10 text-lg">
              Looks like you haven't added any premium dairy products to your cart yet.
            </motion.p>

            <motion.div variants={fadeInUp} className="space-y-4">
              <Button 
                size="lg" 
                className="h-14 px-10 text-base bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/25"
                asChild
              >
                <Link to="/products" className="flex items-center justify-center gap-3">
                  <Sparkles className="h-5 w-5" />
                  Explore Premium Dairy
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="h-14 px-10 text-base border-2 hover:bg-gray-50"
                asChild
              >
                <Link to="/" className="flex items-center justify-center gap-3">
                  <ArrowLeft className="h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-12"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-50 to-cyan-50">
              <ShoppingCart className="h-7 w-7 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          </motion.div>
          
          <motion.p variants={fadeInUp} className="text-gray-600 text-lg">
            Review and manage your premium dairy selection
          </motion.p>

          <motion.div variants={fadeInUp} className="flex items-center gap-3 mt-4">
            <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full">
              <span className="text-sm font-medium text-blue-700">
                {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="h-2 w-2 rounded-full bg-gray-300"></div>
            <span className="text-gray-500">Free delivery on orders above ₨500</span>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
              {cart.map((item, index) => (
                <motion.div
                  key={item.product._id}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0 group">
                        {item.product.images?.[0]?.url ? (
                          <img
                src={`https://dairydrop.onrender.com${item.product.images[0].url}`}
                            alt={item.product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-4xl">🥛</span>
                          </div>
                        )}
                        
                        {/* Stock Badge */}
                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                          item.product.quantity > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <Link 
                              to={`/product/${item.product._id}`}
                              className="block group"
                            >
                              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {item.product.name}
                              </h3>
                              <p className="text-gray-500">{item.product.brand}</p>
                            </Link>
                            
                            {/* Product Tags */}
                            <div className="flex gap-2">
                              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                {item.product.category.replace('-', ' ')}
                              </span>
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {item.product.shelfLife} days shelf life
                              </span>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">₨{item.product.price * item.quantity}</p>
                            <p className="text-sm text-gray-500">₨{item.product.price} × {item.quantity}</p>
                          </div>
                        </div>

                        {/* Quantity Controls & Actions */}
                        <div className="flex items-center justify-between mt-8">
                          {/* Quantity */}
                          <div className="flex items-center border-2 border-gray-200 rounded-xl">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 hover:bg-gray-100"
                              onClick={() => handleQuantityChange(item.product._id, 'decrement')}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium text-gray-900">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 hover:bg-gray-100"
                              onClick={() => handleQuantityChange(item.product._id, 'increment')}
                              disabled={item.quantity >= item.product.quantity}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => moveToCart(item.product._id)}
                              className="border-gray-300 hover:bg-gray-50"
                            >
                              <Heart className="h-4 w-4 mr-2" />
                              Save for Later
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.product._id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Cart Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200"
            >
              <Button 
                variant="outline" 
                size="lg"
                className="h-12 px-8 border-2 hover:bg-gray-50"
                asChild
              >
                <Link to="/products" className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5" />
                  Continue Shopping
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="h-12 px-8 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                onClick={handleClearCart}
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Clear Cart
              </Button>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="sticky top-28"
            >
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-full bg-gradient-to-br from-blue-50 to-cyan-50">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-xl font-semibold text-gray-900">₨{cartTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Delivery</span>
                      <span className={`text-lg font-semibold ${deliveryCharge === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {deliveryCharge === 0 ? 'FREE' : `₨${deliveryCharge}`}
                      </span>
                    </div>

                    {deliveryCharge > 0 && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Add ₨{(500 - cartTotal).toFixed(2)} more for free delivery
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-gray-200" />

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-medium text-gray-900">Total</span>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">₨{grandTotal.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Including all taxes</p>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full h-14 mt-6 text-base bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    You can review and edit this order before payment
                  </p>
                </div>
                {/* Secure Payment Badge */}
                <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">Secure Payment</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;