import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu as MenuIcon, 
  X, 
  ShoppingBag, 
  Cake, 
  Truck, 
  Phone, 
  Home as HomeIcon, 
  Settings,
  MessageCircle
} from 'lucide-react';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Order from './pages/Order';
import CakeRequest from './pages/CakeRequest';
import Catering from './pages/Catering';
import Specials from './pages/Specials';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  const navLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Menu', path: '/menu', icon: MenuIcon },
    { name: 'Order', path: '/order', icon: ShoppingBag },
    { name: 'Cakes', path: '/cakes', icon: Cake },
    { name: 'Catering', path: '/catering', icon: Truck },
    { name: 'Specials', path: '/specials', icon: MessageCircle },
    { name: 'Contact', path: '/contact', icon: Phone },
    { name: 'Admin', path: '/admin', icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">O</div>
            <span className="font-bold text-xl tracking-tight text-primary">Ostrich Bakery</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path ? 'text-primary' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600">
              {isOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-primary-light hover:text-primary transition-colors"
                >
                  <link.icon size={20} />
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">O</div>
              <span className="font-bold text-lg text-primary">Ostrich Bakery</span>
            </div>
            <p className="text-slate-500 max-w-xs">
              Baking fresh memories every day. From artisan breads to custom celebration cakes, we bring sweetness to your life.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/menu" className="hover:text-primary">Our Menu</Link></li>
              <li><Link to="/order" className="hover:text-primary">Place Order</Link></li>
              <li><Link to="/cakes" className="hover:text-primary">Custom Cakes</Link></li>
              <li><Link to="/catering" className="hover:text-primary">Catering</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>FF27+5GC, Sabo Ayuba-Panbeguwa Junction Road, Tsaunin Kura, 800104, Kaduna</li>
              <li>+1 (234) 567-890</li>
              <li>hello@ostrichbakery.com</li>
              <li>Mon-Sun: 8am - 10pm</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>© 2026 Ostrich Bakery. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/admin" className="hover:text-primary flex items-center space-x-1">
              <Settings size={14} />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const WhatsAppButton = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <a
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
    >
      <MessageCircle size={24} />
    </a>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
        <Navbar />
        <main className="flex-grow pt-16">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/order" element={<Order />} />
              <Route path="/cakes" element={<CakeRequest />} />
              <Route path="/catering" element={<Catering />} />
              <Route path="/specials" element={<Specials />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}
