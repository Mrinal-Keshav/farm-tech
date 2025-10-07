import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Search,
  Filter,
  Star,
  Heart,
  Package,
  Truck,
  Shield,
  CreditCard,
  Plus,
  Minus,
  Grid,
  List,
  MapPin,
  Clock,
  Award,
  Sprout,
  Droplets,
  Bug,
  Scissors,
  BookOpen,
  Leaf,
  Globe,
  User,
  BarChart3,
  Home,
  Store,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { Product, CartItem, ProductCategory, Language } from '../types/marketplace';
import { mockProducts, mockAnalytics } from '../data/marketplaceData';
import ProductGrid from '@/components/projectShop/ProductGrid';
import { projectMockProducts } from '../data/projectMockData';
import CheckoutModal from '@/components/CheckoutModal';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [language, setLanguage] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState('browse');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    image: '',
    basePrice: 0,
    quantity: 0,
    category: '' as ProductCategory | ''
  });

  const categories = [
    { id: 'all', name: 'All Products', icon: Grid },
    { id: 'seeds', name: 'Seeds & Plants', icon: Sprout },
    { id: 'tools', name: 'Tools & Equipment', icon: Scissors },
    { id: 'fertilizers', name: 'Fertilizers', icon: Droplets },
    { id: 'protection', name: 'Plant Protection', icon: Shield },
    { id: 'irrigation', name: 'Irrigation', icon: Droplets },
    { id: 'fresh-vegetables', name: 'Fresh Vegetables', icon: Leaf },
    { id: 'farming-books', name: 'Farming Books', icon: BookOpen }
  ];

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
    { code: 'hi' as Language, name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn' as Language, name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ta' as Language, name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te' as Language, name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr' as Language, name: 'मराठी', flag: '🇮🇳' }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sellerName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.product.basePrice * item.quantity), 0);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.description || !newProduct.category || newProduct.basePrice <= 0 || newProduct.quantity <= 0) {
      alert('Please fill in all required fields with valid values');
      return;
    }

    const productData: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description,
      image: newProduct.image || 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=400',
      basePrice: newProduct.basePrice,
      quantity: newProduct.quantity,
      category: newProduct.category as ProductCategory,
      sellerId: 'current-user',
      sellerName: 'Your Farm',
      location: 'Your Location, India',
      createdAt: new Date()
    };
    
    setProducts(prev => [productData, ...prev]);
    
    // Reset form
    setNewProduct({
      name: '',
      description: '',
      image: '',
      basePrice: 0,
      quantity: 0,
      category: ''
    });
    
    // Switch to browse tab to see the new product
    setCurrentTab('browse');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">FarmTech Marketplace</h1>
            </div>
            <p className="text-muted-foreground">
              Premium farming supplies, tools, and equipment for modern agriculture
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <Button variant="outline" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({getTotalItems()})
            </Button>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              Free shipping over ₹750
            </Badge>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Secure Payments</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
            <Truck className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Fast Delivery</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Quality Guaranteed</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">24/7 Support</span>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="browse">Browse Products</TabsTrigger>
            <TabsTrigger value="cart">Shopping Cart</TabsTrigger>
            <TabsTrigger value="sell">Sell Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="project">Project Catalog</TabsTrigger>
          </TabsList>

          {/* Browse Products Tab */}
          <TabsContent value="browse" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setSelectedCategory(category.id as ProductCategory | 'all')}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {category.name}
                        </Button>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price Range</label>
                      <div className="flex gap-2">
                        <Input placeholder="Min" type="number" />
                        <Input placeholder="Max" type="number" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rating</label>
                      <div className="space-y-1">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" />
                            <div className="flex items-center gap-1">
                              {Array.from({ length: rating }, (_, i) => (
                                <Star key={i} className="w-3 h-3 fill-earth-gold text-earth-gold" />
                              ))}
                              <span className="text-sm">& up</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Availability</label>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">In Stock</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">On Sale</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Search and Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Results Summary */}
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Showing {filteredProducts.length} of {products.length} products
                  </p>
                  <select className="px-3 py-2 border rounded-md bg-background">
                    <option>Sort by Relevance</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating</option>
                    <option>Newest</option>
                  </select>
                </div>

                {/* Products Grid */}
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className={`group hover:shadow-soft transition-all duration-300 ${
                      viewMode === 'list' ? 'flex flex-row' : ''
                    }`}>
                      <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                        <div className={`bg-gradient-nature rounded-t-lg ${
                          viewMode === 'list' ? 'rounded-l-lg rounded-tr-none h-full' : 'h-48'
                        } flex items-center justify-center relative overflow-hidden`}>
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {!product.quantity && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge variant="destructive">Out of Stock</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <CardHeader className={viewMode === 'list' ? 'pb-2' : ''}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {product.name}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < 4 ? 'fill-earth-gold text-earth-gold' : 'text-muted-foreground'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  (4.5)
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <CardDescription className={`${viewMode === 'list' ? 'line-clamp-2' : ''}`}>
                            {product.description}
                          </CardDescription>

                          {/* Seller Info */}
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{product.sellerName}</span>
                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                          </div>

                          {/* Category Badge */}
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              {categories.find(c => c.id === product.category)?.name || product.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Stock: {product.quantity}
                            </Badge>
                          </div>

                          {/* Price and Actions */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-foreground">
                                {formatPrice(product.basePrice)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {cartItems.find(item => item.product.id === product.id) ? (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => updateQuantity(product.id, (cartItems.find(item => item.product.id === product.id)?.quantity || 0) - 1)}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                  <span className="w-8 text-center font-medium">
                                    {cartItems.find(item => item.product.id === product.id)?.quantity || 0}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => updateQuantity(product.id, (cartItems.find(item => item.product.id === product.id)?.quantity || 0) + 1)}
                                    disabled={!product.quantity}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="hero"
                                  size="sm"
                                  onClick={() => addToCart(product)}
                                  disabled={!product.quantity}
                                >
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  {product.quantity ? 'Add to Cart' : 'Out of Stock'}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search terms or filters
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Project Catalog Tab */}
          <TabsContent value="project" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Project Catalog</h2>
                <div className="text-sm text-muted-foreground">{projectMockProducts.length} items</div>
              </div>

              <ProductGrid
                products={projectMockProducts}
                language={language}
                onAddToCart={(p) => addToCart(p)}
                onBuyNow={(p) => {
                  addToCart(p);
                  setCurrentTab('cart');
                  setIsCheckoutOpen(true);
                }}
              />
            </div>
          </TabsContent>

          {/* Shopping Cart Tab */}
          <TabsContent value="cart" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">Shopping Cart</h2>
              
              {cartItems.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
                    <p className="text-muted-foreground mb-4">
                      Add some products to get started
                    </p>
                    <Button onClick={() => setCurrentTab('browse')}>
                      Browse Products
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <Card key={item.product.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{item.product.name}</h3>
                            <p className="text-muted-foreground text-sm">{item.product.sellerName}</p>
                            <p className="text-foreground font-medium">{formatPrice(item.product.basePrice)} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">{formatPrice(item.product.basePrice * item.quantity)}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total:</span>
                        <span>{formatPrice(getTotalPrice())}</span>
                      </div>
                      <Button className="w-full mt-4" size="lg" onClick={handleCheckout}>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Proceed to Checkout
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Sell Products Tab */}
          <TabsContent value="sell" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">Sell Your Products</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                  <CardDescription>
                    List your farming products and reach customers worldwide
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Product Name *</label>
                      <Input 
                        placeholder="Enter product name" 
                        value={newProduct.name}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category *</label>
                      <select 
                        className="w-full px-3 py-2 border rounded-md bg-background"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
                      >
                        <option value="">Select Category</option>
                        {categories.slice(1).map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Price ($) *</label>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={newProduct.basePrice || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Quantity *</label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={newProduct.quantity || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description *</label>
                    <textarea 
                      className="w-full px-3 py-2 border rounded-md bg-background min-h-[100px]"
                      placeholder="Describe your product..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Product Image URL (Optional)</label>
                    <Input 
                      placeholder="https://example.com/image.jpg"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty to use default image
                    </p>
                  </div>
                  
                  <Button className="w-full" onClick={handleAddProduct}>
                    <Package className="w-4 h-4 mr-2" />
                    List Product
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">Marketplace Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Sales</p>
                        <p className="text-2xl font-bold">{formatPrice(mockAnalytics.totalSales)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold">{mockAnalytics.totalOrders}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Store className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Active Products</p>
                        <p className="text-2xl font-bold">{products.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAnalytics.topProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.sellerName}</p>
                          </div>
                          <p className="font-semibold">{formatPrice(product.basePrice)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAnalytics.salesByCategory.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.category}</span>
                          <span className="font-semibold">{formatPrice(category.sales)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Shop;