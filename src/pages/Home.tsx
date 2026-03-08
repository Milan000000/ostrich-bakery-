import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, MapPin, Phone, ShoppingBag } from 'lucide-react';

const Home = () => {
  const featuredProducts = [
    { name: 'Artisan Sourdough', price: '₦2,500', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=800&q=80' },
    { name: 'Berry Danish', price: '₦1,800', image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80' },
    { name: 'Velvet Cake', price: '₦15,000', image: 'https://images.unsplash.com/photo-1586788680434-30d324671ff6?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-20 pb-20"
    >
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/bakery-hero/1920/1080" 
            alt="Bakery Hero" 
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Baking Fresh <span className="text-primary-light">Memories</span> Every Day.
            </h1>
            <p className="text-xl text-slate-200 mb-8">
              Experience the warmth of artisan breads, decadent pastries, and custom cakes crafted with love in the heart of the city.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/menu" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center space-x-2 transition-all transform hover:scale-105"
              >
                <span>Order Now</span>
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/cakes" 
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
              >
                Custom Cakes
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Favorites</h2>
            <p className="text-slate-500 mt-2">Our most loved treats, baked fresh this morning.</p>
          </div>
          <Link to="/menu" className="text-primary font-bold flex items-center space-x-1 hover:underline">
            <span>View Full Menu</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-xl text-slate-900">{product.name}</h3>
                  <span className="text-primary font-bold">{product.price}</span>
                </div>
                <Link 
                  to="/order" 
                  className="mt-4 w-full bg-slate-50 hover:bg-primary hover:text-white text-slate-600 py-3 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag size={18} />
                  <span>Quick Order</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daily Announcement */}
      <section className="bg-primary-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                <Clock size={14} />
                <span>Fresh from the oven</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Daily Bread Schedule</h2>
              <p className="text-slate-600 max-w-md">
                Our sourdough comes out at 8:00 AM, and our famous baguettes are ready by 10:30 AM. Don't miss out!
              </p>
            </div>
            <Link 
              to="/specials" 
              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-transform"
            >
              View Today's Specials
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="flex text-yellow-400 mb-4">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-600 italic mb-6">
                "The best sourdough in town! I come here every Saturday morning for my fresh loaf and a coffee. The staff is always so friendly."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full" />
                <div>
                  <p className="font-bold text-slate-900">Happy Customer</p>
                  <p className="text-xs text-slate-400">Local Guide</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-slate-900">Visit Our Bakery</h2>
            <p className="text-slate-600 text-lg">
              We're located in the heart of the historic district. Come smell the fresh bread and enjoy a cozy atmosphere.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-light p-3 rounded-xl text-primary"><MapPin size={24} /></div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">Address</p>
                  <p className="text-slate-500">FF27+5GC, Sabo Ayuba-Panbeguwa Junction Road, Tsaunin Kura, 800104, Kaduna</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary-light p-3 rounded-xl text-primary"><Phone size={24} /></div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">Phone</p>
                  <p className="text-slate-500">+1 (234) 567-890</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary-light p-3 rounded-xl text-primary"><Clock size={24} /></div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">Opening Hours</p>
                  <p className="text-slate-500">Mon - Sat: 8:00 AM - 10:00 PM</p>
                  <p className="text-slate-500">Sun: 8:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[400px] bg-slate-100 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215707144188!2d-73.98784368459377!3d40.75797477932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1652345678901!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              title="Bakery Location"
            ></iframe>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
