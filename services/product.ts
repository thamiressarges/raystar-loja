import { createSupabaseServerClient } from '@/lib/server';
import { Product, Category, Review } from '@/types';
import { notFound } from 'next/navigation';

function hasStock(product: any): boolean {
  if (product.is_available === false) return false;

  let totalVariantStock = 0;
  
  if (product.variations && product.variations.length > 0) {
    totalVariantStock = product.variations.reduce((acc: number, v: any) => {
      return acc + (v.stock || 0);
    }, 0);
  }

  const productStock = product.quantity || 0;

  return totalVariantStock > 0 || productStock > 0;
}

export async function getCategoriesWithProducts(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('categories')
    .select(`
      id, name, slug,
      products (
        id, title, price, photos, description, created_at, is_available, quantity,
        variations ( stock ),
        reviews ( rating )
      )
    `)
    .eq('is_active', true)
    .order('name');

  if (error || !data) return [];

  return data.map((cat: any) => {
    const products = (cat.products || [])
      .filter((p: any) => hasStock(p))
      .map((p: any) => {
        const reviews = p.reviews || [];
        const total = reviews.length;
        const avg = total > 0 ? reviews.reduce((a: number, r: any) => a + r.rating, 0) / total : 0;
        return { ...p, rating: avg, total_reviews: total };
      });
    
    return { ...cat, products };
  });
}

export async function getProductBySlugOrId(id: string) {
  const supabase = await createSupabaseServerClient();

  const [productRes, variationsRes, reviewsRes] = await Promise.all([
    supabase.from('products').select('*, category:categories(id, name, slug)').eq('id', id).single(),
    supabase.from('variations').select('*').eq('product_id', id),
    supabase.from('reviews').select('*, users(name)').eq('product_id', id).order('created_at', { ascending: false })
  ]);

  if (productRes.error || !productRes.data) notFound();

  const reviews = reviewsRes.data || [];
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviews : 0;

  const product: Product = {
    ...productRes.data,
    rating: avgRating,
    total_reviews: totalReviews
  };

  const variations = (variationsRes.data || []).map((v: any) => ({
    id: v.id,
    product_id: v.product_id,
    price: v.price,
    size: v.tamanho,
    color: v.cor,
    stock: v.stock,
    is_available: v.is_available
  }));

  const formattedReviews: Review[] = reviews.map((r: any) => ({
    id: r.id,
    product_id: r.product_id,
    client_id: r.client_id,
    rating: r.rating,
    title: r.title,
    text: r.text,
    created_at: r.created_at,
    user_name: r.users?.name || 'Anônimo'
  }));

  return { product, variations, reviews: formattedReviews };
}

export async function getPaginatedCategoryData(slug: string, page: number, limit = 12) {
  const supabase = await createSupabaseServerClient();
  const normalizedSlug = decodeURIComponent(slug).toLowerCase();
  
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', normalizedSlug)
    .eq('is_active', true)
    .maybeSingle();

  if (!category) return { category: null, products: [], totalPages: 0 };

  const fetchLimit = limit + 10; 
  const from = (page - 1) * limit;
  const to = from + fetchLimit - 1;

  const { data: products, count } = await supabase
    .from('products')
    .select('*, quantity, variations(stock), reviews(rating)', { count: 'exact' })
    .eq('category_id', category.id)
    .range(from, to);

  const formattedProducts = (products || [])
    .filter((p: any) => hasStock(p))
    .slice(0, limit)
    .map((p: any) => {
      const reviews = p.reviews || [];
      const total = reviews.length;
      const avg = total > 0 ? reviews.reduce((a: number, r: any) => a + r.rating, 0) / total : 0;
      return { ...p, rating: avg, total_reviews: total };
    });

  const totalPages = count ? Math.ceil(count / limit) : 0;

  return { category, products: formattedProducts, totalPages };
}

export async function getAllCategoriesSimple() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("categories").select("id, name, slug").eq("is_active", true).order("name");
  return (data as Category[]) ?? [];
}


export async function searchProducts(query: string) {
  const supabase = await createSupabaseServerClient();
  const termo = `%${query}%`; 

  const { data, error } = await supabase
    .from('products')
    
    .select('*, category:categories(name, slug), variations(stock)')
    
    .or(`title.ilike."${termo}",description.ilike."${termo}"`) 
    .eq('is_available', true);

  if (error || !data) return [];

  
  return data.filter((p: any) => hasStock(p)).map((p: any) => {
    return { ...p, rating: 0, total_reviews: 0 }; 
  });
}