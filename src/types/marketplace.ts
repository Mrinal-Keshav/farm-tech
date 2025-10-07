export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
  quantity: number;
  category: ProductCategory;
  sellerId: string;
  sellerName: string;
  createdAt: Date;
  location?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  location: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
  buyerId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: string;
  phone?: string;
}

export type ProductCategory = 'fertilizers' | 'farming-books' | 'fresh-vegetables' | 'tools' | 'seeds' | 'irrigation' | 'protection';

export type UserRole = 'buyer' | 'seller';

export type Language = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr';

export interface PriceBreakdown {
  basePrice: number;
  platformFee: number;
  finalPrice: number;
  sellerEarnings: number;
}

export interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  topProducts: Product[];
  salesByCategory: { category: string; sales: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}

