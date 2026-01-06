import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Eye, 
  Truck,
  Clock,
  Shield,
  ChevronRight,
  Leaf,
  Award,
  Zap,
  Package,
  Milk,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      milk: 'from-blue-500 to-cyan-500',
      yogurt: 'from-green-500 to-emerald-500',
      cheese: 'from-amber-500 to-orange-500',
      butter: 'from-yellow-500 to-amber-500',
      cream: 'from-pink-500 to-rose-500',
      'ice-cream': 'from-purple-500 to-pink-500',
      ghee: 'from-orange-500 to-red-500',
      paneer: 'from-indigo-500 to-purple-500'
    };
    return colors[category] || 'from-gray-500 to-gray-700';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      milk: <Milk className="h-4 w-4" />,
      yogurt: <Package className="h-4 w-4" />,
      cheese: <Award className="h-4 w-4" />,
      butter: <Leaf className="h-4 w-4" />,
      'ice-cream': <Zap className="h-4 w-4" />,
    };
    return icons[category] || <Package className="h-4 w-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${product._id}`}>
        <div className="group relative bg-white border-2 border-gray-200 hover:border-blue-200 rounded-2xl overflow-hidden hover:shadow-2xl shadow-lg hover:shadow-blue-100/50 transition-all duration-500">
          {/* Premium Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {!product.isAvailable && (
              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg shadow-red-500/30 text-xs px-3 py-1 rounded-full">
                Out of Stock
              </Badge>
            )}
            {product.quantity < 10 && product.quantity > 0 && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg shadow-amber-500/30 text-xs px-3 py-1 rounded-full">
                <Clock className="h-3 w-3 mr-1" />
                Low Stock
              </Badge>
            )}
            {product.rating?.average >= 4.5 && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-lg shadow-yellow-500/30 text-xs px-3 py-1 rounded-full">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Premium Pick
              </Badge>
            )}
            {product.sameDayDelivery && (
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/30 text-xs px-3 py-1 rounded-full">
                <Truck className="h-3 w-3 mr-1" />
                Today
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-red-300 hover:bg-white shadow-lg"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-5 w-5 transition-all duration-300 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`}
            />
          </Button>

          {/* Product Image with Gradient Overlay */}
          <div className="relative h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-gray-900/10 z-0"></div>
            {product.images?.[0]?.url ? (
              <img
                src={`https://dairydrop.onrender.com${product.images[0].url}`}
                alt={product.images[0].alt || product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center">
                  <div className="text-6xl mb-3 opacity-30">🥛</div>
                  <p className="text-sm text-gray-500 font-medium">Premium Dairy</p>
                </div>
              </div>
            )}
            
            {/* Quick view overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="w-full bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border-0 shadow-lg"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Quick View
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </motion.div>
            </div>

            {/* Category Gradient */}
            <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${getCategoryColor(product.category)}`}></div>
          </div>

          {/* Product Info */}
          <div className="p-6">
            {/* Category & Brand */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${getCategoryColor(product.category)}`}>
                  <div className="text-white">
                    {getCategoryIcon(product.category)}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {product.category.replace('-', ' ')}
                  </span>
                  <p className="text-xs text-gray-500 line-clamp-1">{product.brand}</p>
                </div>
              </div>
              
              {/* Rating */}
              {product.rating?.average && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-current" />
                  <span className="text-sm font-bold text-gray-900">{product.rating.average.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({product.rating.count || 0})</span>
                </div>
              )}
            </div>

            {/* Product Name */}
            <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors h-14">
              {product.name}
            </h3>

            {/* Nutritional info */}
            {product.nutritionalFacts?.fatContent && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <span className="block text-xs text-gray-500">Fat</span>
                      <span className="font-semibold text-gray-900">{product.nutritionalFacts.fatContent}g</span>
                    </div>
                    {product.nutritionalFacts.proteinContent && (
                      <div className="text-center">
                        <span className="block text-xs text-gray-500">Protein</span>
                        <span className="font-semibold text-gray-900">{product.nutritionalFacts.proteinContent}g</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="block text-xs text-gray-500">Shelf</span>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-gray-500" />
                      <span className="font-semibold text-gray-900">{product.shelfLife} days</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Price & Actions */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-blue-600">₨{product.price}</p>
                  {product.unit && (
                    <p className="text-xs text-gray-500">per {product.unit}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.quantity > 0 ? (
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        In Stock
                      </span>
                    ) : (
                      'Out of Stock'
                    )}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable || product.quantity === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>              
            </div>
          </div>

          {/* Hover Border Effect */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300/50 rounded-2xl pointer-events-none transition-all duration-500"></div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;