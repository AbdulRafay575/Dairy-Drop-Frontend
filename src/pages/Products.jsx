import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ChevronRight, ShoppingCart, Star, X, Loader2, Sparkles, ArrowRight, Clock, Award, Heart, Truck, Shield, Coffee, Droplets, Leaf, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductGrid from '@/components/products/ProductGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { apiService } from '@/services/api';
import ProductFilters from '../components/products/ProductFilters';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInView } from 'framer-motion';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const didInit = useRef(false);

  const [allProducts, setAllProducts] = useState([]); // Store all products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products to display
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });

  const [filters, setFilters] = useState({
    category: [],
    brand: [],
    color: [],
    minPrice: '',
    maxPrice: '',
    minRating: '',
    minFat: '',
    maxFat: '',
    inStock: false,
    sameDayDelivery: false,
    search: '',
    sort: 'newest'
  });

  const [searchQuery, setSearchQuery] = useState('');
  
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const isStatsInView = useInView(statsRef, { once: true });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  /* ------------------ INITIAL LOAD ------------------ */
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      try {
        const [catRes, brandRes] = await Promise.all([
          apiService.getCategories(),
          apiService.getBrands()
        ]);
        if (catRes.success) setCategories(catRes.data.categories || []);
        if (brandRes.success) setBrands(brandRes.data.brands || []);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };
    loadInitial();
  }, []);

  /* ------------------ FETCH ALL PRODUCTS ------------------ */
  useEffect(() => {
    fetchAllProducts();
  }, []); // Only fetch once

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const res = await apiService.getProducts({
        page: 1,
        limit: 100 // Get more products to filter locally
      });

      if (res.success) {
        setAllProducts(res.data.products || []);
        setFilteredProducts(res.data.products || []);
        setPagination({
          page: 1,
          limit: 12,
          total: res.data.products?.length || 0,
          pages: Math.ceil((res.data.products?.length || 0) / 12)
        });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ APPLY FILTERS LOCALLY ------------------ */
  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(product => 
        filters.category.includes(product.category)
      );
    }

    // Brand filter
    if (filters.brand && filters.brand.length > 0) {
      filtered = filtered.filter(product => 
        filters.brand.includes(product.brand)
      );
    }

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter(product => 
        product.price >= Number(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => 
        product.price <= Number(filters.maxPrice)
      );
    }

    // Rating filter - FIXED
    if (filters.minRating) {
      filtered = filtered.filter(product => {
        // Get the actual average rating, default to 0 if no reviews
        const productRating = product.rating?.average || 0;
        return productRating >= Number(filters.minRating);
      });
    }

    // In Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => 
        product.isAvailable === true && product.quantity > 0
      );
    }

    // Sort products
    switch (filters.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => {
          const ratingA = a.rating?.average || 0;
          const ratingB = b.rating?.average || 0;
          return ratingB - ratingA;
        });
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Default sorting (newest)
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Update filtered products and pagination
    setFilteredProducts(filtered);
    setPagination(prev => ({
      ...prev,
      page: 1,
      total: filtered.length,
      pages: Math.ceil(filtered.length / prev.limit)
    }));
  }, [filters, allProducts]);

  /* ------------------ URL SYNC ------------------ */
  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      return;
    }

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v && !(Array.isArray(v) && v.length === 0)) {
        params.set(k, Array.isArray(v) ? v.join(',') : v);
      }
    });
    params.set('page', pagination.page);
    setSearchParams(params, { replace: true });
  }, [filters, pagination.page]);

  /* ------------------ HANDLERS ------------------ */
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchQuery }));
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      category: [],
      brand: [],
      color: [],
      minPrice: '',
      maxPrice: '',
      minRating: '',
      minFat: '',
      maxFat: '',
      inStock: false,
      sameDayDelivery: false,
      search: '',
      sort: 'newest'
    });
    setSearchParams({}, { replace: true });
  };

  const handleSortChange = (value) => {
    setFilters(prev => ({ ...prev, sort: value }));
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilters(prev => ({ ...prev, search: '' }));
  };

  // Count active filters
  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'search' && value) return count + 1;
    if (Array.isArray(value) && value.length > 0) return count + 1;
    if (typeof value === 'string' && value && key !== 'sort') return count + 1;
    if (typeof value === 'number' && value) return count + 1;
    if (typeof value === 'boolean' && value) return count + 1;
    return count;
  }, 0);

  // Get paginated products
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Stats data
  const stats = [
    { number: '1000+', label: 'Fresh Products', icon: <Leaf className="h-5 w-5" />, color: 'from-emerald-500 to-green-500' },
    { number: '50+', label: 'Local Farms', icon: <Users className="h-5 w-5" />, color: 'from-amber-500 to-orange-500' },
    { number: '24/7', label: 'Delivery Support', icon: <Truck className="h-5 w-5" />, color: 'from-blue-500 to-cyan-500' },
    { number: '4.9★', label: 'Customer Rating', icon: <Star className="h-5 w-5" />, color: 'from-purple-500 to-violet-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* CINEMATIC HERO SECTION */}
      <section 
        ref={heroRef}
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.7)),
            url('https://images.unsplash.com/photo-1550583722-459e5b2c0376?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80&blur=20')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container relative mx-auto px-4 py-1">
          <motion.div
            initial="hidden"
            animate={isHeroInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-5xl mx-auto text-center"
          >
            

            <motion.div variants={fadeInUp} className="space-y-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
                <span className="block text-white">
                  Pure Dairy
                </span>
                <span className="block bg-gradient-to-r from-cyan-400 via-white to-blue-400 bg-clip-text text-transparent mt-4">
                  Perfectly Curated
                </span>
              </h1>
              
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="mt-12"
            >
              <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
                <div className="flex gap-2 bg-white/10 backdrop-blur-lg rounded-2xl p-2 shadow-2xl border border-white/20">
                  <div className="flex-1 flex items-center">
                    <Search className="ml-4 w-5 h-5 text-gray-300" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search milk, cheese, yogurt, butter, paneer..."
                      className="border-0 bg-transparent focus-visible:ring-0 text-white placeholder:text-gray-300 h-14 pl-3 text-lg"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="p-2 hover:bg-white/10 rounded-full mr-2 transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-300" />
                      </button>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="rounded-xl px-8 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Search
                  </Button>
                </div>
              </form>
            </motion.div>

          </motion.div>
        </div>

      </section>


      {/* CONTENT */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* MOBILE FILTER TOGGLE */}
          <div className="lg:hidden flex items-center justify-between gap-4">
            <Button
              onClick={() => setIsFilterOpen(true)}
              variant="outline"
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            
            <Select value={filters.sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* FILTERS SIDEBAR */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="fixed inset-0 z-50 lg:hidden"
              >
                <div 
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b z-10">
                    <div className="flex items-center justify-between p-4">
                      <h2 className="text-xl font-semibold">Filters</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <ProductFilters
                      categories={categories}
                      brands={brands}
                      filters={filters}
                      onApply={handleFilterApply}
                      onReset={handleResetFilters}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DESKTOP FILTERS */}
          <div className="hidden lg:block w-1/4">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <ProductFilters
                categories={categories}
                brands={brands}
                filters={filters}
                onApply={handleFilterApply}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="w-full lg:w-3/4">
            {/* HEADER */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Fresh Dairy Collection
                </h2>
                <p className="text-gray-600 mt-1">
                  Showing {paginatedProducts.length} of {filteredProducts.length} products
                  {filters.search && (
                    <span className="ml-2">
                      for "<span className="font-medium">{filters.search}</span>"
                    </span>
                  )}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Select value={filters.sort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Top Rated</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* ACTIVE FILTERS BADGES */}
            {activeFilterCount > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex flex-wrap gap-2"
              >
                {filters.search && (
                  <Badge variant="secondary" className="gap-2">
                    Search: {filters.search}
                    <button onClick={() => setFilters(prev => ({ ...prev, search: '' }))}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.category?.map(cat => (
                  <Badge key={cat} variant="secondary" className="gap-2">
                    {cat}
                    <button onClick={() => setFilters(prev => ({
                      ...prev,
                      category: prev.category.filter(c => c !== cat)
                    }))}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {filters.minPrice && (
                  <Badge variant="secondary" className="gap-2">
                    Min: ₨{filters.minPrice}
                    <button onClick={() => setFilters(prev => ({ ...prev, minPrice: '' }))}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.minRating && (
                  <Badge variant="secondary" className="gap-2">
                    Rating: {filters.minRating}★+
                    <button onClick={() => setFilters(prev => ({ ...prev, minRating: '' }))}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {activeFilterCount > 3 && (
                  <Badge variant="outline">
                    +{activeFilterCount - 3} more
                  </Badge>
                )}
              </motion.div>
            )}

            {/* PRODUCTS */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center py-20"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </motion.div>
              ) : paginatedProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 bg-white rounded-xl border"
                >
                  <div className="max-w-md mx-auto">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search or filter criteria
                    </p>
                    <Button
                      onClick={handleResetFilters}
                      variant="outline"
                    >
                      Clear all filters
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductGrid
                    products={paginatedProducts}
                    loading={false} // We're not loading more in this approach
                    hasMore={pagination.page < pagination.pages}
                    onLoadMore={() =>
                      setPagination(p => ({ ...p, page: p.page + 1 }))
                    }
                  />
                  
                  {/* PAGINATION */}
                  {pagination.pages > 1 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-10 flex items-center justify-center gap-2"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                        disabled={pagination.page === 1}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={pagination.page === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPagination(p => ({ ...p, page: pageNum }))}
                              className="w-10"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        {pagination.pages > 5 && (
                          <>
                            <span className="px-2">...</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPagination(p => ({ ...p, page: pagination.pages }))}
                            >
                              {pagination.pages}
                            </Button>
                          </>
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                        disabled={pagination.page >= pagination.pages}
                      >
                        Next
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-500/10 to-green-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
            >
              Can't Find What You Need?
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            >
              We source special dairy products on request. Tell us what you're looking for!
            </motion.p>
            
            <motion.div variants={fadeInUp}>
              <Button 
                size="lg" 
                asChild
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/30"
              >
                <Link to="/contact">
                  <Coffee className="mr-2 h-5 w-5" />
                  Request Special Product
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Products;