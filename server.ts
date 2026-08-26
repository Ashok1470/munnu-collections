import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import bcrypt from 'bcryptjs';
import { INITIAL_PRODUCTS } from './src/data/initialProducts.ts';
import { Product, Order, AdminNotification, DeliveryAddress, OrderStatus, StoreBranding } from './src/types.ts';

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// File persistence path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'munnu_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface StoredUser {
  id: string;
  fullName: string;
  mobile: string;
  passwordHash: string;
  createdAt: string;
  role: 'customer' | 'admin';
}

interface DatabaseSchema {
  users: StoredUser[];
  products: Product[];
  orders: Order[];
  notifications: AdminNotification[];
  branding: StoreBranding;
}

const DEFAULT_BRANDING: StoreBranding = {
  brandName: 'MUNNU',
  brandSubname: 'COLLECTIONS',
  tagline: 'Exclusive Saree Boutique',
  quote: '“Style Speaks Louder Than Words”',
  logoUrl: '/munnu-logo.svg',
  logoShape: 'circle',
  logoGlow: true,
  contactPhone: '+91 9030782430',
  whatsappNumber: '+91 9030782430',
};

// Initial In-memory and persisted DB
let db: DatabaseSchema = {
  branding: DEFAULT_BRANDING,
  users: [
    {
      id: 'cust-demo-1',
      fullName: 'Priya Sharma',
      mobile: '9876543210',
      // Password: "Password123"
      passwordHash: bcrypt.hashSync('Password123', 8),
      createdAt: '2026-08-18T10:00:00.000Z',
      role: 'customer',
    }
  ],
  products: [],
  orders: [],
  notifications: []
};

// Load database if file exists
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed) {
        db = {
          users: parsed.users || db.users,
          products: Array.isArray(parsed.products) ? parsed.products : [],
          orders: Array.isArray(parsed.orders) ? parsed.orders : [],
          notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
          branding: parsed.branding || DEFAULT_BRANDING,
        };
      }
    } else {
      saveDatabase();
    }
  } catch (err) {
    console.error('Error reading store database file, using fallback', err);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store database file', err);
  }
}

loadDatabase();

// SSE Connected Admin Clients for real-time notification push
type SSEClient = {
  id: string;
  res: express.Response;
};
let sseClients: SSEClient[] = [];

function broadcastAdminEvent(type: string, data: any) {
  const payload = `data: ${JSON.stringify({ type, data })}\n\n`;
  sseClients.forEach(client => {
    try {
      client.res.write(payload);
    } catch (e) {
      console.error('Error pushing SSE message to client', e);
    }
  });
}

// Credentials config
const ADMIN_MOBILE = process.env.ADMIN_MOBILE || '9030782430';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Himabindu';
const ADMIN_TOKEN_KEY = 'munnu_admin_token_secure_himabindu_9030782430';

// Helpers
function sanitizeUser(user: StoredUser) {
  return {
    id: user.id,
    fullName: user.fullName,
    mobile: user.mobile,
    createdAt: user.createdAt,
    role: user.role,
  };
}

// ==================== AUTH ROUTES ====================

