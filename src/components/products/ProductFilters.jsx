import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, X, Sparkles, DollarSign, Star, Clock, Droplets, Beef, Package, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const ProductFilters = ({ categories = [], brands = [], filters, onApply, onReset }) => {
  const [temp, setTemp] = useState(filters);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  useEffect(() => {
    setTemp(filters);
  }, [filters]);

  // Calculate active filters
  useEffect(() => {
    const count = Object.entries(filters).reduce((acc, [key, value]) => {
      if (key === 'search' && value) return acc + 1;
      if (Array.isArray(value) && value.length > 0) return acc + value.length;
      if (typeof value === 'string' && value && key !== 'sort') return acc + 1;
      if (typeof value === 'number' && value) return acc + 1;
      if (typeof value === 'boolean' && value) return acc + 1;
      return acc;
    }, 0);
    setActiveFilterCount(count);
  }, [filters]);

  const update = (key, value) => {
    setTemp(prev => ({ ...prev, [key]: value }));
  };

  const toggleArray = (key, value) => {
    const arr = temp[key] || [];
    update(
      key,
      arr.includes(value)
        ? arr.filter(v => v !== value)
        : [...arr, value]
    );
  };

  const clearFilter = (key, value = null) => {
    if (value === null) {
      update(key, Array.isArray(filters[key]) ? [] : '');
    } else if (Array.isArray(filters[key])) {
      update(key, filters[key].filter(v => v !== value));
    }
  };

  const applyFilters = () => {
    onApply({
      ...temp,
      minPrice: temp.minPrice ? Number(temp.minPrice) : '',
      maxPrice: temp.maxPrice ? Number(temp.maxPrice) : '',
      minRating: temp.minRating ? Number(temp.minRating) : '',
      minShelfLife: temp.minShelfLife ? Number(temp.minShelfLife) : '',
      maxShelfLife: temp.maxShelfLife ? Number(temp.maxShelfLife) : '',
      minFat: temp.minFat ? Number(temp.minFat) : '',
      maxFat: temp.maxFat ? Number(temp.maxFat) : '',
      minProtein: temp.minProtein ? Number(temp.minProtein) : '',
      maxProtein: temp.maxProtein ? Number(temp.maxProtein) : '',
    });
  };

  // Filter categories/brands based on search
  const filteredCategories = categories.filter(c => 
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredBrands = brands.filter(b => 
    b.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            
            
          </div>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        
      </div>

      {/* Quick Clear Section */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Active filters</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-xs h-7 px-2 hover:bg-white/50"
              >
                Clear all
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.category?.map(cat => (
                <Badge key={cat} variant="outline" className="gap-1 text-xs">
                  {cat}
                  <button onClick={() => clearFilter('category', cat)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {filters.minPrice && (
                <Badge variant="outline" className="gap-1 text-xs">
                  Min ${filters.minPrice}
                  <button onClick={() => clearFilter('minPrice')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.minRating && (
                <Badge variant="outline" className="gap-1 text-xs">
                  {filters.minRating}★ & above
                  <button onClick={() => clearFilter('minRating')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-8">
          {/* PRICE */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-gradient-to-br from-emerald-50 to-green-50">
<DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-sm text-gray-900">Price Range</h4>
              </div>
              <span className="text-xs text-gray-500">$</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="minPrice" className="text-xs text-gray-500 mb-1 block font-medium">Min</Label>
                <Input
                  id="minPrice"
                  placeholder="0"
                  value={temp.minPrice || ''}
                  onChange={(e) => update('minPrice', e.target.value)}
                  className="h-10 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="maxPrice" className="text-xs text-gray-500 mb-1 block font-medium">Max</Label>
                <Input
                  id="maxPrice"
                  placeholder="10,000"
                  value={temp.maxPrice || ''}
                  onChange={(e) => update('maxPrice', e.target.value)}
                  className="h-10 border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* RATING */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-gradient-to-br from-amber-50 to-orange-50">
                <Star className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900">Minimum Rating</h4>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2].map(r => (
                <div key={r} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200 group">
                  <Checkbox
                    id={`rating-${r}`}
                    checked={temp.minRating === r}
                    onCheckedChange={() =>
                      update('minRating', temp.minRating === r ? '' : r)
                    }
                    className="data-[state=checked]:bg-blue-600 border-gray-400 group-hover:border-blue-400"
                  />
                  <Label 
                    htmlFor={`rating-${r}`} 
                    className="flex items-center gap-3 cursor-pointer flex-1 group"
                  >
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < r 
                              ? 'text-amber-500 fill-amber-500' 
                              : 'text-gray-300'
                          }`}
                          fill={i < r ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm font-medium group-hover:text-gray-900">
                      & above
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SHELF LIFE */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-gradient-to-br from-purple-50 to-violet-50">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900">Shelf Life (days)</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="minShelfLife" className="text-xs text-gray-500 mb-1 block font-medium">Min</Label>
                <Input
                  id="minShelfLife"
                  placeholder="0"
                  value={temp.minShelfLife || ''}
                  onChange={(e) => update('minShelfLife', e.target.value)}
                  className="h-10 border-gray-300 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="maxShelfLife" className="text-xs text-gray-500 mb-1 block font-medium">Max</Label>
                <Input
                  id="maxShelfLife"
                  placeholder="365"
                  value={temp.maxShelfLife || ''}
                  onChange={(e) => update('maxShelfLife', e.target.value)}
                  className="h-10 border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* NUTRITION */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.3 }}
            className="space-y-4 p-3 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-gradient-to-br from-rose-50 to-pink-50">
                <Beef className="w-4 h-4 text-rose-600" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900">Nutrition (per 100g)</h4>
            </div>
            
            {/* FAT */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-gray-700 flex items-center gap-2">
                  <Droplets className="w-3 h-3" />
                  Fat (g)
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Min"
                  value={temp.minFat || ''}
                  onChange={(e) => update('minFat', e.target.value)}
                  className="h-9 text-sm border-gray-300 focus:border-blue-500"
                />
                <Input
                  placeholder="Max"
                  value={temp.maxFat || ''}
                  onChange={(e) => update('maxFat', e.target.value)}
                  className="h-9 text-sm border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>

            {/* PROTEIN */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-gray-700 flex items-center gap-2">
                  <Package className="w-3 h-3" />
                  Protein (g)
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Min"
                  value={temp.minProtein || ''}
                  onChange={(e) => update('minProtein', e.target.value)}
                  className="h-9 text-sm border-gray-300 focus:border-blue-500"
                />
                <Input
                  placeholder="Max"
                  value={temp.maxProtein || ''}
                  onChange={(e) => update('maxProtein', e.target.value)}
                  className="h-9 text-sm border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* CATEGORIES */}
          {categories.length > 0 && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-gradient-to-br from-blue-50 to-cyan-50">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900">Categories</h4>
                </div>
                {filteredCategories.length > 0 && (
                  <span className="text-xs text-gray-500 font-medium">{filteredCategories.length}</span>
                )}
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map(c => (
                    <div key={c} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                      <Checkbox
                        id={`cat-${c}`}
                        checked={temp.category?.includes(c)}
                        onCheckedChange={() => toggleArray('category', c)}
                        className="border-gray-400"
                      />
                      <Label 
                        htmlFor={`cat-${c}`}
                        className="capitalize cursor-pointer flex-1 text-sm hover:text-gray-900 transition-colors"
                      >
                        {c.replace('-', ' ')}
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-3">
                    <p className="text-sm text-gray-500 italic">No categories found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* BRANDS */}
          {brands.length > 0 && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-gradient-to-br from-indigo-50 to-violet-50">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900">Brands</h4>
                </div>
                {filteredBrands.length > 0 && (
                  <span className="text-xs text-gray-500 font-medium">{filteredBrands.length}</span>
                )}
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {filteredBrands.length > 0 ? (
                  filteredBrands.map(b => (
                    <div key={b} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                      <Checkbox
                        id={`brand-${b}`}
                        checked={temp.brand?.includes(b)}
                        onCheckedChange={() => toggleArray('brand', b)}
                        className="border-gray-400"
                      />
                      <Label 
                        htmlFor={`brand-${b}`}
                        className="cursor-pointer flex-1 text-sm hover:text-gray-900 transition-colors"
                      >
                        {b}
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-3">
                    <p className="text-sm text-gray-500 italic">No brands found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* AVAILABILITY */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-gradient-to-br from-green-50 to-emerald-50">
                <Truck className="w-4 h-4 text-green-600" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900">Availability</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                <Checkbox
                  id="inStock"
                  checked={temp.inStock === true}
                  onCheckedChange={(v) => update('inStock', v ? true : false)}
                  className="border-gray-400"
                />
                <Label htmlFor="inStock" className="cursor-pointer flex-1 text-sm">
                  In Stock Only
                </Label>
              </div>
              <div className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                <Checkbox
                  id="sameDayDelivery"
                  checked={temp.sameDayDelivery === true}
                  onCheckedChange={(v) => update('sameDayDelivery', v ? true : false)}
                  className="border-gray-400"
                />
                <Label htmlFor="sameDayDelivery" className="cursor-pointer flex-1 text-sm">
                  Same Day Delivery
                </Label>
              </div>
            </div>
          </motion.div>
        </div>
      </ScrollArea>

      {/* ACTIONS */}
      <div className="pt-6 border-t mt-6 space-y-3">
        <Button 
          onClick={applyFilters} 
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all duration-300"
        >
          Apply Filters
          <Filter className="ml-2 w-4 h-4" />
        </Button>
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="w-full h-11 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all duration-300"
        >
          Reset All
          <X className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;