import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';

/**
 * Hook for fetching and managing products
 * @param {Object} initialFilters - Initial filter options
 * @returns {Object} Products state and methods
 */
export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });

  /**
   * Fetch products with current filters
   */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      const response = await apiService.getProducts(queryParams);
      
      if (response.success) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  /**
   * Update filters and reset to page 1
   * @param {Object} newFilters - New filter values
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  /**
   * Reset all filters to initial state
   */
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [initialFilters]);

  /**
   * Load more products (pagination)
   */
  const loadMore = useCallback(() => {
    if (pagination.page < pagination.pages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination.page, pagination.pages]);

  /**
   * Search products by query
   * @param {string} query - Search query
   */
  const searchProducts = useCallback((query) => {
    updateFilters({ search: query });
  }, [updateFilters]);

  /**
   * Sort products
   * @param {string} sortBy - Sort field
   */
  const sortProducts = useCallback((sortBy) => {
    updateFilters({ sort: sortBy });
  }, [updateFilters]);

  // Fetch products when filters or pagination changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    // State
    products,
    loading,
    error,
    filters,
    pagination,
    
    // Methods
    fetchProducts,
    updateFilters,
    resetFilters,
    loadMore,
    searchProducts,
    sortProducts,
    
    // Computed values
    hasMore: pagination.page < pagination.pages,
    isEmpty: !loading && products.length === 0,
    totalProducts: pagination.total
  };
};

/**
 * Hook for fetching product by ID
 * @param {string} productId - Product ID
 * @returns {Object} Product state and methods
 */
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  /**
   * Fetch product details
   */
  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [productRes, reviewsRes] = await Promise.all([
        apiService.getProduct(productId),
        apiService.getProductReviews(productId)
      ]);
      
      if (productRes.success) {
        setProduct(productRes.data.product);
        
        // Fetch related products
        const relatedRes = await apiService.getProducts({
          category: productRes.data.product.category,
          limit: 4
        });
        
        if (relatedRes.success) {
          setRelatedProducts(
            relatedRes.data.products.filter(p => p._id !== productId)
          );
        }
      } else {
        setError(productRes.message || 'Product not found');
      }
      
      if (reviewsRes.success) {
        setReviews(reviewsRes.data.reviews);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  /**
   * Add review to product
   * @param {Object} reviewData - Review data
   */
  const addReview = useCallback(async (reviewData) => {
    try {
      const response = await apiService.createReview({
        ...reviewData,
        product: productId
      });
      
      if (response.success) {
        // Refresh reviews
        const reviewsRes = await apiService.getProductReviews(productId);
        if (reviewsRes.success) {
          setReviews(reviewsRes.data.reviews);
        }
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error('Error adding review:', err);
      return { success: false, error: err.message };
    }
  }, [productId]);

  // Fetch product when ID changes
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    // State
    product,
    loading,
    error,
    reviews,
    relatedProducts,
    
    // Methods
    fetchProduct,
    addReview,
    
    // Computed values
    averageRating: product?.rating?.average || 0,
    reviewCount: product?.rating?.count || reviews.length,
    isAvailable: product?.isAvailable && product?.quantity > 0
  };
};

/**
 * Hook for fetching categories
 * @returns {Object} Categories state
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getCategories();
      
      if (response.success) {
        setCategories(response.data.categories);
      } else {
        setError(response.message || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories
  };
};

/**
 * Hook for fetching brands
 * @returns {Object} Brands state
 */
export const useBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getBrands();
      
      if (response.success) {
        setBrands(response.data.brands);
      } else {
        setError(response.message || 'Failed to fetch brands');
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError(err.message || 'Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return {
    brands,
    loading,
    error,
    fetchBrands
  };
};

/**
 * Hook for product actions (add to cart, wishlist)
 * @param {Object} product - Product object
 * @returns {Object} Product actions
 */
export const useProductActions = (product) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  
  const isWishlisted = isInWishlist(product?._id);
  
  const handleAddToCart = (quantity = 1) => {
    if (!product || !product.isAvailable || product.quantity === 0) {
      return { success: false, message: 'Product is not available' };
    }
    
    addToCart(product, quantity);
    return { success: true, message: 'Added to cart' };
  };
  
  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id);
      return { success: true, message: 'Removed from wishlist' };
    } else {
      addToWishlist(product);
      return { success: true, message: 'Added to wishlist' };
    }
  };
  
  return {
    handleAddToCart,
    handleToggleWishlist,
    isWishlisted,
    canAddToCart: product?.isAvailable && product?.quantity > 0
  };
};