import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/did - Get user's DID documents
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: didDocuments, error } = await supabase
      .from('did_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ didDocuments });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/did - Create new DID document
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { did_identifier, public_key, private_key_encrypted, document_content } = body;

    // Generate a simple DID document structure
    const didDocument = {
      did_identifier,
      public_key,
      private_key_encrypted,
      document_content: {
        '@context': ['https://www.w3.org/ns/did/v1'],
        id: did_identifier,
        publicKey: [{
          id: `${did_identifier}#key-1`,
          type: 'Secp256k1VerificationKey2018',
          controller: did_identifier,
          publicKeyHex: public_key
        }],
        authentication: [`${did_identifier}#key-1`],
        service: [{
          id: `${did_identifier}#bsm-service`,
          type: 'BSMService',
          serviceEndpoint: 'https://bsm.example.com/api'
        }]
      },
      user_id: user.id,
      status: 'active'
    };

    const { data, error } = await supabase
      .from('did_documents')
      .insert([didDocument])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ didDocument: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/did - Update DID document status
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { did_id, status } = body;

    const { data, error } = await supabase
      .from('did_documents')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', did_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ didDocument: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
