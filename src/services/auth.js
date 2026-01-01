
import { apiService } from './api';

class AuthService {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Login response
   */
  async login(email, password) {
    try {
      const response = await apiService.login(email, password);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Registration response
   */
  async register(userData) {
    try {
      const { name, email, phone, password } = userData;
      const response = await apiService.register(name, email, phone, password);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   * @returns {Promise} Logout response
   */
  async logout() {
    try {
      await apiService.logout();
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   * @returns {Promise} User profile
   */
  async getProfile() {
    try {
      const response = await apiService.getProfile();
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Update response
   */
  async updateProfile(profileData) {
    try {
      const response = await apiService.updateProfile(profileData);
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Add new address
   * @param {Object} addressData - Address data
   * @returns {Promise} Add address response
   */
  async addAddress(addressData) {
    try {
      const response = await apiService.addAddress(addressData);
      return response;
    } catch (error) {
      console.error('Add address error:', error);
      throw error;
    }
  }

  /**
   * Update address
   * @param {string} addressId - Address ID
   * @param {Object} addressData - Address data
   * @returns {Promise} Update address response
   */
  async updateAddress(addressId, addressData) {
    try {
      const response = await apiService.updateAddress(addressId, addressData);
      return response;
    } catch (error) {
      console.error('Update address error:', error);
      throw error;
    }
  }

  /**
   * Delete address
   * @param {string} addressId - Address ID
   * @returns {Promise} Delete address response
   */
  async deleteAddress(addressId) {
    try {
      const response = await apiService.deleteAddress(addressId);
      return response;
    } catch (error) {
      console.error('Delete address error:', error);
      throw error;
    }
  }

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Change password response
   */
  async changePassword(currentPassword, newPassword) {
    try {
      // Note: This endpoint needs to be implemented in backend
      const response = await apiService.request('/api/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} Reset request response
   */
  async requestPasswordReset(email) {
    try {
      const response = await apiService.request('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        skipAuth: true,
      });
      return response;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise} Reset password response
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.request('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
        skipAuth: true,
      });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * Verify reset token
   * @param {string} token - Reset token
   * @returns {Promise} Token verification response
   */
  async verifyResetToken(token) {
    try {
      const response = await apiService.request(`/api/auth/verify-reset-token?token=${token}`, {
        method: 'GET',
        skipAuth: true,
      });
      return response;
    } catch (error) {
      console.error('Verify token error:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return apiService.isAuthenticated();
  }

  /**
   * Check if user is admin
   * @returns {Promise<boolean>} Admin status
   */
  async isAdmin() {
    try {
      if (!this.isAuthenticated()) return false;
      
      const profile = await this.getProfile();
      return profile?.data?.user?.role === 'admin';
    } catch (error) {
      console.error('Check admin error:', error);
      return false;
    }
  }

  /**
   * Refresh access token
   * @returns {Promise} Refresh token response
   */
  async refreshToken() {
    try {
      const response = await apiService.request('/api/auth/refresh', {
        method: 'POST',
        skipAuth: true,
      });
      
      if (response.data?.token) {
        apiService.setToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  /**
   * Get user token
   * @returns {string|null} User token
   */
  getToken() {
    return apiService.token;
  }

  /**
   * Clear authentication data
   */
  clearAuth() {
    apiService.clearToken();
  }
}

export const authService = new AuthService();