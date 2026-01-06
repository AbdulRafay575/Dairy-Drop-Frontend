const API_BASE = 'https://dairydrop.onrender.com';
// const API_BASE = 'http://localhost:5000';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('access_token');
        this.API_BASE = API_BASE;
    }

    async request(endpoint, options = {}) {
        const url = `${this.API_BASE}${endpoint}`;
        
        console.log(`Making API request to: ${url}`);
        console.log(`Token available: ${!!this.token}`);
        
        const config = {
            headers: {
                ...options.headers,
            },
            ...options,
        };

        // Add Authorization header if token exists and not skipping auth
        if (this.token && !options.skipAuth) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Don't set Content-Type for FormData - let the browser set it
        if (options.body instanceof FormData) {
            delete config.headers['Content-Type'];
        } else if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }

        try {
            const response = await fetch(url, config);
            
            const contentType = response.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                throw new Error(data.message || data.detail || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('access_token', token);
        } else {
            localStorage.removeItem('access_token');
        }
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('access_token');
    }


    
  // ✅ Payment methods
  async createPaymentIntent(orderId) {
        try {
            console.log(`Creating payment intent for order: ${orderId}`);
            const response = await this.request(`/api/orders/${orderId}/pay`, {
                method: 'POST',
            });
            console.log('Payment intent response:', response);
            return response;
        } catch (error) {
            console.error('Payment intent creation error:', error);
            throw error;
        }
    }


    
  async getPaymentStatus(orderId) {
    return this.request(`/api/orders/${orderId}/payment-status`);
  }

  async confirmPayment(orderId, paymentMethodId) {
    return this.request(`/api/orders/${orderId}/confirm-payment`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethodId }),
    });
  }



    
    // ✅ Auth endpoints for Dairy Mart
    async register(name, email, phone, password, role = 'user') {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, phone, password, role }),
            skipAuth: true,
        });
    }

    async login(email, password) {
        const response = await this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            skipAuth: true,
        });
        
        if (response.data?.token) {
            this.setToken(response.data.token);
        }
        return response;
    }

    async logout() {
        try {
            await this.request('/api/auth/logout', {
                method: 'POST',
            });
        } catch (error) {
            // ignore backend error
        } finally {
            this.clearToken();
            localStorage.removeItem('cart');
        }
    }


    
    async getProfile() {
        return this.request('/api/auth/me');
    }

    async updateProfile(data) {
        return this.request('/api/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // ✅ User addresses
    async addAddress(addressData) {
        return this.request('/api/users/address', {
            method: 'POST',
            body: JSON.stringify(addressData),
        });
    }

    async updateAddress(addressId, addressData) {
        return this.request(`/api/users/address/${addressId}`, {
            method: 'PUT',
            body: JSON.stringify(addressData),
        });
    }

    async deleteAddress(addressId) {
        return this.request(`/api/users/address/${addressId}`, {
            method: 'DELETE',
        });
    }

    // ✅ Product endpoints
    async getProducts(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `/api/products?${queryParams}` : '/api/products';
        return this.request(endpoint);
    }

    async getProduct(id) {
        return this.request(`/api/products/${id}`);
    }

    async getCategories() {
        return this.request('/api/products/categories');
    }

    async getBrands() {
        return this.request('/api/products/brands');
    }

    // ✅ Cart & Order endpoints
    async createOrder(orderData) {
        return this.request('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    async getOrders() {
        return this.request('/api/orders/user/my-orders');
    }

    async getOrder(orderId) {
        return this.request(`/api/orders/${orderId}`);
    }

    async cancelOrder(orderId, reason) {
        return this.request(`/api/orders/${orderId}/cancel`, {
            method: 'PUT',
            body: JSON.stringify({ reason }),
        });
    }
// ✅ Review endpoints (add these to your existing apiService)
async createReview(reviewData) {
  return this.request('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}

async getProductReviews(productId) {
  return this.request(`/api/reviews/product/${productId}`);
}

// ADD THIS METHOD - Get all reviews for admin
async getAllReviews() {
  return this.request('/api/reviews');
}

async updateReviewApproval(reviewId, updates) {
  return this.request(`/api/reviews/${reviewId}/approval`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

async deleteReview(reviewId) {
  return this.request(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });
}

async markReviewHelpful(reviewId) {
  return this.request(`/api/reviews/${reviewId}/helpful`, {
    method: 'PUT',
  });
}

    // ✅ Admin endpoints
    async createProduct(productData, images) {
        const formData = new FormData();
        
        // Add product data
        Object.keys(productData).forEach(key => {
            if (key === 'nutritionalFacts') {
                formData.append(key, JSON.stringify(productData[key]));
            } else if (key === 'tags') {
                formData.append(key, productData[key].join(','));
            } else {
                formData.append(key, productData[key]);
            }
        });
        
        // Add images
        images.forEach((image, index) => {
            formData.append('images', image);
        });

        return this.request('/api/products', {
            method: 'POST',
            body: formData,
        });
    }

async updateProduct(id, productData, images = [], imagesToDelete = []) {
  const formData = new FormData();
  
  // Add product data
  Object.keys(productData).forEach(key => {
    if (key === 'nutritionalFacts') {
      formData.append(key, JSON.stringify(productData[key]));
    } else if (key === 'tags') {
      formData.append(key, productData[key].join(','));
    } else {
      formData.append(key, productData[key]);
    }
  });
  
  // Add images to delete
  if (imagesToDelete.length > 0) {
    formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
  }
  
  // Add new images
  images.forEach((image, index) => {
    formData.append('images', image);
  });

  return this.request(`/api/products/${id}`, {
    method: 'PUT',
    body: formData,
  });
}  
// ✅ Delete user (Admin only)
async deleteUser(userId) {
  return this.request(`/api/users/${userId}`, {
    method: 'DELETE',
  });
}

    async deleteProduct(id) {
        return this.request(`/api/products/${id}`, {
            method: 'DELETE',
        });
    }

    async getAllOrders() {
        return this.request('/api/orders');
    }

    async updateOrderStatus(orderId, status, cancellationReason = '') {
        return this.request(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ 
                orderStatus: status,
                cancellationReason 
            }),
        });
    }

    async getAllUsers() {
        return this.request('/api/users');
    }

    // ✅ Health check
    async healthCheck() {
        return this.request('/api/health', { skipAuth: true });
    }

    isAuthenticated() {
        return !!this.token;
    }
}

export const apiService = new ApiService();