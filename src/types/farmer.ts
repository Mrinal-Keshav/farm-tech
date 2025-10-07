export interface FarmerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  language: string;
  location: {
    state: string;
    district: string;
    village?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  farmDetails: {
    farmSize: number; // in acres
    soilType: string;
    cropTypes: string[];
    irrigationType: string;
  };
  preferences: {
    notifications: boolean;
    weatherAlerts: boolean;
    cropAdvice: boolean;
    marketPrices: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorLocation: string;
  title: string;
  content: string;
  category: 'question' | 'tip' | 'success-story' | 'market-update' | 'weather-alert';
  tags: string[];
  images?: string[];
  likes: number;
  replies: number;
  language: string;
  isVerified: boolean; // For expert/official posts
  createdAt: string;
  updatedAt: string;
}

export interface ShopProduct {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerLocation: string;
  name: string;
  description: string;
  category: 'seeds' | 'fertilizers' | 'tools' | 'pesticides' | 'equipment' | 'organic';
  price: number;
  currency: 'INR';
  unit: string; // kg, liter, piece, etc.
  images: string[];
  inStock: boolean;
  quantity: number;
  specifications: Record<string, string>;
  certifications?: string[]; // organic, verified, etc.
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  deliveryAreas: string[]; // states/districts where delivery available
  createdAt: string;
  updatedAt: string;
}

export interface AIAgriSuggestion {
  id: string;
  type: 'crop' | 'soil' | 'weather' | 'fertilizer' | 'pest' | 'market';
  title: string;
  content: string;
  confidence: number; // 0-1
  applicableRegions: string[];
  season?: string;
  cropTypes?: string[];
  urgency: 'low' | 'medium' | 'high';
  source: 'ai' | 'expert' | 'government';
  language: string;
  createdAt: string;
  validUntil?: string;
}

export interface WeatherData {
  location: string;
  current: {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    uvIndex: number;
    visibility: number;
  };
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    humidity: number;
    rainfall: number;
    conditions: string;
  }>;
  alerts?: Array<{
    type: 'warning' | 'advisory';
    message: string;
    severity: 'low' | 'medium' | 'high';
    validUntil: string;
  }>;
}