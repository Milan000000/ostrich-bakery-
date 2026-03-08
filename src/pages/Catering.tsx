import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, Loader2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Catering = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    event_type: '',
    guests: 20,
    items: '',
    budget: '',
    event_date: '',
    customer_name: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/catering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) setSuccess(true);
    } catch (error) {
      console.error('Catering request failed', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-primary-light p-12 rounded-[3rem] border border-primary/10"
        >
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Catering Request Sent!</h1>
          <p className="text-slate-600 mb-8">
            Thank you for choosing Ostrich Bakery for your event. We'll review your requirements and get back to you with a proposal within 24 hours.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 py-12"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Catering for Your Events</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          From corporate meetings to family gatherings, we provide delicious spreads that will impress your guests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 text-xl mb-6">Why Choose Us?</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-light p-2 rounded-lg text-primary"><Users size={20} /></div>
                <div>
                  <p className="font-bold text-slate-900">Scalable Service</p>
                  <p className="text-sm text-slate-500">From 10 to 500+ guests, we've got you covered.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary-light p-2 rounded-lg text-primary"><Truck size={20} /></div>
                <div>
                  <p className="font-bold text-slate-900">Reliable Delivery</p>
                  <p className="text-sm text-slate-500">On-time delivery and professional setup.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary-light p-2 rounded-lg text-primary"><CheckCircle size={20} /></div>
                <div>
                  <p className="font-bold text-slate-900">Custom Menus</p>
                  <p className="text-sm text-slate-500">Tailored selections to fit your theme and budget.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-primary p-8 rounded-3xl text-white">
            <h3 className="font-bold text-xl mb-2">Need Help?</h3>
            <p className="text-primary-light/80 text-sm mb-6">Call our catering specialist for immediate assistance.</p>
            <p className="text-2xl font-bold">+1 (234) 567-890</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Event Type</label>
                <input
                  required
                  type="text"
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. Wedding, Office Lunch"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Estimated Guests</label>
                <input
                  required
                  type="number"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value === '' ? '' : parseInt(e.target.value) })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Required Items</label>
              <textarea
                required
                value={formData.items}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all h-24"
                placeholder="List the types of bread, pastries, or meals you're interested in..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Budget Range</label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. ₦50,000 - ₦100,000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Event Date</label>
                <input
                  required
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Contact Name</label>
                <input
                  required
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <button
              disabled={submitting}
              type="submit"
              className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all flex items-center justify-center space-x-3 disabled:opacity-70"
            >
              {submitting ? <Loader2 className="animate-spin" /> : <span>Submit Request</span>}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Catering;
