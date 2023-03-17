import AppBarBackUniversal from '@/components/Navigation/AppBarBackUniversal';
import { formatPrice } from '@/utils/helpers';
import { supabase } from '@/utils/supabase-client';
import { useUser } from '@/utils/useUser';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import CheckIcon from 'public/icons/CheckIcon';
import React from 'react';

function Invoice() {
  const { user } = useUser();
  const router = useRouter();
  const { productId } = router.query;

  const getProduct = async (id: string | undefined | null) => {
    let { data, error } = await supabase
      .from('invoice_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`${error.message}: ${error.details}`);
    }
    return data;
  };

  const useGetProduct = (id: string | undefined | null) => {
    return useQuery({
      queryKey: ['invoiceTemplate', id],
      queryFn: () => getProduct(id),
      enabled: !!id,
      refetchOnMount: false, // when user invalidates, we don't want to refetch
      refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
    });
  };

  const { data, isLoading, error } = useGetProduct(productId as string);

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <AppBarBackUniversal />
        {data && (
          <button
            onClick={() => router.push(`/invoice/${data.id}/checkout`)}
            className="text-indigo-500 px-2 rounded h-6 text-sm flex items-center gap-1"
          >
            <CheckIcon height={12} width={12} />
            <p>Proceed To Checkout</p>
          </button>
        )}
      </div>
      <div className="p-2">
        {isLoading && <p>Loading...</p>}
        {data && (
          <div
            className="p-2 mb-4 flex flex-col justify-between text-sm items-baseline gap-2"
            // key={lead.id}
          >
            <p className="font-semibold">{data.title}</p>
            <div className="text-sm h-28 text-ellipsis overflow-hidden relative">
              <p>{data.description}</p>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white" />
            </div>
            <p className="bg-green-400 rounded-full px-2">
              {formatPrice(data.unit_amount, data.currency)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Invoice;
