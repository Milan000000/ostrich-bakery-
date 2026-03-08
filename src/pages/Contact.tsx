import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook, Twitter } from 'lucide-react';

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Have a question about our products or want to discuss a special order? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="bg-primary-light w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Phone size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Phone</h3>
              <p className="text-slate-500">+1 (234) 567-890</p>
              <p className="text-slate-500">Mon-Sun, 8am-10pm</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="bg-primary-light w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Mail size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Email</h3>
              <p className="text-slate-500">hello@ostrichbakery.com</p>
              <p className="text-slate-500">orders@ostrichbakery.com</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-start space-x-6">
              <div className="bg-primary-light w-12 h-12 rounded-2xl flex items-center justify-center text-primary shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Our Location</h3>
                <p className="text-slate-500 mb-4">FF27+5GC, Sabo Ayuba-Panbeguwa Junction Road, Tsaunin Kura, 800104, Kaduna</p>
                <div className="h-48 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
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
            </div>
          </div>

          <div className="flex items-center justify-between p-8 bg-slate-900 rounded-3xl text-white">
            <div>
              <h3 className="font-bold text-xl mb-1">Follow Us</h3>
              <p className="text-slate-400 text-sm">Stay updated with our latest bakes.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><Facebook size={20} /></a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><Twitter size={20} /></a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Send us a Message</h2>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Your Name</label>
              <input
                type="text"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <input
                type="email"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
              <select className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none bg-white">
                <option>General Inquiry</option>
                <option>Order Question</option>
                <option>Feedback</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
              <textarea
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all h-32"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="button"
              className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all"
            >
              Send Message
            </button>

            <div className="pt-6 border-t border-slate-100">
              <a 
                href="https://wa.me/1234567890" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 text-green-600 font-bold hover:underline"
              >
                <MessageCircle size={20} />
                <span>Chat with us on WhatsApp</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
