import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { validateEmail, validatePhone, validatePassword, validateName } from '@/utils/validators';

const RegisterForm = ({ 
  onSubmit, 
  loading = false,
  showLoginLink = true,
  className 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const { toast } = useToast();

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.message;
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate phone
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate terms agreement
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to create account',
        variant: 'destructive'
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    
    // Length check
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const strengths = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' }
    ];

    return strengths[Math.min(strength, 4)];
  };

  const strength = passwordStrength();

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name">Full Name</Label>
          <div className="relative mt-2">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
              disabled={loading}
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email Address</Label>
          <div className="relative mt-2">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative mt-2">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
              disabled={loading}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-2">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          
          {/* Password strength indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Password strength:</span>
                <span className="text-xs font-medium">{strength.label}</span>
              </div>
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${strength.color} transition-all duration-300`}
                  style={{ width: `${(strength.strength + 1) * 20}%` }}
                />
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
          
          <ul className="mt-2 space-y-1">
            <li className="flex items-center text-xs text-muted-foreground">
              <CheckCircle className={`h-3 w-3 mr-2 ${formData.password.length >= 6 ? 'text-green-500' : 'text-gray-300'}`} />
              At least 6 characters
            </li>
          </ul>
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative mt-2">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              disabled={loading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={setAgreedToTerms}
              className="mt-1"
              disabled={loading}
            />
            <Label htmlFor="terms" className="text-sm cursor-pointer">
              I agree to the{' '}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-sm">{errors.terms}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        {/* Login Link */}
        {showLoginLink && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:text-primary/80">
                Sign in here
              </Link>
            </p>
          </div>
        )}
      </div>
    </form>
  );
};

export default RegisterForm;