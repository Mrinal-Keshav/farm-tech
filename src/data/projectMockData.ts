import { Product, ProductCategory, AnalyticsData } from '../types/marketplace';

export const projectMockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Organic Fertilizer Premium',
    description: 'High-quality organic fertilizer perfect for vegetable gardens. Enriches soil naturally with essential nutrients.',
    image: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=400',
    basePrice: 45.99,
    quantity: 25,
    category: 'fertilizers' as ProductCategory,
    sellerId: 'seller1',
    sellerName: 'Green Valley Farm Supply',
    location: 'Punjab, India',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'p2',
    name: 'Professional Pruning Shears',
    description: 'Sharp, durable pruning shears for professional gardening. Ergonomic design for comfortable use.',
    image: 'https://images.pexels.com/photos/4503438/pexels-photo-4503438.jpeg?auto=compress&cs=tinysrgb&w=400',
    basePrice: 29.99,
    quantity: 15,
    category: 'tools' as ProductCategory,
    sellerId: 'seller2',
    sellerName: 'Farm Tools Pro',
    location: 'Maharashtra, India',
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'p3',
    name: 'Complete Guide to Organic Farming',
    description: 'Comprehensive guide covering all aspects of organic farming, from soil preparation to harvest techniques.',
    image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400',
    basePrice: 24.95,
    quantity: 50,
    category: 'farming-books' as ProductCategory,
    sellerId: 'seller3',
    sellerName: 'Agricultural Education Press',
    location: 'Karnataka, India',
    createdAt: new Date('2024-01-10')
  }
];

export const projectMockAnalytics: AnalyticsData = {
  totalSales: 125000,
  totalOrders: 450,
  topProducts: projectMockProducts.slice(0, 3),
  salesByCategory: [
    { category: 'Fresh Vegetables', sales: 45000 },
    { category: 'Fertilizers', sales: 35000 },
    { category: 'Tools', sales: 25000 },
    { category: 'Farming Books', sales: 20000 }
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 18000 },
    { month: 'Mar', revenue: 22000 },
    { month: 'Apr', revenue: 25000 },
    { month: 'May', revenue: 28000 },
    { month: 'Jun', revenue: 17000 }
  ]
};


