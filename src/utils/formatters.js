/**
 * Format currency in Indian Rupees
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale string
 * @returns {string} Formatted date
 */
export const formatDate = (date, locale = 'en-IN') => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Format time for delivery
 * @param {string} timeSlot - Time slot value
 * @returns {string} Formatted time string
 */
export const formatDeliveryTime = (timeSlot) => {
  const times = {
    morning: '7 AM - 10 AM',
    afternoon: '12 PM - 3 PM',
    evening: '5 PM - 8 PM',
  };
  return times[timeSlot] || 'Flexible';
};

/**
 * Format order status for display
 * @param {string} status - Order status
 * @returns {string} Formatted status
 */
export const formatOrderStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    packed: 'Packed',
    'out-for-delivery': 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return statusMap[status] || status;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Format phone number for display
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Pakistan phone numbers
  if (cleaned.length === 10) {
    return `+92 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
  } else if (cleaned.length > 10) {
    return `+${cleaned.substring(0, cleaned.length - 10)} ${cleaned.substring(cleaned.length - 10, cleaned.length - 5)} ${cleaned.substring(cleaned.length - 5)}`;
  }
  
  return phone;
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate order number display
 * @param {string} orderNumber - Order number
 * @returns {string} Formatted order number
 */
export const formatOrderNumber = (orderNumber) => {
  if (!orderNumber) return '';
  return `#${orderNumber}`;
};

/**
 * Format nutritional value
 * @param {number} value - Nutritional value
 * @param {string} unit - Unit of measurement
 * @returns {string} Formatted nutritional value
 */
export const formatNutritionalValue = (value, unit = 'g') => {
  if (value === undefined || value === null) return 'N/A';
  return `${value}${unit}`;
};

/**
 * Format shelf life
 * @param {number} days - Shelf life in days
 * @returns {string} Formatted shelf life
 */
export const formatShelfLife = (days) => {
  if (!days) return 'N/A';
  
  if (days === 1) return '1 day';
  if (days <= 7) return `${days} days`;
  if (days <= 30) return `${Math.floor(days / 7)} weeks`;
  
  return `${Math.floor(days / 30)} months`;
};