import React, { useState, useRef } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle,
  MessageSquare,
  User,
  Truck,
  Shield,
  Sparkles,
  Award,
  Heart,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Coffee,
  Droplets,
  Leaf,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const heroRef = useRef(null);
  const contactRef = useRef(null);
  const formRef = useRef(null);
  
  const isHeroInView = useInView(heroRef, { once: true });
  const isContactInView = useInView(contactRef, { once: true });
  const isFormInView = useInView(formRef, { once: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset submission status after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Phone className="h-8 w-8" />,
      title: 'Call Us Anytime',
      details: ['+91 98765 43210', '+91 98765 43211'],
      description: '24/7 emergency support',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50'
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: 'Email Support',
      details: ['support@dairydrop.com', 'hello@dairydrop.com'],
      description: 'Response within 90 minutes',
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Business Hours',
      details: ['Mon-Sun: 6 AM - 10 PM', 'Delivery: 7 AM - 9 PM'],
      description: 'Always here for you',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50'
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Visit Our Farm',
      details: ['Mumbai, Maharashtra', 'By appointment only'],
      description: 'See freshness in action',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50'
    }
  ];

  const faqs = [
    {
      question: 'What time do you deliver?',
      answer: 'We deliver from 7 AM to 9 PM daily. Same-day delivery available for orders placed before 12 PM. You can choose your preferred time slot at checkout.',
      icon: <Clock className="h-5 w-5 text-blue-500" />
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order is dispatched, you\'ll receive a real-time tracking link via SMS and email. You can also track from your account dashboard with live updates.',
      icon: <Truck className="h-5 w-5 text-green-500" />
    },
    {
      question: 'What\'s your freshness guarantee?',
      answer: 'We offer a 24-hour freshness guarantee. If you\'re not completely satisfied, contact us immediately for a replacement or full refund. Your happiness is our priority.',
      icon: <Shield className="h-5 w-5 text-amber-500" />
    },
    {
      question: 'Do you deliver to apartments?',
      answer: 'Yes! We deliver right to your doorstep, whether it\'s an apartment, office, or home. Our temperature-controlled delivery ensures freshness every time.',
      icon: <MapPin className="h-5 w-5 text-purple-500" />
    }
  ];

  const team = [
    {
      name: 'Anjali Sharma',
      role: 'Customer Happiness',
      image: '👩‍💼',
      description: 'Makes sure every question gets answered with care'
    },
    {
      name: 'Rahul Verma',
      role: 'Quality Support',
      image: '👨‍🔬',
      description: 'Our dairy expert for technical questions'
    },
    {
      name: 'Priya Patel',
      role: 'Delivery Coordination',
      image: '👩‍🚚',
      description: 'Ensures your order arrives perfectly'
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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section - Cinematic */}
      <section 
        ref={heroRef}
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.7)),
            url('https://images.unsplash.com/photo-1550583722-459e5b2c0376?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80&blur=20')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container relative mx-auto px-4 py-20">
          <motion.div
            initial="hidden"
            animate={isHeroInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex mb-6">
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-full">
                <span className="flex items-center gap-2 text-sm font-medium text-cyan-200 tracking-wide">
                  <Sparkles className="h-4 w-4" />
                  WE'RE HERE TO HELP
                </span>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
                <span className="block text-white">
                  Let's Create
                </span>
                <span className="block bg-gradient-to-r from-cyan-400 via-white to-blue-400 bg-clip-text text-transparent mt-4">
                  Fresh Connections
                </span>
              </h1>
              
              <p className="text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
                Your questions, concerns, and feedback are what help us deliver exceptional dairy experiences. 
                Let's start a conversation about freshness.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="mt-12 flex items-center justify-center gap-4"
            >
              <a 
                href="#contact-form" 
                className="group inline-flex items-center gap-2 text-white hover:text-cyan-300 transition-colors"
              >
                <span className="text-lg">Send us a message</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="h-4 w-4" />
                <span>Response in 90 minutes</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      

      {/* Contact Form & Team Section */}
      <section id="contact-form" ref={formRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form - Premium */}
            <div className="lg:col-span-2">
              <motion.div
                initial="hidden"
                animate={isFormInView ? "visible" : "hidden"}
                variants={staggerContainer}
              >
                <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  {/* Form Header */}
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5"></div>
                    <CardContent className="p-8 relative">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50">
                          <MessageSquare className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900">Send Us a Message</h2>
                          <p className="text-gray-600">We'll get back to you within 90 minutes</p>
                        </div>
                      </div>

                      {submitted ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-16"
                        >
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-8 shadow-lg">
                            <CheckCircle className="h-12 w-12 text-emerald-600" />
                          </div>
                          <h3 className="text-2xl font-bold mb-4 text-gray-900">Message Sent Successfully!</h3>
                          <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Thank you for reaching out. Our team will personally review your message and get back to you shortly.
                          </p>
                          <div className="space-y-4">
                            <Button 
                              onClick={() => setSubmitted(false)}
                              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg"
                            >
                              Send Another Message
                            </Button>
                            <p className="text-sm text-gray-500">
                              Or browse our <a href="/faq" className="text-blue-600 hover:text-blue-700">FAQ section</a> for instant answers
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.form 
                          onSubmit={handleSubmit} 
                          className="space-y-8"
                          variants={staggerContainer}
                          initial="hidden"
                          animate="visible"
                        >
                          {/* Name & Email */}
                          <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                <span className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  Your Name *
                                </span>
                              </Label>
                              <div className="relative">
                                <Input
                                  id="name"
                                  placeholder="John Smith"
                                  value={formData.name}
                                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                  required
                                  className="h-12 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                            <div className="space-y-3">
                              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                <span className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  Email Address *
                                </span>
                              </Label>
                              <div className="relative">
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="john@example.com"
                                  value={formData.email}
                                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                  required
                                  className="h-12 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                          </motion.div>

                          {/* Phone & Subject */}
                          <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                <span className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  Phone Number
                                </span>
                              </Label>
                              <div className="relative">
                                <Input
                                  id="phone"
                                  type="tel"
                                  placeholder="+91 98765 43210"
                                  value={formData.phone}
                                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                  className="h-12 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                            <div className="space-y-3">
                              <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                                Subject *
                              </Label>
                              <Input
                                id="subject"
                                placeholder="How can we help?"
                                value={formData.subject}
                                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                required
                                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </motion.div>

                          {/* Message */}
                          <motion.div variants={fadeInUp} className="space-y-3">
                            <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                              Your Message *
                            </Label>
                            <Textarea
                              id="message"
                              placeholder="Tell us about your dairy needs, questions, or feedback..."
                              rows={6}
                              value={formData.message}
                              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                              required
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                            />
                          </motion.div>

                          {/* Submit Button */}
                          <motion.div variants={fadeInUp}>
                            <Button 
                              type="submit" 
                              size="lg" 
                              disabled={loading}
                              className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
                            >
                              {loading ? (
                                <>
                                  <span className="animate-spin mr-3">⏳</span>
                                  Sending Your Message...
                                </>
                              ) : (
                                <>
                                  <Send className="mr-3 h-5 w-5" />
                                  Send Message
                                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                              )}
                            </Button>
                            <p className="text-center text-sm text-gray-500 mt-4">
                              By submitting, you agree to our privacy policy
                            </p>
                          </motion.div>
                        </motion.form>
                      )}
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar - Team & Info */}
            <div className="space-y-8">
              {/* Meet the Team */}
              

              {/* FAQ Preview */}
              <motion.div
                initial="hidden"
                animate={isFormInView ? "visible" : "hidden"}
                variants={staggerContainer}
              >
                <Card className="border-0 shadow-xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-full bg-gradient-to-br from-amber-50 to-orange-50">
                        <Award className="h-5 w-5 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Common Questions</h3>
                    </div>
                    <div className="space-y-6">
                      {faqs.map((faq, index) => (
                        <motion.div 
                          key={index} 
                          variants={fadeInUp}
                          whileHover={{ x: 4 }}
                          className="group"
                        >
                          <div className="flex items-start gap-3 mb-2">
                            {faq.icon}
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {faq.question}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 pl-8 leading-relaxed">
                            {faq.answer.split(' ').slice(0, 15).join(' ')}...
                          </p>
                        </motion.div>
                      ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-6" asChild>
                      <a href="/faq" className="flex items-center justify-center gap-2">
                        View All FAQ
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              
            </div>
          </div>
        </div>
      </section>

      {/* Visit Our Farm Section - Cinematic */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/325944/pexels-photo-325944.jpeg"
            alt="Dairy Farm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-blue-900/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>

        {/* Animated Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tr from-amber-500/5 to-orange-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
          />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-flex mb-6">
                <span className="text-sm font-semibold text-cyan-300 tracking-wide uppercase">
                  EXPERIENCE FRESHNESS
                </span>
              </motion.div>
              
              <motion.h2 
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white leading-tight"
              >
                <span className="block">Visit Our</span>
                <span className="block bg-gradient-to-r from-amber-400 via-white to-cyan-400 bg-clip-text text-transparent">
                  Dairy Farm
                </span>
              </motion.h2>
              
              <motion.p 
                variants={fadeInUp}
                className="text-2xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
              >
                See where the magic happens. Book a farm tour and experience dairy freshness from source to doorstep.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-base bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300"
                >
                  <MapPin className="h-5 w-5 mr-3" />
                  BOOK FARM TOUR
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-14 px-10 text-base border-2 border-white/30 hover:bg-white/10 text-black backdrop-blur-sm"
                >
                  <Coffee className="h-5 w-5 mr-3" />
                  DAIRY WORKSHOP
                </Button>
              </motion.div>
              
              <motion.p 
                variants={fadeInUp}
                className="text-gray-400 mt-12 text-sm tracking-wide flex items-center justify-center gap-4"
              >
                <span className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  Sustainable farming
                </span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  Quality certified
                </span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Family-friendly tours
                </span>
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Contact;