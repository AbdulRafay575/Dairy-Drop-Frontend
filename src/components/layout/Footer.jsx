import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Phone, 
  Mail, 
  MapPin,
  Truck,
  Shield,
  CreditCard,
  Heart,
  Milk,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <Milk className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dairy Mart</h2>
                <p className="text-sm text-gray-600">Fresh Dairy Delivered Daily</p>
              </div>
            </Link>
            <p className="text-gray-600 leading-relaxed max-w-xs">
              Farm-fresh dairy delivered to your doorstep. Taste the difference of purity in every drop.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['Shop All', 'Our Story', 'Contact', 'FAQ', 'Terms'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center group"
                  >
                    <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-6">Dairy Categories</h3>
            <ul className="space-y-3">
              {['Fresh Milk', 'Yogurt & Curd', 'Premium Cheese', 'Butter & Ghee', 'Cream', 'Ice Cream'].map((category) => (
                <li key={category}>
                  <Link 
                    to={`/products?category=${category.toLowerCase().replace(/[^a-z]/g, '-')}`} 
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-900 text-lg">Stay Fresh</h3>
            <p className="text-gray-600 text-sm">
              Get updates on new arrivals and exclusive offers.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Your email" 
                  className="pl-10 border-2 border-gray-200 focus:border-blue-600 rounded-xl"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>


        

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Dairy Mart. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Made with ❤️ for fresh dairy lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;