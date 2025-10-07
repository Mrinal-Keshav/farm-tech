import { Product, ProductCategory, AnalyticsData } from '../types/marketplace';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Fertilizer Premium',
    description: 'High-quality organic fertilizer perfect for vegetable gardens. Enriches soil naturally with essential nutrients.',
    image: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=400',
    basePrice: 459.99,
    quantity: 25,
    category: 'fertilizers' as ProductCategory,
    sellerId: 'seller1',
    sellerName: 'Priya Sharma Farm Supply',
    location: 'Punjab, India',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Professional Pruning Shears',
    description: 'Sharp, durable pruning shears for professional gardening. Ergonomic design for comfortable use.',
    image: 'https://images.pexels.com/photos/4503438/pexels-photo-4503438.jpeg?auto=compress&cs=tinysrgb&w=400',
    basePrice: 299.99,
    quantity: 15,
    category: 'tools' as ProductCategory,
    sellerId: 'seller2',
    sellerName: 'Rajesh Kumar Tools',
    location: 'Maharashtra, India',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Complete Guide to Organic Farming',
    description: 'Comprehensive guide covering all aspects of organic farming, from soil preparation to harvest techniques.',
    image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400',
    basePrice: 249.50,
    quantity: 50,
    category: 'farming-books' as ProductCategory,
    sellerId: 'seller3',
    sellerName: 'Anita Patel Publications',
    location: 'Karnataka, India',
    createdAt: new Date('2024-01-10')
  },
  {
    id: '4',
    name: 'Fresh Organic Tomatoes',
    description: 'Locally grown organic tomatoes, harvested fresh daily. Perfect for salads and cooking.',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400',
    basePrice: 89.99,
    quantity: 100,
    category: 'fresh-vegetables' as ProductCategory,
    sellerId: 'seller4',
    sellerName: 'Deepak Singh Organic Farm',
    location: 'Tamil Nadu, India',
    createdAt: new Date('2024-01-25')
  },
  {
    id: '5',
    name: 'Premium Garden Hoe',
    description: 'Heavy-duty garden hoe with comfortable wooden handle. Perfect for weeding and soil cultivation.',
    image: 'https://images.pexels.com/photos/4503325/pexels-photo-4503325.jpeg?auto=compress&cs=tinysrgb&w=400',
    basePrice: 399.99,
    quantity: 12,
    category: 'tools' as ProductCategory,
    sellerId: 'seller1',
    sellerName: 'Priya Sharma Farm Supply',
    location: 'Punjab, India',
    createdAt: new Date('2024-01-18')
  },
  {
    id: '6',
    name: 'Fresh Leafy Greens Mix',
    description: 'Fresh mix of seasonal leafy greens including spinach, arugula, and lettuce. Grown organically.',
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
    basePrice: 129.99,
    quantity: 30,
    category: 'fresh-vegetables' as ProductCategory,
    sellerId: 'seller4',
    sellerName: 'Deepak Singh Organic Farm',
    location: 'Tamil Nadu, India',
    createdAt: new Date('2024-01-23')
  },
  {
    id: '7',
    name: 'NPK Fertilizer 20-20-20',
    description: 'Balanced NPK fertilizer suitable for all crops. Promotes healthy growth and high yield.',
    image: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=400',
    basePrice: 355.00,
    quantity: 40,
    category: 'fertilizers' as ProductCategory,
    sellerId: 'seller2',
    sellerName: 'Rajesh Kumar Tools',
    location: 'Maharashtra, India',
    createdAt: new Date('2024-01-22')
  },
  {
    id: '8',
    name: 'Modern Farming Techniques',
    description: 'Learn about the latest farming technologies and sustainable practices for better yields.',
    image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400',
    basePrice: 329.99,
    quantity: 25,
    category: 'farming-books' as ProductCategory,
    sellerId: 'seller3',
    sellerName: 'Anita Patel Publications',
    location: 'Karnataka, India',
    createdAt: new Date('2024-01-12')
  },
  {
    id: '9',
    name: 'Heirloom Tomato Seeds',
    description: 'Premium heirloom tomato seeds with 95% germination rate. Perfect for organic farming.',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400',
    basePrice: 159.99,
    quantity: 200,
    category: 'seeds' as ProductCategory,
    sellerId: 'seller5',
    sellerName: 'Sunita Reddy Seeds',
    location: 'Gujarat, India',
    createdAt: new Date('2024-01-28')
  },
  {
    id: '10',
    name: 'Smart Irrigation Controller',
    description: 'WiFi-enabled irrigation controller with weather integration and smartphone app control.',
    image: 'https://images.pexels.com/photos/4503438/pexels-photo-4503438.jpeg?auto=compress&cs=tinysrgb&w=400',
    basePrice: 899.99,
    quantity: 8,
    category: 'irrigation' as ProductCategory,
    sellerId: 'seller6',
    sellerName: 'Amit Kumar Tech Solutions',
    location: 'Telangana, India',
    createdAt: new Date('2024-01-30')
  },
  {
    id: '11',
    name: 'Organic Pest Control Spray',
    description: 'Natural pest control spray made from neem oil and other organic ingredients. Safe for all crops.',
    image: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=400',
    basePrice: 225.00,
    quantity: 35,
    category: 'protection' as ProductCategory,
    sellerId: 'seller7',
    sellerName: 'Kavita Singh Eco Solutions',
    location: 'Kerala, India',
    createdAt: new Date('2024-01-26')
  },
  {
    id: '12',
    name: 'Premium Soil Test Kit',
    description: 'Professional-grade soil testing kit for pH, nitrogen, phosphorus, and potassium levels.',
    image: 'https://images.pexels.com/photos/4503325/pexels-photo-4503325.jpeg?auto=compress&cs=tinysrgb&w=400',
    basePrice: 349.99,
    quantity: 20,
    category: 'tools' as ProductCategory,
    sellerId: 'seller2',
    sellerName: 'Rajesh Kumar Tools',
    location: 'Maharashtra, India',
    createdAt: new Date('2024-01-24')
  }
];

export const mockAnalytics: AnalyticsData = {
  totalSales: 1250000,
  totalOrders: 450,
  topProducts: mockProducts.slice(0, 3),
  salesByCategory: [
    { category: 'Fresh Vegetables', sales: 450000 },
    { category: 'Fertilizers', sales: 350000 },
    { category: 'Tools', sales: 250000 },
    { category: 'Farming Books', sales: 200000 }
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 150000 },
    { month: 'Feb', revenue: 180000 },
    { month: 'Mar', revenue: 220000 },
    { month: 'Apr', revenue: 250000 },
    { month: 'May', revenue: 280000 },
    { month: 'Jun', revenue: 170000 }
  ]
};
