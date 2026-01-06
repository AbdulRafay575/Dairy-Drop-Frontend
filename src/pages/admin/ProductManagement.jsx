import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Upload,
  Tag,
  Package,
  BarChart3,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { apiService } from '@/services/api';
import ProductForm from './ProductForm';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, categoryFilter, statusFilter, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts({ limit: 100 });
      if (response.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => 
        statusFilter === 'available' ? product.isAvailable : !product.isAvailable
      );
    }

    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await apiService.deleteProduct(productId);
      if (response.success) {
        setProducts(prev => prev.filter(p => p._id !== productId));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleFormSubmitSuccess = (updatedProduct) => {
    // Refresh the products list
    fetchProducts();
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const getCategoryColor = (category) => {
    const colors = {
      milk: 'bg-blue-100 text-blue-800',
      yogurt: 'bg-green-100 text-green-800',
      cheese: 'bg-yellow-100 text-yellow-800',
      butter: 'bg-orange-100 text-orange-800',
      cream: 'bg-purple-100 text-purple-800',
      'ice-cream': 'bg-pink-100 text-pink-800',
      ghee: 'bg-amber-100 text-amber-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'milk', label: 'Milk' },
    { value: 'yogurt', label: 'Yogurt' },
    { value: 'cheese', label: 'Cheese' },
    { value: 'butter', label: 'Butter' },
    { value: 'cream', label: 'Cream' },
    { value: 'ice-cream', label: 'Ice Cream' },
    { value: 'ghee', label: 'Ghee' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Product Management</h2>
          <p className="text-muted-foreground">
            Manage your dairy products inventory
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) {
            setSelectedProduct(null); // Reset selected product when dialog closes
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={handleAddProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <ProductForm 
              product={selectedProduct} 
              onSubmit={handleFormSubmitSuccess}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedProduct(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <Package className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="justify-start" onClick={() => {
          setSearchQuery('');
          setCategoryFilter('all');
          setStatusFilter('all');
        }}>
          Clear Filters
        </Button>
      </div>

      {/* Products Table */}
      <div className="border rounded-lg bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {product.images?.[0]?.url ? (
                          <img
src={`https://dairydrop.onrender.com${product.images[0].url}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-sm">🥛</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`capitalize ${getCategoryColor(product.category)}`}>
                      {product.category.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">₨{product.price}</span>
                    <p className="text-xs text-muted-foreground">per {product.unit}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            product.quantity > 20 ? 'bg-green-500' :
                            product.quantity > 5 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, (product.quantity / 50) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{product.quantity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.isAvailable ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Out of Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{product.rating?.average?.toFixed(1) || '0.0'}</span>
                      <span className="text-xs text-muted-foreground">
                        ({product.rating?.count || 0})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              {products.length === 0 
                ? 'No products added yet. Add your first product!' 
                : 'No products match your filters'}
            </p>
            <Button onClick={handleAddProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Stock</p>
              <p className="text-2xl font-bold">
                {products.filter(p => p.isAvailable).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold">
                {products.filter(p => !p.isAvailable).length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock (&lt; 10)</p>
              <p className="text-2xl font-bold">
                {products.filter(p => p.quantity < 10 && p.quantity > 0).length}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;