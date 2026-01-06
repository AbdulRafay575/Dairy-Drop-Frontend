import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield,
  Clock,
  Leaf,
  Package,
  ChevronRight,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Users,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const { toast } = useToast();

  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = () => {
    if (product.quantity === 0) {
      toast({
        title: 'Out of Stock',
        description: 'This product is currently unavailable',
        variant: 'destructive'
      });
      return;
    }

    addToCart(product, quantity);
    toast({
      title: 'Added to Cart',
      description: `${quantity} × ${product.name} added to your cart`,
    });
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id);
      toast({
        title: 'Removed from Wishlist',
        description: 'Product removed from wishlist',
      });
    } else {
      addToWishlist(product);
      toast({
        title: 'Added to Wishlist',
        description: 'Product saved to wishlist',
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
        console.error('Error sharing:', error);
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

  const getCategoryColor = (category) => {
    const colors = {
      milk: 'bg-blue-100 text-blue-800',
      yogurt: 'bg-green-100 text-green-800',
      cheese: 'bg-yellow-100 text-yellow-800',
      butter: 'bg-orange-100 text-orange-800',
      cream: 'bg-purple-100 text-purple-800',
      'ice-cream': 'bg-pink-100 text-pink-800',
      ghee: 'bg-amber-100 text-amber-800',
      paneer: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatNutritionalValue = (key, value) => {
    const units = {
      fatContent: 'g',
      proteinContent: 'g',
      carbohydrateContent: 'g',
      calories: 'kcal',
      calcium: 'mg'
    };
    
    return `${value}${units[key] || ''}`;
  };

  const renderNutritionalFacts = () => {
    if (!product.nutritionalFacts) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {Object.entries(product.nutritionalFacts)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => (
            <div key={key} className="text-center p-3 border rounded-lg bg-white">
              <p className="text-sm text-muted-foreground capitalize mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-lg font-bold text-primary">
                {formatNutritionalValue(key, value)}
              </p>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link 
          to={`/products?category=${product.category}`}
          className="hover:text-primary transition-colors capitalize"
        >
          {product.category.replace('-', ' ')}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="font-medium text-foreground truncate">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="rounded-xl overflow-hidden bg-white border mb-4 aspect-square relative">
            {product.images?.[selectedImage]?.url ? (
              <img
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].alt || product.name}
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl mb-4">🥛</span>
                  <p className="text-muted-foreground">No image available</p>
                </div>
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {!product.isAvailable && (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
              {product.rating?.average >= 4.5 && (
                <Badge className="bg-yellow-500">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {product.rating.average.toFixed(1)}
                </Badge>
              )}
              {product.quantity < 10 && product.quantity > 0 && (
                <Badge variant="secondary" className="bg-amber-500">
                  Low Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  } hover:border-primary/50 transition-colors`}
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

          {/* Product Highlights */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 border rounded-lg">
              <Truck className="h-5 w-5 mx-auto text-primary mb-2" />
              <p className="text-xs font-medium">Same Day Delivery</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <Shield className="h-5 w-5 mx-auto text-primary mb-2" />
              <p className="text-xs font-medium">100% Hygienic</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <Clock className="h-5 w-5 mx-auto text-primary mb-2" />
              <p className="text-xs font-medium">{product.shelfLife} Days Fresh</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <Leaf className="h-5 w-5 mx-auto text-primary mb-2" />
              <p className="text-xs font-medium">Farm Fresh</p>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <Badge className={`mb-3 capitalize ${getCategoryColor(product.category)}`}>
              {product.category.replace('-', ' ')}
            </Badge>
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{product.brand}</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating?.average || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({product.rating?.count || 0} reviews)
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                SKU: {product._id.slice(-8).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl font-bold text-primary">₨{product.price}</span>
              <span className="text-sm text-muted-foreground">per {product.unit}</span>
            </div>
            
            {product.quantity > 0 ? (
              <p className="text-green-600 text-sm flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                {product.quantity} units available
              </p>
            ) : (
              <p className="text-red-600 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Currently out of stock
              </p>
            )}
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-primary" />
              <span>Packing: Vacuum Sealed</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>Best Before: {product.shelfLife} days</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Fat: {product.nutritionalFacts?.fatContent || 'N/A'}g</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span>Protein: {product.nutritionalFacts?.proteinContent || 'N/A'}g</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <p className="font-medium mb-3">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange('decrement')}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange('increment')}
                  disabled={quantity >= product.quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {product.quantity} units available
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <Button
              size="lg"
              className="sm:col-span-2"
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              {isWishlisted ? 'Saved' : 'Wishlist'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleShare}
              className="sm:col-span-3"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share Product
            </Button>
          </div>

          {/* Delivery Info */}
          <div className="border rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Delivery Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-muted-foreground">Same Day Delivery</span>
                <span className="font-medium">Order before 12 PM</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Free Delivery</span>
                <span className="font-medium">On orders above ₨500</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-medium">{product.storageInstructions}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition Facts</TabsTrigger>
            <TabsTrigger value="usage">Usage & Storage</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.rating?.count || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p className="text-lg mb-6">{product.description}</p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-lg mb-4">Key Features</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Fresh from local dairy farms</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>No preservatives or additives</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Pasteurized for safety</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Vacuum sealed for freshness</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-4">Benefits</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Zap className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Rich in essential nutrients</span>
                    </li>
                    <li className="flex items-center">
                      <Shield className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Supports bone health</span>
                    </li>
                    <li className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Great source of protein</span>
                    </li>
                    <li className="flex items-center">
                      <Leaf className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Natural and wholesome</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="mt-6">
            <div className="space-y-8">
              {/* Nutritional Facts */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Nutritional Information</h4>
                <p className="text-muted-foreground mb-6">Per 100g/ml serving</p>
                {renderNutritionalFacts()}
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg mb-4">Product Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="usage" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-4">Storage Instructions</h4>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-primary" />
                      <span className="font-medium">Storage</span>
                    </div>
                    <p className="text-muted-foreground">{product.storageInstructions}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-medium">Shelf Life</span>
                    </div>
                    <p className="text-muted-foreground">{product.shelfLife} days from delivery date</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-4">Usage Suggestions</h4>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Best For</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Direct consumption</li>
                      <li>• Cooking and baking</li>
                      <li>• Making desserts</li>
                      <li>• Breakfast cereals</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Serving Temperature</h5>
                    <p className="text-sm text-muted-foreground">Serve chilled at 4°C for best taste</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="text-xl font-semibold mb-2">Customer Reviews</h4>
              <p className="text-muted-foreground mb-6">
                Be the first to review this product!
              </p>
              <Button>Write a Review</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <Separator className="mb-8" />
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold">You May Also Like</h3>
            <p className="text-muted-foreground">Similar dairy products you might enjoy</p>
          </div>
          <Button variant="outline" asChild>
            <Link to={`/products?category=${product.category}`}>
              View All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {/* Related products grid would go here */}
      </div>
    </div>
  );
};

export default ProductDetail;