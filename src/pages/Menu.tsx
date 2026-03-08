import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Info, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Bread', 'Cakes', 'Pastries', 'Hot Meals', 'Drinks', 'Ice Cream'];

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Delicious Menu</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Everything we serve is made from scratch using the finest ingredients. Explore our wide range of treats.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search our menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                category === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="animate-pulse bg-slate-100 h-80 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4">
                    {product.available ? (
                      <span className="bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1">
                        <CheckCircle size={10} />
                        <span>Available</span>
                      </span>
                    ) : (
                      <span className="bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 leading-tight">{product.name}</h3>
                    <span className="text-primary font-bold">₦{product.price.toLocaleString()}</span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">
                    {product.description}
                  </p>
                  <Link 
                    to={`/order?productId=${product.id}`}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
                      product.available 
                        ? 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/10' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag size={18} />
                    <span>Order Now</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full text-slate-400 mb-4">
            <Info size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No items found</h3>
          <p className="text-slate-500">Try adjusting your search or category filter.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Menu;
