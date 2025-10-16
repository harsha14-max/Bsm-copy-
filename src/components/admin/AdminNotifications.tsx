'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity, 
  Shield, 
  Zap, 
  Target, 
  Eye, 
  X, 
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';

interface AdminNotification {
  id: string;
  type: 'TRADING' | 'WALLET' | 'SECURITY' | 'SYSTEM' | 'ALERT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  timestamp: string;
  status: 'UNREAD' | 'READ' | 'RESOLVED';
  user_id?: string;
  user_name?: string;
  action_required: boolean;
  related_data?: any;
}

interface NotificationStats {
  totalNotifications: number;
  unreadNotifications: number;
  highPriorityNotifications: number;
  tradingAlerts: number;
  walletAlerts: number;
  securityAlerts: number;
  systemAlerts: number;
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    totalNotifications: 0,
    unreadNotifications: 0,
    highPriorityNotifications: 0,
    tradingAlerts: 0,
    walletAlerts: 0,
    securityAlerts: 0,
    systemAlerts: 0
  });
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState<AdminNotification | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockNotifications: AdminNotification[] = [
      {
        id: '1',
        type: 'TRADING',
        priority: 'HIGH',
        title: 'Large Stock Purchase Detected',
        message: 'User John Doe purchased $15,000 worth of AAPL stock. This exceeds the normal trading pattern for this user.',
        timestamp: new Date().toISOString(),
        status: 'UNREAD',
        user_id: 'user_1',
        user_name: 'John Doe',
        action_required: true,
        related_data: {
          symbol: 'AAPL',
          amount: 15000,
          shares: 85,
          price: 175.43
        }
      },
      {
        id: '2',
        type: 'WALLET',
        priority: 'MEDIUM',
        title: 'Suspicious Withdrawal Pattern',
        message: 'User Jane Smith has made 5 withdrawals in the last hour totaling $2,500. This may require verification.',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'UNREAD',
        user_id: 'user_2',
        user_name: 'Jane Smith',
        action_required: true,
        related_data: {
          withdrawal_count: 5,
          total_amount: 2500,
          time_span: '1 hour'
        }
      },
      {
        id: '3',
        type: 'SECURITY',
        priority: 'CRITICAL',
        title: 'Failed Login Attempts',
        message: 'Multiple failed login attempts detected for user Mike Johnson. Account may be compromised.',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        status: 'UNREAD',
        user_id: 'user_3',
        user_name: 'Mike Johnson',
        action_required: true,
        related_data: {
          failed_attempts: 8,
          ip_address: '192.168.1.100',
          last_attempt: new Date(Date.now() - 600000).toISOString()
        }
      },
      {
        id: '4',
        type: 'SYSTEM',
        priority: 'LOW',
        title: 'System Performance Alert',
        message: 'Database response time has increased by 15% in the last hour. Monitoring recommended.',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        status: 'READ',
        action_required: false,
        related_data: {
          response_time: '2.3s',
          increase_percent: 15,
          threshold: '2.0s'
        }
      },
      {
        id: '5',
        type: 'TRADING',
        priority: 'MEDIUM',
        title: 'AI Recommendation Accuracy',
        message: 'AI trading recommendations have achieved 78% accuracy rate this week, above the 70% threshold.',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        status: 'RESOLVED',
        action_required: false,
        related_data: {
          accuracy_rate: 78,
          threshold: 70,
          period: '1 week'
        }
      },
      {
        id: '6',
        type: 'WALLET',
        priority: 'HIGH',
        title: 'Large Deposit Detected',
        message: 'User Sarah Wilson deposited $50,000 via bank transfer. This is significantly above their average deposit amount.',
        timestamp: new Date(Date.now() - 1500000).toISOString(),
        status: 'READ',
        user_id: 'user_4',
        user_name: 'Sarah Wilson',
        action_required: true,
        related_data: {
          amount: 50000,
          method: 'bank_transfer',
          average_deposit: 5000
        }
      }
    ];

    setNotifications(mockNotifications);

    // Calculate stats
    const totalNotifications = mockNotifications.length;
    const unreadNotifications = mockNotifications.filter(n => n.status === 'UNREAD').length;
    const highPriorityNotifications = mockNotifications.filter(n => n.priority === 'HIGH' || n.priority === 'CRITICAL').length;
    const tradingAlerts = mockNotifications.filter(n => n.type === 'TRADING').length;
    const walletAlerts = mockNotifications.filter(n => n.type === 'WALLET').length;
    const securityAlerts = mockNotifications.filter(n => n.type === 'SECURITY').length;
    const systemAlerts = mockNotifications.filter(n => n.type === 'SYSTEM').length;

    setStats({
      totalNotifications,
      unreadNotifications,
      highPriorityNotifications,
      tradingAlerts,
      walletAlerts,
      securityAlerts,
      systemAlerts
    });
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TRADING': return 'bg-blue-100 text-blue-800';
      case 'WALLET': return 'bg-green-100 text-green-800';
      case 'SECURITY': return 'bg-red-100 text-red-800';
      case 'SYSTEM': return 'bg-purple-100 text-purple-800';
      case 'ALERT': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UNREAD': return 'bg-blue-100 text-blue-800';
      case 'READ': return 'bg-gray-100 text-gray-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'TRADING': return <TrendingUp className="h-4 w-4" />;
      case 'WALLET': return <DollarSign className="h-4 w-4" />;
      case 'SECURITY': return <Shield className="h-4 w-4" />;
      case 'SYSTEM': return <Activity className="h-4 w-4" />;
      case 'ALERT': return <AlertTriangle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, status: 'READ' as const } : n
    ));
  };

  const markAsResolved = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, status: 'RESOLVED' as const } : n
    ));
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    
    return matchesType && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Notifications</h2>
          <p className="text-gray-600">Real-time alerts and monitoring dashboard</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Notification Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalNotifications}</div>
            <p className="text-xs text-muted-foreground">
              All notifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.unreadNotifications}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Target className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highPriorityNotifications}</div>
            <p className="text-xs text-muted-foreground">
              Critical alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <Zap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {notifications.filter(n => n.action_required).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need intervention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Type Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Trading Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.tradingAlerts}</div>
            <p className="text-sm text-gray-600">
              Trading activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Wallet Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.walletAlerts}</div>
            <p className="text-sm text-gray-600">
              Wallet activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-red-600" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.securityAlerts}</div>
            <p className="text-sm text-gray-600">
              Security issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-600" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.systemAlerts}</div>
            <p className="text-sm text-gray-600">
              System issues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Types</option>
                <option value="TRADING">Trading</option>
                <option value="WALLET">Wallet</option>
                <option value="SECURITY">Security</option>
                <option value="SYSTEM">System</option>
                <option value="ALERT">Alert</option>
              </select>
            </div>
            <div className="flex-1">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div className="flex-1">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="UNREAD">Unread</option>
                <option value="READ">Read</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <p className="text-sm text-gray-600">
            Showing {filteredNotifications.length} notifications
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                  notification.status === 'UNREAD' ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => setSelectedNotification(notification)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.status === 'UNREAD' ? 'bg-blue-100' : 'bg-gray-200'
                  }`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <Badge className={getTypeColor(notification.type)}>
                        {notification.type}
                      </Badge>
                      <Badge className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                      <Badge className={getStatusColor(notification.status)}>
                        {notification.status}
                      </Badge>
                      {notification.action_required && (
                        <Badge className="bg-red-100 text-red-800">
                          Action Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>{new Date(notification.timestamp).toLocaleString()}</span>
                      {notification.user_name && (
                        <span>User: {notification.user_name}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {notification.status === 'UNREAD' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  {notification.status === 'READ' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsResolved(notification.id);
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredNotifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-600">Try adjusting your filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  {getTypeIcon(selectedNotification.type)}
                  <span className="ml-2">Notification Details</span>
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedNotification(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Notification Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Type</div>
                    <Badge className={getTypeColor(selectedNotification.type)}>
                      {selectedNotification.type}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Priority</div>
                    <Badge className={getPriorityColor(selectedNotification.priority)}>
                      {selectedNotification.priority}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <Badge className={getStatusColor(selectedNotification.status)}>
                      {selectedNotification.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Action Required</div>
                    <div className={`font-medium ${selectedNotification.action_required ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedNotification.action_required ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>

                {/* Title and Message */}
                <div>
                  <h4 className="font-medium mb-2">Title</h4>
                  <p className="text-gray-700">{selectedNotification.title}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Message</h4>
                  <p className="text-gray-700">{selectedNotification.message}</p>
                </div>

                {/* User Information */}
                {selectedNotification.user_name && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">User Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Name</div>
                        <div className="font-medium">{selectedNotification.user_name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">User ID</div>
                        <div className="font-medium">{selectedNotification.user_id}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Related Data */}
                {selectedNotification.related_data && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Related Data</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(selectedNotification.related_data, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Timestamp */}
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {new Date(selectedNotification.timestamp).toLocaleString()}
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  {selectedNotification.status === 'UNREAD' && (
                    <Button
                      onClick={() => {
                        markAsRead(selectedNotification.id);
                        setSelectedNotification(null);
                      }}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Read
                    </Button>
                  )}
                  {selectedNotification.status === 'READ' && (
                    <Button
                      onClick={() => {
                        markAsResolved(selectedNotification.id);
                        setSelectedNotification(null);
                      }}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
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

export default AdminNotifications;

