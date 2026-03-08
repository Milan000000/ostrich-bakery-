import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
          <p className="text-slate-500">Please enter the password to continue.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-xl text-sm font-medium">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <span>Login to Dashboard</span>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-primary text-sm font-medium transition-colors"
          >
            Return to Website
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
