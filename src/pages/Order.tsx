import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Product } from '../types';

const Order = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('productId');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    product_id: productId || '',
    quantity: 1,
    type: 'pickup',
    address: '',
    pickup_time: '',
    notes: ''
  });

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.filter((p: Product) => p.available));
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Order failed', error);
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
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Order Placed!</h1>
          <p className="text-slate-600 mb-8">
            Thank you for your order, {formData.customer_name}. We've received it and will start preparing it shortly.
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20"
          >
            Back to Menu
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 py-12"
    >
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-slate-500 hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Go Back</span>
      </button>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-primary">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Place Your Order</h1>
            <p className="text-slate-500">Fill in the details below to order your favorite treats.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <input
              required
              type="text"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="John Doe"
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

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Select Product</label>
            <select
              required
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none bg-white"
            >
              <option value="">Choose a product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} - ₦{p.price.toLocaleString()}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Quantity</label>
            <input
              required
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value === '' ? '' : parseInt(e.target.value) })}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Order Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'pickup' })}
                className={`py-4 rounded-2xl font-bold border-2 transition-all ${
                  formData.type === 'pickup' 
                    ? 'border-primary bg-primary-light text-primary' 
                    : 'border-slate-100 bg-slate-50 text-slate-500'
                }`}
              >
                Store Pickup
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'delivery' })}
                className={`py-4 rounded-2xl font-bold border-2 transition-all ${
                  formData.type === 'delivery' 
                    ? 'border-primary bg-primary-light text-primary' 
                    : 'border-slate-100 bg-slate-50 text-slate-500'
                }`}
              >
                Home Delivery
              </button>
            </div>
          </div>

          {formData.type === 'delivery' ? (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Delivery Address</label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all h-24"
                placeholder="Street name, Apartment, City..."
              />
            </div>
          ) : (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Pickup Time</label>
              <input
                required
                type="datetime-local"
                value={formData.pickup_time}
                onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          )}

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all h-24"
              placeholder="Any special requests? (e.g. no nuts, extra napkins)"
            />
          </div>

          <div className="md:col-span-2 pt-4">
            <button
              disabled={submitting}
              type="submit"
              className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-primary/20 hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center space-x-3 disabled:opacity-70"
            >
              {submitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <ShoppingBag size={22} />
                  <span>Confirm Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Order;
