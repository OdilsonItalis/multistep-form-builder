import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';

const getInvoiceTemplates = async (userId: string | undefined | null) => {
  let { data, error } = await supabase
    .from('invoice_templates')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('order_number', { ascending: true });
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  return data;
};

export const useGetInvoiceTemplates = (userId: string | undefined | null) => {
  return useQuery({
    queryKey: ['invoiceTemplates', userId],
    queryFn: () => getInvoiceTemplates(userId),
    enabled: !!userId,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
};
