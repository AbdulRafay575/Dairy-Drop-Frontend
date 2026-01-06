import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Milk, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: 'Terms Required',
        description: 'Please agree to the terms and conditions',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      if (result.success) {
        toast({
          title: 'Welcome to Dairy Mart!',
          description: 'Your account has been created successfully',
        });
        
        navigate('/');
      } else {
        toast({
          title: 'Registration Failed',
          description: result.error || 'Failed to create account',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during registration',
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
                      JOIN OUR DAIRY FAMILY
                    </span>
                  </div>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none">
                  <span className="block bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                    Start Your Fresh Journey
                  </span>
                  <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mt-4">
                    With Dairy Mart
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                  Create an account to experience farm-fresh dairy delivered straight from our pastures to your home. Join thousands of families who trust us for daily dairy needs.
                </p>
              </motion.div>

              {/* Benefits */}
              <motion.div variants={fadeInUp} className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                    <Shield className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-300 font-medium">100% Secure Registration</span>
                    <p className="text-xs text-gray-400">Your data is protected with bank-level encryption</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-300 font-medium">Instant Access</span>
                    <p className="text-xs text-gray-400">Start ordering in under 2 minutes</p>
                  </div>
                </div>
              </motion.div>

            </motion.div>

            {/* Right Column - Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-3">Create Your Account</h2>
                  <p className="text-gray-400">
                    Join our community of dairy lovers
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <Label htmlFor="name" className="text-gray-300 mb-2">Full Name</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="pl-12 h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

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

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-gray-300 mb-2">Phone Number</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                        className="pl-12 h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
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
                    <p className="text-xs text-gray-500 mt-2">
                      Must be at least 6 characters
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        className="pl-12 pr-12 h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={setAgreedToTerms}
                      className="mt-1 border-gray-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer flex-1">
                      I agree to the{' '}
                      <Link to="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/30 mt-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Login Link */}
                <div className="text-center mt-8 pt-6 border-t border-gray-700/50">
                  <p className="text-gray-400">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
                    >
                      Sign in here
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

export default Register;