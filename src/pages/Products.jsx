import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Grid3x3, List, Search, Star, ShoppingCart, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProductGrid from '@/components/products/ProductGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { apiService } from '@/services/api';

// Import the ProductFilters component from the correct path
import ProductFilters from '../components/products/ProductFilters';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });
  
  const initialFilters = {
    category: searchParams.get('category')?.split(',') || [],
    brand: searchParams.get('brand')?.split(',') || [],
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    minFat: searchParams.get('minFat') ? Number(searchParams.get('minFat')) : undefined,
    maxFat: searchParams.get('maxFat') ? Number(searchParams.get('maxFat')) : undefined,
    color: searchParams.get('color')?.split(',') || [],
    inStock: searchParams.get('inStock') === 'true' ? true : undefined,
    sameDayDelivery: searchParams.get('sameDayDelivery') === 'true' ? true : undefined,
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || 'newest',
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  const fetchInitialData = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        apiService.getCategories(),
        apiService.getBrands()
      ]);

      if (categoriesRes.success) setCategories(categoriesRes.data.categories || []);
      if (brandsRes.success) setBrands(brandsRes.data.brands || []);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Clean up filters to remove undefined values
      const cleanFilters = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (Array.isArray(value) && value.length > 0) {
            cleanFilters[key] = value;
          } else if (!Array.isArray(value)) {
            cleanFilters[key] = value;
          }
        }
      });

      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...cleanFilters
      };

      // Convert arrays to strings for query params
      if (queryParams.category && Array.isArray(queryParams.category)) {
        queryParams.category = queryParams.category.join(',');
      }
      if (queryParams.brand && Array.isArray(queryParams.brand)) {
        queryParams.brand = queryParams.brand.join(',');
      }
      if (queryParams.color && Array.isArray(queryParams.color)) {
        queryParams.color = queryParams.color.join(',');
      }

      const response = await apiService.getProducts(queryParams);
      
      if (response.success) {
        setProducts(response.data.products || []);
        setPagination(response.data.pagination || {
          page: 1,
          limit: 12,
          total: 0,
          pages: 1
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','));
        } else if (!Array.isArray(value)) {
          params.set(key, value.toString());
        }
      }
    });
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchQuery || undefined }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: [],
      brand: [],
      color: [],
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      minFat: undefined,
      maxFat: undefined,
      inStock: undefined,
      sameDayDelivery: undefined,
      search: undefined,
      sort: 'newest',
    });
    setSearchQuery('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (value) => {
    setFilters(prev => ({ ...prev, sort: value }));
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const activeFilterCount = Object.keys(filters).filter(
    key => filters[key] !== undefined && 
           filters[key] !== '' && 
           !(Array.isArray(filters[key]) && filters[key].length === 0)
  ).length;

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Discovering premium dairy...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex mb-4">
              <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">
                PREMIUM DAIRY COLLECTION
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="block text-gray-900">Farm-Fresh</span>
              <span className="block text-blue-600">Dairy Selection</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Handpicked dairy products from trusted farms. Experience purity in every drop.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        {/* Search and Controls */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for milk, cheese, yogurt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-blue-600 rounded-2xl shadow-sm"
            />
            <Button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 bg-blue-600 hover:bg-blue-700"
            >
              Search
            </Button>
          </form>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-3">
              <span className="text-gray-600">
                {pagination.total} premium products
              </span>
              {activeFilterCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full font-medium">
                    {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleResetFilters}
                    className="h-7 px-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={`h-9 w-9 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={`h-9 w-9 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort Dropdown */}
              <Select value={filters.sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[200px] border-2 border-gray-200 rounded-xl h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="featured">Featured First</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filters Button */}
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden border-2 border-gray-200 h-12 rounded-xl">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="ml-2 bg-blue-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:w-[400px] p-0">
                  <SheetHeader className="border-b border-gray-200 p-6">
                    <SheetTitle className="text-xl">Filter Products</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-120px)]">
                    <ProductFilters
                      categories={categories}
                      brands={brands}
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onReset={handleResetFilters}
                    />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block lg:w-1/4"
          >
            <div className="sticky top-24">
              <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleResetFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
                <ProductFilters
                  categories={categories}
                  brands={brands}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </div>
            </div>
          </motion.div>

          {/* Products Area */}
          <div className="lg:w-3/4">
            <AnimatePresence mode="wait">
              {!loading && products.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Search className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">No products found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We couldn't find dairy products matching your criteria. Try adjusting your filters.
                  </p>
                  <Button 
                    onClick={handleResetFilters}
                    className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
                  >
                    Clear All Filters
                  </Button>
                </motion.div>
              ) : viewMode === 'grid' ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductGrid
                    products={products}
                    loading={loading}
                    hasMore={pagination.page < pagination.pages}
                    onLoadMore={handleLoadMore}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductListView products={products} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductListView = ({ products }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-center gap-8">
            {/* Product Image */}
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
              {product.images?.[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl">🥛</span>
                </div>
              )}
              {product.color && (
                <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full border-2 border-white shadow-sm" 
                     style={{ backgroundColor: product.color }} />
              )}
            </div>
            
            {/* Product Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    {product.brand && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {product.brand}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">₹{product.price}</p>
                  <p className="text-xs text-gray-500">per {product.unit}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                {product.rating?.average && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-500 fill-current mr-1" />
                    <span className="font-medium">{product.rating.average.toFixed(1)}</span>
                    <span className="text-gray-500 ml-1">({product.rating.count || 0})</span>
                  </div>
                )}
                {product.nutritionalFacts?.fatContent && (
                  <div className="text-gray-600">
                    <span className="font-medium">{product.nutritionalFacts.fatContent}g</span> fat
                  </div>
                )}
                <div className="text-gray-600">
                  Shelf: <span className="font-medium">{product.shelfLife} days</span>
                </div>
                <div className={`font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                onClick={() => addToCart(product)}
                disabled={!product.isAvailable || product.quantity === 0}
                className="bg-blue-600 hover:bg-blue-700 h-11 min-w-[140px]"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                className="border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 h-11"
              >
                <Link to={`/product/${product._id}`} className="flex items-center justify-center">
                  View Details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Products;