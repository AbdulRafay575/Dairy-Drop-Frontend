import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle, 
  XCircle,
  Download,
  MoreVertical,
  Calendar,
  User,
  Package,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { apiService } from '@/services/api';
import OrderDetails from './OrderDetails';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, statusFilter, dateFilter, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllOrders();
      if (response.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(query) ||
        order.user?.name?.toLowerCase().includes(query) ||
        order.user?.email?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        
        switch (dateFilter) {
          case 'today':
            return orderDate >= today;
          case 'yesterday':
            return orderDate >= yesterday && orderDate < today;
          case 'week':
            return orderDate >= lastWeek;
          case 'month':
            return orderDate.getMonth() === now.getMonth() && 
                   orderDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await apiService.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      packed: 'bg-purple-100 text-purple-800',
      'out-for-delivery': 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'confirmed':
      case 'delivered':
        return <CheckCircle className="h-3 w-3" />;
      case 'out-for-delivery':
        return <Truck className="h-3 w-3" />;
      case 'cancelled':
        return <XCircle className="h-3 w-3" />;
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'packed', label: 'Packed' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'This Month' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Order Management</h2>
          <p className="text-muted-foreground">
            Manage and track customer orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger>
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            {dateOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => {
          setSearchQuery('');
          setStatusFilter('all');
          setDateFilter('all');
        }}>
          Clear Filters
        </Button>
      </div>

      {/* Orders Table */}
      <div className="border rounded-lg bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    <div className="font-medium">#{order.orderNumber}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.paymentMethod === 'card' ? 'Card' : 'Cash/COD'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{order.user?.name || 'Customer'}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.contactNumber || 'No phone'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.deliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3 text-muted-foreground" />
                      <span>{order.items?.length || 0} items</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold">₨{order.totalAmount?.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`flex items-center gap-1 ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      <span className="capitalize">
                        {order.orderStatus.replace(/-/g, ' ')}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewOrderDetails(order)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {order.orderStatus === 'pending' && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'confirmed')}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm Order
                          </DropdownMenuItem>
                        )}
                        {order.orderStatus === 'confirmed' && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'packed')}>
                            <Package className="h-4 w-4 mr-2" />
                            Mark as Packed
                          </DropdownMenuItem>
                        )}
                        {order.orderStatus === 'packed' && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'out-for-delivery')}>
                            <Truck className="h-4 w-4 mr-2" />
                            Dispatch for Delivery
                          </DropdownMenuItem>
                        )}
                        {order.orderStatus === 'out-for-delivery' && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'delivered')}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Delivered
                          </DropdownMenuItem>
                        )}
                        {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Order
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              {orders.length === 0 
                ? 'No orders placed yet' 
                : 'No orders match your filters'}
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries({
          total: { label: 'Total Orders', value: orders.filter(o => o.orderStatus !== 'cancelled').length, color: 'bg-blue-500', icon: Package },
          pending: { label: 'Pending', value: orders.filter(o => o.orderStatus === 'pending').length, color: 'bg-yellow-500', icon: Clock },
          delivered: { label: 'Delivered', value: orders.filter(o => o.orderStatus === 'delivered').length, color: 'bg-green-500', icon: CheckCircle },
          revenue: { label: 'Total Revenue', value: `₨${orders.filter(o => o.orderStatus !== 'cancelled').reduce((sum, order) => sum + (order.totalAmount || 0), 0).toLocaleString()}`, color: 'bg-purple-500', icon: Truck }
        }).map(([key, stat]) => (
          <div key={key} className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={(open) => {
        setIsDetailsOpen(open);
        if (!open) {
          setSelectedOrder(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && <OrderDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;