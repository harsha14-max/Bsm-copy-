import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items, paymentMethod } = body

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('store_orders')
      .insert({
        user_id: userId,
        order_number: orderNumber,
        total_amount: totalAmount,
        currency_code: 'USD',
        status: 'pending',
        payment_method: paymentMethod || 'wallet',
        metadata: { items: items.length }
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }))

    const { error: itemsError } = await supabase
      .from('store_order_items')
      .insert(orderItems)

    if (itemsError) {
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 })
    }

    // Process payment (simplified - in real app, integrate with payment gateway)
    if (paymentMethod === 'wallet') {
      // Deduct from user's wallet
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .eq('wallet_type', 'currency')
        .eq('is_active', true)
        .single()

      if (walletError || !wallet) {
        return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
      }

      if (wallet.balance < totalAmount) {
        return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 })
      }

      // Update wallet balance
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance - totalAmount })
        .eq('id', wallet.id)

      if (updateError) {
        return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 })
      }

      // Create wallet transaction
      await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: wallet.id,
          transaction_type: 'purchase',
          amount: -totalAmount,
          balance_before: wallet.balance,
          balance_after: wallet.balance - totalAmount,
          description: `Purchase: ${orderNumber}`,
          reference_id: order.id,
          reference_type: 'order',
          status: 'completed'
        })
    }

    // Update order status
    const { error: updateOrderError } = await supabase
      .from('store_orders')
      .update({ 
        status: 'completed',
        payment_reference: `PAY-${Date.now()}`
      })
      .eq('id', order.id)

    if (updateOrderError) {
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
    }

    // Create user licenses for digital products
    const digitalItems = items.filter((item: any) => item.isDigital)
    if (digitalItems.length > 0) {
      const licenses = digitalItems.map((item: any) => ({
        user_id: userId,
        product_id: item.productId,
        order_id: order.id,
        license_key: `LIC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        is_active: true
      }))

      await supabase
        .from('user_licenses')
        .insert(licenses)
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        status: 'completed'
      }
    })
  } catch (error) {
    console.error('Store order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user's orders
    const { data: orders, error: ordersError } = await supabase
      .from('store_orders')
      .select(`
        *,
        items:store_order_items(
          *,
          product:store_products(name, description, product_type)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (ordersError) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    return NextResponse.json({
      orders: orders || []
    })
  } catch (error) {
    console.error('Store orders API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



