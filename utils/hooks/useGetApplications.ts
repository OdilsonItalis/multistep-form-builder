import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { ensureError } from '../ensureError';

const getApplications = async (jobId: string | undefined) => {
  let { data, error, count } = await supabase
    .from('job-applications')
    .select(`*, user_id(*)`, { count: 'exact' })
    .eq('job_id', jobId);
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  if (count === 0) {
    return null;
  }
  return data;
};

export default function useGetApplications(jobId: string | undefined) {
  return useQuery({
    queryKey: ['applications', jobId],
    queryFn: () => getApplications(jobId),
    enabled: !!jobId,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}
const getApplication = async (id: string | undefined) => {
  let { data, error, count } = await supabase
    .from('jobs')
    .select(`*, user_id(*)`)
    .eq('id', id)
    .single();
  if (error) {
    throw new Error(`${error.message}: ${error.details}`);
  }
  return data;
};

export function useGetApplication(id: string | undefined) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => getApplication(id),
    enabled: !!id,
    refetchOnMount: false, // when user invalidates, we don't want to refetch
    refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
  });
}
