'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Star, 
  Download, 
  Package, 
  CreditCard,
  CheckCircle,
  Clock,
  Tag,
  Grid,
  List,
  Heart,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Brain,
  Target,
  AlertTriangle,
  DollarSign,
  Activity,
  PieChart,
  LineChart,
  Zap,
  ArrowUp,
  ArrowDown,
  Eye,
  Plus,
  Minus
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency_code: string;
  product_type: 'digital_goods' | 'service_package' | 'credits' | 'premium_feature' | 'stock';
  category: string;
  image_url?: string;
  tags: string[];
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  stock_quantity?: number;
}

interface Stock {
  symbol: string;
  name: string;
  current_price: number;
  change_percent: number;
  change_amount: number;
  volume: number;
  market_cap: number;
  pe_ratio: number;
  dividend_yield: number;
  sector: string;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  ai_analysis: string;
  price_target: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  last_updated: string;
}

interface StockPosition {
  symbol: string;
  shares: number;
  avg_price: number;
  current_value: number;
  total_gain_loss: number;
  gain_loss_percent: number;
}

interface AIRecommendation {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  price_target: number;
  risk_assessment: string;
  timeframe: string;
}

interface Category {
  id: string;
  name: string;
  product_count: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const StoreTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showCart, setShowCart] = useState(false);
  
  // Stock trading state
  const [activeTab, setActiveTab] = useState<'products' | 'stocks'>('products');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [stockPositions, setStockPositions] = useState<StockPosition[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showTradingModal, setShowTradingModal] = useState(false);
  const [tradingAction, setTradingAction] = useState<'buy' | 'sell'>('buy');
  const [tradingShares, setTradingShares] = useState<number>(0);
  const [tradingPrice, setTradingPrice] = useState<number>(0);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setProducts([
      {
        id: '1',
        name: 'Premium Analytics Report',
        description: 'Comprehensive business analytics with advanced insights and recommendations',
        price: 99.99,
        currency_code: 'USD',
        product_type: 'digital_goods',
        category: 'Reports',
        tags: ['analytics', 'business', 'premium'],
        rating: 4.8,
        reviews_count: 156,
        is_featured: true,
        stock_quantity: 100
      },
      {
        id: '2',
        name: 'Service Credits Pack',
        description: '100 service credits for premium support and features',
        price: 49.99,
        currency_code: 'USD',
        product_type: 'credits',
        category: 'Credits',
        tags: ['credits', 'support', 'premium'],
        rating: 4.9,
        reviews_count: 89,
        is_featured: false,
        stock_quantity: 500
      },
      {
        id: '3',
        name: 'Advanced Workflow Automation',
        description: 'Automate complex business processes with our advanced workflow engine',
        price: 199.99,
        currency_code: 'USD',
        product_type: 'premium_feature',
        category: 'Features',
        tags: ['automation', 'workflow', 'business'],
        rating: 4.7,
        reviews_count: 234,
        is_featured: true,
        stock_quantity: 50
      },
      {
        id: '4',
        name: 'Priority Support Package',
        description: '24/7 priority support with dedicated account manager',
        price: 299.99,
        currency_code: 'USD',
        product_type: 'service_package',
        category: 'Support',
        tags: ['support', 'priority', 'dedicated'],
        rating: 4.9,
        reviews_count: 67,
        is_featured: false,
        stock_quantity: 25
      }
    ]);

    setCategories([
      { id: '1', name: 'All Products', product_count: 4 },
      { id: '2', name: 'Reports', product_count: 1 },
      { id: '3', name: 'Credits', product_count: 1 },
      { id: '4', name: 'Features', product_count: 1 },
      { id: '5', name: 'Support', product_count: 1 }
    ]);

    // Stock data
    setStocks([
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        current_price: 175.43,
        change_percent: 2.34,
        change_amount: 4.01,
        volume: 45678900,
        market_cap: 2800000000000,
        pe_ratio: 28.5,
        dividend_yield: 0.5,
        sector: 'Technology',
        recommendation: 'BUY',
        confidence: 85,
        ai_analysis: 'Strong fundamentals with growing services revenue and robust ecosystem.',
        price_target: 195.00,
        risk_level: 'MEDIUM',
        last_updated: new Date().toISOString()
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        current_price: 378.85,
        change_percent: -1.23,
        change_amount: -4.72,
        volume: 23456700,
        market_cap: 2800000000000,
        pe_ratio: 32.1,
        dividend_yield: 0.7,
        sector: 'Technology',
        recommendation: 'HOLD',
        confidence: 72,
        ai_analysis: 'Cloud growth remains strong but valuation is stretched.',
        price_target: 390.00,
        risk_level: 'LOW',
        last_updated: new Date().toISOString()
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        current_price: 142.56,
        change_percent: 3.45,
        change_amount: 4.75,
        volume: 34567800,
        market_cap: 1800000000000,
        pe_ratio: 25.8,
        dividend_yield: 0.0,
        sector: 'Technology',
        recommendation: 'BUY',
        confidence: 78,
        ai_analysis: 'AI investments showing early returns, search dominance continues.',
        price_target: 165.00,
        risk_level: 'MEDIUM',
        last_updated: new Date().toISOString()
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        current_price: 248.50,
        change_percent: -2.15,
        change_amount: -5.45,
        volume: 67890100,
        market_cap: 790000000000,
        pe_ratio: 45.2,
        dividend_yield: 0.0,
        sector: 'Automotive',
        recommendation: 'SELL',
        confidence: 65,
        ai_analysis: 'High valuation with increasing competition in EV space.',
        price_target: 220.00,
        risk_level: 'HIGH',
        last_updated: new Date().toISOString()
      }
    ]);

    // Stock positions
    setStockPositions([
      {
        symbol: 'AAPL',
        shares: 10,
        avg_price: 165.50,
        current_value: 1754.30,
        total_gain_loss: 99.30,
        gain_loss_percent: 6.0
      },
      {
        symbol: 'MSFT',
        shares: 5,
        avg_price: 350.00,
        current_value: 1894.25,
        total_gain_loss: 144.25,
        gain_loss_percent: 8.24
      }
    ]);

    // AI Recommendations
    setAiRecommendations([
      {
        symbol: 'AAPL',
        action: 'BUY',
        confidence: 85,
        reasoning: 'Strong Q4 earnings beat, services revenue growing 15% YoY, iPhone 15 demand exceeding expectations',
        price_target: 195.00,
        risk_assessment: 'Medium risk due to China exposure and regulatory concerns',
        timeframe: '3-6 months'
      },
      {
        symbol: 'GOOGL',
        action: 'BUY',
        confidence: 78,
        reasoning: 'AI investments in Bard and Cloud showing early returns, search dominance maintained',
        price_target: 165.00,
        risk_assessment: 'Medium risk from AI competition and regulatory scrutiny',
        timeframe: '6-12 months'
      },
      {
        symbol: 'TSLA',
        action: 'SELL',
        confidence: 65,
        reasoning: 'Valuation stretched at 45x P/E, increasing EV competition, margin pressure',
        price_target: 220.00,
        risk_assessment: 'High risk due to market volatility and execution challenges',
        timeframe: '1-3 months'
      }
    ]);
  }, []);

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'digital_goods': return <Download className="h-5 w-5" />;
      case 'service_package': return <Package className="h-5 w-5" />;
      case 'credits': return <CreditCard className="h-5 w-5" />;
      case 'premium_feature': return <Star className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const getProductBadgeColor = (type: string) => {
    switch (type) {
      case 'digital_goods': return 'bg-blue-100 text-blue-800';
      case 'service_package': return 'bg-green-100 text-green-800';
      case 'credits': return 'bg-purple-100 text-purple-800';
      case 'premium_feature': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  // Stock trading functions
  const openStockModal = (stock: Stock) => {
    setSelectedStock(stock);
    setShowStockModal(true);
  };

  const openTradingModal = (stock: Stock, action: 'buy' | 'sell') => {
    setSelectedStock(stock);
    setTradingAction(action);
    setTradingPrice(stock.current_price);
    setTradingShares(0);
    setShowTradingModal(true);
  };

  const executeTrade = () => {
    if (!selectedStock || tradingShares <= 0) return;
    
    const totalValue = tradingShares * tradingPrice;
    
    // Simulate trade execution
    console.log(`Executing ${tradingAction.toUpperCase()} order:`, {
      symbol: selectedStock.symbol,
      shares: tradingShares,
      price: tradingPrice,
      total: totalValue
    });
    
    // Update positions
    if (tradingAction === 'buy') {
      const existingPosition = stockPositions.find(p => p.symbol === selectedStock.symbol);
      if (existingPosition) {
        const newShares = existingPosition.shares + tradingShares;
        const newAvgPrice = ((existingPosition.shares * existingPosition.avg_price) + (tradingShares * tradingPrice)) / newShares;
        setStockPositions(stockPositions.map(p => 
          p.symbol === selectedStock.symbol 
            ? { ...p, shares: newShares, avg_price: newAvgPrice }
            : p
        ));
      } else {
        setStockPositions([...stockPositions, {
          symbol: selectedStock.symbol,
          shares: tradingShares,
          avg_price: tradingPrice,
          current_value: tradingShares * selectedStock.current_price,
          total_gain_loss: tradingShares * (selectedStock.current_price - tradingPrice),
          gain_loss_percent: ((selectedStock.current_price - tradingPrice) / tradingPrice) * 100
        }]);
      }
    } else {
      setStockPositions(stockPositions.map(p => 
        p.symbol === selectedStock.symbol 
          ? { ...p, shares: Math.max(0, p.shares - tradingShares) }
          : p
      ).filter(p => p.shares > 0));
    }
    
    setShowTradingModal(false);
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY': return 'text-green-600 bg-green-100';
      case 'SELL': return 'text-red-600 bg-red-100';
      case 'HOLD': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low': return a.price - b.price;
      case 'price_high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store & Trading</h1>
          <p className="text-gray-600">Browse products and trade stocks with AI recommendations</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => setShowCart(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart ({cart.length})
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package className="h-4 w-4 inline mr-2" />
          Products
        </button>
        <button
          onClick={() => setActiveTab('stocks')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'stocks'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="h-4 w-4 inline mr-2" />
          Stock Trading
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'products' ? (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name} ({category.product_count})
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="name">Sort by Name</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : ''}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {sortedProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getProductIcon(product.product_type)}
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge className={getProductBadgeColor(product.product_type)}>
                      {product.product_type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                {product.is_featured && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    Featured
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{product.description}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({product.reviews_count})</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {product.stock_quantity ? `${product.stock_quantity} in stock` : 'Digital item'}
                </div>
                <Button 
                  onClick={() => addToCart(product)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
              </CardContent>
            </Card>
          ))}
          </div>
        </>
      ) : (
        /* Stock Trading Interface */
        <div className="space-y-6">
          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                AI Trading Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg">{rec.symbol}</span>
                      <Badge className={getRecommendationColor(rec.action)}>
                        {rec.action}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Confidence: {rec.confidence}%
                    </div>
                    <div className="text-sm mb-2">{rec.reasoning}</div>
                    <div className="text-sm text-gray-500">
                      Target: ${rec.price_target} | {rec.timeframe}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                  Portfolio Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stockPositions.map((position, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{position.symbol}</div>
                        <div className="text-sm text-gray-500">
                          {position.shares} shares @ ${position.avg_price.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${position.current_value.toFixed(2)}</div>
                        <div className={`text-sm ${position.gain_loss_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {position.gain_loss_percent >= 0 ? '+' : ''}{position.gain_loss_percent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                  {stockPositions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No positions yet. Start trading to build your portfolio!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-600" />
                  Market Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stocks.map((stock, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                         onClick={() => openStockModal(stock)}>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-sm text-gray-500">{stock.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${stock.current_price.toFixed(2)}</div>
                            <div className={`text-sm flex items-center ${stock.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {stock.change_percent >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                              {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge className={getRecommendationColor(stock.recommendation)}>
                            {stock.recommendation}
                          </Badge>
                          <Badge className={getRiskColor(stock.risk_level)}>
                            {stock.risk_level} Risk
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stock List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
                Available Stocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stocks.map((stock, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-bold text-lg">{stock.symbol}</div>
                        <div className="text-sm text-gray-500">{stock.name}</div>
                      </div>
                      <Badge className={getRecommendationColor(stock.recommendation)}>
                        {stock.recommendation}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Price:</span>
                        <span className="font-medium">${stock.current_price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Change:</span>
                        <span className={`text-sm ${stock.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">P/E:</span>
                        <span className="text-sm">{stock.pe_ratio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Sector:</span>
                        <span className="text-sm">{stock.sector}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button 
                        onClick={() => openTradingModal(stock, 'buy')}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Buy
                      </Button>
                      <Button 
                        onClick={() => openTradingModal(stock, 'sell')}
                        variant="outline"
                        className="w-full border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        Sell
                      </Button>
                      <Button 
                        onClick={() => openStockModal(stock)}
                        variant="outline"
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Shopping Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Shopping Cart</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCart(false)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getProductIcon(item.product.product_type)}
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stock Detail Modal */}
      {showStockModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  {selectedStock.symbol} - {selectedStock.name}
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setShowStockModal(false)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Price and Change */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-bold">${selectedStock.current_price.toFixed(2)}</div>
                    <div className={`text-lg ${selectedStock.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedStock.change_percent >= 0 ? '+' : ''}{selectedStock.change_percent.toFixed(2)}% 
                      ({selectedStock.change_amount >= 0 ? '+' : ''}${selectedStock.change_amount.toFixed(2)})
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getRecommendationColor(selectedStock.recommendation)}>
                      {selectedStock.recommendation}
                    </Badge>
                    <div className="text-sm text-gray-500 mt-2">
                      Confidence: {selectedStock.confidence}%
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm text-gray-500">P/E Ratio</div>
                    <div className="font-medium">{selectedStock.pe_ratio}</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm text-gray-500">Dividend Yield</div>
                    <div className="font-medium">{selectedStock.dividend_yield}%</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm text-gray-500">Volume</div>
                    <div className="font-medium">{(selectedStock.volume / 1000000).toFixed(1)}M</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm text-gray-500">Market Cap</div>
                    <div className="font-medium">${(selectedStock.market_cap / 1000000000).toFixed(1)}B</div>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Brain className="h-5 w-5 mr-2 text-purple-600" />
                    <span className="font-medium">AI Analysis</span>
                  </div>
                  <p className="text-sm text-gray-700">{selectedStock.ai_analysis}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500">Price Target: </span>
                      <span className="font-medium">${selectedStock.price_target.toFixed(2)}</span>
                    </div>
                    <Badge className={getRiskColor(selectedStock.risk_level)}>
                      {selectedStock.risk_level} Risk
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => {
                      setShowStockModal(false);
                      openTradingModal(selectedStock, 'buy');
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Buy Stock
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowStockModal(false);
                      openTradingModal(selectedStock, 'sell');
                    }}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Sell Stock
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trading Modal */}
      {showTradingModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  {tradingAction === 'buy' ? (
                    <Plus className="h-5 w-5 mr-2 text-green-600" />
                  ) : (
                    <Minus className="h-5 w-5 mr-2 text-red-600" />
                  )}
                  {tradingAction.toUpperCase()} {selectedStock.symbol}
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setShowTradingModal(false)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{selectedStock.symbol}</span>
                    <span className="text-lg font-bold">${selectedStock.current_price.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedStock.name} • {selectedStock.sector}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Shares
                  </label>
                  <Input
                    type="number"
                    value={tradingShares}
                    onChange={(e) => setTradingShares(Number(e.target.value))}
                    placeholder="Enter number of shares"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price per Share
                  </label>
                  <Input
                    type="number"
                    value={tradingPrice}
                    onChange={(e) => setTradingPrice(Number(e.target.value))}
                    placeholder="Enter price per share"
                    step="0.01"
                  />
                </div>

                {tradingShares > 0 && tradingPrice > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Value:</span>
                      <span className="text-lg font-bold">
                        ${(tradingShares * tradingPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button 
                    onClick={executeTrade}
                    disabled={tradingShares <= 0 || tradingPrice <= 0}
                    className={`flex-1 ${
                      tradingAction === 'buy' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {tradingAction === 'buy' ? 'Buy' : 'Sell'} {tradingShares} Shares
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowTradingModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StoreTab;


