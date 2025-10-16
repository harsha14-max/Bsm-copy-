'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Lock,
  Unlock,
  FileText,
  CreditCard,
  Brain
} from 'lucide-react';

interface DIDDocument {
  id: string;
  did_identifier: string;
  public_key: string;
  document_content: any;
  created_at: string;
  status: 'active' | 'revoked' | 'suspended';
}

interface VerifiableCredential {
  id: string;
  credential_id: string;
  issuer_did: string;
  holder_did: string;
  credential_type: string;
  credential_data: any;
  issued_at: string;
  expires_at?: string;
  status: 'valid' | 'revoked' | 'expired';
}

interface CreditScore {
  id: string;
  sovereign_score: number;
  credit_factors: any;
  calculated_at: string;
  is_verified: boolean;
  verification_method: string;
}

const DIDManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'did' | 'credentials' | 'credit'>('did');
  const [didDocuments, setDidDocuments] = useState<DIDDocument[]>([]);
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([]);
  const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState<{ [key: string]: boolean }>({});
  const [newDIDName, setNewDIDName] = useState('');
  const [selectedDID, setSelectedDID] = useState<DIDDocument | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockDIDs: DIDDocument[] = [
      {
        id: '1',
        did_identifier: 'did:bsm:user123',
        public_key: '03a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        document_content: {
          '@context': ['https://www.w3.org/ns/did/v1'],
          id: 'did:bsm:user123',
          publicKey: [{
            id: 'did:bsm:user123#key-1',
            type: 'Secp256k1VerificationKey2018',
            controller: 'did:bsm:user123',
            publicKeyHex: '03a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456'
          }],
          authentication: ['did:bsm:user123#key-1'],
          service: [{
            id: 'did:bsm:user123#bsm-service',
            type: 'BSMService',
            serviceEndpoint: 'https://bsm.example.com/api'
          }]
        },
        created_at: '2024-01-15T10:30:00Z',
        status: 'active'
      }
    ];

    const mockCredentials: VerifiableCredential[] = [
      {
        id: '1',
        credential_id: 'vc:bsm:identity:123',
        issuer_did: 'did:bsm:issuer',
        holder_did: 'did:bsm:user123',
        credential_type: 'IdentityCredential',
        credential_data: {
          name: 'John Doe',
          email: 'john@example.com',
          verified: true,
          issuedBy: 'BSM Identity Service'
        },
        issued_at: '2024-01-15T10:30:00Z',
        expires_at: '2025-01-15T10:30:00Z',
        status: 'valid'
      },
      {
        id: '2',
        credential_id: 'vc:bsm:credit:456',
        issuer_did: 'did:bsm:credit-bureau',
        holder_did: 'did:bsm:user123',
        credential_type: 'CreditCredential',
        credential_data: {
          creditScore: 750,
          creditLimit: 50000,
          paymentHistory: 'excellent',
          issuedBy: 'BSM Credit Bureau'
        },
        issued_at: '2024-01-10T09:15:00Z',
        expires_at: '2024-07-10T09:15:00Z',
        status: 'valid'
      }
    ];

    const mockCreditScore: CreditScore = {
      id: '1',
      sovereign_score: 750,
      credit_factors: {
        paymentHistory: 0.3,
        creditUtilization: 0.25,
        creditAge: 0.2,
        creditMix: 0.15,
        newCredit: 0.1
      },
      calculated_at: '2024-01-15T10:30:00Z',
      is_verified: true,
      verification_method: 'zkp'
    };

    setDidDocuments(mockDIDs);
    setCredentials(mockCredentials);
    setCreditScore(mockCreditScore);
  }, []);

  const generateNewDID = async () => {
    if (!newDIDName.trim()) return;
    
    setLoading(true);
    try {
      // Simulate DID generation
      const newDID: DIDDocument = {
        id: Date.now().toString(),
        did_identifier: `did:bsm:${newDIDName.toLowerCase().replace(/\s+/g, '')}`,
        public_key: '03' + Math.random().toString(16).substring(2, 66),
        document_content: {
          '@context': ['https://www.w3.org/ns/did/v1'],
          id: `did:bsm:${newDIDName.toLowerCase().replace(/\s+/g, '')}`,
          publicKey: [{
            id: `did:bsm:${newDIDName.toLowerCase().replace(/\s+/g, '')}#key-1`,
            type: 'Secp256k1VerificationKey2018',
            controller: `did:bsm:${newDIDName.toLowerCase().replace(/\s+/g, '')}`,
            publicKeyHex: '03' + Math.random().toString(16).substring(2, 66)
          }],
          authentication: [`did:bsm:${newDIDName.toLowerCase().replace(/\s+/g, '')}#key-1`]
        },
        created_at: new Date().toISOString(),
        status: 'active'
      };

      setDidDocuments(prev => [...prev, newDID]);
      setNewDIDName('');
    } catch (error) {
      console.error('Error generating DID:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const togglePrivateKey = (didId: string) => {
    setShowPrivateKey(prev => ({
      ...prev,
      [didId]: !prev[didId]
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600';
    if (score >= 700) return 'text-yellow-600';
    if (score >= 600) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 800) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 600) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Decentralized Identity & Credit Scoring
          </h2>
          <p className="text-gray-600">Manage your digital identity and sovereign credit score</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('did')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'did'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Key className="h-4 w-4 inline mr-2" />
          DID Management
        </button>
        <button
          onClick={() => setActiveTab('credentials')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'credentials'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Verifiable Credentials
        </button>
        <button
          onClick={() => setActiveTab('credit')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'credit'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <CreditCard className="h-4 w-4 inline mr-2" />
          Credit Scoring
        </button>
      </div>

      {/* DID Management Tab */}
      {activeTab === 'did' && (
        <div className="space-y-6">
          {/* Create New DID */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Create New DID
              </CardTitle>
              <CardDescription>
                Generate a new decentralized identifier for your digital identity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="did-name">DID Name</Label>
                  <Input
                    id="did-name"
                    placeholder="Enter a name for your DID"
                    value={newDIDName}
                    onChange={(e) => setNewDIDName(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={generateNewDID} disabled={loading || !newDIDName.trim()}>
                    {loading ? 'Generating...' : 'Generate DID'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DID Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your DID Documents</h3>
            {didDocuments.map((did) => (
              <Card key={did.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={did.status === 'active' ? 'default' : 'secondary'}>
                        {did.status}
                      </Badge>
                      <span className="font-mono text-sm">{did.did_identifier}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(did.did_identifier)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDID(selectedDID?.id === did.id ? null : did)}
                      >
                        {selectedDID?.id === did.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {selectedDID?.id === did.id && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div>
                        <Label>Public Key</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={did.public_key}
                            readOnly
                            className="font-mono text-xs"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(did.public_key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>DID Document</Label>
                        <Textarea
                          value={JSON.stringify(did.document_content, null, 2)}
                          readOnly
                          rows={8}
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Verifiable Credentials Tab */}
      {activeTab === 'credentials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Verifiable Credentials</h3>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Request New Credential
            </Button>
          </div>

          <div className="grid gap-4">
            {credentials.map((credential) => (
              <Card key={credential.id} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{credential.credential_type}</CardTitle>
                      <CardDescription className="font-mono text-sm">
                        {credential.credential_id}
                      </CardDescription>
                    </div>
                    <Badge variant={credential.status === 'valid' ? 'default' : 'secondary'}>
                      {credential.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Issuer</Label>
                        <p className="font-mono text-sm">{credential.issuer_did}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Expires</Label>
                        <p className="text-sm">
                          {credential.expires_at 
                            ? new Date(credential.expires_at).toLocaleDateString()
                            : 'Never'
                          }
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Credential Data</Label>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <pre className="text-xs font-mono">
                          {JSON.stringify(credential.credential_data, null, 2)}
                        </pre>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy ID
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Credit Scoring Tab */}
      {activeTab === 'credit' && (
        <div className="space-y-6">
          {creditScore && (
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Sovereign Credit Score
                </CardTitle>
                <CardDescription>
                  Your privacy-preserving credit score calculated using Zero-Knowledge Proofs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Score Display */}
                  <div className="text-center">
                    <div className={`text-6xl font-bold ${getScoreColor(creditScore.sovereign_score)}`}>
                      {creditScore.sovereign_score}
                    </div>
                    <div className="text-lg font-medium text-gray-600">
                      {getScoreLabel(creditScore.sovereign_score)}
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      {creditScore.is_verified ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
                      <span className="text-sm">
                        {creditScore.is_verified ? 'Verified with ZKP' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>

                  {/* Credit Factors */}
                  <div>
                    <h4 className="font-semibold mb-3">Credit Factors</h4>
                    <div className="space-y-2">
                      {Object.entries(creditScore.credit_factors).map(([factor, weight]) => (
                        <div key={factor} className="flex items-center justify-between">
                          <span className="capitalize">{factor.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(weight as number) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{(weight as number * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ZKP Information */}
                  <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      Your credit score is calculated using Zero-Knowledge Proofs, ensuring your financial data remains private while providing verifiable creditworthiness.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2">
                    <Button>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate New Score
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default DIDManagement;
