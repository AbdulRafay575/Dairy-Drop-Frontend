import React from 'react';
import { Filter, X, Star, Tag, Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

const ProductFilters = ({ 
  categories = [], 
  brands = [],
  filters, 
  onFilterChange,
  onReset
}) => {
  const colorOptions = [
    { value: 'white', label: 'White', bg: 'bg-white border' },
    { value: 'cream', label: 'Cream', bg: 'bg-amber-50' },
    { value: 'yellow', label: 'Yellow', bg: 'bg-amber-200' },
    { value: 'blue', label: 'Blue', bg: 'bg-blue-200' },
    { value: 'green', label: 'Green', bg: 'bg-emerald-200' },
  ];

  const handleCategoryChange = (category) => {
    const currentCategories = filters.category || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    onFilterChange({ category: newCategories });
  };

  const handleBrandChange = (brand) => {
    const currentBrands = filters.brand || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    
    onFilterChange({ brand: newBrands });
  };

  const handleColorChange = (color) => {
    const currentColors = filters.color || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter(c => c !== color)
      : [...currentColors, color];
    
    onFilterChange({ color: newColors });
  };

  const handlePriceChange = (value) => {
    onFilterChange({ minPrice: value[0], maxPrice: value[1] });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({ minRating: rating });
  };

  const handleFatContentChange = (value) => {
    onFilterChange({ minFat: value[0], maxFat: value[1] });
  };

  const handleAvailabilityChange = (key, checked) => {
    onFilterChange({ [key]: checked ? true : undefined });
  };

  const FilterSection = ({ title, icon: Icon, children }) => (
    <div className="space-y-4 pb-6 border-b border-gray-200 last:border-0 last:pb-0">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-blue-600" />}
        <h4 className="font-semibold text-sm text-gray-900 tracking-wide">{title}</h4>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-1">
      <FilterSection title="Price Range">
        <div className="space-y-4">
          <Slider
            defaultValue={[filters.minPrice || 0, filters.maxPrice || 5000]}
            max={5000}
            step={100}
            onValueChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{filters.minPrice || 0}</span>
            <span>₹{filters.maxPrice || 5000}</span>
          </div>
        </div>
      </FilterSection>

      {/* Categories */}
      {categories.length > 0 && (
        <FilterSection title="Categories" icon={Tag}>
          <ScrollArea className="h-48">
            <div className="space-y-2 pr-4">
              {categories.map((category) => (
                <motion.div
                  key={category}
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-3"
                >
                  <Checkbox
                    id={`cat-${category}`}
                    checked={(filters.category || []).includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                    className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label
                    htmlFor={`cat-${category}`}
                    className="text-sm text-gray-700 cursor-pointer flex-1 capitalize hover:text-gray-900"
                  >
                    {category.replace('-', ' ')}
                  </Label>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </FilterSection>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <FilterSection title="Brands">
          <ScrollArea className="h-48">
            <div className="space-y-2 pr-4">
              {brands.map((brand) => (
                <motion.div
                  key={brand}
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-3"
                >
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={(filters.brand || []).includes(brand)}
                    onCheckedChange={() => handleBrandChange(brand)}
                    className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm text-gray-700 cursor-pointer flex-1 hover:text-gray-900"
                  >
                    {brand}
                  </Label>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </FilterSection>
      )}

      {/* Color */}
      <FilterSection title="Color" icon={Palette}>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => {
            const isSelected = (filters.color || []).includes(color.value);
            return (
              <motion.button
                key={color.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleColorChange(color.value)}
                className={`relative w-10 h-10 rounded-full ${color.bg} border-2 ${
                  isSelected ? 'border-blue-600' : 'border-gray-300'
                } flex items-center justify-center transition-all`}
                title={color.label}
              >
                {isSelected && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </motion.button>
            );
          })}
        </div>
      </FilterSection>

      {/* Fat Content */}
      <FilterSection title="Fat Content (per 100g/ml)">
        <div className="space-y-4">
          <Slider
            defaultValue={[filters.minFat || 0, filters.maxFat || 50]}
            max={50}
            step={0.5}
            onValueChange={handleFatContentChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{filters.minFat || 0}g</span>
            <span>{filters.maxFat || 50}g</span>
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Minimum Rating">
        <div className="space-y-2">
          {[5, 4, 3, 2].map((rating) => (
            <motion.div
              key={rating}
              whileHover={{ x: 4 }}
              className="flex items-center space-x-3"
            >
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.minRating === rating}
                onCheckedChange={() => 
                  onFilterChange({ minRating: filters.minRating === rating ? undefined : rating })
                }
                className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label htmlFor={`rating-${rating}`} className="text-sm text-gray-700 cursor-pointer flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
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
              checked={filters.inStock === true}
              onCheckedChange={(checked) => handleAvailabilityChange('inStock', checked)}
              className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor="in-stock" className="text-sm text-gray-700 cursor-pointer hover:text-gray-900">
              In Stock Only
            </Label>
          </motion.div>
          <motion.div whileHover={{ x: 4 }} className="flex items-center space-x-3">
            <Checkbox
              id="same-day"
              checked={filters.sameDayDelivery === true}
              onCheckedChange={(checked) => handleAvailabilityChange('sameDayDelivery', checked)}
              className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor="same-day" className="text-sm text-gray-700 cursor-pointer hover:text-gray-900">
              Same Day Delivery
            </Label>
          </motion.div>
        </div>
      </FilterSection>
    </div>
  );
};

export default ProductFilters;