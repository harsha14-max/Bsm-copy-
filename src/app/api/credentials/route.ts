import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/credentials - Get user's verifiable credentials
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: credentials, error } = await supabase
      .from('verifiable_credentials')
      .select('*')
      .eq('user_id', user.id)
      .order('issued_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ credentials });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/credentials - Issue new verifiable credential
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      credential_type, 
      credential_data, 
      issuer_did, 
      holder_did, 
      expires_at 
    } = body;

    // Generate credential ID
    const credential_id = `vc:bsm:${credential_type.toLowerCase()}:${Date.now()}`;

    // Create a simple signature (in production, use proper cryptographic signing)
    const signature = `sig:${Math.random().toString(16).substring(2, 66)}`;

    const credentialData = {
      credential_id,
      issuer_did,
      holder_did,
      credential_type,
      credential_data,
      signature,
      user_id: user.id,
      status: 'valid',
      expires_at: expires_at ? new Date(expires_at).toISOString() : null
    };

    const { data, error } = await supabase
      .from('verifiable_credentials')
      .insert([credentialData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ credential: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/credentials - Revoke verifiable credential
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { credential_id, revocation_reason } = body;

    const { data, error } = await supabase
      .from('verifiable_credentials')
      .update({ 
        status: 'revoked',
        revocation_reason,
        updated_at: new Date().toISOString()
      })
      .eq('credential_id', credential_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ credential: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
