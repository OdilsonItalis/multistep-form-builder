import AppBarBackUniversal from '@/components/Navigation/AppBarBackUniversal';
import { supabase } from '@/utils/supabase-client';
import { useUser } from '@/utils/useUser';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

function MyForms() {
  const { user } = useUser();
  const getForms = async (userId: string | undefined | null) => {
    let { data, error, count } = await supabase
      .from('form_configs')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      throw new Error(`${error.message}: ${error.details}`);
    }
    return { data, count };
  };

  function useGetForms(userId: string | undefined | null) {
    return useQuery({
      queryKey: ['forms', userId],
      queryFn: () => getForms(userId),
      enabled: !!userId,
      refetchOnMount: false, // when user invalidates, we don't want to refetch
      refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
    });
  }

  // TODO: Convert this to delete function

  //   const handleArchive = async () => {
  //     const { data, error } = await supabase
  //       .from('leads')
  //       .update({ status: 'archived' })
  //       .eq('id', '1');
  //     if (error) {
  //       throw new Error(`${error.message}: ${error.details}`);
  //     }
  //   };

  const { data, isLoading, error } = useGetForms(user?.id);
  console.log(data);

  return (
    <>
      <AppBarBackUniversal />
      <div className="p-2">
        {data?.data?.map((lead) => (
          <div
            className="shadow-lg rounded-lg p-2 mb-4 flex flex-col justify-between text-sm ring-1 ring-gray-200 items-baseline h-20"
            // key={lead.id}
          >
            <p>{lead.form_name}</p>
            <div className="flex gap-2">
              <p>Steps</p>
              {/* @ts-ignore */}
              <p>{lead.form_config?.length}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default MyForms;
