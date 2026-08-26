export type ProductCategory = 
  | 'Silk Sarees'
  | 'Pattu Sarees'
  | 'Cotton Sarees'
  | 'Designer Sarees'
  | 'Party Wear Sarees'
  | 'Luxury Handbags'
  | 'Bridal Clutches & Potlis'
  | 'Sling & Shoulder Bags'
  | 'Tote Bags'
  | 'Bridal Jewellery Sets'
  | 'Necklaces & Chokers'
  | 'Earrings & Jhumkas'
  | 'Bangles & Kadas'
  | 'Temple & Kundan Jewellery'
  | 'New Arrivals'
  | string;

export type SareeCategory = ProductCategory;

export type DepartmentType = 'all' | 'sarees' | 'handbags' | 'jewellery';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  description: string;
  fabric: string; // Fabric / Material description (e.g. Mulberry Silk, Vegan Leather, Gold Plated Brass)
  blouseIncluded: boolean; // Blouse included (Sarees) or Extras/Dustbag/Gift Box included (Bags/Jewellery)
  length: string; // Length / Dimensions / Size specification
  images: string[];
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
}

export interface User {
  id: string;
  fullName: string;
  mobile: string;
  createdAt: string;
  role?: 'customer' | 'admin';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryAddress {
  fullName: string;
  mobile: string;
  altMobile?: string;
  houseNumber: string;
  street: string;
  colonyArea: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string; // e.g. "MC-2026-8492"
  customerId?: string;
  customerName: string;
  customerMobile: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: DeliveryAddress;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminNotification {
  id: string;
  orderId: string;
  customerName: string;
  productName: string;
  totalAmount: number;
  createdAt: string;
  read: boolean;
}

export interface CustomerNotification {
  id: string;
  orderId: string;
  customerId?: string;
  customerMobile: string;
  title: string;
  message: string;
  type: 'order_placed' | 'order_received' | 'order_delivered' | 'order_status';
  status: OrderStatus;
  totalAmount: number;
  productName: string;
  createdAt: string;
  read: boolean;
}

export interface CustomerStats {
  id: string;
  fullName: string;
  mobile: string;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
  recentOrders: Order[];
}

export interface AdminDashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalProducts: number;
  totalSales: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  recentOrders: Order[];
}

export interface StoreBranding {
  brandName: string;
  brandSubname: string;
  tagline: string;
  quote: string;
  logoUrl?: string; // Base64 data URI or public image URL
  logoShape?: 'circle' | 'rounded' | 'square';
  logoGlow?: boolean;
  contactPhone?: string;
  whatsappNumber?: string;
}

