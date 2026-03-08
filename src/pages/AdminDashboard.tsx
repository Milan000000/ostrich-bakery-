import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Cake, 
  Truck, 
  Star, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  FileCode,
  Save,
  FolderOpen,
  Loader2
} from 'lucide-react';
import { Product, Order, CakeRequest, CateringRequest, Special } from '../types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, cakeRequests: 0, cateringRequests: 0 });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin');

    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleLogoClick = () => {
    // Trigger auto-save event for components like FileManager
    window.dispatchEvent(new CustomEvent('admin-auto-save'));
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/dashboard/orders', icon: ShoppingBag },
    { name: 'Products', path: '/admin/dashboard/products', icon: Package },
    { name: 'Cake Requests', path: '/admin/dashboard/cakes', icon: Cake },
    { name: 'Catering', path: '/admin/dashboard/catering', icon: Truck },
    { name: 'Specials', path: '/admin/dashboard/specials', icon: Star },
    { name: 'File Manager', path: '/admin/dashboard/files', icon: FileCode },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full">
        <div 
          className="p-6 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={handleLogoClick}
          title="Save and go to Home"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">O</div>
            <span className="font-bold text-lg text-primary">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-grow p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow md:ml-64 p-4 md:p-8">
        <Routes>
          <Route path="/" element={<DashboardOverview stats={stats} />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/cakes" element={<CakeManagement />} />
          <Route path="/catering" element={<CateringManagement />} />
          <Route path="/specials" element={<SpecialsManagement />} />
          <Route path="/files" element={<FileManager />} />
        </Routes>
      </main>
    </div>
  );
};

