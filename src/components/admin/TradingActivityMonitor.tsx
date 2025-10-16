'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  BarChart3,
  Users,
  Filter,
  Search,
  RefreshCw,
  Download,
  Bell,
  Zap,
  Target,
  PieChart,
  LineChart
} from 'lucide-react';

interface TradingActivity {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  shares: number;
  price: number;
  total_value: number;
  timestamp: string;
  status: 'PENDING' | 'EXECUTED' | 'FAILED' | 'CANCELLED';
  ai_recommendation: string;
  confidence: number;
  profit_loss?: number;
  portfolio_value?: number;
}

interface TradingStats {
  totalTrades: number;
  totalVolume: number;
  totalValue: number;
  activeTraders: number;
  buyOrders: number;
  sellOrders: number;
  pendingOrders: number;
  executedOrders: number;
  failedOrders: number;
  totalProfitLoss: number;
  avgTradeSize: number;
  topPerformer: string;
  mostTradedStock: string;
}

const TradingActivityMonitor: React.FC = () => {
  const [activities, setActivities] = useState<TradingActivity[]>([]);
  const [stats, setStats] = useState<TradingStats>({
    totalTrades: 0,
    totalVolume: 0,
    totalValue: 0,
    activeTraders: 0,
    buyOrders: 0,
    sellOrders: 0,
    pendingOrders: 0,
    executedOrders: 0,
    failedOrders: 0,
    totalProfitLoss: 0,
    avgTradeSize: 0,
    topPerformer: '',
    mostTradedStock: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<TradingActivity | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockActivities: TradingActivity[] = [
      {
        id: '1',
        user_id: 'user_1',
        user_name: 'John Doe',
        user_email: 'john@example.com',
        symbol: 'AAPL',
        action: 'BUY',
        shares: 10,
        price: 175.43,
        total_value: 1754.30,
        timestamp: new Date().toISOString(),
        status: 'EXECUTED',
        ai_recommendation: 'Strong buy signal with 85% confidence',
        confidence: 85,
        profit_loss: 99.30,
        portfolio_value: 17543.00
      },
      {
        id: '2',
        user_id: 'user_2',
        user_name: 'Jane Smith',
        user_email: 'jane@example.com',
        symbol: 'MSFT',
        action: 'SELL',
        shares: 5,
        price: 378.85,
        total_value: 1894.25,
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'EXECUTED',
        ai_recommendation: 'Hold position, consider partial profit taking',
        confidence: 72,
        profit_loss: 144.25,
        portfolio_value: 18942.50
      },
      {
        id: '3',
        user_id: 'user_3',
        user_name: 'Mike Johnson',
        user_email: 'mike@example.com',
        symbol: 'GOOGL',
        action: 'BUY',
        shares: 15,
        price: 142.56,
        total_value: 2138.40,
        timestamp: new Date(Date.now() - 600000).toISOString(),
        status: 'PENDING',
        ai_recommendation: 'AI recommends buy with 78% confidence',
        confidence: 78,
        portfolio_value: 21384.00
      },
      {
        id: '4',
        user_id: 'user_1',
        user_name: 'John Doe',
        user_email: 'john@example.com',
        symbol: 'TSLA',
        action: 'SELL',
        shares: 8,
        price: 248.50,
        total_value: 1988.00,
        timestamp: new Date(Date.now() - 900000).toISOString(),
        status: 'FAILED',
        ai_recommendation: 'High risk, consider reducing position',
        confidence: 65,
        profit_loss: -45.20,
        portfolio_value: 19880.00
      }
    ];

    setActivities(mockActivities);

    // Calculate stats
    const totalTrades = mockActivities.length;
    const totalVolume = mockActivities.reduce((sum, activity) => sum + activity.shares, 0);
    const totalValue = mockActivities.reduce((sum, activity) => sum + activity.total_value, 0);
    const uniqueUsers = new Set(mockActivities.map(a => a.user_id)).size;
    const buyOrders = mockActivities.filter(a => a.action === 'BUY').length;
    const sellOrders = mockActivities.filter(a => a.action === 'SELL').length;
    const pendingOrders = mockActivities.filter(a => a.status === 'PENDING').length;
    const executedOrders = mockActivities.filter(a => a.status === 'EXECUTED').length;
    const failedOrders = mockActivities.filter(a => a.status === 'FAILED').length;
    const totalProfitLoss = mockActivities.reduce((sum, activity) => sum + (activity.profit_loss || 0), 0);

    setStats({
      totalTrades,
      totalVolume,
      totalValue,
      activeTraders: uniqueUsers,
      buyOrders,
      sellOrders,
      pendingOrders,
      executedOrders,
      failedOrders,
      totalProfitLoss,
      avgTradeSize: totalValue / totalTrades,
      topPerformer: 'John Doe',
      mostTradedStock: 'AAPL'
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXECUTED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-100 text-green-800';
      case 'SELL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
    const matchesAction = filterAction === 'all' || activity.action === filterAction;
    
    return matchesSearch && matchesStatus && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trading Activity Monitor</h2>
          <p className="text-gray-600">Real-time monitoring of customer trading activities</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setLoading(true)} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Trading Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalTrades}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeTraders} active traders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Shares traded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.avgTradeSize.toFixed(0)} avg trade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${stats.totalProfitLoss.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total profit/loss
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Executed Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.executedOrders}</div>
            <p className="text-sm text-gray-600">
              {stats.totalTrades > 0 ? Math.round((stats.executedOrders / stats.totalTrades) * 100) : 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-600" />
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</div>
            <p className="text-sm text-gray-600">
              Awaiting execution
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Failed Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.failedOrders}</div>
            <p className="text-sm text-gray-600">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by user, symbol, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="EXECUTED">Executed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Actions</option>
                <option value="BUY">Buy Orders</option>
                <option value="SELL">Sell Orders</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Activities</CardTitle>
          <p className="text-sm text-gray-600">
            Showing {filteredActivities.length} activities
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedActivity(activity)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {activity.action === 'BUY' ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">{activity.symbol}</h3>
                      <Badge className={getActionColor(activity.action)}>
                        {activity.action}
                      </Badge>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {activity.user_name} ({activity.user_email})
                    </p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>{activity.shares} shares @ ${activity.price.toFixed(2)}</span>
                      <span>Total: ${activity.total_value.toFixed(2)}</span>
                      <span>Confidence: {activity.confidence}%</span>
                      <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {activity.profit_loss && (
                    <div className={`text-sm font-medium ${activity.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {activity.profit_loss >= 0 ? '+' : ''}${activity.profit_loss.toFixed(2)}
                    </div>
                  )}
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredActivities.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trading activities found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Trading Activity Details
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedActivity(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Trade Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Symbol</div>
                    <div className="font-medium">{selectedActivity.symbol}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Action</div>
                    <Badge className={getActionColor(selectedActivity.action)}>
                      {selectedActivity.action}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Shares</div>
                    <div className="font-medium">{selectedActivity.shares}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="font-medium">${selectedActivity.price.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Value</div>
                    <div className="font-medium">${selectedActivity.total_value.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <Badge className={getStatusColor(selectedActivity.status)}>
                      {selectedActivity.status}
                    </Badge>
                  </div>
                </div>

                {/* User Information */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Trader Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="font-medium">{selectedActivity.user_name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{selectedActivity.user_email}</div>
                    </div>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-purple-600" />
                    AI Recommendation
                  </h4>
                  <p className="text-sm text-gray-700 mb-2">{selectedActivity.ai_recommendation}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500">Confidence: </span>
                      <span className="font-medium">{selectedActivity.confidence}%</span>
                    </div>
                    {selectedActivity.profit_loss && (
                      <div className={`text-sm font-medium ${selectedActivity.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        P&L: {selectedActivity.profit_loss >= 0 ? '+' : ''}${selectedActivity.profit_loss.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-sm text-gray-500">
                  <Clock className="h-4 w-4 inline mr-2" />
                  {new Date(selectedActivity.timestamp).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TradingActivityMonitor;

