import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user's wallets
    const { data: wallets, error: walletsError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)

    if (walletsError) {
      return NextResponse.json({ error: 'Failed to fetch wallets' }, { status: 500 })
    }

    // Get recent transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('wallet_transactions')
      .select(`
        *,
        wallet:wallets(wallet_type, currency_code)
      `)
      .in('wallet_id', wallets?.map(w => w.id) || [])
      .order('created_at', { ascending: false })
      .limit(10)

    if (transactionsError) {
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
    }

    return NextResponse.json({
      wallets: wallets || [],
      transactions: transactions || []
    })
  } catch (error) {
    console.error('Wallet API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, walletType, amount, description, transactionType } = body

    if (!userId || !walletType || !amount || !transactionType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user's wallet
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .eq('wallet_type', walletType)
      .eq('is_active', true)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    const balanceBefore = wallet.balance
    const balanceAfter = transactionType === 'deposit' 
      ? balanceBefore + amount 
      : balanceBefore - amount

    if (balanceAfter < 0) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 })
    }

    // Update wallet balance
    const { error: updateError } = await supabase
      .from('wallets')
      .update({ balance: balanceAfter })
      .eq('id', wallet.id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update wallet' }, { status: 500 })
    }

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('wallet_transactions')
      .insert({
        wallet_id: wallet.id,
        transaction_type: transactionType,
        amount: transactionType === 'deposit' ? amount : -amount,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        description: description || `${transactionType} transaction`,
        status: 'completed'
      })
      .select()
      .single()

    if (transactionError) {
      return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      transaction,
      newBalance: balanceAfter
    })
  } catch (error) {
    console.error('Wallet transaction error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



