import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X,
  ChevronDown,
  LogOut,
  Package,
  Milk,
  Home,
  Info,
  Phone,
  Star,
  Sparkles,
  Truck,
  Shield,
  Award
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import logoIcon from '@/assets/images/apple-touch-icon.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
const { getUniqueProductCount, wishlist } = useCart();
const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

const cartCount = getUniqueProductCount();
  const wishlistCount = wishlist.length;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const dairyCategories = [
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
              <div className="h-9 w-9 rounded-full overflow-hidden shadow-lg shadow-blue-500/30 border border-blue-100">
                <img
                  src={logoIcon}
                  alt="Dairy Mart Logo"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Dairy Mart
                </h1>
                <p className="text-xs text-gray-500 leading-none">Freshness Delivered</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1 group">
              <Home className="h-4 w-4 group-hover:text-blue-600" />
              <span className="group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent">
                Home
              </span>
            </Link>
            
          

            <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group">
              <span className="group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent">
                Shop All
              </span>
            </Link>
            <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1 group">
              <Info className="h-4 w-4 group-hover:text-blue-600" />
              <span className="group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent">
                Our Story
              </span>
            </Link>
            <Link to="/contact" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1 group">
              <Phone className="h-4 w-4 group-hover:text-blue-600" />
              <span className="group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent">
                Contact
              </span>
            </Link>
           {isAdmin && (
  <Link
    to="/admin"
    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1 group"
  >
    <Shield className="h-4 w-4 group-hover:text-blue-600" />
    <span className="group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent">
      Admin
    </span>
  </Link>
)}


          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Wishlist */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full" 
              asChild
            >
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                    {wishlistCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full" 
              asChild
            >
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full border border-gray-200 hover:border-blue-200 hover:bg-blue-50">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-blue-700 font-medium">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 border-gray-100 shadow-xl">
                  <DropdownMenuLabel className="text-gray-700">
                    <div className="flex flex-col">
                      <span className="font-semibold">{user?.name}</span>
                      <span className="text-xs text-gray-500 truncate">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer text-gray-700 hover:text-blue-600">
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer text-gray-700 hover:text-blue-600">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button 
  size="sm" 
  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30" 
  asChild
>
  <Link to="/login">
    Login
  </Link>
</Button>
<Button 
  size="sm" 
  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30" 
  asChild
>
  <Link to="/register">
    Sign Up
  </Link>
</Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 border-t border-gray-100">
            {/* Quick Features */}
            <div className="flex items-center justify-around py-3 px-4 mb-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg mx-4">
              <div className="text-center">
                <Truck className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <span className="text-xs font-medium text-gray-700">Same Day</span>
              </div>
              <div className="text-center">
                <Shield className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <span className="text-xs font-medium text-gray-700">100% Fresh</span>
              </div>
              <div className="text-center">
                <Award className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <span className="text-xs font-medium text-gray-700">Premium</span>
              </div>
            </div>

            {/* Mobile Categories */}
            

            {/* Mobile Links */}
           <div className="space-y-1 px-4 mb-4 flex flex-col items-center">
  <Link
    to="/"
    onClick={() => setIsMenuOpen(false)}
    className="flex items-center justify-center gap-3 py-3 px-4 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors group w-full max-w-xs"
  >
    <Home className="h-4 w-4 group-hover:text-blue-600" />
    Home
  </Link>

  <Link
    to="/products"
    onClick={() => setIsMenuOpen(false)}
    className="flex items-center justify-center gap-3 py-3 px-4 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors group w-full max-w-xs"
  >
    <ShoppingCart className="h-4 w-4 group-hover:text-blue-600" />
    Shop All Products
  </Link>

  <Link
    to="/about"
    onClick={() => setIsMenuOpen(false)}
    className="flex items-center justify-center gap-3 py-3 px-4 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors group w-full max-w-xs"
  >
    <Info className="h-4 w-4 group-hover:text-blue-600" />
    Our Story
  </Link>

  <Link
    to="/contact"
    onClick={() => setIsMenuOpen(false)}
    className="flex items-center justify-center gap-3 py-3 px-4 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors group w-full max-w-xs"
  >
    <Phone className="h-4 w-4 group-hover:text-blue-600" />
    Contact Us
  </Link>
</div>


            {/* Mobile Auth Links */}
            {!isAuthenticated ? (
              <div className="mt-6 pt-6 border-t border-gray-100 px-4 space-y-3">
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Login to Account
                  </Link>
                </Button>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg" asChild>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Free Account
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-gray-100 px-4 space-y-3">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <p className="text-sm font-medium text-gray-800">Welcome back!</p>
                  <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors group"
                >
                  <User className="h-4 w-4 group-hover:text-blue-600" />
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors group"
                >
                  <Package className="h-4 w-4 group-hover:text-blue-600" />
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 py-3 px-4 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;