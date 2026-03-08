import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('bakery.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    available INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    product_id INTEGER,
    quantity INTEGER,
    type TEXT, -- pickup/delivery
    address TEXT,
    pickup_time TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cake_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    flavor TEXT,
    size TEXT,
    description TEXT,
    image_url TEXT,
    pickup_date TEXT,
    status TEXT DEFAULT 'Pending',
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS catering_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT,
    guests INTEGER,
    items TEXT,
    budget TEXT,
    event_date TEXT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS specials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL,
    active INTEGER DEFAULT 1
  );
`);

// Seed initial products if empty
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (productCount.count === 0) {
  const insert = db.prepare('INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)');
  insert.run('Sourdough Bread', 'Freshly baked artisan sourdough.', 2500, 'Bread', 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=800&q=80');
  insert.run('Chocolate Croissant', 'Flaky pastry with rich chocolate filling.', 1800, 'Pastries', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80');
  insert.run('Vanilla Cupcake', 'Sweet vanilla cupcake with buttercream.', 1500, 'Cakes', 'https://images.unsplash.com/photo-1586788680434-30d324671ff6?auto=format&fit=crop&w=800&q=80');
  insert.run('Iced Latte', 'Chilled espresso with milk.', 2000, 'Drinks', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80');
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  });

  app.post('/api/products', (req, res) => {
    const { name, description, price, category, image_url } = req.body;
    const info = db.prepare('INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)').run(name, description, price, category, image_url);
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/products/:id', (req, res) => {
    const { name, description, price, category, image_url, available } = req.body;
    db.prepare('UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_url = ?, available = ? WHERE id = ?')
      .run(name, description, price, category, image_url, available ? 1 : 0, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/products/:id', (req, res) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.get('/api/orders', (req, res) => {
    const orders = db.prepare(`
      SELECT orders.*, products.name as product_name 
      FROM orders 
      LEFT JOIN products ON orders.product_id = products.id
      ORDER BY created_at DESC
    `).all();
    res.json(orders);
  });

  app.post('/api/orders', (req, res) => {
    const { customer_name, phone, product_id, quantity, type, address, pickup_time, notes } = req.body;
    const info = db.prepare('INSERT INTO orders (customer_name, phone, product_id, quantity, type, address, pickup_time, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(customer_name, phone, product_id, quantity, type, address, pickup_time, notes);
    res.json({ id: info.lastInsertRowid });
  });

  app.patch('/api/orders/:id', (req, res) => {
    const { status } = req.body;
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  });

  app.get('/api/cake-requests', (req, res) => {
    const requests = db.prepare('SELECT * FROM cake_requests ORDER BY created_at DESC').all();
    res.json(requests);
  });

  app.post('/api/cake-requests', (req, res) => {
    const { customer_name, phone, flavor, size, description, image_url, pickup_date } = req.body;
    const info = db.prepare('INSERT INTO cake_requests (customer_name, phone, flavor, size, description, image_url, pickup_date) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(customer_name, phone, flavor, size, description, image_url, pickup_date);
    res.json({ id: info.lastInsertRowid });
  });

  app.patch('/api/cake-requests/:id', (req, res) => {
    const { status, admin_notes } = req.body;
    db.prepare('UPDATE cake_requests SET status = ?, admin_notes = ? WHERE id = ?').run(status, admin_notes, req.params.id);
    res.json({ success: true });
  });

  app.get('/api/catering', (req, res) => {
    const requests = db.prepare('SELECT * FROM catering_requests ORDER BY created_at DESC').all();
    res.json(requests);
  });

  app.post('/api/catering', (req, res) => {
    const { event_type, guests, items, budget, event_date, customer_name, phone } = req.body;
    const info = db.prepare('INSERT INTO catering_requests (event_type, guests, items, budget, event_date, customer_name, phone) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(event_type, guests, items, budget, event_date, customer_name, phone);
    res.json({ id: info.lastInsertRowid });
  });

  app.patch('/api/catering/:id', (req, res) => {
    const { status, admin_notes } = req.body;
    db.prepare('UPDATE catering_requests SET status = ?, admin_notes = ? WHERE id = ?').run(status, admin_notes, req.params.id);
    res.json({ success: true });
  });

  app.get('/api/specials', (req, res) => {
    const specials = db.prepare('SELECT * FROM specials WHERE active = 1').all();
    res.json(specials);
  });

  app.post('/api/specials', (req, res) => {
    const { title, description, price } = req.body;
    const info = db.prepare('INSERT INTO specials (title, description, price) VALUES (?, ?, ?)').run(title, description, price);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete('/api/specials/:id', (req, res) => {
    db.prepare('DELETE FROM specials WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    if (password === 'milan000000') {
      res.json({ success: true, token: 'fake-jwt-token' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  });

  // File Management API (restricted to admin)
  const isAdmin = (req: any) => {
    return req.headers.authorization === 'fake-jwt-token';
  };

  app.get('/api/admin/files', (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: 'Unauthorized' });
    const root = process.cwd();
    const getFiles = (dir: string, fileList: string[] = []) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'bakery.db' || file === '.gemini') return;
        if (fs.statSync(filePath).isDirectory()) {
          getFiles(filePath, fileList);
        } else {
          fileList.push(path.relative(root, filePath));
        }
      });
      return fileList;
    };
    try {
      const files = getFiles(root);
      res.json(files);
    } catch (err) {
      res.status(500).json({ error: 'Failed to list files' });
    }
  });

  app.get('/api/admin/files/content', (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: 'Unauthorized' });
    const filePath = req.query.path as string;
    if (!filePath) return res.status(400).json({ error: 'Path required' });
    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fullPath.startsWith(process.cwd())) return res.status(403).json({ error: 'Access denied' });
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      res.json({ content });
    } catch (err) {
      res.status(500).json({ error: 'Failed to read file' });
    }
  });

  app.post('/api/admin/files/save', (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: 'Unauthorized' });
    const { path: filePath, content } = req.body;
    if (!filePath) return res.status(400).json({ error: 'Path required' });
    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fullPath.startsWith(process.cwd())) return res.status(403).json({ error: 'Access denied' });
    try {
      fs.writeFileSync(fullPath, content, 'utf-8');
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save file' });
    }
  });

  app.delete('/api/admin/files', (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: 'Unauthorized' });
    const filePath = req.query.path as string;
    if (!filePath) return res.status(400).json({ error: 'Path required' });
    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fullPath.startsWith(process.cwd())) return res.status(403).json({ error: 'Access denied' });
    try {
      fs.unlinkSync(fullPath);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete file' });
    }
  });

  app.get('/api/stats', (req, res) => {
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'").get() as { count: number };
    const cakeRequests = db.prepare('SELECT COUNT(*) as count FROM cake_requests').get() as { count: number };
    const cateringRequests = db.prepare('SELECT COUNT(*) as count FROM catering_requests').get() as { count: number };
    
    res.json({
      totalOrders: totalOrders.count,
      pendingOrders: pendingOrders.count,
      cakeRequests: cakeRequests.count,
      cateringRequests: cateringRequests.count
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
