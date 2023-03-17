import AppBarBackUniversal from '@/components/Navigation/AppBarBackUniversal';
import { supabase } from '@/utils/supabase-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import { AnimatePresence } from 'framer-motion';
// import ModalForAddNewPrice from '@/components/Modals/ModalForAddNewPrice';
// import { changeModalForAddNewPriceStatus } from '@/utils/features/modalStateSlice';
import { RadioGroup } from '@headlessui/react';
import CheckIcon from 'public/icons/CheckIcon';
import PlusIcon from 'public/icons/PlusIcon';
import StringListGenerator from '@/components/StringListGenerator';

interface Inputs {
  product_name: string | null;
  price: number;
  description: string;
  billing_period:
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'custom_weekly'
    | 'custom_monthly';
  billing_interval: number;
  promo_enabled: boolean;
  promo_duration_interval: 'hours' | 'days';
  promo_duration: number;
  value_label_enabled: boolean;
}

function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();

  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedPromoPrice, setSelectedPromoPrice] = useState<string | null>(
    null
  );

  const [features, setFeatures] = useState<string[]>([]);

  // const addNewPriceModalState = useAppSelector(
  //   (state) => state.modalState.modalForAddNewPrice
  // );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: {
      product_name: '',
      price: 0,
      promo_enabled: false,
      promo_duration_interval: 'hours'
    }
  });

  const promoEnabled = watch('promo_enabled');

  const getProduct = async (productId: string | string[] | undefined) => {
    let { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    if (error) {
      throw new Error(`${error.message}: ${error.details}`);
    }
    if (product) {
      return product;
    } else {
      return null;
    }
  };

  function useGetProduct(productId: string | string[] | undefined) {
    return useQuery({
      queryKey: ['product', id],
      queryFn: () => getProduct(id),
      enabled: !!productId,
      refetchOnMount: false, // when user invalidates, we don't want to refetch
      refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
    });
  }

  const getPrices = async (productId: string | string[] | undefined) => {
    let { data: prices, error } = await supabase
      .from('prices')
      .select('*, product_id (*)')
      .eq('product_id', productId);
    if (error) {
      throw new Error(`${error.message}: ${error.details}`);
    }
    if (prices) {
      return prices;
    } else {
      return null;
    }
  };

  function useGetPrices(productId: string | string[] | undefined) {
    return useQuery({
      queryKey: ['prices', id],
      queryFn: () => getPrices(id),
      enabled: !!productId,
      refetchOnMount: false, // when user invalidates, we don't want to refetch
      refetchOnWindowFocus: false // when user comes back to the app, we don't want to refetch
    });
  }

  function getFutureTimestamp(
    promo_duration_interval: 'hours' | 'days',
    promo_duration: number
  ) {
    const now = new Date();
    let intervalInMs;
    switch (promo_duration_interval) {
      case 'hours':
        intervalInMs = promo_duration * 60 * 60 * 1000;
        break;
      case 'days':
        intervalInMs = promo_duration * 24 * 60 * 60 * 1000;
        break;
      default:
        throw new Error(`Invalid interval: ${promo_duration_interval}`);
    }
    const futureTimestamp = now.getTime() + intervalInMs;
    return new Date(futureTimestamp).toISOString();
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    toast.loading('Saving changes...');
    try {
      const res = await axios.post(`/api/edit-stripe-connect-product`, {
        product_name: data.product_name,
        features,
        product_id: id,
        default_price_id: selectedPrice,
        description: data.description,
        promo_price_id: selectedPromoPrice,
        value_description: data.value_label_enabled ? 'most_popular' : null,
        ...(promoEnabled && {
          promo_price_id: selectedPromoPrice,
          offer_valid_until: getFutureTimestamp(
            data?.promo_duration_interval,
            data?.promo_duration
          )
        })
      });
      // console.log(res);
      toast.dismiss();
      toast.success('Product changes saved');
    } catch (error) {
      toast.dismiss();
      toast.error('Something went wrong');
      console.log(error);
    }
  };

  const queryClient = useQueryClient();
  // queryClient.setQueryData(['editingDiary'], result);

  const { data: productQueryData, isLoading, error } = useGetProduct(id);
  const { data: pricesQueryData, isLoading: pricesIsLoading } =
    useGetPrices(id);

  useEffect(() => {
    if (productQueryData) {
      console.log(productQueryData);
      setValue('product_name', productQueryData.name);
      setValue('description', productQueryData.description || '');
      setFeatures(productQueryData.features || []);
      setSelectedPrice(productQueryData.default_price);
    }
  }, [productQueryData]);

  // const handleOpenModalForNewPrice = () => {
  //   dispatch(changeModalForAddNewPriceStatus(true));
  // };

  // function that formats the price from hundredths to dollars
  function formatPrice(price: number | null, currency: string | null) {
    if (!price) return null;

    let symbol = '$';
    if (currency === 'eur') symbol = '€';
    if (currency === 'gbp') symbol = '£';

    return `${symbol}${(price / 100).toFixed(2)}`;
  }

  function renderInterval(
    interval: 'day' | 'week' | 'month' | 'year' | null,
    interval_count: number | null
  ) {
    let intervalString = '';
    if (interval) {
      intervalString = interval_count
        ? `every ${interval_count} ${interval}${interval_count > 1 ? 's' : ''}`
        : `every ${interval}`;
    }
    return intervalString;
  }

  console.log(pricesQueryData);

  if (!productQueryData) return null;

  return (
    <div className="max-w-xl mx-auto flex flex-col w-full pb-20">
      <Toaster />
      <div className="flex">
        <AppBarBackUniversal />
        <button
          onClick={handleSubmit(onSubmit)}
          className="flex ml-auto items-center px-2 gap-1 text-blue-500"
        >
          <CheckIcon height={15} width={15} color="#3B82F6" />
          <p>Save</p>
        </button>
      </div>
      <div className="form-control w-full py-4">
        <label className="label">
          <span className="label-text">Choose subscription name</span>
        </label>
        <input
          {...register('product_name', { required: false })}
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full"
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Edit description</span>
        </label>
        <textarea
          {...register('description', { required: false })}
          className="textarea textarea-bordered h-12"
          placeholder="Enter a feature"
        ></textarea>
      </div>
      <StringListGenerator setStrings={setFeatures} strings={features} />

      <div className="form-control w-full py-4">
        <label className="label">
          <span className="label-text">Select active price</span>
        </label>

        <>
          <RadioGroup
            value={selectedPrice}
            onChange={setSelectedPrice}
            className="flex flex-col bg-white gap-2"
          >
            {pricesQueryData?.map((price) => {
              return (
                <RadioGroup.Option className="w-full" value={price.id}>
                  {({ checked }) => (
                    <div
                      className={`relative flex flex-col justify-between rounded-lg border bg-white p-2 cursor-pointer  ${
                        checked && 'ring-1 ring-indigo-400'
                      }                
              `}
                    >
                      <div className="flex gap-2 p-2">
                        <p>{formatPrice(price.unit_amount, price.currency)}</p>
                        <p>
                          {renderInterval(price.interval, price.interval_count)}
                        </p>
                        <input
                          type="checkbox"
                          checked={checked}
                          className="checkbox ml-auto"
                        />
                      </div>
                    </div>
                  )}
                </RadioGroup.Option>
              );
            })}
          </RadioGroup>
        </>
        {/* <button
          onClick={handleOpenModalForNewPrice}
          className="flex w-48 h-10 justify-center gap-2 items-center border rounded mt-4 shadow"
        >
          <PlusIcon height={20} width={20} />
          <p>Add Another price</p>
        </button> */}
      </div>
      <div className="form-control w-full">
        <label className="cursor-pointer label">
          <span className="label-text font-semibold">
            Add "most popular" label to this product
          </span>
          <input
            type="checkbox"
            className="toggle"
            {...register('value_label_enabled')}
          />
        </label>
      </div>
      <div className="form-control w-full">
        <label className="cursor-pointer label">
          <span className="label-text font-semibold">
            Run a promotional offer
          </span>
          <input
            type="checkbox"
            className="toggle"
            {...register('promo_enabled')}
          />
        </label>
      </div>
      {promoEnabled && (
        <>
          <div className="form-control w-full py-4 px-2">
            <label className="label">
              <span className="label-text font-semibold">
                How long will the promotional offer last?
              </span>
            </label>
            <div className="flex flex-col gap-2">
              <select
                {...register('promo_duration_interval')}
                className="select select-bordered w-full"
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
              <input
                {...register('promo_duration')}
                type="number"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div className="form-control w-full py-4 px-2">
            <label className="label flex flex-col items-start">
              <span className="label-text font-semibold">
                Select the promo price
              </span>
              <p className="text-sm text-gray-400">
                ℹ️ Promo price must match the billing period and billing
                interval
              </p>
            </label>
            <RadioGroup
              value={selectedPromoPrice}
              onChange={setSelectedPromoPrice}
              className="flex flex-col bg-white gap-2"
            >
              {pricesQueryData?.map((price) => {
                return (
                  <RadioGroup.Option className="w-full" value={price.id}>
                    {({ checked }) => (
                      <div
                        className={`relative flex flex-col justify-between rounded-lg border bg-white p-2 cursor-pointer  ${
                          checked &&
                          'ring-2 ring-cyan-400 shadow-xl shadow-cyan-400/20'
                        }                
              `}
                      >
                        <div className="flex gap-2 p-2">
                          <p>
                            {formatPrice(price.unit_amount, price.currency)}
                          </p>
                          <p>
                            {renderInterval(
                              price.interval,
                              price.interval_count
                            )}
                          </p>
                          <input
                            type="checkbox"
                            checked={checked}
                            className="checkbox ml-auto"
                          />
                        </div>
                      </div>
                    )}
                  </RadioGroup.Option>
                );
              })}
            </RadioGroup>
          </div>
        </>
      )}
      {/* <AnimatePresence>
        {addNewPriceModalState && <ModalForAddNewPrice />}
      </AnimatePresence> */}
    </div>
  );
}

export default EditProduct;
