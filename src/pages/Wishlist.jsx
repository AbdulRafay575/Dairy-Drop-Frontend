import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  AlertCircle,
  Star,
  Clock,
  Shield,
  Truck,
  Plus,
  Minus,
  Filter,
  Search,
  X,
  ChevronLeft,
  Package,
  CheckCircle,
  Eye,
  Milk,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, moveToCart, addToCart } = useCart();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const handleMoveAllToCart = () => {
    wishlist.forEach(product => {
      moveToCart(product._id);
    });
    
    toast({
      title: 'Items Moved to Cart',
      description: `All ${wishlist.length} items have been moved to your cart`,
    });
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      wishlist.forEach(product => {
        removeFromWishlist(product._id);
      });
      
      toast({
        title: 'Wishlist Cleared',
        description: 'All items have been removed from your wishlist',
      });
    }
  };

  // Updated: Now removes from wishlist after adding to cart
  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id); // Add this line
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart and removed from wishlist`,
    });
  };

  // moveToCart already removes from wishlist in CartContext
  const handleMoveToCart = (productId) => {
    moveToCart(productId);
    toast({
      title: 'Moved to Cart',
      description: 'Item moved to your cart',
    });
  };

  const handleRemoveItem = (productId) => {
    removeFromWishlist(productId);
    toast({
      title: 'Removed',
      description: 'Item removed from wishlist',
    });
  };

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

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-lg mx-auto text-center"
          >
            <motion.div variants={fadeInUp}>
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
                <Heart className="h-16 w-16 text-rose-500" />
              </div>
            </motion.div>

            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold mb-4 text-gray-900"
            >
              Your Wishlist Awaits
            </motion.h2>

            <motion.p 
              variants={fadeInUp}
              className="text-gray-600 mb-8 text-lg"
            >
              Save your favorite dairy products here for easy access. Start exploring our premium collection!
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="space-y-4"
            >
              <Button 
                size="lg" 
                asChild
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 h-12 px-8"
              >
                <Link to="/products" className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Start Shopping
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
             <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white"
                  >
                    <div className="container mx-auto px-4 py-16">
                      <div className="text-center max-w-3xl mx-auto">
                        
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                          <span className="block text-gray-900">YOUR SAVED</span>
                          <span className="block text-blue-600">FAVOURITE</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                          Handpicked dairy products from trusted farms. Experience purity in every drop.
                        </p>
                      </div>
                    </div>
                  </motion.div>

            {/* Stats Bar */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white border-2 border-gray-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50">
                    <Heart className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{wishlist.length}</p>
                    <p className="text-sm text-gray-600">Saved Items</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleMoveAllToCart}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Move All to Cart
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/products">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="container mx-auto px-4 pb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((product, index) => (
              <motion.div
                key={product._id}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.05 }}
              >
                <WishlistItem 
                  product={product}
                  onMoveToCart={handleMoveToCart}
                  onAddToCart={handleAddToCart}
                  onRemove={handleRemoveItem}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

       
      </div>
    </div>
  );
};

const WishlistItem = ({ product, onMoveToCart, onAddToCart, onRemove }) => {
  const getCategoryColor = (category) => {
    const colors = {
      milk: 'from-blue-500 to-cyan-500',
      yogurt: 'from-green-500 to-emerald-500',
      cheese: 'from-amber-500 to-orange-500',
      butter: 'from-yellow-500 to-amber-500',
      'ice-cream': 'from-purple-500 to-pink-500',
    };
    return colors[category] || 'from-gray-500 to-gray-700';
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative group"
    >
      <Card className="border-2 border-gray-200 hover:border-gray-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Product Image */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {product.images?.[0]?.url ? (
            <img
src={`https://dairydrop.onrender.com${product.images[0].url}`}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-2 opacity-30">🥛</div>
                <p className="text-sm text-gray-500 font-medium">Premium Dairy</p>
              </div>
            </div>
          )}

          {/* Category Badge */}
          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-0 shadow-lg">
            {product.category.replace('-', ' ')}
          </Badge>

          {/* Wishlist Heart */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            onClick={() => onRemove(product._id)}
          >
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
          </Button>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-white hover:bg-white/90 text-gray-900"
              asChild
            >
              <Link to={`/product/${product._id}`} className="flex items-center justify-center">
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Link>
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Name & Brand */}
            <div>
              <Link to={`/product/${product._id}`}>
                <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-500">{product.brand}</p>
            </div>

            {/* Rating & Shelf Life */}
            <div className="flex items-center justify-between">
              {product.rating?.average && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-current" />
                  <span className="font-medium">{product.rating.average.toFixed(1)}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Clock className="h-3 w-3" />
                <span>{product.shelfLife} days</span>
              </div>
            </div>

            {/* Price & Fat Content */}
            <div className="flex items-center justify-between border-t border-b border-gray-100 py-3">
              <div>
                <p className="text-2xl font-bold text-blue-600">₨{product.price}</p>
                <p className="text-xs text-gray-500">per {product.unit}</p>
              </div>
              {product.nutritionalFacts?.fatContent && (
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{product.nutritionalFacts.fatContent}g</p>
                  <p className="text-xs text-gray-500">Fat</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
                onClick={() => onMoveToCart(product._id)}
                disabled={!product.isAvailable || product.quantity === 0}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Move to Cart
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-gray-200"
                  onClick={() => onAddToCart(product)}
                  disabled={!product.isAvailable || product.quantity === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-gray-200 text-rose-600 hover:text-rose-700 hover:border-rose-200"
                  onClick={() => onRemove(product._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Bottom Gradient */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryColor(product.category)}`} />
      </Card>
    </motion.div>
  );
};

export default Wishlist;