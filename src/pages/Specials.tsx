import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag, ShoppingBag, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Special } from '../types';

const Specials = () => {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/specials')
      .then(res => res.json())
      .then(data => {
        setSpecials(data);
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Daily Specials</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Freshly baked surprises and limited-time offers. Check back every day for something new!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Fresh Bread Schedule */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-primary">
              <Clock size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Baking Schedule</h2>
          </div>
          <div className="space-y-6">
            {[
              { time: '07:00 AM', item: 'Classic Sourdough & Baguettes', status: 'Ready' },
              { time: '08:30 AM', item: 'Croissants & Danishes', status: 'Ready' },
              { time: '10:00 AM', item: 'Whole Wheat & Rye Bread', status: 'In Oven' },
              { time: '11:30 AM', item: 'Focaccia & Specialty Breads', status: 'Upcoming' },
              { time: '02:00 PM', item: 'Afternoon Fresh Batch', status: 'Upcoming' },
            ].map((slot, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-primary font-bold text-sm">{slot.time}</p>
                  <p className="font-bold text-slate-900">{slot.item}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                  slot.status === 'Ready' ? 'bg-green-100 text-green-600' : 
                  slot.status === 'In Oven' ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 text-slate-500'
                }`}>
                  {slot.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Special Offers */}
        <div className="space-y-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-primary">
              <Tag size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Today's Deals</h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-3xl" />)}
            </div>
          ) : specials.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {specials.map((special) => (
                <motion.div
                  key={special.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-primary text-white p-8 rounded-[2.5rem] shadow-lg shadow-primary/20 relative overflow-hidden group"
                >
                  <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">{special.title}</h3>
                    <p className="text-primary-light/80 mb-6">{special.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold">₦{special.price.toLocaleString()}</span>
                      <Link 
                        to="/order" 
                        className="bg-white text-primary px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-primary-light transition-colors"
                      >
                        <ShoppingBag size={18} />
                        <span>Claim Deal</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 text-center">
              <p className="text-slate-500">No special offers currently active. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Specials;
