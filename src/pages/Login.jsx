import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Milk, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff,
  ArrowRight,
  Shield,
  Truck,
  Award,
  Clock,
  Sparkles,
  CheckCircle,
  Leaf,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast({
          title: 'Welcome Back!',
          description: 'You have successfully logged in',
        });
        
        navigate(from, { replace: true });
      } else {
        toast({
          title: 'Login Failed',
          description: result.error || 'Invalid credentials',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during login',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with cinematic overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/259637/pexels-photo-259637.jpeg"
          alt="Dairy farm background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/85 to-blue-900/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-tr from-amber-500/5 to-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Brand Story */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp}>
                <Link to="/" className="inline-flex items-center space-x-3">
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Milk className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Dairy Mart
                    </h1>
                    <p className="text-sm text-gray-300 tracking-wide">Fresh Dairy Delivered Daily</p>
                  </div>
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="inline-flex">
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-white px-6 py-3 rounded-full font-medium text-sm tracking-wide">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      PREMIUM DAIRY EXPERIENCE
                    </span>
                  </div>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none">
                  <span className="block bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                    Welcome Back
                  </span>
                  <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mt-4">
                    Taste the Difference
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                  Sign in to continue your journey with farm-fresh dairy delivered straight from our pastures to your home.
                </p>
              </motion.div>

              {/* Features */}
              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                    <Clock className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-300">Same Day Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
                    <Leaf className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="text-sm text-gray-300">Organic & Fresh</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                    <Award className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="text-sm text-gray-300">Award Winning</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <Zap className="h-5 w-5 text-purple-400" />
                  </div>
                  <span className="text-sm text-gray-300">Temperature Controlled</span>
                </div>
              </motion.div>

            </motion.div>

            {/* Right Column - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-3">Sign In to Your Account</h2>
                  <p className="text-gray-400">
                    Access your personalized dairy experience
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-gray-300 mb-2">Email Address</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="pl-12 h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="password" className="text-gray-300">Password</Label>
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        required
                        className="pl-12 pr-12 h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/30"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center mt-8 pt-6 border-t border-gray-700/50">
                  <p className="text-gray-400">
                    Don't have an account?{' '}
                    <Link 
                      to="/register" 
                      className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
                    >
                      Join Dairy Mart
                    </Link>
                  </p>
                </div>
              </div>

              
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;