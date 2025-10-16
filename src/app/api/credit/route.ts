import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/credit - Get user's credit score
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: creditScore, error } = await supabase
      .from('credit_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('calculated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!creditScore) {
      return NextResponse.json({ error: 'No credit score found' }, { status: 404 });
    }

    return NextResponse.json({ creditScore });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/credit - Calculate new credit score
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { credit_factors, zkp_proof } = body;

    // Calculate sovereign credit score based on factors
    const calculateScore = (factors: any) => {
      const weights = {
        paymentHistory: 0.35,
        creditUtilization: 0.30,
        creditAge: 0.15,
        creditMix: 0.10,
        newCredit: 0.10
      };

      let score = 300; // Base score

      // Payment history (0-350 points)
      if (factors.paymentHistory === 'excellent') score += 350;
      else if (factors.paymentHistory === 'good') score += 280;
      else if (factors.paymentHistory === 'fair') score += 200;
      else if (factors.paymentHistory === 'poor') score += 100;

      // Credit utilization (0-300 points)
      const utilization = factors.creditUtilization || 0;
      if (utilization <= 0.1) score += 300;
      else if (utilization <= 0.2) score += 250;
      else if (utilization <= 0.3) score += 200;
      else if (utilization <= 0.5) score += 150;
      else score += 100;

      // Credit age (0-150 points)
      const age = factors.creditAge || 0;
      if (age >= 10) score += 150;
      else if (age >= 7) score += 120;
      else if (age >= 5) score += 90;
      else if (age >= 3) score += 60;
      else score += 30;

      // Credit mix (0-100 points)
      const mix = factors.creditMix || 0;
      if (mix >= 4) score += 100;
      else if (mix >= 3) score += 80;
      else if (mix >= 2) score += 60;
      else score += 40;

      // New credit (0-100 points)
      const newCredit = factors.newCredit || 0;
      if (newCredit === 0) score += 100;
      else if (newCredit <= 2) score += 80;
      else if (newCredit <= 4) score += 60;
      else score += 40;

      return Math.min(Math.max(score, 300), 1000);
    };

    const sovereign_score = calculateScore(credit_factors);

    const creditScoreData = {
      user_id: user.id,
      sovereign_score,
      credit_factors,
      zkp_proof,
      is_verified: !!zkp_proof,
      verification_method: zkp_proof ? 'zkp' : 'basic'
    };

    const { data, error } = await supabase
      .from('credit_scores')
      .insert([creditScoreData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ creditScore: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/credit - Update credit score verification
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { credit_score_id, is_verified, zkp_proof } = body;

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (is_verified !== undefined) updateData.is_verified = is_verified;
    if (zkp_proof) updateData.zkp_proof = zkp_proof;

    const { data, error } = await supabase
      .from('credit_scores')
      .update(updateData)
      .eq('id', credit_score_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ creditScore: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
