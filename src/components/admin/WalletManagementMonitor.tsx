'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  Filter, 
  Search, 
  RefreshCw, 
  Download, 
  Shield, 
  Lock, 
  Unlock, 
  ArrowUp, 
  ArrowDown,
  PieChart,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';

interface WalletTransaction {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  transaction_type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT' | 'REFUND' | 'ADJUSTMENT';
  amount: number;
  currency: string;
  balance_before: number;
  balance_after: number;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  timestamp: string;
  reference_id?: string;
  fee?: number;
  admin_notes?: string;
}

interface WalletBalance {
  user_id: string;
  user_name: string;
  user_email: string;
  total_balance: number;
  currency: string;
  last_activity: string;
  transaction_count: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'FROZEN' | 'CLOSED';
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  verification_status: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

interface WalletStats {
  totalUsers: number;
  totalBalance: number;
  totalTransactions: number;
  pendingTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalFees: number;
  avgTransactionSize: number;
  highRiskUsers: number;
  suspendedWallets: number;
  verifiedUsers: number;
}

const WalletManagementMonitor: React.FC = () => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [stats, setStats] = useState<WalletStats>({
    totalUsers: 0,
    totalBalance: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    completedTransactions: 0,
    failedTransactions: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalFees: 0,
    avgTransactionSize: 0,
    highRiskUsers: 0,
    suspendedWallets: 0,
    verifiedUsers: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null);
  const [selectedBalance, setSelectedBalance] = useState<WalletBalance | null>(null);
  const [activeTab, setActiveTab] = useState<'transactions' | 'balances'>('transactions');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockTransactions: WalletTransaction[] = [
      {
        id: '1',
        user_id: 'user_1',
        user_name: 'John Doe',
        user_email: 'john@example.com',
        transaction_type: 'DEPOSIT',
        amount: 1000.00,
        currency: 'USD',
        balance_before: 500.00,
        balance_after: 1500.00,
        description: 'Bank transfer deposit',
        status: 'COMPLETED',
        timestamp: new Date().toISOString(),
        reference_id: 'TXN_001',
        fee: 0.00
      },
      {
        id: '2',
        user_id: 'user_2',
        user_name: 'Jane Smith',
        user_email: 'jane@example.com',
        transaction_type: 'WITHDRAWAL',
        amount: 250.00,
        currency: 'USD',
        balance_before: 750.00,
        balance_after: 500.00,
        description: 'ATM withdrawal',
        status: 'COMPLETED',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        reference_id: 'TXN_002',
        fee: 2.50
      },
      {
        id: '3',
        user_id: 'user_3',
        user_name: 'Mike Johnson',
        user_email: 'mike@example.com',
        transaction_type: 'PAYMENT',
        amount: 99.99,
        currency: 'USD',
        balance_before: 200.00,
        balance_after: 100.01,
        description: 'Stock purchase - AAPL',
        status: 'PENDING',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        reference_id: 'TXN_003',
        fee: 1.00
      },
      {
        id: '4',
        user_id: 'user_1',
        user_name: 'John Doe',
        user_email: 'john@example.com',
        transaction_type: 'TRANSFER',
        amount: 100.00,
        currency: 'USD',
        balance_before: 1500.00,
        balance_after: 1400.00,
        description: 'Transfer to savings account',
        status: 'FAILED',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        reference_id: 'TXN_004',
        fee: 0.00,
        admin_notes: 'Insufficient funds - account frozen'
      }
    ];

    const mockBalances: WalletBalance[] = [
      {
        user_id: 'user_1',
        user_name: 'John Doe',
        user_email: 'john@example.com',
        total_balance: 1400.00,
        currency: 'USD',
        last_activity: new Date().toISOString(),
        transaction_count: 15,
        status: 'ACTIVE',
        risk_level: 'LOW',
        verification_status: 'VERIFIED'
      },
      {
        user_id: 'user_2',
        user_name: 'Jane Smith',
        user_email: 'jane@example.com',
        total_balance: 500.00,
        currency: 'USD',
        last_activity: new Date(Date.now() - 300000).toISOString(),
        transaction_count: 8,
        status: 'ACTIVE',
        risk_level: 'MEDIUM',
        verification_status: 'VERIFIED'
      },
      {
        user_id: 'user_3',
        user_name: 'Mike Johnson',
        user_email: 'mike@example.com',
        total_balance: 100.01,
        currency: 'USD',
        last_activity: new Date(Date.now() - 600000).toISOString(),
        transaction_count: 3,
        status: 'SUSPENDED',
        risk_level: 'HIGH',
        verification_status: 'PENDING'
      }
    ];

    setTransactions(mockTransactions);
    setBalances(mockBalances);

    // Calculate stats
    const totalUsers = mockBalances.length;
    const totalBalance = mockBalances.reduce((sum, balance) => sum + balance.total_balance, 0);
    const totalTransactions = mockTransactions.length;
    const pendingTransactions = mockTransactions.filter(t => t.status === 'PENDING').length;
    const completedTransactions = mockTransactions.filter(t => t.status === 'COMPLETED').length;
    const failedTransactions = mockTransactions.filter(t => t.status === 'FAILED').length;
    const totalDeposits = mockTransactions.filter(t => t.transaction_type === 'DEPOSIT').reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = mockTransactions.filter(t => t.transaction_type === 'WITHDRAWAL').reduce((sum, t) => sum + t.amount, 0);
    const totalFees = mockTransactions.reduce((sum, t) => sum + (t.fee || 0), 0);
    const highRiskUsers = mockBalances.filter(b => b.risk_level === 'HIGH').length;
    const suspendedWallets = mockBalances.filter(b => b.status === 'SUSPENDED').length;
    const verifiedUsers = mockBalances.filter(b => b.verification_status === 'VERIFIED').length;

    setStats({
      totalUsers,
      totalBalance,
      totalTransactions,
      pendingTransactions,
      completedTransactions,
      failedTransactions,
      totalDeposits,
      totalWithdrawals,
      totalFees,
      avgTransactionSize: totalTransactions > 0 ? totalBalance / totalTransactions : 0,
      highRiskUsers,
      suspendedWallets,
      verifiedUsers
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'bg-green-100 text-green-800';
      case 'WITHDRAWAL': return 'bg-red-100 text-red-800';
      case 'TRANSFER': return 'bg-blue-100 text-blue-800';
      case 'PAYMENT': return 'bg-purple-100 text-purple-800';
      case 'REFUND': return 'bg-orange-100 text-orange-800';
      case 'ADJUSTMENT': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWalletStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'SUSPENDED': return 'bg-yellow-100 text-yellow-800';
      case 'FROZEN': return 'bg-red-100 text-red-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesType = filterType === 'all' || transaction.transaction_type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredBalances = balances.filter(balance => {
    const matchesSearch = 
      balance.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      balance.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = filterRisk === 'all' || balance.risk_level === filterRisk;
    
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Wallet Management Monitor</h2>
          <p className="text-gray-600">Comprehensive wallet and transaction monitoring</p>
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

      {/* Wallet Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.verifiedUsers} verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${stats.totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all wallets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.avgTransactionSize.toFixed(0)} avg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingTransactions}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk and Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              High Risk Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.highRiskUsers}</div>
            <p className="text-sm text-gray-600">
              Require monitoring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-yellow-600" />
              Suspended Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.suspendedWallets}</div>
            <p className="text-sm text-gray-600">
              Need review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Verified Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.verifiedUsers}</div>
            <p className="text-sm text-gray-600">
              {stats.totalUsers > 0 ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'transactions'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Activity className="h-4 w-4 inline mr-2" />
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('balances')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'balances'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Wallet className="h-4 w-4 inline mr-2" />
          Wallet Balances
        </button>
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
                  placeholder="Search by user, email, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {activeTab === 'transactions' ? (
                <>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Types</option>
                    <option value="DEPOSIT">Deposits</option>
                    <option value="WITHDRAWAL">Withdrawals</option>
                    <option value="TRANSFER">Transfers</option>
                    <option value="PAYMENT">Payments</option>
                    <option value="REFUND">Refunds</option>
                    <option value="ADJUSTMENT">Adjustments</option>
                  </select>
                </>
              ) : (
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="LOW">Low Risk</option>
                  <option value="MEDIUM">Medium Risk</option>
                  <option value="HIGH">High Risk</option>
                </select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on active tab */}
      {activeTab === 'transactions' ? (
        /* Transactions Table */
        <Card>
          <CardHeader>
            <CardTitle>Wallet Transactions</CardTitle>
            <p className="text-sm text-gray-600">
              Showing {filteredTransactions.length} transactions
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {transaction.transaction_type === 'DEPOSIT' ? (
                        <ArrowUp className="h-5 w-5 text-green-600" />
                      ) : transaction.transaction_type === 'WITHDRAWAL' ? (
                        <ArrowDown className="h-5 w-5 text-red-600" />
                      ) : (
                        <Activity className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{transaction.user_name}</h3>
                        <Badge className={getTypeColor(transaction.transaction_type)}>
                          {transaction.transaction_type}
                        </Badge>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{transaction.description}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>Amount: ${transaction.amount.toFixed(2)}</span>
                        <span>Balance: ${transaction.balance_after.toFixed(2)}</span>
                        <span>{new Date(transaction.timestamp).toLocaleString()}</span>
                        {transaction.fee && transaction.fee > 0 && (
                          <span>Fee: ${transaction.fee.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`text-lg font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Wallet Balances Table */
        <Card>
          <CardHeader>
            <CardTitle>Wallet Balances</CardTitle>
            <p className="text-sm text-gray-600">
              Showing {filteredBalances.length} wallets
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBalances.map((balance) => (
                <div
                  key={balance.user_id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedBalance(balance)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{balance.user_name}</h3>
                        <Badge className={getWalletStatusColor(balance.status)}>
                          {balance.status}
                        </Badge>
                        <Badge className={getRiskColor(balance.risk_level)}>
                          {balance.risk_level} Risk
                        </Badge>
                        <Badge className={balance.verification_status === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {balance.verification_status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{balance.user_email}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{balance.transaction_count} transactions</span>
                        <span>Last activity: {new Date(balance.last_activity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-lg font-bold text-green-600">
                      ${balance.total_balance.toFixed(2)}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredBalances.length === 0 && (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No wallets found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Transaction Details
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTransaction(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Transaction Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Transaction ID</div>
                    <div className="font-medium">{selectedTransaction.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Reference ID</div>
                    <div className="font-medium">{selectedTransaction.reference_id || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Type</div>
                    <Badge className={getTypeColor(selectedTransaction.transaction_type)}>
                      {selectedTransaction.transaction_type}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <Badge className={getStatusColor(selectedTransaction.status)}>
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Amount</div>
                    <div className="font-medium">${selectedTransaction.amount.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Currency</div>
                    <div className="font-medium">{selectedTransaction.currency}</div>
                  </div>
                </div>

                {/* Balance Information */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Balance Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Balance Before</div>
                      <div className="font-medium">${selectedTransaction.balance_before.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Balance After</div>
                      <div className="font-medium">${selectedTransaction.balance_after.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* User Information */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">User Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="font-medium">{selectedTransaction.user_name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{selectedTransaction.user_email}</div>
                    </div>
                  </div>
                </div>

                {/* Description and Notes */}
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-gray-700 mb-2">{selectedTransaction.description}</p>
                  {selectedTransaction.admin_notes && (
                    <div>
                      <h5 className="font-medium text-sm">Admin Notes</h5>
                      <p className="text-sm text-gray-700">{selectedTransaction.admin_notes}</p>
                    </div>
                  )}
                </div>

                {/* Timestamp and Fees */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {new Date(selectedTransaction.timestamp).toLocaleString()}
                  </div>
                  {selectedTransaction.fee && selectedTransaction.fee > 0 && (
                    <div>
                      Fee: ${selectedTransaction.fee.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Balance Detail Modal */}
      {selectedBalance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Wallet Details
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedBalance(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Wallet Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Balance</div>
                    <div className="text-2xl font-bold text-green-600">${selectedBalance.total_balance.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Currency</div>
                    <div className="font-medium">{selectedBalance.currency}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <Badge className={getWalletStatusColor(selectedBalance.status)}>
                      {selectedBalance.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Risk Level</div>
                    <Badge className={getRiskColor(selectedBalance.risk_level)}>
                      {selectedBalance.risk_level} Risk
                    </Badge>
                  </div>
                </div>

                {/* User Information */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">User Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="font-medium">{selectedBalance.user_name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{selectedBalance.user_email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Verification Status</div>
                      <Badge className={selectedBalance.verification_status === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {selectedBalance.verification_status}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Transaction Count</div>
                      <div className="font-medium">{selectedBalance.transaction_count}</div>
                    </div>
                  </div>
                </div>

                {/* Activity Information */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Activity Information</h4>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Last Activity: {new Date(selectedBalance.last_activity).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Transactions
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Review
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Target className="h-4 w-4 mr-2" />
                    Risk Assessment
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

export default WalletManagementMonitor;

