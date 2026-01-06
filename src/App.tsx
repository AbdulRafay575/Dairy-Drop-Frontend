import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";

/* 🌐 PUBLIC PAGES */
import Home from "./pages/Home";
import PaymentPage from './pages/PaymentPage';
import OrderConfirmation from './pages/OrderConfirmation';
import Products from "./pages/Products";
import ProductDetailPage from "./pages/ProductDetailPage";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

/* 🔒 USER PROTECTED PAGES */
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";

/* 🛡️ ADMIN PAGES */
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ProductsPage from "./pages/admin/ProductsPage";
import OrdersPage from "./pages/admin/OrdersPage";
import UsersPage from "./pages/admin/UsersPage";
import ReviewsPage from "./pages/admin/ReviewsPage";


const AdminRoute = () => {
  const { user, isAdmin, loading } = useAuth();

  // ⏳ wait until auth check finishes
  if (loading) {
    return null; // or spinner
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <AuthProvider>
            <CartProvider>
              <BrowserRouter>
                <Routes>
                  {/* 🌐 AUTH ROUTES (NO LAYOUT) */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* 🌐 APP LAYOUT (NAVBAR + FOOTER) */}
                  <Route element={<AppLayout />}>
                    {/* PUBLIC */}
                    <Route index element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/payment/:orderId" element={<PaymentPage />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* 🔒 USER PROTECTED */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                    </Route>
                  </Route>

                  {/* 🛡️ ADMIN ROUTES */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<ProductsPage />} />
                      <Route path="orders" element={<OrdersPage />} />
                      <Route path="users" element={<UsersPage />} />
                      <Route path="reviews" element={<ReviewsPage />} />
                    </Route>
                  </Route>

                  {/* ❌ NOT FOUND */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
