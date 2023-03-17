import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';

const getProducts = async (userId: string | undefined | null) => {
  let {
    data: products,
    error,
    count
  } = await supabase
    .from('products')
    .select('*, default_price (*), offer_price_id (*)')
    .eq('created_by', userId)
    .order('order_number', { ascending: true });
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }

  if (count === 0) {
    return null;
  }
  if (!products) return null;
  if (products) {
    return products;
  }
};

export const useGetProducts = (userId: string | undefined | null) => {
  return useQuery({
    queryKey: ['products', userId],
    queryFn: () => getProducts(userId),
    enabled: !!userId,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
};
