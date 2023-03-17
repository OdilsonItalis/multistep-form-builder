import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';

// again don't know why this would be null, even though its required in supabase table
const getPremiumMember = async (userId: string | undefined | null) => {
  let { data, error, count } = await supabase
    .from('premium_members')
    .select('*', { count: 'exact' })
    // Filters
    .eq('user_id', userId)
    .limit(1)
    .single();
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  if (data) {
    return data;
  }
  // here count 0 means that user has no diary yet, so we return him the default one
  if (count === 0) {
    return null;
  }
};

export default function useGetPremiumMember(userId: string | undefined | null) {
  return useQuery({
    queryKey: ['premium_member'],
    queryFn: () => getPremiumMember(userId),
    enabled: !!userId,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}
