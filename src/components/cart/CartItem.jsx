import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity, addToWishlist } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (type) => {
    const newQuantity = type === 'increment' ? item.quantity + 1 : item.quantity - 1;
    
    if (newQuantity < 1) {
      removeFromCart(item.product._id);
      toast({
        title: 'Removed',
        description: `${item.product.name} removed from cart`,
      });
    } else if (newQuantity > item.product.quantity) {
      toast({
        title: 'Stock Limit',
        description: `Only ${item.product.quantity} units available`,
        variant: 'destructive'
      });
    } else {
      updateQuantity(item.product._id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.product._id);
    toast({
      title: 'Removed',
      description: `${item.product.name} removed from cart`,
    });
  };

  const handleMoveToWishlist = () => {
    addToWishlist(item.product);
    removeFromCart(item.product._id);
    toast({
      title: 'Moved to Wishlist',
      description: `${item.product.name} moved to wishlist`,
    });
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <Link to={`/product/${item.product._id}`} className="sm:w-24 sm:h-24 w-full h-48 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          {item.product.images?.[0]?.url ? (
            <img
              src={item.product.images[0].url}
              alt={item.product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">🥛</span>
            </div>
          )}
        </Link>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1">
              <Link 
                to={`/product/${item.product._id}`}
                className="font-semibold hover:text-primary transition-colors line-clamp-1"
              >
                {item.product.name}
              </Link>
              <p className="text-sm text-muted-foreground mb-2">{item.product.brand}</p>
              
              {/* Category & Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs capitalize">
                  {item.product.category.replace('-', ' ')}
                </Badge>
                {item.product.tags?.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>
                ))}
              </div>

              {/* Nutritional Info */}
              {item.product.nutritionalFacts?.fatContent && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span>Fat: {item.product.nutritionalFacts.fatContent}g</span>
                  {item.product.nutritionalFacts.proteinContent && (
                    <span>Protein: {item.product.nutritionalFacts.proteinContent}g</span>
                  )}
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{item.product.shelfLife} days</span>
                  </div>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-lg font-bold text-primary">₨{(item.product.price * item.quantity).toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">₨{item.product.price} × {item.quantity}</p>
            </div>
          </div>

          {/* Quantity Controls & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange('decrement')}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-10 text-center font-medium">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange('increment')}
                  disabled={item.quantity >= item.product.quantity}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Stock Status */}
              <div className="text-sm">
                <p className={item.product.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                  {item.product.quantity > 0 
                    ? `${item.product.quantity} available`
                    : 'Out of stock'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMoveToWishlist}
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Save for later</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Remove</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;