const FileManager = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const res = await fetch('/api/admin/files', {
      headers: { 'Authorization': token || '' }
    });
    if (res.ok) {
      const data = await res.json();
      setFiles(data);
    }
  };

  const saveFile = React.useCallback(async () => {
    if (!selectedFile) return;
    setSaving(true);
    const res = await fetch('/api/admin/files/save', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token || ''
      },
      body: JSON.stringify({ path: selectedFile, content })
    });
    if (res.ok) {
      setMessage({ text: 'File saved successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } else {
      setMessage({ text: 'Failed to save file.', type: 'error' });
    }
    setSaving(false);
  }, [selectedFile, content, token]);

  useEffect(() => {
    const handleAutoSave = () => {
      if (selectedFile) {
        saveFile();
      }
    };
    window.addEventListener('admin-auto-save', handleAutoSave);
    return () => window.removeEventListener('admin-auto-save', handleAutoSave);
  }, [selectedFile, saveFile]);

  const loadFile = async (path: string) => {
    setLoading(true);
    setSelectedFile(path);
    const res = await fetch(`/api/admin/files/content?path=${encodeURIComponent(path)}`, {
      headers: { 'Authorization': token || '' }
    });
    if (res.ok) {
      const data = await res.json();
      setContent(data.content);
    }
    setLoading(false);
  };

  const deleteFile = async (path: string) => {
    if (!confirm(`Are you sure you want to delete ${path}?`)) return;
    const res = await fetch(`/api/admin/files?path=${encodeURIComponent(path)}`, {
      method: 'DELETE',
      headers: { 'Authorization': token || '' }
    });
    if (res.ok) {
      if (selectedFile === path) {
        setSelectedFile(null);
        setContent('');
      }
      fetchFiles();
      setMessage({ text: 'File deleted.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Site File Manager</h1>
        {message.text && (
          <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
            message.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {message.text}
          </div>
        )}
      </div>

      <div className="flex-grow flex gap-6 overflow-hidden">
        {/* File List */}
        <div className="w-1/3 bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center space-x-2">
            <FolderOpen size={18} className="text-slate-400" />
            <span className="font-bold text-slate-700">Project Files</span>
          </div>
          <div className="flex-grow overflow-y-auto p-2">
            {files.map(file => (
              <div 
                key={file}
                className={`flex items-center justify-between group p-2 rounded-xl cursor-pointer transition-all ${
                  selectedFile === file ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 text-slate-600'
                }`}
                onClick={() => loadFile(file)}
              >
                <div className="flex items-center space-x-2 truncate">
                  <FileCode size={14} />
                  <span className="text-sm truncate">{file}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteFile(file); }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-grow bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-700 truncate max-w-xs">
                {selectedFile || 'Select a file to edit'}
              </span>
            </div>
            {selectedFile && (
              <button 
                onClick={saveFile}
                disabled={saving}
                className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 flex items-center space-x-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>Save Changes</span>
              </button>
            )}
          </div>
          <div className="flex-grow p-4 relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                <Loader2 size={32} className="animate-spin text-primary" />
              </div>
            ) : selectedFile ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full p-4 font-mono text-sm bg-slate-900 text-slate-100 rounded-2xl outline-none resize-none"
                spellCheck={false}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <FileCode size={64} strokeWidth={1} />
                <p>Select a file from the list to start editing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardOverview = ({ stats }: { stats: any }) => (
  <div className="space-y-8">
    <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="bg-blue-500" />
      <StatCard title="Pending Orders" value={stats.pendingOrders} icon={Clock} color="bg-orange-500" />
      <StatCard title="Cake Requests" value={stats.cakeRequests} icon={Cake} color="bg-pink-500" />
      <StatCard title="Catering Requests" value={stats.cateringRequests} icon={Truck} color="bg-green-500" />
    </div>
    <div className="bg-white p-8 rounded-3xl border border-slate-200">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
      <p className="text-slate-500">Welcome back! Use the sidebar to manage your bakery operations.</p>
    </div>
  </div>
);

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
    <div className={`${color} p-4 rounded-2xl text-white`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders').then(res => res.json()).then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setOrders(orders.map(o => o.id === id ? { ...o, status: status as any } : o));
  };

  const exportCSV = () => {
    const headers = ['ID', 'Customer', 'Phone', 'Product', 'Qty', 'Type', 'Status', 'Date'];
    const rows = orders.map(o => [o.id, o.customer_name, o.phone, o.product_name, o.quantity, o.type, o.status, o.created_at]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "orders.csv";
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
        <button onClick={exportCSV} className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50">
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Order ID</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Customer</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Product</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm">#{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{order.customer_name}</p>
                    <p className="text-xs text-slate-500">{order.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{order.product_name} x {order.quantity}</p>
                    <p className="text-xs text-slate-400 capitalize">{order.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-600' : 
                      order.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg p-1 outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(data => setProducts(data));
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
        <button 
          onClick={() => { setEditingProduct(null); setShowModal(true); }}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <img src={p.image_url} alt={p.name} className="w-full h-32 object-cover rounded-2xl mb-4" />
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-900">{p.name}</h3>
              <span className="text-primary font-bold">₦{p.price.toLocaleString()}</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">{p.category}</p>
            <div className="flex space-x-2">
              <button 
                onClick={() => { setEditingProduct(p); setShowModal(true); }}
                className="flex-grow flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                <Edit size={14} />
                <span>Edit</span>
              </button>
              <button 
                onClick={() => handleDelete(p.id)}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ProductModal 
          product={editingProduct} 
          onClose={() => setShowModal(false)} 
          onSave={() => {
            setShowModal(false);
            fetch('/api/products').then(res => res.json()).then(data => setProducts(data));
          }} 
        />
      )}
    </div>
  );
};

const ProductModal = ({ product, onClose, onSave }: any) => {
  const [formData, setFormData] = useState(product || {
    name: '',
    description: '',
    price: 0,
    category: 'Bread',
    image_url: 'https://picsum.photos/seed/bakery/400/300',
    available: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = product ? 'PUT' : 'POST';
    const url = product ? `/api/products/${product.id}` : '/api/products';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    onSave();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            required
            placeholder="Product Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea 
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary h-24"
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              required
              type="number"
              step="0.01"
              placeholder="Price"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
            />
            <select 
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Bread</option>
              <option>Cakes</option>
              <option>Pastries</option>
              <option>Hot Meals</option>
              <option>Drinks</option>
              <option>Ice Cream</option>
            </select>
          </div>
          <input 
            placeholder="Image URL"
            value={formData.image_url}
            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox"
              checked={formData.available === 1}
              onChange={e => setFormData({ ...formData, available: e.target.checked ? 1 : 0 })}
              className="w-4 h-4 text-primary rounded"
            />
            <label className="text-sm font-medium text-slate-600">Available in stock</label>
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-grow py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
            <button type="submit" className="flex-grow py-3 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20">Save Product</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CakeManagement = () => {
  const [requests, setRequests] = useState<CakeRequest[]>([]);
  useEffect(() => {
    fetch('/api/cake-requests').then(res => res.json()).then(data => setRequests(data));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/cake-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setRequests(requests.map(r => r.id === id ? { ...r, status: status as any } : r));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Cake Requests</h1>
      <div className="grid grid-cols-1 gap-6">
        {requests.map(req => (
          <div key={req.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
            {req.image_url && <img src={req.image_url} className="w-32 h-32 object-cover rounded-2xl" />}
            <div className="flex-grow space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-slate-900">{req.customer_name}</h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                  req.status === 'Ready' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {req.status}
                </span>
              </div>
              <p className="text-sm text-slate-500">Flavor: {req.flavor} | Size: {req.size}</p>
              <p className="text-sm text-slate-600 italic">"{req.description}"</p>
              <div className="flex items-center space-x-4 pt-2">
                <p className="text-xs font-bold text-primary">Pickup: {req.pickup_date}</p>
                <p className="text-xs text-slate-400">Phone: {req.phone}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <select 
                value={req.status}
                onChange={(e) => updateStatus(req.id, e.target.value)}
                className="text-xs border border-slate-200 rounded-lg p-2 outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Ready">Ready</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CateringManagement = () => {
  const [requests, setRequests] = useState<CateringRequest[]>([]);
  useEffect(() => {
    fetch('/api/catering').then(res => res.json()).then(data => setRequests(data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Catering Requests</h1>
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Event</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Customer</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Details</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map(req => (
                <tr key={req.id}>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{req.event_type}</p>
                    <p className="text-xs text-slate-400">{req.event_date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{req.customer_name}</p>
                    <p className="text-xs text-slate-500">{req.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-600">Guests: {req.guests}</p>
                    <p className="text-xs text-slate-600">Budget: {req.budget}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider bg-slate-100 text-slate-500">
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SpecialsManagement = () => {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [newSpecial, setNewSpecial] = useState({ title: '', description: '', price: 0 });

  useEffect(() => {
    fetch('/api/specials').then(res => res.json()).then(data => setSpecials(data));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/specials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSpecial)
    });
    setNewSpecial({ title: '', description: '', price: 0 });
    fetch('/api/specials').then(res => res.json()).then(data => setSpecials(data));
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/specials/${id}`, { method: 'DELETE' });
    setSpecials(specials.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Daily Specials Management</h1>
      
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Add New Special</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            required
            placeholder="Title"
            value={newSpecial.title}
            onChange={e => setNewSpecial({ ...newSpecial, title: e.target.value })}
            className="px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
          />
          <input 
            required
            placeholder="Description"
            value={newSpecial.description}
            onChange={e => setNewSpecial({ ...newSpecial, description: e.target.value })}
            className="px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex space-x-2">
            <input 
              required
              type="number"
              step="0.01"
              placeholder="Price"
              value={newSpecial.price}
              onChange={e => setNewSpecial({ ...newSpecial, price: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              className="flex-grow px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="bg-primary text-white px-6 rounded-xl font-bold hover:bg-primary/90 transition-all">
              Add
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specials.map(s => (
          <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900">{s.title}</h3>
              <p className="text-sm text-slate-500">{s.description}</p>
              <p className="text-primary font-bold mt-1">₦{s.price.toLocaleString()}</p>
            </div>
            <button 
              onClick={() => handleDelete(s.id)}
              className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
