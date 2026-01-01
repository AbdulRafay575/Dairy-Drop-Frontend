import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const response = await apiService.getProfile();
          if (response.success) {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          apiService.clearToken();
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(
        userData.name,
        userData.email,
        userData.phone,
        userData.password
      );
      if (response.success) {
        // Auto login after registration
        const loginResponse = await apiService.login(userData.email, userData.password);
        if (loginResponse.success) {
          setUser(loginResponse.data.user);
          return { success: true };
        }
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await apiService.logout();
    setUser(null);
  };

  const updateProfile = async (data) => {
    try {
      const response = await apiService.updateProfile(data);
      if (response.success) {
        setUser(prev => ({ ...prev, ...response.data.user }));
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addAddress = async (addressData) => {
    try {
      const response = await apiService.addAddress(addressData);
      if (response.success) {
        setUser(prev => ({
          ...prev,
          addresses: response.data.addresses
        }));
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      const response = await apiService.updateAddress(addressId, addressData);
      if (response.success) {
        setUser(prev => ({
          ...prev,
          addresses: response.data.addresses
        }));
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const response = await apiService.deleteAddress(addressId);
      if (response.success) {
        setUser(prev => ({
          ...prev,
          addresses: response.data.addresses
        }));
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};