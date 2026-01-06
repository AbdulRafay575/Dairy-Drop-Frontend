import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Target, 
  Users, 
  Leaf, 
  Shield, 
  Truck,
  Award,
  Clock,
  CheckCircle,
  Star,
  ChevronRight,
  Milk,
  Droplets,
  Coffee,
  Home,
  MapPin,
  Calendar,
  Sparkles,
  Eye,
  ArrowDown,
  BookOpen,
  ShoppingBag,
  Zap,
  Package,
  UtensilsCrossed,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

const About = () => {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const timelineRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const ctaRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true });
  const isStoryInView = useInView(storyRef, { once: true });
  const isTimelineInView = useInView(timelineRef, { once: true });
  const isValuesInView = useInView(valuesRef, { once: true });
  const isTeamInView = useInView(teamRef, { once: true });

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Heart in Every Drop',
      description: 'We pour passion into every product, treating dairy like the art it is.',
      color: 'text-blue-600'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Uncompromising Integrity',
      description: 'From farm to doorstep, we maintain the highest standards of purity.',
      color: 'text-green-600'
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: 'Sustainable Harmony',
      description: 'We work with nature, not against it, ensuring ethical practices.',
      color: 'text-amber-600'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Community First',
      description: 'We build relationships that go beyond transactions.',
      color: 'text-purple-600'
    }
  ];

  const timeline = [
    {
      year: '2021',
      title: 'Lahore Ka Sapna',
      description: 'A young entrepreneur in Lahore dreamed of pure, fresh dairy delivered to families without compromise. Started with 15 households in Defence, delivering farm-fresh milk from partner farms in Punjab.',
      image: 'https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg',
      side: 'left',
      gradient: 'from-green-500/20 to-emerald-500/10'
    },
    {
      year: '2022',
      title: 'Karachi Connection',
      description: 'Expanded to Karachi with a mission to bring quality dairy to the bustling metropolis. Built partnerships with 20+ vetted dairy farms across Sindh and Punjab. First expansion success!',
      image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      side: 'right',
      gradient: 'from-amber-500/20 to-orange-500/10'
    },
    {
      year: '2023',
      title: 'Islamabad & Beyond',
      description: 'Reached Islamabad and expanded product range to include lassi, yogurt, and paneer. Featured in Pakistani food magazines. 25,000+ families trust Dairy Mart for their daily nutrition.',
      image: 'https://images.pexels.com/photos/33303293/pexels-photo-33303293.jpeg',
      side: 'left',
      gradient: 'from-blue-500/20 to-cyan-500/10'
    },
    {
      year: '2024',
      title: 'Pakistan\u0027s Choice',
      description: 'Now serving 100,000+ families across major Pakistani cities. Every package carries our commitment: pure, safe, and fresh dairy delivered at your doorstep. Alhamdulillah for the journey!',
      image: 'https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      side: 'right',
      gradient: 'from-green-500/20 to-emerald-500/10'
    }
  ];

  const team = [
    {
      name: 'Ali Hassan',
      role: 'Founder & Vision Keeper',
      bio: 'Punjabi dairy farmer at heart. Believes in the purity and soul of fresh milk from Pakistani farms.',
      image: '👨‍🌾',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    },
    {
      name: 'Fatima Khan',
      role: 'Quality Guardian',
      bio: 'Food scientist trained in Lahore. Ensures every drop meets international standards while honoring Pakistani values.',
      image: '👩‍🔬',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      borderColor: 'border-amber-200'
    },
    {
      name: 'Muhammad Rizwan',
      role: 'Operations Director',
      bio: 'Logistics expert from Karachi. Makes sure freshness reaches every doorstep on time, every time.',
      image: '👨‍💼',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200'
    },
    {
      name: 'Aisha Ahmed',
      role: 'Community Manager',
      bio: 'Passionate about connecting families with pure dairy. Your voice matters to our Dairy Mart family.',
      image: '👩‍💻',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      borderColor: 'border-purple-200'
    }
  ];

  const commitments = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: 'Same-Day Freshness',
      description: 'Delivered within 4 hours of collection',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Zero Preservatives',
      description: 'Pure, natural dairy as nature intended',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: '24/7 Care',
      description: 'Always here when you need us',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: 'Farm Traceability',
      description: 'Know exactly where your dairy comes from',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section - Cinematic Contact Page Style */}
      <section 
        ref={heroRef}
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.7)),
            url('/src/assets/images/About-Hero.jpg')
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

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-cyan-900/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

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
                  OUR DAIRY STORY
                </span>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
                <span className="block text-white">
                  Pakistan's
                </span>
                <span className="block bg-gradient-to-r from-green-400 via-white to-green-400 bg-clip-text text-transparent mt-4">
                  Fresh Dairy Revolution
                </span>
              </h1>
              
              <p className="text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
                From Punjab's farms to your family's table. Dairy Mart brings pure, fresh dairy products 
                with the promise of quality, trust, and tradition across Pakistan.
              </p>
            </motion.div>

            
            
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        
      </section>

      

      {/* Our Journey Timeline */}
      <section 
        ref={timelineRef}
        className="relative py-32 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={isTimelineInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-6xl mx-auto mb-20"
          >
            <motion.div variants={fadeInUp} className="space-y-6 text-center">
              <div className="inline-flex items-center gap-3 mx-auto">
                <div className="w-16 h-px bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <span className="text-sm font-medium tracking-widest text-blue-600 uppercase">
                  Our Timeline
                </span>
                <div className="w-16 h-px bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-black leading-tight">
                <span className="text-gray-900">The Chapters of</span>
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Our Journey</span>
              </h2>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                Scroll through our story, year by meaningful year.
              </p>
            </motion.div>
          </motion.div>

          {/* Timeline Container */}
          <div className="relative max-w-6xl mx-auto">
            {/* Vertical Timeline Line */}
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-500 to-blue-500"
              style={{ height: `${timeline.length * 100}vh` }}
            />

            {/* Timeline Items */}
            <div className="space-y-0">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: index * 0.3 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`min-h-screen flex items-center justify-center py-20 ${
                    index % 2 === 0 ? 'pr-1/2 pl-4' : 'pl-1/2 pr-4'
                  }`}
                >
                  {/* Timeline Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.3 + 0.5 }}
                    className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br ${item.gradient} border-4 border-white z-10 shadow-lg`}
                  />

                  {/* Content Container */}
                  <div className={`w-full max-w-2xl ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                    <div className="relative">
                      {/* Year Badge */}
                      <motion.div
                        initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className={`absolute -top-20 ${index % 2 === 0 ? 'left-0' : 'right-0'}`}
                      >
                        <div className="text-7xl md:text-8xl font-black text-gray-200/50 leading-none">
                          {item.year}
                        </div>
                      </motion.div>

                      {/* Card */}
                      <Card className="border border-gray-200 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                        <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${item.gradient}`} />
                        
                        <div className="relative z-10 p-8 md:p-12">
                          <div className="flex flex-col lg:flex-row gap-8 items-start">
                            {/* Image */}
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className="lg:w-2/5"
                            >
                              <div className="relative overflow-hidden rounded-xl">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
                              </div>
                            </motion.div>

                            {/* Text Content */}
                            <div className="lg:w-3/5 space-y-6">
                              <div>
                                <div className="inline-flex items-center gap-2 mb-3">
                                  <div className="w-8 h-px bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                  <span className="text-sm font-medium tracking-widest text-blue-600 uppercase">
                                    {item.year}
                                  </span>
                                </div>
                                
                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                  {item.title}
                                </h3>
                                
                                <p className="text-lg text-gray-600 leading-relaxed font-light">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet The Team Section */}
      <section 
        ref={teamRef}
        className="py-32 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={isTeamInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="space-y-6 text-center mb-16">
              <div className="inline-flex items-center gap-3 mx-auto">
                <div className="w-16 h-px bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <span className="text-sm font-medium tracking-widest text-blue-600 uppercase">
                  The Guardians
                </span>
                <div className="w-16 h-px bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-black leading-tight">
                <span className="text-gray-900">The Faces Behind</span>
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">The Milk</span>
              </h2>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                A small team with big hearts, dedicated to keeping the story alive.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <Card className={`border ${member.borderColor} ${member.bgColor} hover:shadow-xl transition-all duration-500 overflow-hidden h-full`}>
                    <CardContent className="p-8 text-center h-full flex flex-col items-center">
                      {/* Avatar */}
                      <div className="mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-4 border-white flex items-center justify-center text-4xl shadow-lg">
                          {member.image}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-2xl font-bold mb-2 text-gray-900">{member.name}</h3>
                      <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-4 h-px bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                        <span className="text-blue-600 font-medium text-sm tracking-wider uppercase">
                          {member.role}
                        </span>
                        <div className="w-4 h-px bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed font-light flex-grow">
                        {member.bio}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;