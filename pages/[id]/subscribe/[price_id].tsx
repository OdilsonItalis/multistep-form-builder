import CheckoutForm from '@/components/CheckoutForm';
import StripeWrapper from '@/components/StripeWrapper';
import { supabase } from '@/utils/supabase-client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

function TestCard() {
  // use axios to fetch client_secret from create-payment-intent api route endpoint
  const router = useRouter();
  const { price_id, id } = router.query;
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeConnectAccountId, setStripeConnectAccountId] = useState<
    string | null
  >(null);

  const getPublicUser = async (id: string | undefined) => {
    const { data, error } = await supabase
      .from('public_user_info')
      .select(`*`)
      .eq('username', id)
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

  console.log('price_id', price_id);

  const { data: InvoiceOwnerAccount } = useGetPublicUser(id);

  const getClientSecret = async () => {
    try {
      const response = await axios.post('/api/create-subscription-intent', {
        price_id
      });
      console.log(response);
      setClientSecret(response.data.client_secret);
      setStripeConnectAccountId(response.data.stripe_account_id);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (price_id) getClientSecret();
  }, [price_id]);

  useEffect(() => {
    console.log('InvoiceOwnerAccount', InvoiceOwnerAccount);
  }, [InvoiceOwnerAccount]);

  // return (
  //   <div className="flex flex-col h-40 flex-shrink-0 justify-center items-center">
  //     <img
  //       src={InvoiceOwnerAccount?.avatar_url || '/banner-placeholder.svg'}
  //       alt=""
  //       className="h-20 w-20 object-cover rounded-full mx-auto"
  //     />
  //     <p>{InvoiceOwnerAccount?.full_name}</p>
  //   </div>
  // );

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
        <div className="flex">
          <img src="/sidepicture.jpg" alt="" />
          <div className="p-2 max-w-xl mx-auto flex flex-col w-full">
            <div className="flex flex-col h-40 flex-shrink-0 justify-center items-center">
              <img
                src={
                  InvoiceOwnerAccount?.avatar_url || '/banner-placeholder.svg'
                }
                alt=""
                className="h-20 w-20 object-cover rounded-full mx-auto"
              />
              <p>{InvoiceOwnerAccount?.full_name}</p>
            </div>
            <CheckoutForm />
          </div>
        </div>
      </StripeWrapper>
    );
  } else {
    return <div>loading...</div>;
  }
}

export default TestCard;
