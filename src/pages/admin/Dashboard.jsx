import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingBag,
  Users,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    averageOrderValue: 0,
    conversionRate: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
  try {
    setLoading(true);
    const [ordersRes, usersRes, productsRes] = await Promise.all([
      apiService.getAllOrders(),
      apiService.getAllUsers(),
      apiService.getProducts({ limit: 100 })
    ]);

    if (ordersRes.success && usersRes.success && productsRes.success) {
      const orders = ordersRes.data.orders || [];
      const users = usersRes.data.users || [];
      const products = productsRes.data.products || [];

      // Filter out admins
      const customers = users.filter(user => user.role !== 'admin');

      // Calculate stats - exclude cancelled orders
      const activeOrders = orders.filter(order => order.orderStatus !== 'cancelled');
      const totalRevenue = activeOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const totalOrders = activeOrders.length;
      const totalUsers = customers.length; // only non-admins
      const totalProducts = products.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const conversionRate = totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0;

      setStats({
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        averageOrderValue,
        conversionRate
      });

      // Recent orders (last 5 non-cancelled)
      const activeOrdersForDisplay = orders.filter(order => order.orderStatus !== 'cancelled');
      setRecentOrders(activeOrdersForDisplay.slice(0, 5));

      // Top products (by rating)
      setTopProducts(
        products
          .filter(p => p.rating?.average)
          .sort((a, b) => b.rating.average - a.rating.average)
          .slice(0, 5)
      );
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    setLoading(false);
  }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your dairy business performance
          </p>
        </div>
        
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₨{stats.totalRevenue.toLocaleString()}</div>
            
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₨{stats.averageOrderValue.toFixed(2)}</div>
            
          </CardContent>
        </Card>
      </div>

      {/* Charts & Tables */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              <TabsTrigger value="products">Top Products</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Latest {recentOrders.length} orders from customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">#{order.orderNumber}</span>
                            <Badge className={getStatusColor(order.orderStatus)}>
                              {order.orderStatus}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.user?.name || 'Customer'} • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₨{order.totalAmount?.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items?.length || 0} items
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Rated Products</CardTitle>
                  <CardDescription>
                    Most popular dairy products by rating
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product) => (
                      <div key={product._id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {product.images?.[0]?.url ? (
                            <img
                            
src={`https://dairydrop.onrender.com${product.images[0].url}`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-lg">🥛</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{product.rating?.average?.toFixed(1) || '0.0'}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {product.rating?.count || 0} reviews
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;