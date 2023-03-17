import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';

const getUserForms = async (userId: string | undefined) => {
  const { data, error, count } = await supabase
    .from('forms')
    .select(`*`, { count: 'exact' })
    .eq('user_id', userId);
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  if (count === 0) {
    return null;
  }
  return data;
};

export function useGetUserForms(userId: string | undefined) {
  return useQuery({
    queryKey: ['forms', userId],
    queryFn: () => getUserForms(userId),
    enabled: !!userId,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}

const getFormById = async (formId: string) => {
  const { data, error } = await supabase
    .from('forms')
    .select(`*`)
    .eq('id', formId)
    .single();
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  return data;
};

export function useGetFormById(formId: string) {
  return useQuery({
    queryKey: ['forms', formId],
    queryFn: () => getFormById(formId),
    enabled: !!formId,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}
