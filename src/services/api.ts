import { Product, Order, AdminNotification, AdminDashboardStats, CustomerStats, DeliveryAddress, OrderStatus } from '../types';

const API_BASE = '/api';

export const api = {
  // Products
  async getProducts(params?: { category?: string; search?: string; featured?: boolean; newArrival?: boolean }) {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.featured) query.append('featured', 'true');
    if (params?.newArrival) query.append('newArrival', 'true');

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json() as Promise<{ products: Product[]; count: number }>;
  },

  async getProduct(id: string) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json() as Promise<{ product: Product }>;
  },

  // Auth
  async register(data: { fullName: string; mobile: string; password: string; confirmPassword?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Registration failed');
    return result;
  },

  async login(data: { mobile: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Login failed');
    return result;
  },

  // Orders
  async placeOrder(data: {
    customerId?: string;
    customerName: string;
    customerMobile: string;
    items: Array<{
      productId: string;
      productName: string;
      productImage: string;
      category: string;
      price: number;
      quantity: number;
    }>;
    deliveryAddress: DeliveryAddress;
    notes?: string;
  }) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to place order');
    return result as { message: string; order: Order };
  },

  async getMyOrders(params: { mobile?: string; customerId?: string }) {
    const query = new URLSearchParams();
    if (params.mobile) query.append('mobile', params.mobile);
    if (params.customerId) query.append('customerId', params.customerId);

    const res = await fetch(`${API_BASE}/orders/my?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json() as Promise<{ orders: Order[] }>;
  },

  // Admin Auth
  async adminLogin(data: { mobile: string; password: string }) {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Admin login failed');
    return result as { message: string; admin: any; token: string };
  },

  // Admin Products
  async adminAddProduct(product: Partial<Product>, token: string) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(product),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to add product');
    return result as { message: string; product: Product };
  },

  async adminUpdateProduct(id: string, product: Partial<Product>, token: string) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(product),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update product');
    return result as { message: string; product: Product };
  },

  async adminDeleteProduct(id: string, token: string) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete product');
    return result as { message: string; product: Product };
  },

  // Admin Orders
  async adminGetOrders(token: string, params?: { status?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/admin/orders?${query.toString()}`, {
      headers: { Authorization: token },
    });
    if (!res.ok) throw new Error('Failed to fetch admin orders');
    return res.json() as Promise<{ orders: Order[]; count: number }>;
  },

  async adminUpdateOrderStatus(orderId: string, status: OrderStatus, token: string) {
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update order status');
    return result as { message: string; order: Order };
  },

  // Admin Customers
  async adminGetCustomers(token: string, search?: string) {
    const query = new URLSearchParams();
    if (search) query.append('search', search);

    const res = await fetch(`${API_BASE}/admin/customers?${query.toString()}`, {
      headers: { Authorization: token },
    });
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json() as Promise<{ customers: CustomerStats[]; count: number }>;
  },

  // Admin Stats
  async adminGetStats(token: string) {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { Authorization: token },
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json() as Promise<{ stats: AdminDashboardStats }>;
  },

  // Admin Notifications
  async adminGetNotifications(token: string) {
    const res = await fetch(`${API_BASE}/admin/notifications`, {
      headers: { Authorization: token },
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json() as Promise<{ notifications: AdminNotification[]; unreadCount: number }>;
  },

  async adminMarkNotificationRead(id: string, token: string) {
    const res = await fetch(`${API_BASE}/admin/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: token },
    });
    return res.json();
  },

  async adminMarkAllNotificationsRead(token: string) {
    const res = await fetch(`${API_BASE}/admin/notifications/mark-all-read`, {
      method: 'POST',
      headers: { Authorization: token },
    });
    return res.json();
  },

  // Branding & Logo Settings
  async getBranding() {
    const res = await fetch(`${API_BASE}/settings/branding`);
    if (!res.ok) throw new Error('Failed to fetch branding');
    return res.json();
  },

  async saveBranding(brandingData: any, token?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = token;

    const res = await fetch(`${API_BASE}/settings/branding`, {
      method: 'POST',
      headers,
      body: JSON.stringify(brandingData),
    });
    if (!res.ok) throw new Error('Failed to save branding');
    return res.json();
  },
};

