import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { ensureError } from '../ensureError';

const getJobs = async () => {
  let { data, error, count } = await supabase
    .from('jobs')
    .select(`*, created_by(*)`, { count: 'exact' });
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  return data;
};

export default function useGetJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => getJobs(),
    // enabled: !!id,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}
const getJob = async (id: string | undefined) => {
  let { data, error, count } = await supabase
    .from('jobs')
    .select(`*, created_by(*)`)
    .eq('id', id)
    .single();
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  return data;
};

export function useGetJob(id: string | undefined) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => getJob(id),
    enabled: !!id,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}

const getMyJobs = async (userId: string | undefined) => {
  let { data, error, count } = await supabase
    .from('jobs')
    .select(`*, created_by(*)`, { count: 'exact' })
    .eq('created_by', userId);
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  if (count === 0) {
    return null;
  }
  return data;
};

export function useGetMyJobs(userId: string | undefined) {
  return useQuery({
    queryKey: ['jobs', userId],
    queryFn: () => getMyJobs(userId),
    enabled: !!userId,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}
