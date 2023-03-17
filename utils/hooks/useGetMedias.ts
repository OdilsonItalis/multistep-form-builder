import { supabase } from '@/utils/supabase-client';
import { useQuery } from '@tanstack/react-query';

const getMedias = async (userId: string | undefined | null) => {
  let { data, error, count } = await supabase
    .from('media')
    .select('*', { count: 'exact' })
    .eq('created_by', userId)
    .order('order_number', { ascending: false });

  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  return { data, count };
};

export const useGetMedias = (userId: string | undefined | null) => {
  return useQuery({
    queryKey: ['medias', userId],
    queryFn: () => getMedias(userId),
    enabled: !!userId,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
};
