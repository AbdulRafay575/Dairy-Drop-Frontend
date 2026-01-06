import React from 'react';
import ProductCard from './ProductCard';
import { Loader2, Milk, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ProductGrid = ({ products, loading, hasMore, onLoadMore }) => {
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

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-200/30"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Discovering Premium Dairy</h3>
          <p className="text-gray-600">Loading fresh farm-to-table selections...</p>
        </div>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-32"
      >
        <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-lg">
          <Search className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Premium Dairy Found</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
          We couldn't find dairy products matching your criteria. 
          Try adjusting your filters or explore our full collection.
        </p>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/30 h-12 px-8"
          asChild
        >
          <a href="/products">
            Explore Full Collection
          </a>
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
      >
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            variants={fadeInUp}
            custom={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
      
      {hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-20"></div>
            <Button
              onClick={onLoadMore}
              className="relative bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 h-14 px-12 text-base"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  Loading Fresh Selections...
                </>
              ) : (
                <>
                  <Milk className="h-5 w-5 mr-3" />
                  Load More Premium Dairy
                </>
              )}
            </Button>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Discover {hasMore ? 'more' : 'all'} farm-fresh products in our collection
          </p>
        </motion.div>
      )}

      
    </>
  );
};

export default ProductGrid;