// Customer Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, mobile, password, confirmPassword } = req.body;

    if (!fullName || !mobile || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const cleanMobile = mobile.trim().replace(/\D/g, '').slice(-10);
    if (cleanMobile.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Password and Confirm Password do not match.' });
    }

    // Check if mobile already exists
    const existingUser = db.users.find(u => u.mobile === cleanMobile);
    if (existingUser) {
      return res.status(409).json({
        error: 'This mobile number is already registered. Please login.',
        alreadyRegistered: true,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: StoredUser = {
      id: `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fullName: fullName.trim(),
      mobile: cleanMobile,
      passwordHash,
      createdAt: new Date().toISOString(),
      role: 'customer',
    };

    db.users.push(newUser);
    saveDatabase();

    const userPayload = sanitizeUser(newUser);
    // Simple session token
    const token = Buffer.from(`${newUser.id}:${newUser.mobile}:${Date.now()}`).toString('base64');

    return res.status(201).json({
      message: 'Registration successful!',
      user: userPayload,
      token,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Customer Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ error: 'Mobile number and password are required.' });
    }

    const cleanMobile = mobile.trim().replace(/\D/g, '').slice(-10);
    const user = db.users.find(u => u.mobile === cleanMobile);

    if (!user) {
      return res.status(401).json({ error: 'Invalid mobile number or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid mobile number or password.' });
    }

    const userPayload = sanitizeUser(user);
    const token = Buffer.from(`${user.id}:${user.mobile}:${Date.now()}`).toString('base64');

    return res.json({
      message: 'Login successful!',
      user: userPayload,
      token,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ error: 'Admin mobile number and password are required.' });
    }

    const cleanMobile = mobile.trim().replace(/\D/g, '').slice(-10);
    const adminCleanMobile = ADMIN_MOBILE.replace(/\D/g, '').slice(-10);

    const isMobileValid = cleanMobile === adminCleanMobile;
    const isPasswordValid = password === ADMIN_PASSWORD;

    if (!isMobileValid || !isPasswordValid) {
      return res.status(401).json({ error: 'Invalid admin mobile number or password.' });
    }

    // Generate secure admin session token
    const adminToken = `${ADMIN_TOKEN_KEY}_${Buffer.from(`${cleanMobile}:${Date.now()}`).toString('base64')}`;

    return res.json({
      message: 'Admin access granted.',
      admin: {
        name: 'Munnu Collections Administrator',
        mobile: ADMIN_MOBILE,
        role: 'admin',
      },
      token: adminToken,
    });
  } catch (err: any) {
    console.error('Admin login error:', err);
    return res.status(500).json({ error: 'Admin authentication failed.' });
  }
});

// Admin verification middleware
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes(ADMIN_TOKEN_KEY)) {
    return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
  }
  next();
}

// ==================== PRODUCT ROUTES ====================

// Get all products (supports category, query search, featured, new arrivals)
app.get('/api/products', (req, res) => {
  try {
    let list = [...db.products];
    const { category, search, featured, newArrival } = req.query;

    if (category && category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }

    if (featured === 'true') {
      list = list.filter(p => p.isFeatured);
    }

    if (newArrival === 'true') {
      list = list.filter(p => p.isNewArrival);
    }

    if (search) {
      const q = String(search).toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q)
      );
    }

    return res.json({ products: list, count: list.length });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product details
app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json({ product });
});

// Admin Create Product
app.post('/api/products', requireAdmin, (req, res) => {
  try {
    const {
      name,
      category,
      price,
      originalPrice,
      description,
      fabric,
      blouseIncluded = true,
      length = '6.3 Meters (with blouse)',
      images = [],
      stock = 10,
      isFeatured = false,
      isNewArrival = true,
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Product name, category, and price are required.' });
    }

    const newProduct: Product = {
      id: `saree-${Date.now()}`,
      name: String(name).trim(),
      category: category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.35),
      description: String(description || '').trim(),
      fabric: String(fabric || 'Pure Handloom Silk').trim(),
      blouseIncluded: Boolean(blouseIncluded),
      length: String(length || '6.3 Meters (with blouse)'),
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85'
      ],
      stock: Number(stock) || 0,
      isFeatured: Boolean(isFeatured),
      isNewArrival: Boolean(isNewArrival),
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString(),
    };

    db.products.unshift(newProduct);
    saveDatabase();

    return res.status(201).json({
      message: 'Product added successfully',
      product: newProduct,
    });
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({ error: 'Failed to add product' });
  }
});

// Admin Update Product
app.put('/api/products/:id', requireAdmin, (req, res) => {
  try {
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const current = db.products[index];
    const updated: Product = {
      ...current,
      ...req.body,
      id: current.id,
      price: req.body.price !== undefined ? Number(req.body.price) : current.price,
      originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : current.originalPrice,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : current.stock,
      isFeatured: req.body.isFeatured !== undefined ? Boolean(req.body.isFeatured) : current.isFeatured,
      isNewArrival: req.body.isNewArrival !== undefined ? Boolean(req.body.isNewArrival) : current.isNewArrival,
    };

    db.products[index] = updated;
    saveDatabase();

    return res.json({
      message: 'Product updated successfully',
      product: updated,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update product' });
  }
});

// Admin Delete Product
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  try {
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deleted = db.products.splice(index, 1)[0];
    saveDatabase();

    return res.json({
      message: 'Product deleted successfully',
      product: deleted,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ==================== ORDER ROUTES ====================

// Customer Place Order
app.post('/api/orders', (req, res) => {
  try {
    const {
      customerId,
      customerName,
      customerMobile,
      items,
      deliveryAddress,
      notes,
    } = req.body;

    if (!customerName || !customerMobile || !items || !items.length || !deliveryAddress) {
      return res.status(400).json({ error: 'Missing required order details or address.' });
    }

    // Validate delivery address fields
    const { houseNumber, street, colonyArea, city, district, state, pincode } = deliveryAddress;
    if (!houseNumber || !street || !city || !pincode) {
      return res.status(400).json({ error: 'Please fill in all mandatory address fields.' });
    }

    // Calculate total & decrement stock
    let calculatedTotal = 0;
    for (const item of items) {
      calculatedTotal += Number(item.price) * Number(item.quantity);
      // Decrement stock in db
      const prod = db.products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - Number(item.quantity));
      }
    }

    const orderId = `MC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      customerId: customerId || undefined,
      customerName: customerName.trim(),
      customerMobile: customerMobile.trim(),
      items,
      totalAmount: calculatedTotal,
      deliveryAddress,
      status: 'Pending',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);

    // Create real-time Admin Notification
    const newNotification: AdminNotification = {
      id: `notif-${Date.now()}`,
      orderId: newOrder.id,
      customerName: newOrder.customerName,
      productName: items.map((i: any) => i.productName).join(', '),
      totalAmount: newOrder.totalAmount,
      createdAt: newOrder.createdAt,
      read: false,
    };

    db.notifications.unshift(newNotification);
    saveDatabase();

    // Broadcast Real-Time SSE to all active Admin Dashboards
    broadcastAdminEvent('NEW_ORDER', {
      order: newOrder,
      notification: newNotification,
    });

    return res.status(201).json({
      message: 'Your order has been placed successfully!',
      order: newOrder,
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return res.status(500).json({ error: 'Failed to place order. Please try again.' });
  }
});

// Customer: Get My Orders
app.get('/api/orders/my', (req, res) => {
  try {
    const { mobile, customerId } = req.query;

    if (!mobile && !customerId) {
      return res.status(400).json({ error: 'Mobile number or Customer ID required.' });
    }

    const cleanMobile = mobile ? String(mobile).replace(/\D/g, '').slice(-10) : '';

    const myOrders = db.orders.filter(order => {
      if (customerId && order.customerId === customerId) return true;
      if (cleanMobile && order.customerMobile.replace(/\D/g, '').slice(-10) === cleanMobile) return true;
      return false;
    });

    return res.json({ orders: myOrders });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve order history' });
  }
});

// ==================== ADMIN MANAGEMENT ROUTES ====================

// Admin: Get All Orders with filtering
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  try {
    const { status, search } = req.query;
    let list = [...db.orders];

    if (status && status !== 'All') {
      list = list.filter(o => o.status.toLowerCase() === String(status).toLowerCase());
    }

    if (search) {
      const q = String(search).toLowerCase().trim();
      list = list.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerMobile.includes(q) ||
        o.deliveryAddress.city.toLowerCase().includes(q) ||
        o.items.some(i => i.productName.toLowerCase().includes(q))
      );
    }

    return res.json({ orders: list, count: list.length });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch admin orders' });
  }
});

