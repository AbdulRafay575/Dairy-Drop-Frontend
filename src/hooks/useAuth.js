import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Custom hook to access authentication context
 * @returns {Object} Auth context values
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

/**
 * Hook to check authentication status
 * @returns {Object} Authentication state
 */
export const useAuthStatus = () => {
  const { user, loading, isAuthenticated } = useAuth();
  
  return {
    user,
    loading,
    isAuthenticated,
    isAdmin: user?.role === 'admin'
  };
};

/**
 * Hook for authentication actions
 * @returns {Object} Authentication actions
 */
export const useAuthActions = () => {
  const { login, register, logout, updateProfile } = useAuth();
  
  return {
    login,
    register,
    logout,
    updateProfile
  };
};

/**
 * Hook for user profile
 * @returns {Object} Profile data and actions
 */
export const useProfile = () => {
  const { user, updateProfile, addAddress, updateAddress, deleteAddress } = useAuth();
  
  return {
    profile: user,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    addresses: user?.addresses || [],
    defaultAddress: user?.addresses?.find(addr => addr.isDefault) || null
  };
};

/**
 * Hook to check if user can access admin routes
 * @returns {Object} Admin access check
 */
export const useAdminAccess = () => {
  const { user, loading } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  const canAccess = !loading && isAdmin;
  
  return {
    isAdmin,
    canAccess,
    loading
  };
};

/**
 * Hook for authentication guards
 * @param {Object} options - Guard options
 * @returns {Object} Guard functions
 */
export const useAuthGuard = (options = {}) => {
  const { redirectTo = '/login', requireAdmin = false } = options;
  const { isAuthenticated, loading, user } = useAuth();
  
  const checkAccess = () => {
    if (loading) return { allowed: false, reason: 'loading' };
    
    if (!isAuthenticated) {
      return { allowed: false, reason: 'unauthenticated', redirectTo };
    }
    
    if (requireAdmin && user?.role !== 'admin') {
      return { allowed: false, reason: 'unauthorized', redirectTo: '/' };
    }
    
    return { allowed: true };
  };
  
  return {
    checkAccess,
    isAuthenticated,
    isLoading: loading,
    isAdmin: user?.role === 'admin'
  };
};