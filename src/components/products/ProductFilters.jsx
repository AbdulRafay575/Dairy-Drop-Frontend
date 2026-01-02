import React, { useState, useEffect } from 'react';
import { Filter, X, Star, Tag, Palette, Check, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

const ProductFilters = ({ categories = [], brands = [], filters, onFilterChange, onReset }) => {
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => setTempFilters(filters), [filters]);

  const colorOptions = [
    { value: 'white', label: 'White', bg: 'bg-white border' },
    { value: 'cream', label: 'Cream', bg: 'bg-amber-50' },
    { value: 'yellow', label: 'Yellow', bg: 'bg-amber-200' },
    { value: 'blue', label: 'Blue', bg: 'bg-blue-200' },
    { value: 'green', label: 'Green', bg: 'bg-emerald-200' },
  ];

  const handleTempChange = (key, value) => setTempFilters(prev => ({ ...prev, [key]: value }));

  const toggleArrayFilter = (key, value) => {
    const current = tempFilters[key] || [];
    const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    setTempFilters(prev => ({ ...prev, [key]: updated }));
  };

  const applyFilters = () => onFilterChange(tempFilters);

  const handleResetAll = () => {
    const resetFilters = { category: [], brand: [], color: [], minPrice: 0, maxPrice: 5000, minFat: 0, maxFat: 50, minRating: undefined, inStock: undefined, sameDayDelivery: undefined, sort: 'newest', search: undefined };
    setTempFilters(resetFilters);
    onReset();
  };

  const getActiveFilterCount = (filtersObj) =>
    Object.keys(filtersObj).filter(
      k => filtersObj[k] !== undefined && !(Array.isArray(filtersObj[k]) && filtersObj[k].length === 0)
    ).length;

  const activeFilterCount = getActiveFilterCount(tempFilters);

  const FilterSection = ({ title, icon: Icon, children }) => (
    <div className="space-y-4 pb-6 border-b border-gray-200 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50">
            <Icon className="h-4 w-4 text-blue-600" />
          </div>
        )}
        <h4 className="font-semibold text-sm text-gray-900 tracking-wide">{title}</h4>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6 max-h-[700px]">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Refine Results</h3>
              <p className="text-xs text-gray-500">Select your preferences</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleResetAll} className="text-gray-500 hover:text-gray-700 text-xs">
            <X className="h-3 w-3 mr-1" /> Clear All
          </Button>
        </div>

        {/* Active Filters Badge */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
            <span className="text-xs font-medium text-blue-700">
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} selected
            </span>
          </div>
        )}
      </div>

      <ScrollArea className="h-[550px] pr-4">
        <div className="space-y-6">
          {/* Price Range */}
          <FilterSection title="Minimum Price" icon={Tag}>
            <div className="space-y-4">
              <Slider
                value={[tempFilters.minPrice || 0, 5000]}
                max={5000}
                step={100}
                onValueChange={(value) => handleTempChange('minPrice', value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">₹{tempFilters.minPrice || 0}</div>
                  <div className="text-xs text-gray-500">Min</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">₹5000</div>
                  <div className="text-xs text-gray-500">Max</div>
                </div>
              </div>
            </div>
          </FilterSection>

          {/* Categories */}
          {categories.length > 0 && (
            <FilterSection title="Categories">
              <div className="space-y-2">
                {categories.map((cat) => (
                  <motion.div key={cat} whileHover={{ x: 4 }} className="flex items-center space-x-3">
                    <Checkbox
                      id={`cat-${cat}`}
                      checked={(tempFilters.category || []).includes(cat)}
                      onCheckedChange={() => toggleArrayFilter('category', cat)}
                      className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor={`cat-${cat}`} className="text-sm text-gray-700 cursor-pointer flex-1 capitalize hover:text-gray-900">
                      {cat.replace('-', ' ')}
                    </Label>
                  </motion.div>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Brands */}
          {brands.length > 0 && (
            <FilterSection title="Brands">
              <div className="space-y-2">
                {brands.slice(0, 6).map((b) => (
                  <motion.div key={b} whileHover={{ x: 4 }} className="flex items-center space-x-3">
                    <Checkbox
                      id={`brand-${b}`}
                      checked={(tempFilters.brand || []).includes(b)}
                      onCheckedChange={() => toggleArrayFilter('brand', b)}
                      className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor={`brand-${b}`} className="text-sm text-gray-700 cursor-pointer hover:text-gray-900">{b}</Label>
                  </motion.div>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Color */}
          <FilterSection title="Color" icon={Palette}>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((color) => {
                const selected = (tempFilters.color || []).includes(color.value);
                return (
                  <motion.button
                    key={color.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleArrayFilter('color', color.value)}
                    className={`relative w-10 h-10 rounded-full ${color.bg} border-2 ${
                      selected ? 'border-blue-600 shadow-lg shadow-blue-500/30' : 'border-gray-300'
                    } flex items-center justify-center transition-all group`}
                    title={color.label}
                  >
                    {selected && <Check className="h-4 w-4 text-blue-600" />}
                    <div className="absolute -bottom-6 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {color.label}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </FilterSection>

          {/* Minimum Fat */}
          <FilterSection title="Minimum Fat">
            <div className="space-y-4">
              <Slider
                value={[tempFilters.minFat || 0, 50]}
                max={50}
                step={0.5}
                onValueChange={(v) => handleTempChange('minFat', v[0])}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{tempFilters.minFat || 0}g</div>
                  <div className="text-xs text-gray-500">Min</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">50g</div>
                  <div className="text-xs text-gray-500">Max</div>
                </div>
              </div>
            </div>
          </FilterSection>

          {/* Ratings */}
          <FilterSection title="Minimum Rating" icon={Star}>
            <div className="space-y-2">
              {[5, 4, 3, 2].map((rating) => (
                <motion.div key={rating} whileHover={{ x: 4 }} className="flex items-center space-x-3">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={tempFilters.minRating === rating}
                    onCheckedChange={() =>
                      handleTempChange('minRating', tempFilters.minRating === rating ? undefined : rating)
                    }
                    className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor={`rating-${rating}`} className="text-sm text-gray-700 cursor-pointer flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 ml-1">& above</span>
                  </Label>
                </motion.div>
              ))}
            </div>
          </FilterSection>

          {/* Availability */}
          <FilterSection title="Availability">
            <div className="space-y-3">
              <motion.div whileHover={{ x: 4 }} className="flex items-center space-x-3">
                <Checkbox
                  id="in-stock"
                  checked={tempFilters.inStock === true}
                  onCheckedChange={(v) => handleTempChange('inStock', v ? true : undefined)}
                  className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="in-stock" className="text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                  In Stock Only
                </Label>
              </motion.div>
              <motion.div whileHover={{ x: 4 }} className="flex items-center space-x-3">
                <Checkbox
                  id="same-day"
                  checked={tempFilters.sameDayDelivery === true}
                  onCheckedChange={(v) => handleTempChange('sameDayDelivery', v ? true : undefined)}
                  className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="same-day" className="text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                  Same Day Delivery
                </Label>
              </motion.div>
            </div>
          </FilterSection>
        </div>
      </ScrollArea>

      {/* Apply Button */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-gray-200">
        <Button
          onClick={applyFilters}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 h-12 transform hover:scale-105 transition-all duration-300"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Apply Filters
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
        <p className="text-xs text-gray-500 text-center mt-2">
          {activeFilterCount > 0
            ? `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} will be applied`
            : 'Select filters to refine results'}
        </p>
      </motion.div>
    </div>
  );
};

export default ProductFilters;
