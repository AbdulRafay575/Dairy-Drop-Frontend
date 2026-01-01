import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  X, 
  Plus, 
  Trash2,
  Info,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'milk',
    brand: '',
    shelfLife: '3',
    storageInstructions: 'Store in refrigerator at 4°C or below',
    quantity: '',
    unit: 'piece',
    isAvailable: true,
    nutritionalFacts: {
      fatContent: '',
      proteinContent: '',
      carbohydrateContent: '',
      calories: '',
      calcium: ''
    },
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || 'milk',
        brand: product.brand || '',
        shelfLife: product.shelfLife?.toString() || '3',
        storageInstructions: product.storageInstructions || 'Store in refrigerator at 4°C or below',
        quantity: product.quantity?.toString() || '',
        unit: product.unit || 'piece',
        isAvailable: product.isAvailable ?? true,
        nutritionalFacts: product.nutritionalFacts || {
          fatContent: '',
          proteinContent: '',
          carbohydrateContent: '',
          calories: '',
          calcium: ''
        },
        tags: product.tags || []
      });
      setImagePreviews(product.images?.map(img => ({ url: img.url, name: img.alt })) || []);
    }
  }, [product]);

  const categories = [
    { value: 'milk', label: 'Milk' },
    { value: 'yogurt', label: 'Yogurt' },
    { value: 'cheese', label: 'Cheese' },
    { value: 'butter', label: 'Butter' },
    { value: 'cream', label: 'Cream' },
    { value: 'ghee', label: 'Ghee' },
    { value: 'ice-cream', label: 'Ice Cream' },
    { value: 'paneer', label: 'Paneer' },
    { value: 'other', label: 'Other' }
  ];

  const units = [
    { value: 'ml', label: 'Milliliter (ml)' },
    { value: 'l', label: 'Liter (l)' },
    { value: 'g', label: 'Gram (g)' },
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'piece', label: 'Piece' },
    { value: 'pack', label: 'Pack' }
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    const newPreviews = [];

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds 5MB limit`,
          variant: 'destructive'
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not an image`,
          variant: 'destructive'
        });
        return;
      }

      newImages.push(file);
      newPreviews.push({
        url: URL.createObjectURL(file),
        name: file.name
      });
    });

    setImages([...images, ...newImages]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    // Revoke object URL to prevent memory leaks
    if (!product && newPreviews[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(newPreviews[index].url);
    }

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Product name is required',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Valid price is required',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      toast({
        title: 'Validation Error',
        description: 'Valid quantity is required',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        shelfLife: parseInt(formData.shelfLife),
        nutritionalFacts: {
          fatContent: parseFloat(formData.nutritionalFacts.fatContent) || 0,
          proteinContent: parseFloat(formData.nutritionalFacts.proteinContent) || 0,
          carbohydrateContent: parseFloat(formData.nutritionalFacts.carbohydrateContent) || 0,
          calories: parseFloat(formData.nutritionalFacts.calories) || 0,
          calcium: parseFloat(formData.nutritionalFacts.calcium) || 0
        }
      };

      let response;
      if (product) {
        // Update existing product
        response = await apiService.updateProduct(product._id, productData, images);
      } else {
        // Create new product
        response = await apiService.createProduct(productData, images);
      }

      if (response.success) {
        toast({
          title: product ? 'Product Updated' : 'Product Created',
          description: product ? 'Product updated successfully' : 'New product added successfully',
        });
        onSubmit();
      } else {
        throw new Error(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save product',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Fresh Cow Milk"
              />
            </div>

            <div>
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="e.g., Dairy Fresh"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your product..."
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="25.00"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="100"
              />
            </div>
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4 pt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="shelfLife">Shelf Life (days) *</Label>
              <Input
                id="shelfLife"
                type="number"
                min="1"
                value={formData.shelfLife}
                onChange={(e) => setFormData(prev => ({ ...prev, shelfLife: e.target.value }))}
                placeholder="3"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="storageInstructions">Storage Instructions</Label>
            <Input
              id="storageInstructions"
              value={formData.storageInstructions}
              onChange={(e) => setFormData(prev => ({ ...prev, storageInstructions: e.target.value }))}
              placeholder="Store in refrigerator at 4°C or below"
            />
          </div>

          {/* Nutritional Facts */}
          <div className="space-y-4">
            <h3 className="font-semibold">Nutritional Facts (per 100g/ml)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.nutritionalFacts.fatContent}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutritionalFacts: { ...prev.nutritionalFacts, fatContent: e.target.value }
                  }))}
                  placeholder="3.5"
                />
              </div>
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.nutritionalFacts.proteinContent}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutritionalFacts: { ...prev.nutritionalFacts, proteinContent: e.target.value }
                  }))}
                  placeholder="3.2"
                />
              </div>
              <div>
                <Label htmlFor="calories">Calories (kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  value={formData.nutritionalFacts.calories}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutritionalFacts: { ...prev.nutritionalFacts, calories: e.target.value }
                  }))}
                  placeholder="60"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isAvailable"
              checked={formData.isAvailable}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
            />
            <Label htmlFor="isAvailable">Product is available for sale</Label>
          </div>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag & drop images here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Maximum file size: 5MB. Supported formats: JPG, PNG, WebP
              </p>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Label htmlFor="image-upload">
                <Button variant="outline" type="button">
                  Select Images
                </Button>
              </Label>
            </div>
          </div>

          {imagePreviews.length > 0 && (
            <div>
              <Label>Selected Images ({imagePreviews.length}/5)</Label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={preview.url}
                        alt={preview.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Image Guidelines</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>First image will be the main product image</li>
                  <li>Use high-quality images with white background</li>
                  <li>Show product from multiple angles</li>
                  <li>Include nutritional label if available</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              {product ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            product ? 'Update Product' : 'Create Product'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;