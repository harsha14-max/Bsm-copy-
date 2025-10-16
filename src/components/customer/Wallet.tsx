'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  History, 
  Send, 
  Download,
  Plus,
  Minus,
  ArrowUpDown,
  DollarSign,
  Coins,
  Star
} from 'lucide-react';

interface WalletData {
  id: string;
  wallet_type: 'currency' | 'credits' | 'loyalty_points';
  balance: number;
  currency_code: string;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  balance_after: number;
  description: string;
  status: string;
  created_at: string;
}

const WalletTab: React.FC = () => {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'transfer' | 'deposit'>('overview');
  const [transferAmount, setTransferAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<string>('');

  // Mock data - replace with actual API calls
  useEffect(() => {
    setWallets([
      {
        id: '1',
        wallet_type: 'currency',
        balance: 1250.50,
        currency_code: 'USD'
      },
      {
        id: '2',
        wallet_type: 'credits',
        balance: 500,
        currency_code: 'CREDITS'
      },
      {
        id: '3',
        wallet_type: 'loyalty_points',
        balance: 2500,
        currency_code: 'POINTS'
      }
    ]);

    setTransactions([
      {
        id: '1',
        transaction_type: 'deposit',
        amount: 100.00,
        balance_after: 1250.50,
        description: 'Wallet top-up via credit card',
        status: 'completed',
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        transaction_type: 'purchase',
        amount: -25.00,
        balance_after: 1225.50,
        description: 'Premium service purchase',
        status: 'completed',
        created_at: '2024-01-14T15:45:00Z'
      },
      {
        id: '3',
        transaction_type: 'reward',
        amount: 50.00,
        balance_after: 1250.50,
        description: 'Loyalty reward bonus',
        status: 'completed',
        created_at: '2024-01-13T09:20:00Z'
      }
    ]);
  }, []);

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'currency': return <DollarSign className="h-6 w-6" />;
      case 'credits': return <Coins className="h-6 w-6" />;
      case 'loyalty_points': return <Star className="h-6 w-6" />;
      default: return <Wallet className="h-6 w-6" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <Plus className="h-4 w-4 text-green-500" />;
      case 'withdrawal': return <Minus className="h-4 w-4 text-red-500" />;
      case 'transfer_in': return <ArrowUpDown className="h-4 w-4 text-blue-500" />;
      case 'transfer_out': return <ArrowUpDown className="h-4 w-4 text-orange-500" />;
      case 'purchase': return <CreditCard className="h-4 w-4 text-purple-500" />;
      case 'refund': return <Download className="h-4 w-4 text-green-500" />;
      case 'reward': return <Star className="h-4 w-4 text-yellow-500" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'USD') {
      return `$${amount.toFixed(2)}`;
    }
    return `${amount.toFixed(0)} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-600">Manage your digital wallet and transactions</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setActiveTab('deposit')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Funds
          </Button>
          <Button 
            onClick={() => setActiveTab('transfer')}
            variant="outline"
          >
            <Send className="h-4 w-4 mr-2" />
            Transfer
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Wallet },
          { id: 'transactions', label: 'Transactions', icon: History },
          { id: 'transfer', label: 'Transfer', icon: Send },
          { id: 'deposit', label: 'Deposit', icon: Plus }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Wallet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wallets.map((wallet) => (
              <Card key={wallet.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {wallet.wallet_type.replace('_', ' ').toUpperCase()}
                  </CardTitle>
                  {getWalletIcon(wallet.wallet_type)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatAmount(wallet.balance, wallet.currency_code)}
                  </div>
                  <p className="text-xs text-gray-500">
                    Available Balance
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$245.50</div>
                <p className="text-xs text-gray-500">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rewards Earned</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,500</div>
                <p className="text-xs text-gray-500">Loyalty points</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getTransactionIcon(transaction.transaction_type)}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(transaction.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount, 'USD')}
                    </p>
                    <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transfer Tab */}
      {activeTab === 'transfer' && (
        <Card>
          <CardHeader>
            <CardTitle>Transfer Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Wallet
              </label>
              <select 
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select wallet</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.wallet_type.replace('_', ' ').toUpperCase()} - {formatAmount(wallet.balance, wallet.currency_code)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <Input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To User (Email)
              </label>
              <Input
                type="email"
                placeholder="Enter recipient email"
              />
            </div>
            <Button className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Transfer Funds
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Deposit Tab */}
      {activeTab === 'deposit' && (
        <Card>
          <CardHeader>
            <CardTitle>Add Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Wallet
              </label>
              <select 
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select wallet</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.wallet_type.replace('_', ' ').toUpperCase()} - {formatAmount(wallet.balance, wallet.currency_code)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <Input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Credit Card
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Bank Transfer
              </Button>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WalletTab;



