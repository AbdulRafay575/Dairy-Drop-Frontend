import React from 'react';
import Navbar from './Navbar';
import { Truck, Phone, Shield, Award, Clock, Droplets } from 'lucide-react';

const Header = () => {
  const announcements = [
    {
      id: 1,
      text: "🎉 FREE Delivery on orders over ₨500",
      color: "text-primary"
    },
    {
      id: 2,
      text: "📞 24/7 Support: +91 98765 43210",
      color: "text-blue-600"
    },
    {
      id: 3,
      text: "🛡️ 100% Fresh & Hygienic Guaranteed",
      color: "text-green-600"
    },
    {
      id: 4,
      text: "🏆 Award Winning Dairy Quality",
      color: "text-amber-600"
    },
    {
      id: 5,
      text: "⏰ Same Day Delivery Available",
      color: "text-purple-600"
    },
    {
      id: 6,
      text: "💧 Farm Fresh & Pasteurized",
      color: "text-cyan-600"
    }
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Scrolling Announcement Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-2 overflow-hidden relative">
        {/* Animated background stripes */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1) 100%)`,
            backgroundSize: '50px 50px',
          }}></div>
        </div>
        
        <div className="relative">
          {/* Marquee Container */}
          <div className="overflow-hidden">
            {/* Main Marquee */}
            <div className="animate-marquee whitespace-nowrap flex">
              {announcements.map((item) => (
                <div 
                  key={item.id} 
                  className="inline-flex items-center mx-8 px-4 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <div className={`mr-2 ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm text-white font-medium tracking-wide">
                    {item.text}
                  </span>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {announcements.map((item) => (
                <div 
                  key={`${item.id}-copy`} 
                  className="inline-flex items-center mx-8 px-4 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <div className={`mr-2 ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm text-white font-medium tracking-wide">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-transparent"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent"></div>
        
        {/* Pulsing dot indicator */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <div className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Add CSS for animation in global or component */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Main Navbar */}
      <Navbar />
    </header>
  );
};

export default Header;