import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const type = searchParams.get('type')

    let query = supabase
      .from('store_products')
      .select(`
        *,
        category:store_categories(name, description)
      `)
      .eq('is_active', true)

    if (category && category !== 'all') {
      query = query.eq('category_id', category)
    }

    if (type) {
      query = query.eq('product_type', type)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: products, error: productsError } = await query.order('created_at', { ascending: false })

    if (productsError) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    // Get categories
    const { data: categories, error: categoriesError } = await supabase
      .from('store_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (categoriesError) {
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }

    return NextResponse.json({
      products: products || [],
      categories: categories || []
    })
  } catch (error) {
    console.error('Store API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



