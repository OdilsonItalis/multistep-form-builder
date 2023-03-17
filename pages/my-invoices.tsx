import ReadOnlyEditor from '@/components/Editor/ReadOnlyEditor';
import AppBarBackUniversal from '@/components/Navigation/AppBarBackUniversal';
import { formatPrice } from '@/utils/helpers';
import { supabase } from '@/utils/supabase-client';
import { useUser } from '@/utils/useUser';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

function MyForms() {
  const { user } = useUser();
  const router = useRouter();
  const getInvoices = async (userId: string | undefined | null) => {
    let { data, error, count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact' })
      .eq('sent_to', userId)
      .order('created_at', { ascending: false });
    if (error) {
      throw new Error(`${error.message}: ${error.details}`);
    }
    return { data, count };
  };

  const useGetInvoices = (userId: string | undefined | null) => {
    return useQuery({
      queryKey: ['invoices', userId],
      queryFn: () => getInvoices(userId),
      enabled: !!userId,
      refetchOnMount: false, // when user invalidates, we don't want to refetch
      refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
    });
  };

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

  const { data, isLoading, error } = useGetInvoices(user?.id);

  return (
    <>
      <AppBarBackUniversal />
      <div className="p-2">
        {isLoading && <p>Loading...</p>}
        {data?.data?.map((invoice) => (
          <div
            onClick={() => router.push(`/invoice/${invoice.id}`)}
            className="shadow-lg rounded-lg p-2 mb-4 flex flex-col justify-between text-sm ring-1 ring-gray-200 items-baseline gap-2"
            // key={lead.id}
          >
            <p className="font-semibold">{invoice.title}</p>
            <div className="text-sm h-28 text-ellipsis overflow-hidden relative">
              <ReadOnlyEditor instructions={invoice.description} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white" />
            </div>
            <p className="bg-green-400 rounded-full px-2">
              {formatPrice(invoice?.unit_amount, invoice.currency)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default MyForms;