// Admin: Update Order Status
app.patch('/api/admin/orders/:id/status', requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status value.' });
    }

    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
    saveDatabase();

    broadcastAdminEvent('ORDER_STATUS_UPDATED', { order });

    return res.json({
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Admin: Get Registered Customers with order analytics
app.get('/api/admin/customers', requireAdmin, (req, res) => {
  try {
    const { search } = req.query;
    let customerList = db.users
      .filter(u => u.role === 'customer')
      .map(u => {
        const userOrders = db.orders.filter(
          o => o.customerId === u.id || o.customerMobile.replace(/\D/g, '').slice(-10) === u.mobile.slice(-10)
        );
        const totalSpent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);

        return {
          id: u.id,
          fullName: u.fullName,
          mobile: u.mobile,
          createdAt: u.createdAt,
          ordersCount: userOrders.length,
          totalSpent,
          recentOrders: userOrders.slice(0, 3),
        };
      });

    if (search) {
      const q = String(search).toLowerCase().trim();
      customerList = customerList.filter(c => 
        c.fullName.toLowerCase().includes(q) ||
        c.mobile.includes(q)
      );
    }

    return res.json({ customers: customerList, count: customerList.length });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch customer list' });
  }
});

// Admin: Get Dashboard Overall Stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  try {
    const totalCustomers = db.users.filter(u => u.role === 'customer').length;
    const totalOrders = db.orders.length;
    const totalProducts = db.products.length;
    const totalSales = db.orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = db.orders.filter(o => o.status === 'Pending').length;
    const shippedOrders = db.orders.filter(o => o.status === 'Shipped').length;
    const deliveredOrders = db.orders.filter(o => o.status === 'Delivered').length;

    return res.json({
      stats: {
        totalCustomers,
        totalOrders,
        totalProducts,
        totalSales,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        recentOrders: db.orders.slice(0, 5),
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to calculate stats' });
  }
});

// Admin: Get Notifications List
app.get('/api/admin/notifications', requireAdmin, (req, res) => {
  try {
    const unreadCount = db.notifications.filter(n => !n.read).length;
    return res.json({
      notifications: db.notifications,
      unreadCount,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Admin: Mark notification as read
app.patch('/api/admin/notifications/:id/read', requireAdmin, (req, res) => {
  const notif = db.notifications.find(n => n.id === req.params.id);
  if (notif) {
    notif.read = true;
    saveDatabase();
  }
  return res.json({ success: true });
});

// Admin: Mark all notifications as read
app.post('/api/admin/notifications/mark-all-read', requireAdmin, (req, res) => {
  db.notifications.forEach(n => { n.read = true; });
  saveDatabase();
  return res.json({ success: true, count: db.notifications.length });
});

// ==================== STORE SETTINGS & BRANDING ====================

// Get Store Branding (Public)
app.get('/api/settings/branding', (req, res) => {
  return res.json(db.branding || DEFAULT_BRANDING);
});

// Update Store Branding (Admin ONLY)
app.post('/api/settings/branding', requireAdmin, (req, res) => {
  try {
    const { brandName, brandSubname, tagline, quote, logoUrl, logoShape, logoGlow, contactPhone, whatsappNumber } = req.body;

    db.branding = {
      brandName: brandName !== undefined ? brandName : (db.branding.brandName || 'MUNNU'),
      brandSubname: brandSubname !== undefined ? brandSubname : (db.branding.brandSubname || 'COLLECTIONS'),
      tagline: tagline !== undefined ? tagline : (db.branding.tagline || 'Exclusive Saree Boutique'),
      quote: quote !== undefined ? quote : (db.branding.quote || '“Style Speaks Louder Than Words”'),
      logoUrl: logoUrl !== undefined ? logoUrl : db.branding.logoUrl,
      logoShape: logoShape || db.branding.logoShape || 'circle',
      logoGlow: logoGlow !== undefined ? Boolean(logoGlow) : (db.branding.logoGlow !== false),
      contactPhone: contactPhone || db.branding.contactPhone || '+91 9030782430',
      whatsappNumber: whatsappNumber || db.branding.whatsappNumber || '+91 9030782430',
    };

    saveDatabase();

    // Broadcast branding change via SSE to all active clients
    broadcastAdminEvent('BRANDING_UPDATED', db.branding);

    return res.json({
      success: true,
      message: 'Store branding updated successfully',
      branding: db.branding,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update store branding' });
  }
});


// Real-Time Server-Sent Events (SSE) Stream for Admin Notifications & Live Orders
app.get('/api/admin/notifications/stream', (req, res) => {
  // Setup SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  const clientId = `client-${Date.now()}-${Math.random()}`;
  const client: SSEClient = { id: clientId, res };
  sseClients.push(client);

  // Send initial ping connection
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', clientId })}\n\n`);

  // Heartbeat keep-alive every 25 seconds
  const interval = setInterval(() => {
    try {
      res.write(`: ping\n\n`);
    } catch (e) {
      clearInterval(interval);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(interval);
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

// ==================== VITE & PRODUCTION SETUP ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Munnu Collections server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
