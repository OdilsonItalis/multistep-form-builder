import CheckoutForm from '@/components/CheckoutForm';
import StripeWrapper from '@/components/StripeWrapper';
import { supabase } from '@/utils/supabase-client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
//   {
//     stripeAccount: 'acct_1Mg5B8CHxcCMbMSQ'
//   }
// );

function TestCard() {
  // use axios to fetch client_secret from create-payment-intent api route endpoint
  const router = useRouter();
  const { id } = router.query;
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeConnectAccountId, setStripeConnectAccountId] = useState<
    string | null
  >(null);

  const getInvoice = async (id: string | undefined | null) => {
    let { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`${error.message}: ${error.details}`);
    }
    return data;
  };

  const useGetInvoice = (id: string | undefined | null) => {
    return useQuery({
      queryKey: ['invoice', id],
      queryFn: () => getInvoice(id),
      enabled: !!id,
      refetchOnMount: false, // when user invalidates, we don't want to refetch
      refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
    });
  };

  const getPublicUser = async (id: string | undefined) => {
    const { data, error } = await supabase
      .from('public_user_info')
      .select(`*`)
      .eq('id', id)
      .single();
    if (error) {
      throw new Error(`${error.message}: ${error.details}`);
    }
    return data;
  };

  function useGetPublicUser(id: string | undefined) {
    return useQuery({
      queryKey: ['publicUser', id],
      queryFn: () => getPublicUser(id),
      enabled: !!id,
      refetchOnMount: false, // when user invalidates, we don't want to refetch
      refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
    });
  }

  const { data, isLoading, error } = useGetInvoice(id as string);

  const { data: InvoiceOwnerAccount } = useGetPublicUser(data?.created_by);

  const getClientSecret = async () => {
    const response = await axios.post('/api/create-payment-intent', {
      invoice_id: id
    });
    setClientSecret(response.data.client_secret);
    setStripeConnectAccountId(response.data.stripe_connect_account_id);
  };

  useEffect(() => {
    if (id) getClientSecret();
  }, [id]);

  console.log({
    clientSecret,
    stripeConnectAccountId
  });

  if (clientSecret && stripeConnectAccountId) {
    return (
      <StripeWrapper
        accountId={stripeConnectAccountId}
        clientSecret={clientSecret}
      >
        <div className="p-2 max-w-xl mx-auto flex flex-col w-full">
          <div className="flex flex-col h-40 flex-shrink-0 justify-center items-center">
            <img
              src={InvoiceOwnerAccount?.avatar_url || '/banner-placeholder.svg'}
              alt=""
              className="h-20 w-20 object-cover rounded-full mx-auto"
            />
            <p>{InvoiceOwnerAccount?.full_name}</p>
          </div>
          {/* <Elements stripe={stripePromise} options={options}> */}
          <CheckoutForm />
          {/* </Elements> */}
        </div>
      </StripeWrapper>
    );
  } else {
    return <div>loading...</div>;
  }
}

export default TestCard;
