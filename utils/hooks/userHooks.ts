import { supabase } from '../supabase-client';
import { useQuery } from '@tanstack/react-query';

const getPrivateUser = async (id: string | undefined) => {
  const { data, error } = await supabase
    .from('users')
    .select(`*`)
    .eq('id', id as string)
    .single();
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  return data;
};

export function useGetPrivateUser(id: string | undefined) {
  return useQuery({
    queryKey: ['privateUser', id],
    queryFn: () => getPrivateUser(id),
    enabled: !!id,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}
const getPublicUser = async (username: string | undefined) => {
  if (!username) return null;
  const { data, error } = await supabase
    .from('public_user_info')
    .select(`*`)
    .eq('username', username)
    .single();
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  return data;
};

export function useGetPublicUser(username: string | undefined) {
  return useQuery({
    queryKey: ['publicUser', username],
    queryFn: () => getPublicUser(username),
    enabled: !!username,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}
