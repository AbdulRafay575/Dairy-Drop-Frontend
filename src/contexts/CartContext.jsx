import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('dairy_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('dairy_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dairy_cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dairy_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product._id === product._id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product._id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Wishlist functions
  const addToWishlist = (product) => {
    setWishlist(prev => {
      if (!prev.find(item => item._id === product._id)) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item._id !== productId));
  };
  const getUniqueProductCount = () => {
  return cart.length;
};


  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  const moveToCart = (productId) => {
    const product = wishlist.find(item => item._id === productId);
    if (product) {
      addToCart(product);
      removeFromWishlist(productId);
    }
  };

  const value = {
    cart,
    wishlist,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    getUniqueProductCount, // product-based (new)
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    moveToCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};