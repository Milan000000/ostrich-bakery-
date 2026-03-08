import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cake, CheckCircle, Loader2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CakeRequest = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    flavor: '',
    size: '',
    description: '',
    image_url: '',
    pickup_date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/cake-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) setSuccess(true);
    } catch (error) {
      console.error('Request failed', error);
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
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Request Sent!</h1>
          <p className="text-slate-600 mb-8">
            We've received your custom cake request. Our head baker will review it and contact you shortly to discuss the details.
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
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-primary-light p-8 rounded-[2.5rem] border border-primary/10">
            <Cake className="text-primary mb-6" size={48} />
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Dream Cakes</h1>
            <p className="text-slate-600">
              Whether it's a wedding, birthday, or any special milestone, we craft custom cakes that taste as good as they look.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-xl">Our Process</h3>
            <ul className="space-y-3">
              {[
                'Submit your request with details',
                'We call you for a consultation',
                'Receive a custom quote',
                'We bake and decorate your masterpiece',
                'Pickup or delivery on your big day'
              ].map((step, i) => (
                <li key={i} className="flex items-center space-x-3 text-slate-600">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Your Name</label>
                <input
                  required
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Jane Smith"
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
                  placeholder="+1 (234) 567-890"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Preferred Flavor</label>
                <select
                  required
                  value={formData.flavor}
                  onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none bg-white"
                >
                  <option value="">Select a flavor...</option>
                  <option value="Vanilla">Classic Vanilla</option>
                  <option value="Chocolate">Rich Chocolate</option>
                  <option value="Red Velvet">Red Velvet</option>
                  <option value="Lemon">Zesty Lemon</option>
                  <option value="Carrot">Carrot Cake</option>
                  <option value="Custom">Other (Specify in notes)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Cake Size</label>
                <select
                  required
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none bg-white"
                >
                  <option value="">Select a size...</option>
                  <option value="6-inch">6-inch (Serves 8-10)</option>
                  <option value="8-inch">8-inch (Serves 15-20)</option>
                  <option value="10-inch">10-inch (Serves 25-30)</option>
                  <option value="Tiered">Multi-tiered (Wedding/Large Event)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Design Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all h-32"
                placeholder="Tell us about the theme, colors, and any text you want on the cake..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Inspiration Image URL</label>
              <div className="relative">
                <Upload className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Link to a photo (Pinterest, Instagram, etc.)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Pickup Date</label>
              <input
                required
                type="date"
                value={formData.pickup_date}
                onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>

            <button
              disabled={submitting}
              type="submit"
              className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all flex items-center justify-center space-x-3 disabled:opacity-70"
            >
              {submitting ? <Loader2 className="animate-spin" /> : <span>Send Request</span>}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default CakeRequest;
