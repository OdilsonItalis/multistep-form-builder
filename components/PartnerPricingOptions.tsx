import React from 'react';
import { RadioGroup } from '@headlessui/react';
import { supabase } from '@/utils/supabase-client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useGetPublicUser } from '@/utils/hooks/userHooks';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import dayjs from 'dayjs';
import PartnerProductHit from './PartnerProductHit';

function PartnerPricingOptions() {
  const [selectedPrice, setSelectedPrice] = React.useState<string | null>(null);
  // again don't know why this would be null, even though its required in supabase table
  const getProducts = async (userId: string | undefined | null) => {
    let {
      data: products,
      error,
      count
    } = await supabase
      .from('products')
      .select('*, default_price (*), offer_price_id (*)')
      .eq('created_by', userId)
      .order('order_number', { ascending: true });
    if (error) {
      throw new Error(`${error.message}: ${error.details}`);
    }
    if (count === 0) {
      return null;
    }
    if (!products) return null;
    if (products) {
      // @ts-ignore TODO: need to find how to handle this with supabase
      setSelectedPrice(products[0].default_price.id);
      return products;
    }
  };

  function useGetProducts(userId: string | undefined | null) {
    return useQuery({
      queryKey: ['products', userId],
      queryFn: () => getProducts(userId),
      enabled: !!userId,
      refetchOnMount: false, // when user invalidates, we don't want to refetch
      refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
    });
  }

  const router = useRouter();

  const { id } = router.query;
  const { data: publicProfile } = useGetPublicUser(id as string | undefined);
  const [loading, setLoading] = React.useState(false);

  const {
    data: products,
    isLoading,
    error
  } = useGetProducts(publicProfile?.id);

  const handleCheckout = async () => {
    if (!publicProfile?.id) return alert('no user id found');
    if (!selectedPrice) return alert('no price selected');
    setLoading(true);

    // find product that matches the selected price
    // const product = products?.find((product) => {
    //   return product?.default_price?.id === selectedPrice;
    // });

    try {
      const { sessionId, url } = await postData({
        url: '/api/create-stripe-connect-checkout-session',
        data: {
          priceId: selectedPrice,
          // delete this line once confirmed that the affiliate cookie is working
          metadata: { subscribed_to: publicProfile?.id }
        }
      });
      // const stripe = await getStripe();
      window.location.replace(url);
      // stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      setLoading(false);
      return alert((error as Error)?.message);
    }
    setLoading(false);
  };

  console.log('products', products);

  console.log(selectedPrice);

  return (
    <>
      {products && (
        <>
          <RadioGroup
            value={selectedPrice}
            onChange={setSelectedPrice}
            className="flex flex-col bg-white px-2 gap-2"
          >
            {products.map((product) => {
              return (
                <RadioGroup.Option
                  className="w-full"
                  // @ts-ignore TODO: need to find how to handle this with supabase
                  value={product.default_price.id}
                >
                  {({ checked }) => (
                    <div
                      className={`relative flex flex-col justify-between rounded-lg border bg-white p-2 cursor-pointer  ${
                        checked &&
                        'ring-2 ring-blue-400 shadow-xl shadow-blue-400/20'
                      }                
              `}
                    >
                      <PartnerProductHit product={product} />
                    </div>
                  )}
                </RadioGroup.Option>
              );
            })}
          </RadioGroup>
          {products.length > 0 && (
            <div className="flex w-full pb-2 px-2 bottom-0 sticky">
              <button
                // disabled={loading}
                onClick={handleCheckout}
                className="flex w-full justify-center items-center rounded-md border bg-blue-400 p-2 mt-4 font-semibold capitalize relative px-4 text-white z-10"
              >
                {loading && (
                  <img
                    src="/Feather-core-loader.svg"
                    height={20}
                    width={20}
                    className={`absolute left-4 animate-spin`}
                    alt=""
                  />
                )}
                <p>
                  Get Full Access Now <span className="pl-2 text-xl">👉</span>
                </p>
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default PartnerPricingOptions;
