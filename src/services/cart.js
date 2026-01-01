class CartService {
  constructor() {
    this.storageKey = 'dairy_cart';
    this.cart = this.loadCart();
  }

  /**
   * Load cart from localStorage
   * @returns {Array} Cart items
   */
  loadCart() {
    try {
      const cartData = localStorage.getItem(this.storageKey);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  }

  /**
   * Save cart to localStorage
   */
  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  /**
   * Get all cart items
   * @returns {Array} Cart items
   */
  getCart() {
    return this.cart;
  }

  /**
   * Add item to cart
   * @param {Object} product - Product to add
   * @param {number} quantity - Quantity to add
   * @returns {Object} Updated cart
   */
  addToCart(product, quantity = 1) {
    if (!product || !product._id) {
      throw new Error('Invalid product');
    }

    const existingItem = this.cart.find(item => item.product._id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images,
          brand: product.brand,
          unit: product.unit,
          quantity: product.quantity,
          isAvailable: product.isAvailable,
          shelfLife: product.shelfLife
        },
        quantity: quantity
      });
    }

    this.saveCart();
    return this.cart;
  }

  /**
   * Remove item from cart
   * @param {string} productId - Product ID to remove
   * @returns {Object} Updated cart
   */
  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.product._id !== productId);
    this.saveCart();
    return this.cart;
  }

  /**
   * Update item quantity
   * @param {string} productId - Product ID
   * @param {number} quantity - New quantity
   * @returns {Object} Updated cart
   */
  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }

    const item = this.cart.find(item => item.product._id === productId);
    
    if (item) {
      item.quantity = quantity;
      this.saveCart();
    }

    return this.cart;
  }

  /**
   * Clear cart
   * @returns {Object} Empty cart
   */
  clearCart() {
    this.cart = [];
    this.saveCart();
    return this.cart;
  }

  /**
   * Get cart total amount
   * @returns {number} Total amount
   */
  getCartTotal() {
    return this.cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  /**
   * Get cart item count
   * @returns {number} Total item count
   */
  getCartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Get cart summary
   * @returns {Object} Cart summary
   */
  getCartSummary() {
    const subtotal = this.getCartTotal();
    const deliveryCharge = subtotal > 500 ? 0 : 50;
    const total = subtotal + deliveryCharge;
    const itemCount = this.getCartCount();

    return {
      items: this.cart.length,
      itemCount,
      subtotal,
      deliveryCharge,
      total,
      freeDeliveryThreshold: 500,
      amountToFreeDelivery: Math.max(0, 500 - subtotal)
    };
  }

  /**
   * Check if product is in cart
   * @param {string} productId - Product ID
   * @returns {boolean} True if in cart
   */
  isInCart(productId) {
    return this.cart.some(item => item.product._id === productId);
  }

  /**
   * Get cart item by product ID
   * @param {string} productId - Product ID
   * @returns {Object|null} Cart item
   */
  getCartItem(productId) {
    return this.cart.find(item => item.product._id === productId) || null;
  }

  /**
   * Validate cart items availability
   * @returns {Object} Validation result
   */
  validateCart() {
    const errors = [];
    const warnings = [];

    this.cart.forEach((item, index) => {
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
      message: errors.length === 0 ? 'Cart is valid' : 'Some items have issues'
    };
  }

  /**
   * Prepare cart for checkout
   * @returns {Array} Checkout-ready cart items
   */
  prepareForCheckout() {
    return this.cart.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
      name: item.product.name,
      image: item.product.images?.[0]?.url || ''
    }));
  }

  /**
   * Merge cart with server cart
   * @param {Array} serverCart - Cart from server
   * @returns {Object} Merged cart
   */
  mergeWithServerCart(serverCart) {
    if (!serverCart || !Array.isArray(serverCart)) {
      return this.cart;
    }

    // Create a map of server cart items
    const serverCartMap = new Map();
    serverCart.forEach(item => {
      if (item.product && item.product._id) {
        serverCartMap.set(item.product._id, item);
      }
    });

    // Merge with local cart
    this.cart.forEach(localItem => {
      const serverItem = serverCartMap.get(localItem.product._id);
      
      if (serverItem) {
        // Take the higher quantity
        localItem.quantity = Math.max(localItem.quantity, serverItem.quantity);
        serverCartMap.delete(localItem.product._id);
      }
    });

    // Add remaining server items
    serverCartMap.forEach(item => {
      this.cart.push(item);
    });

    this.saveCart();
    return this.cart;
  }

  /**
   * Calculate estimated delivery date
   * @returns {Date} Estimated delivery date
   */
  getEstimatedDeliveryDate() {
    const now = new Date();
    const cutoffHour = 12; // 12 PM cutoff for same-day delivery
    
    if (now.getHours() < cutoffHour) {
      // Same day delivery
      return new Date(now.setDate(now.getDate()));
    } else {
      // Next day delivery
      return new Date(now.setDate(now.getDate() + 1));
    }
  }
}

export const cartService = new CartService();