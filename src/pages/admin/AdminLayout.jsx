import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Truck,
  Shield,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
    });
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Star, label: 'Reviews', path: '/admin/reviews' },
  
  ];

  const stats = [
    { label: 'Today Orders', value: '24', change: '+12%', icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Total Revenue', value: '₨42,580', change: '+8%', icon: BarChart3, color: 'bg-green-500' },
    { label: 'New Users', value: '48', change: '+5%', icon: Users, color: 'bg-purple-500' },
    { label: 'Pending Reviews', value: '12', change: '-3%', icon: Star, color: 'bg-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b fixed top-0 left-0 right-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Menu button & Brand */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              <Link to="/" className="flex items-center gap-2 cursor-pointer">
  <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
    <Shield className="h-5 w-5 text-white" />
  </div>
  <div>
    <h1 className="font-bold text-lg">Dairy Mart</h1>
    <p className="text-xs text-muted-foreground">Admin Panel</p>
  </div>
</Link>

            </div>

         
            {/* Right side - User & Notifications */}
            <div className="flex items-center gap-4">
             
              
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:static top-16 left-0 bottom-0 z-40
          w-64 bg-white border-r transition-transform duration-200 ease-in-out
        `}>
          <div className="p-4">

            <Separator className="my-4" />

            {/* Navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <Separator className="my-4" />

           
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 lg:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;