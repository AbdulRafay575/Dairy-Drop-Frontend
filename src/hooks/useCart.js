import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext';

/**
 * Custom hook to access cart context
 * @returns {Object} Cart context values
 */
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

/**
 * Hook for cart actions
 * @returns {Object} Cart actions
 */
export const useCartActions = () => {
  const { 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    addToWishlist,
    removeFromWishlist,
    moveToCart
  } = useCart();
  
  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    moveToCart
  };
};

/**
 * Hook for cart state
 * @returns {Object} Cart state
 */
export const useCartState = () => {
  const { cart, wishlist } = useCart();
  
  return {
    cart,
    wishlist,
    cartCount: cart.reduce((count, item) => count + item.quantity, 0),
    wishlistCount: wishlist.length,
    cartItems: cart.length
  };
};

/**
 * Hook for cart calculations
 * @returns {Object} Cart calculations
 */
export const useCartCalculations = () => {
  const { cart } = useCart();
  
  const subtotal = cart.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
  
  const deliveryCharge = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryCharge;
  const amountToFreeDelivery = Math.max(0, 500 - subtotal);
  
  return {
    subtotal,
    deliveryCharge,
    total,
    amountToFreeDelivery,
    isFreeDelivery: deliveryCharge === 0,
    itemCount: cart.reduce((count, item) => count + item.quantity, 0)
  };
};

/**
 * Hook for cart validation
 * @returns {Object} Cart validation
 */
export const useCartValidation = () => {
  const { cart } = useCart();
  
  const validateCart = () => {
    const errors = [];
    const warnings = [];
    
    cart.forEach((item, index) => {
      if (!item.product.isAvailable) {
        errors.push({
          index,
          productId: item.product._id,
          productName: item.product.name,
          message: 'Product is no longer available'
        });
      } else if (item.quantity > item.product.quantity) {
        errors.push({
          index,
          productId: item.product._id,
          productName: item.product.name,
          message: `Only ${item.product.quantity} items available in stock`
        });
      } else if (item.product.quantity < 5) {
        warnings.push({
          index,
          productId: item.product._id,
          productName: item.product.name,
          message: `Low stock: Only ${item.product.quantity} items left`
        });
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      hasErrors: errors.length > 0,
      hasWarnings: warnings.length > 0
    };
  };
  
  return {
    validateCart,
    ...validateCart()
  };
};

/**
 * Hook for cart item operations
 * @param {string} productId - Product ID
 * @returns {Object} Cart item operations
 */
export const useCartItem = (productId) => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  
  const item = cart.find(item => item.product._id === productId);
  const isInCart = !!item;
  const quantity = item?.quantity || 0;
  
  const handleIncrement = () => {
    if (item && item.product.quantity > quantity) {
      updateQuantity(productId, quantity + 1);
    }
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(productId, quantity - 1);
    } else {
      removeFromCart(productId);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(productId);
  };
  
  const handleSetQuantity = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= item.product.quantity) {
      updateQuantity(productId, newQuantity);
    }
  };
  
  return {
    item,
    isInCart,
    quantity,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleSetQuantity,
    maxQuantity: item?.product.quantity || 0,
    isAvailable: item?.product.isAvailable || false
  };
};

/**
 * Hook for wishlist operations
 * @param {string} productId - Product ID
 * @returns {Object} Wishlist operations
 */
export const useWishlistItem = (productId) => {
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist, moveToCart } = useCart();
  
  const isWishlisted = isInWishlist(productId);
  
  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      // Find product in cart or create minimal product object
      const product = wishlist.find(p => p._id === productId) || { _id: productId };
      addToWishlist(product);
    }
  };
  
  const handleMoveToCart = () => {
    moveToCart(productId);
  };
  
  return {
    isWishlisted,
    handleToggleWishlist,
    handleMoveToCart
  };
};