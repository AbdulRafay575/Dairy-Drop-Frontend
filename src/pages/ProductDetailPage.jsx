import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Truck, 
  Shield, 
  Clock, 
  Heart, 
  Share2, 
  ChevronRight,
  Plus,
  Minus,
  ShoppingCart,
  Calendar,
  Leaf,
  Users,
  CheckCircle,
  Package,
  Sparkles,
  Award,
  Milk,
  ArrowRight,
  ChevronDown,
  MapPin,
  Shield as ShieldIcon,
  Truck as TruckIcon,
  Clock as ClockIcon,
  Zap,
  Droplets,
  UtensilsCrossed,
  ShoppingBag,
  Eye,
  X,
  MessageSquare,
  Mail,
  Send,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import ProductGrid from '@/components/products/ProductGrid';
import { apiService } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedSize, setSelectedSize] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [eligibleOrder, setEligibleOrder] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    title: '',
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const { toast } = useToast();
  const isWishlisted = isInWishlist(id);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (product && user) {
      checkEligibleOrder();
    }
  }, [product, user]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const [productRes, reviewsRes] = await Promise.all([
        apiService.getProduct(id),
        apiService.getProductReviews(id)
      ]);

      if (productRes.success) {
        setProduct(productRes.data.product);
        
        // Fetch related products
        const relatedRes = await apiService.getProducts({
          category: productRes.data.product.category,
          limit: 4
        });
        
        if (relatedRes.success) {
          setRelatedProducts(
            relatedRes.data.products.filter(p => p._id !== id)
          );
        }

        // Set default size if available
        if (productRes.data.product.variants?.length > 0) {
          setSelectedSize(productRes.data.product.variants[0]);
        }
      }

      if (reviewsRes.success) {
        setReviews(reviewsRes.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product details',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkEligibleOrder = async () => {
    try {
      const ordersResponse = await apiService.getOrders();
      if (ordersResponse.success) {
        setUserOrders(ordersResponse.data.orders);
        
        // Find an order that contains this product and is delivered
        const deliveredOrders = ordersResponse.data.orders.filter(
          order => order.orderStatus === 'delivered'
        );
        
        const eligible = deliveredOrders.find(order => 
          order.items.some(item => item.product?._id === id || item.product === id)
        );
        
        setEligibleOrder(eligible);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product.isAvailable || product.quantity === 0) {
      toast({
        title: 'Out of Stock',
        description: 'This product is currently unavailable',
        variant: 'destructive'
      });
      return;
    }

    const productToAdd = {
      ...product,
      ...(selectedSize && { selectedSize })
    };

    addToCart(productToAdd, quantity);
    toast({
      title: 'Added to Cart',
      description: `${quantity} × ${product.name} added to cart`,
    });
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(id);
      toast({
        title: 'Removed from Wishlist',
        description: 'Product removed from wishlist',
      });
    } else {
      addToWishlist(product);
      toast({
        title: 'Added to Wishlist',
        description: 'Product added to wishlist',
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Dairy Mart`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'Product link copied to clipboard',
      });
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increment') {
      setQuantity(prev => Math.min(prev + 1, product.quantity));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewData.rating) {
      toast({
        title: 'Rating Required',
        description: 'Please select a rating',
        variant: 'destructive'
      });
      return;
    }

    if (!reviewData.comment.trim()) {
      toast({
        title: 'Comment Required',
        description: 'Please write your review',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSubmittingReview(true);
      
      if (!eligibleOrder) {
        toast({
          title: 'Order Required',
          description: 'You need to have purchased and received this product first',
          variant: 'destructive'
        });
        return;
      }

      const response = await apiService.createReview({
        product: id,
        order: eligibleOrder._id,
        rating: reviewData.rating,
        title: reviewData.title.trim(),
        comment: reviewData.comment.trim()
      });
      
      if (response.success) {
        toast({
          title: 'Review Submitted',
          description: 'Thank you for your feedback!',
        });
        
        // Reset form
        setReviewData({
          rating: 0,
          title: '',
          comment: ''
        });
        setShowReviewForm(false);
        
        // Refresh reviews
        fetchProductDetails();
      } else {
        throw new Error(response.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review',
        variant: 'destructive'
      });
    } finally {
      setSubmittingReview(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading premium dairy details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-lg">
            <span className="text-6xl">🥛</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Dairy Not Found</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            The premium dairy product you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            asChild
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg"
          >
            <Link to="/products">
              Browse Premium Dairy
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-600 mb-8">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="font-medium text-gray-900">{product.name}</span>
          </div>
        </div>
      </motion.div>

      {/* Product Details */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <div className="space-y-6">
              {/* Main Image */}
              <div 
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer shadow-xl"
                onClick={() => setShowImageModal(true)}
              >
                {product.images?.[activeImage]?.url ? (
                  <img
src={`https://dairydrop.onrender.com${product.images[0].url}`}
                    alt={product.images[activeImage].alt || product.name}
                    className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-[500px] flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-8xl opacity-20">🥛</span>
                      <p className="text-gray-500 mt-4">Premium Dairy Image</p>
                    </div>
                  </div>
                )}
                
                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                  <div className="p-3 rounded-full bg-white/90 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
                    <Eye className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all duration-300 ${
                        activeImage === index 
                          ? 'border-blue-500 shadow-lg scale-105' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
           

            {/* Title */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600">{product.brand}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating?.average || 0)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
                <span className="ml-2 font-bold text-gray-900">
                  {product.rating?.average?.toFixed(1) || '0.0'}
                </span>
              </div>
              <span className="text-gray-500">({product.rating?.count || 0} reviews)</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">SKU: {product._id.slice(-8).toUpperCase()}</span>
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-blue-600">₨{product.price}</span>
                <span className="text-gray-500">per {product.unit}</span>
                {product.quantity > 0 && (
                  <span className="ml-auto text-green-600 font-medium flex items-center">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    In Stock
                  </span>
                )}
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-2xl hover:border-blue-200 transition-all">
                <div className="p-3 rounded-xl bg-blue-50">
                  <TruckIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Today Delivery</p>
                  <p className="text-sm text-gray-500">Order by 12 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-2xl hover:border-blue-200 transition-all">
                <div className="p-3 rounded-xl bg-green-50">
                  <ShieldIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">100% Hygienic</p>
                  <p className="text-sm text-gray-500">Premium Quality</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-2xl hover:border-blue-200 transition-all">
                <div className="p-3 rounded-xl bg-amber-50">
                  <ClockIcon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Fresh for {product.shelfLife} Days</p>
                  <p className="text-sm text-gray-500">Shelf Life</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-2xl hover:border-blue-200 transition-all">
                <div className="p-3 rounded-xl bg-purple-50">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Temperature Controlled</p>
                  <p className="text-sm text-gray-500">Chilled Delivery</p>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Quantity</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange('decrement')}
                      disabled={quantity <= 1}
                      className="h-10 w-10 hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange('increment')}
                      disabled={quantity >= product.quantity}
                      className="h-10 w-10 hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.quantity} available
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable || product.quantity === 0}
                  className="h-14 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                >
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  Add to Cart
                </Button>
                <div className="flex gap-2">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleWishlistToggle}
                    className="h-14 flex-1 border-2 border-gray-200 hover:border-gray-300"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleShare}
                    className="h-14 flex-1 border-2 border-gray-200 hover:border-gray-300"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Delivery Promise */}
            <div className="border-2 border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-blue-50">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delivery Promise</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Same Day Delivery</span>
                  <span className="font-medium text-gray-900">Order before 12 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Free Delivery</span>
                  <span className="font-medium text-green-600">Orders above ₨500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Storage</span>
                  <span className="font-medium text-gray-900">{product.storageInstructions}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 border-2 border-gray-200 rounded-2xl p-1 bg-white">
              <TabsTrigger 
                value="description" 
                className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Reviews ({reviews.length})
              </TabsTrigger>
              <TabsTrigger 
                value="nutrition" 
                className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Nutrition
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h3>
                  <div className="prose max-w-none">
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      {product.description}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Key Features</h4>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">Farm fresh and pasteurized</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">No preservatives or additives</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">Vacuum sealed for freshness</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Storage Instructions</h4>
                        <p className="text-gray-600">
                          {product.storageInstructions}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Average Rating */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-2xl p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-6 w-6 ${
                                i < Math.floor(product.rating?.average || 0)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-gray-300 text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-3xl font-bold text-gray-900">
                          {product.rating?.average?.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-gray-600">({product.rating?.count || 0} reviews)</span>
                      </div>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                      onClick={() => {
                        if (!user) {
                          toast({
                            title: 'Login Required',
                            description: 'Please login to write a review',
                            variant: 'destructive'
                          });
                          return;
                        }
                        
                        if (!eligibleOrder) {
                          toast({
                            title: 'Order Required',
                            description: 'You need to purchase and receive this product first',
                            variant: 'destructive'
                          });
                          return;
                        }
                        
                        setShowReviewForm(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Write a Review
                    </Button>
                  </div>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-2 border-blue-200 rounded-2xl p-6 bg-gradient-to-br from-white to-blue-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-semibold text-gray-900">Write Your Review</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowReviewForm(false)}
                        className="hover:bg-blue-100"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Rating *
                        </label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                              className="p-1 hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`h-10 w-10 transition-colors ${
                                  star <= reviewData.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-gray-200 text-gray-200'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-4 text-lg font-bold text-gray-900 self-center">
                            {reviewData.rating}.0
                          </span>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <div>
                        <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-900 mb-2">
                          Title (Optional)
                        </label>
                        <Input
                          id="reviewTitle"
                          value={reviewData.title}
                          onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Summarize your experience"
                          maxLength={100}
                        />
                      </div>
                      
                      {/* Comment */}
                      <div>
                        <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-900 mb-2">
                          Your Review *
                        </label>
                        <Textarea
                          id="reviewComment"
                          value={reviewData.comment}
                          onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                          placeholder="Share your experience with this product..."
                          rows={4}
                          maxLength={500}
                          required
                        />
                        <div className="text-right mt-1 text-sm text-gray-500">
                          {reviewData.comment.length}/500 characters
                        </div>
                      </div>
                      
                      {/* Order Info */}
                      {eligibleOrder && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                          <div className="flex items-center gap-2 text-sm text-green-800">
                            <CheckCircle className="h-4 w-4" />
                            <span>Reviewing based on your order #{eligibleOrder.orderNumber}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Buttons */}
                      <div className="flex justify-end gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowReviewForm(false)}
                          disabled={submittingReview}
                          className="border-2 border-gray-200 hover:border-gray-300"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={submittingReview || !eligibleOrder}
                          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                        >
                          {submittingReview ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Submit Review
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12 border-2 border-gray-200 rounded-2xl">
                      <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
                      <p className="text-gray-600 max-w-md mx-auto mb-6">
                        Be the first to share your experience with this premium dairy product.
                      </p>
                      {user && !eligibleOrder && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto mb-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div className="text-sm text-amber-800">
                              <p className="font-medium mb-1">Order Required</p>
                              <p>Purchase and receive this product to write a review.</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        className="border-2 border-gray-200"
                        onClick={() => {
                          if (!user) {
                            toast({
                              title: 'Login Required',
                              description: 'Please login to write a review',
                              variant: 'destructive'
                            });
                          } else if (!eligibleOrder) {
                            toast({
                              title: 'Order Required',
                              description: 'You need to purchase and receive this product first',
                              variant: 'destructive'
                            });
                          } else {
                            setShowReviewForm(true);
                          }
                        }}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Share Feedback
                      </Button>
                    </div>
                  ) : (
                    reviews.map((review, index) => (
                      <motion.div
                        key={review._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'fill-gray-200 text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.title && (
                          <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                        )}
                        <p className="text-gray-600">{review.comment}</p>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="nutrition" className="mt-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Nutritional Information</h3>
                  
                  {product.nutritionalFacts ? (
                    <div className="space-y-8">
                      {/* Main Nutritional Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Object.entries(product.nutritionalFacts).map(([key, value]) => (
                          <div 
                            key={key} 
                            className="text-center p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-200 transition-all"
                          >
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-3xl font-bold text-blue-600">{value}</p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Additional Info */}
                      <div className="pt-8 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4">Why This Matters</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-green-50">
                                <Leaf className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Natural Goodness</p>
                                <p className="text-sm text-gray-600">Packed with essential nutrients</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-blue-50">
                                <Droplets className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Pure & Fresh</p>
                                <p className="text-sm text-gray-600">No additives or preservatives</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-amber-50">
                                <UtensilsCrossed className="h-4 w-4 text-amber-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Perfect Balance</p>
                                <p className="text-sm text-gray-600">Optimal nutritional profile</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-purple-50">
                                <Shield className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Quality Certified</p>
                                <p className="text-sm text-gray-600">Meets all quality standards</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Nutritional Info Coming Soon</h4>
                      <p className="text-gray-600 max-w-md mx-auto">
                        We're working on getting detailed nutritional information for this premium dairy product.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <div className="inline-flex mb-2">
                  <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">
                    MORE PREMIUM DAIRY
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  You May Also Like
                </h2>
              </div>
              <Button 
                variant="outline" 
                asChild
                className="border-2 border-gray-200 hover:border-blue-600"
              >
                <Link to={`/products?category=${product.category}`} className="flex items-center">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ProductGrid products={relatedProducts} loading={false} />
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && product.images?.[activeImage]?.url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setShowImageModal(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={`https://dairydrop.onrender.com${product.images[activeImage].url}`}
              alt={product.images[activeImage].alt || product.name}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;