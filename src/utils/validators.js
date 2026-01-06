/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate phone number (Pakistan format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const validatePhone = (phone) => {
  const re = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  return re.test(phone);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  if (password.length > 50) {
    return { isValid: false, message: 'Password must be less than 50 characters' };
  }
  
  return { isValid: true, message: 'Password is valid' };
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {Object} Validation result
 */
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: 'Name is required' };
  }
  
  if (name.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }
  
  if (name.length > 50) {
    return { isValid: false, message: 'Name must be less than 50 characters' };
  }
  
  return { isValid: true, message: 'Name is valid' };
};

/**
 * Validate address fields
 * @param {Object} address - Address object
 * @returns {Object} Validation result
 */
export const validateAddress = (address) => {
  const errors = {};
  
  if (!address.street?.trim()) {
    errors.street = 'Street address is required';
  }
  
  if (!address.city?.trim()) {
    errors.city = 'City is required';
  }
  
  if (!address.state?.trim()) {
    errors.state = 'State is required';
  }
  
  if (!address.zipCode?.trim()) {
    errors.zipCode = 'ZIP code is required';
  } else if (!/^\d{6}$/.test(address.zipCode)) {
    errors.zipCode = 'ZIP code must be 6 digits';
  }
  
  if (!address.country?.trim()) {
    errors.country = 'Country is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    message: Object.keys(errors).length === 0 ? 'Address is valid' : 'Please fix the errors'
  };
};

/**
 * Validate product data
 * @param {Object} product - Product data
 * @returns {Object} Validation result
 */
export const validateProduct = (product) => {
  const errors = {};
  
  if (!product.name?.trim()) {
    errors.name = 'Product name is required';
  } else if (product.name.length > 100) {
    errors.name = 'Product name must be less than 100 characters';
  }
  
  if (!product.description?.trim()) {
    errors.description = 'Description is required';
  } else if (product.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }
  
  if (!product.price || product.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }
  
  if (!product.category) {
    errors.category = 'Category is required';
  }
  
  if (!product.brand?.trim()) {
    errors.brand = 'Brand is required';
  }
  
  if (!product.shelfLife || product.shelfLife <= 0) {
    errors.shelfLife = 'Shelf life must be greater than 0';
  }
  
  if (!product.quantity || product.quantity < 0) {
    errors.quantity = 'Quantity must be 0 or greater';
  }
  
  if (!product.unit) {
    errors.unit = 'Unit is required';
  }
  
  // Validate nutritional facts if provided
  if (product.nutritionalFacts) {
    const nutrition = product.nutritionalFacts;
    
    if (nutrition.fatContent && nutrition.fatContent < 0) {
      errors.fatContent = 'Fat content cannot be negative';
    }
    
    if (nutrition.proteinContent && nutrition.proteinContent < 0) {
      errors.proteinContent = 'Protein content cannot be negative';
    }
    
    if (nutrition.calories && nutrition.calories < 0) {
      errors.calories = 'Calories cannot be negative';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    message: Object.keys(errors).length === 0 ? 'Product data is valid' : 'Please fix the errors'
  };
};

/**
 * Validate review data
 * @param {Object} review - Review data
 * @returns {Object} Validation result
 */
export const validateReview = (review) => {
  const errors = {};
  
  if (!review.rating || review.rating < 1 || review.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5';
  }
  
  if (!review.comment?.trim()) {
    errors.comment = 'Review comment is required';
  } else if (review.comment.length > 500) {
    errors.comment = 'Comment must be less than 500 characters';
  }
  
  if (review.title && review.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    message: Object.keys(errors).length === 0 ? 'Review is valid' : 'Please fix the errors'
  };
};

/**
 * Validate order data
 * @param {Object} order - Order data
 * @returns {Object} Validation result
 */
export const validateOrder = (order) => {
  const errors = {};
  
  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    errors.items = 'Order must have at least one item';
  } else {
    order.items.forEach((item, index) => {
      if (!item.product) {
        errors[`items[${index}].product`] = 'Product is required';
      }
      if (!item.quantity || item.quantity < 1) {
        errors[`items[${index}].quantity`] = 'Quantity must be at least 1';
      }
    });
  }
  
  if (!order.deliveryAddress) {
    errors.deliveryAddress = 'Delivery address is required';
  } else {
    const addressValidation = validateAddress(order.deliveryAddress);
    if (!addressValidation.isValid) {
      Object.keys(addressValidation.errors).forEach(key => {
        errors[`deliveryAddress.${key}`] = addressValidation.errors[key];
      });
    }
  }
  
  if (!order.contactNumber) {
    errors.contactNumber = 'Contact number is required';
  } else if (!validatePhone(order.contactNumber)) {
    errors.contactNumber = 'Invalid phone number';
  }
  
  if (!order.deliveryDate) {
    errors.deliveryDate = 'Delivery date is required';
  } else {
    const deliveryDate = new Date(order.deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deliveryDate < today) {
      errors.deliveryDate = 'Delivery date cannot be in the past';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    message: Object.keys(errors).length === 0 ? 'Order is valid' : 'Please fix the errors'
  };
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;
  const errors = {};
  
  if (!file) {
    errors.file = 'File is required';
    return { isValid: false, errors, message: 'No file selected' };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.type = `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
  }
  
  // Check file size
  if (file.size > maxSize) {
    errors.size = `File size must be less than ${maxSize / (1024 * 1024)}MB`;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    message: Object.keys(errors).length === 0 ? 'File is valid' : 'Please fix the errors'
  };
};

/**
 * Validate quantity for cart
 * @param {number} quantity - Quantity to validate
 * @param {number} availableQuantity - Available stock
 * @returns {Object} Validation result
 */
export const validateQuantity = (quantity, availableQuantity) => {
  if (!quantity || quantity < 1) {
    return { isValid: false, message: 'Quantity must be at least 1' };
  }
  
  if (quantity > availableQuantity) {
    return { 
      isValid: false, 
      message: `Only ${availableQuantity} items available in stock` 
    };
  }
  
  return { isValid: true, message: 'Quantity is valid' };
};