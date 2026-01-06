import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Truck, 
  Shield, 
  Star, 
  Clock, 
  Heart, 
  Users,
  Leaf,
  Sparkles,
  Milk,
  IceCream,
  Package,
  Award,
  ShoppingBag,
  Zap,
  Droplets,
  UtensilsCrossed
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductGrid from '@/components/products/ProductGrid';
import { apiService } from '@/services/api';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const categoriesRef = useRef(null);
  
  const isHeroInView = useInView(heroRef, { once: true });
  const isFeaturesInView = useInView(featuresRef, { once: true });
  const isCategoriesInView = useInView(categoriesRef, { once: true });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const [featuredResponse, newArrivalsResponse] = await Promise.all([
        apiService.getProducts({ limit: 8, sort: 'rating' }),
        apiService.getProducts({ limit: 8, sort: 'newest' })
      ]);

      if (featuredResponse.success) {
        setFeaturedProducts(featuredResponse.data.products.slice(0, 4));
      }
      
      if (newArrivalsResponse.success) {
        setNewArrivals(newArrivalsResponse.data.products.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { 
      icon: <Droplets className="h-10 w-10" />, 
      name: 'Fresh Milk', 
      count: '12 Products',
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      link: '/products?category=milk'
    },
    { 
      icon: <UtensilsCrossed className="h-10 w-10" />, 
      name: 'Artisan Cheese', 
      count: '8 Varieties',
      color: 'from-amber-400 to-orange-400',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      link: '/products?category=cheese'
    },
    { 
      icon: <IceCream className="h-10 w-10" />, 
      name: 'Premium Ice Cream', 
      count: '6 Flavors',
      color: 'from-pink-400 to-rose-400',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
      link: '/products?category=ice-cream'
    },
    { 
      icon: <Package className="h-10 w-10" />, 
      name: 'Yogurt & Curd', 
      count: '10 Variants',
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      link: '/products?category=yogurt'
    },
  ];

  const features = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'Same Day Delivery',
      description: 'Order 12 PM, get it same day',
      color: 'text-blue-600'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: '100% Hygienic',
      description: 'Certified fresh & safe',
      color: 'text-green-600'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Farm Fresh',
      description: 'Direct from local farms',
      color: 'text-amber-600'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Thermostatic',
      description: 'Always chilled delivery',
      color: 'text-purple-600'
    }
  ];

  const testimonials = [
    {
      name: 'Saira Sana',
      role: 'Home Chef',
      content: 'The creamiest milk I have ever tasted! Dairy Mart has transformed our family breakfasts.',
      rating: 5,
      avatar: '👩‍🍳'
    },
    {
      name: 'Zamar',
      role: 'Restaurant Owner',
      content: 'Consistent quality and timely delivery. Our go-to for all dairy needs.',
      rating: 5,
      avatar: '👨‍🍳'
    },
    {
      name: 'Uzair',
      role: 'Father of Two',
      content: 'My children love the organic yogurt. Trustworthy and delicious every time.',
      rating: 5,
      avatar: '👩‍👧‍👦'
    }
  ];

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
    <div className="flex flex-col">
      {/* Hero Section - Premium Redesign */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%),
            url('data:image/svg+xml,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M20,20 Q40,5 60,20 T100,20 L100,80 Q80,95 60,80 T20,80 Z" fill="%23e0f2fe" opacity="0.3"/><circle cx="30" cy="30" r="8" fill="%23a5f3fc" opacity="0.2"/><circle cx="70" cy="50" r="12" fill="%23f0f9ff" opacity="0.2"/></svg>')
          `,
          backgroundSize: 'cover, 200px',
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-tr from-amber-100 to-orange-100 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="container relative mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate={isHeroInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-flex">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-medium text-sm tracking-wide shadow-lg shadow-blue-500/25">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    FRESH DAIRY DELIVERED DAILY
                  </span>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-6">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
                  <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    Farm Fresh
                  </span>
                  <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent mt-2">
                    Dairy Delivered
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                  Premium milk, artisan cheese, & creamy yogurt delivered straight to your doorstep. 
                  Taste the difference of farm-to-table freshness.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 pt-6">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-base bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
                  asChild
                >
                  <Link to="/products" className="flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5" />
                    SHOP PREMIUM DAIRY
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-14 px-10 text-base border-2 shadow-white-500/30 hover:shadow-xl hover:shadow-black-500/40 hover:text-white hover:bg-black transition-all duration-300"
                  asChild
                >
                  <Link to="/about" className="flex items-center gap-3">
                    <Leaf className="h-5 w-5" />
                    OUR STORY
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Premium Image Container */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20">
                  <img
  src="https://images.pexels.com/photos/4919730/pexels-photo-4919730.jpeg"
  alt="Premium Dairy Selection"
  className="w-full h-[250px] md:h-[400px] lg:h-[700px] object-cover"
/>

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section - Animated Cards */}
      <section ref={featuresRef} className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white"></div>
        
        <div className="container relative mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={isFeaturesInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex mb-4">
              <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">
                WHY CHOOSE Dairy Mart
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Excellence in Every
              </span>
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Dairy Mart
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              We redefine dairy delivery with uncompromising quality, freshness, and service
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isFeaturesInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
  <motion.div key={index} variants={fadeInUp}>
    <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 overflow-hidden group">
      <CardContent className="p-8 relative">
        {/* Animated Background - FIXED: Lighter opacity */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Icon Container */}
        <div className={`relative mb-6 p-4 rounded-2xl bg-gradient-to-br from-white to-gray-100 shadow-lg w-fit mx-auto group-hover:scale-110 group-hover:bg-gradient-to-br ${feature.color} transition-all duration-300`}>
  {feature.icon}
</div>

        
        {/* Content - Added z-index to appear above background */}
        <div className="relative z-10 text-center flex flex-col items-center">
  <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-gray-900 transition-colors">
    {feature.title}
  </h3>
  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
    {feature.description}
  </p>
</div>

        
        {/* Animated Underline */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-500"></div>
      </CardContent>
    </Card>
  </motion.div>
))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section ref={categoriesRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={isCategoriesInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex mb-4">
              <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">
                EXPLORE OUR COLLECTION
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Premium Dairy
              </span>
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Categories
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our curated selection of premium dairy products, each category crafted for excellence
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isCategoriesInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <Link to={category.link}>
                  <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden h-full ${category.bgColor}`}>
                    <CardContent className="p-8 relative h-full">
                      {/* Animated Background Gradient */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${category.color}`}></div>
                      
                      <div className="relative z-10 flex flex-col items-center text-center h-full">
                        {/* Icon */}
                        <div className={`mb-6 p-5 rounded-2xl bg-gradient-to-br ${category.color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                          <div className="text-white">
                            {category.icon}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <h3 className="text-2xl font-bold mb-3 text-gray-900">{category.name}</h3>
                        <p className="text-gray-600 mb-6">{category.count}</p>
                        
                        {/* Animated Button */}
                        <Button
                          variant="ghost"
                          className="mt-auto border-2 border-gray-200 hover:border-gray-300 group-hover:bg-white/50 transition-all duration-300"
                        >
                          <span className="flex items-center gap-2">
                            Explore Collection
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
<div className="flex flex-col items-center text-center gap-6">
              <div>
                <motion.div variants={fadeInUp} className="inline-flex mb-4">
                  <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">
                    CURATED SELECTION
                  </span>
                </motion.div>
                <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold mb-4">
                  <span className="block bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Featured
                  </span>
                  <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Products
                  </span>
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-2xl">
                  Discover our most beloved dairy selections, handpicked for their exceptional quality and taste
                </motion.p>
              </div>
              <motion.div variants={fadeInUp}>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-12 px-8 border-2 text-base"
                  asChild
                >
                  <Link to="/products">
                    View All Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <ProductGrid products={featuredProducts} loading={loading} />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #3b82f6 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container relative mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="inline-flex mb-4">
              <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">
                SIMPLE & CONVENIENT
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                How It Works
              </span>
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Three Simple Steps
              </span>
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/4 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-cyan-200 -translate-y-1/2"></div>
            
            {[
              {
                step: '01',
                title: 'Browse & Select',
                description: 'Explore our premium dairy collection',
                icon: <ShoppingBag className="h-8 w-8" />
              },
              {
                step: '02',
                title: 'Checkout & Schedule',
                description: 'Choose delivery time and complete your order',
                icon: <Clock className="h-8 w-8" />
              },
              {
                step: '03',
                title: 'Fresh Delivery',
                description: 'Receive farm-fresh dairy at your doorstep',
                icon: <Truck className="h-8 w-8" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>
                </div>
                
                <Card className="border-0 shadow-xl bg-white pt-12 pb-8 px-8 text-center group hover:shadow-2xl transition-all duration-500">
                  <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 w-fit mx-auto">
                    <div className="text-blue-600">
                      {item.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        {/* Animated Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container relative mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex mb-4">
              <span className="text-sm font-semibold text-cyan-300 tracking-wide uppercase">
                CUSTOMER LOVE
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold mb-6 text-white">
              <span className="block">What Our</span>
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Customers Say
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of families experiencing dairy like never before
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
              >
                <Card className="border-0 bg-gray-800/50 backdrop-blur-sm shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500">
  <CardContent className="p-8 flex flex-col items-center text-center">
    
    {/* Stars */}
    <div className="flex mb-6 justify-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className="h-5 w-5 fill-amber-400 text-amber-400"
        />
      ))}
    </div>

    {/* Quote */}
    <p className="text-gray-200 text-lg italic mb-8 leading-relaxed">
      "{testimonial.content}"
    </p>

    {/* Author */}
    <div className="flex items-center gap-4 justify-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xl">
        {testimonial.avatar}
      </div>
      <div>
        <h4 className="font-semibold text-white">{testimonial.name}</h4>
        <p className="text-gray-400 text-sm">{testimonial.role}</p>
      </div>
    </div>

  </CardContent>
</Card>

              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Premium Design */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/4919739/pexels-photo-4919739.jpeg"
            alt="Fresh Dairy Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-blue-900/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>

        {/* Animated Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tr from-amber-500/5 to-orange-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex mb-6">
              <span className="text-sm font-semibold text-cyan-300 tracking-wide uppercase">
                EXPERIENCE THE DIFFERENCE
              </span>
            </motion.div>
            
            <motion.h2 
              variants={fadeInUp}
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 text-white leading-tight"
            >
              <span className="block">Ready for</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-white to-blue-400 bg-clip-text text-transparent">
                Premium Dairy?
              </span>
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-2xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Join the revolution of farm-fresh dairy delivery. Taste, quality, and convenience redefined.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button 
                size="lg" 
                className="h-16 px-12 text-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300"
                asChild
              >
                <Link to="/products" className="flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6" />
                  SHOP PREMIUM COLLECTION
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="h-16 px-12 text-lg border-2 border-white/30 hover:bg-black text-black backdrop-blur-sm hover:text-white"
                asChild
              >
                <Link to="/about" className="flex items-center gap-3">
                  <Award className="h-6 w-6" />
                  OUR STORY
                </Link>
              </Button>
            </motion.div>
            
            <motion.p 
              variants={fadeInUp}
              className="text-gray-400 mt-8 text-sm tracking-wide"
            >
              Join 50,000+ satisfied families • 4.9/5 Stars • 24/7 Support
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;