'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Key,
  Brain,
  Lock,
  FileText,
  BarChart3,
  Activity
} from 'lucide-react';

interface DIDStats {
  total_dids: number;
  active_dids: number;
  revoked_dids: number;
  new_dids_today: number;
}

interface CreditStats {
  total_scores: number;
  average_score: number;
  high_risk_scores: number;
  verified_scores: number;
}

interface DIDActivity {
  id: string;
  user_id: string;
  did_identifier: string;
  action: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
}

interface CreditActivity {
  id: string;
  user_id: string;
  score: number;
  change: number;
  timestamp: string;
  verification_status: 'verified' | 'pending' | 'failed';
}

const DIDCreditMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'did-activity' | 'credit-activity' | 'analytics'>('overview');
  const [didStats, setDidStats] = useState<DIDStats | null>(null);
  const [creditStats, setCreditStats] = useState<CreditStats | null>(null);
  const [didActivities, setDidActivities] = useState<DIDActivity[]>([]);
  const [creditActivities, setCreditActivities] = useState<CreditActivity[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockDIDStats: DIDStats = {
      total_dids: 1247,
      active_dids: 1189,
      revoked_dids: 58,
      new_dids_today: 23
    };

    const mockCreditStats: CreditStats = {
      total_scores: 1189,
      average_score: 742,
      high_risk_scores: 89,
      verified_scores: 1156
    };

    const mockDIDActivities: DIDActivity[] = [
      {
        id: '1',
        user_id: 'user123',
        did_identifier: 'did:bsm:user123',
        action: 'DID Created',
        timestamp: '2024-01-15T10:30:00Z',
        status: 'success'
      },
      {
        id: '2',
        user_id: 'user456',
        did_identifier: 'did:bsm:user456',
        action: 'DID Revoked',
        timestamp: '2024-01-15T09:15:00Z',
        status: 'success'
      },
      {
        id: '3',
        user_id: 'user789',
        did_identifier: 'did:bsm:user789',
        action: 'DID Suspended',
        timestamp: '2024-01-15T08:45:00Z',
        status: 'success'
      }
    ];

    const mockCreditActivities: CreditActivity[] = [
      {
        id: '1',
        user_id: 'user123',
        score: 750,
        change: 15,
        timestamp: '2024-01-15T10:30:00Z',
        verification_status: 'verified'
      },
      {
        id: '2',
        user_id: 'user456',
        score: 680,
        change: -25,
        timestamp: '2024-01-15T09:15:00Z',
        verification_status: 'pending'
      },
      {
        id: '3',
        user_id: 'user789',
        score: 820,
        change: 30,
        timestamp: '2024-01-15T08:45:00Z',
        verification_status: 'verified'
      }
    ];

    setDidStats(mockDIDStats);
    setCreditStats(mockCreditStats);
    setDidActivities(mockDIDActivities);
    setCreditActivities(mockCreditActivities);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600';
    if (score >= 700) return 'text-yellow-600';
    if (score >= 600) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            DID & Credit Monitoring
          </h2>
          <p className="text-gray-600">Monitor decentralized identity and credit scoring activities</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('did-activity')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'did-activity'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Key className="h-4 w-4 inline mr-2" />
          DID Activity
        </button>
        <button
          onClick={() => setActiveTab('credit-activity')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'credit-activity'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Brain className="h-4 w-4 inline mr-2" />
          Credit Activity
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Activity className="h-4 w-4 inline mr-2" />
          Analytics
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* DID Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total DIDs</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{didStats?.total_dids.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{didStats?.new_dids_today} today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active DIDs</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{didStats?.active_dids.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {didStats ? ((didStats.active_dids / didStats.total_dids) * 100).toFixed(1) : 0}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revoked DIDs</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{didStats?.revoked_dids.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {didStats ? ((didStats.revoked_dids / didStats.total_dids) * 100).toFixed(1) : 0}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Today</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{didStats?.new_dids_today}</div>
                <p className="text-xs text-muted-foreground">
                  DIDs created today
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Credit Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Scores</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{creditStats?.total_scores.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Credit scores calculated
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{creditStats?.average_score}</div>
                <p className="text-xs text-muted-foreground">
                  Out of 1000
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{creditStats?.high_risk_scores}</div>
                <p className="text-xs text-muted-foreground">
                  Scores below 600
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                <Lock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{creditStats?.verified_scores.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {creditStats ? ((creditStats.verified_scores / creditStats.total_scores) * 100).toFixed(1) : 0}% verified
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* DID Activity Tab */}
      {activeTab === 'did-activity' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent DID Activities</h3>
            <Button>
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {didActivities.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activity.action}</span>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 font-mono">{activity.did_identifier}</p>
                      <p className="text-xs text-gray-500">
                        User ID: {activity.user_id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Credit Activity Tab */}
      {activeTab === 'credit-activity' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Credit Activities</h3>
            <Button>
              <Brain className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {creditActivities.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Credit Score Update</span>
                        <Badge className={getStatusColor(activity.verification_status)}>
                          {activity.verification_status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-lg font-bold ${getScoreColor(activity.score)}`}>
                          {activity.score}
                        </span>
                        <span className={`text-sm ${activity.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {activity.change >= 0 ? '+' : ''}{activity.change}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        User ID: {activity.user_id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>DID Creation Trends</CardTitle>
                <CardDescription>Daily DID creation over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart visualization would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credit Score Distribution</CardTitle>
                <CardDescription>Distribution of credit scores across users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart visualization would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ZKP Verification Status</CardTitle>
              <CardDescription>Zero-Knowledge Proof verification statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">1,156</div>
                  <div className="text-sm text-gray-600">Verified Proofs</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">33</div>
                  <div className="text-sm text-gray-600">Pending Verification</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">0</div>
                  <div className="text-sm text-gray-600">Failed Verification</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DIDCreditMonitoring;
