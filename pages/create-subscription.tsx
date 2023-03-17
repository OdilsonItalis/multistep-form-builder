import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AppBarBackUniversal from '@/components/Navigation/AppBarBackUniversal';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '@/utils/useUser';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import CheckIcon from 'public/icons/CheckIcon';
import StringListGenerator from '@/components/StringListGenerator';

interface CreateStripeConnectProductRequest {
  price_in_cents: number;
  product_name: string;
  description: string;
  features: string[];
  currency: 'usd' | 'gbp' | 'eur';
  billing_period: 'weekly' | 'monthly' | 'yearly';
  billing_interval: number;
}

interface Inputs {
  product_name: string;
  price: number;
  currency: 'usd' | 'gbp' | 'eur';
  billing_period:
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'custom_weekly'
    | 'custom_monthly';
  billing_interval: number;
  description: string;
}

export const getServerSideProps = withPageAuth();

function CreateSubscription() {
  const { user, isLoading: userIsLoading } = useUser();
  const [features, setFeatuers] = useState<string[]>([]);
  const router = useRouter();
  // just test this loading state one more time
  const [loading, setLoading] = useState(false);

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
      billing_interval: 1
    }
  });

  const billingPeriod = watch('billing_period');
  const billingInterval = watch('billing_interval');
  const price = watch('price');
  const currency = watch('currency');

  function formatBillingPeriod(
    billing_period:
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | 'custom_weekly'
      | 'custom_monthly'
  ) {
    switch (billing_period) {
      case 'weekly':
        return 'week';
      case 'monthly':
        return 'month';
      case 'yearly':
        return 'year';
      case 'custom_weekly':
        return 'week';
      case 'custom_monthly':
        return 'month';
    }
  }

  // create a function that checks if billing period is custom, then return billingInterval variable, but if the billing is not custom then return 1
  function formatBillingInterval(
    billing_period:
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | 'custom_weekly'
      | 'custom_monthly'
  ) {
    if (billing_period.includes('custom')) {
      return Number(billingInterval);
    }
    return 1;
  }

  const RenderInformationText = () => {
    const priceInt = typeof price === 'string' ? parseInt(price, 10) : price;
    if (!billingPeriod || !billingInterval || !priceInt || !currency)
      return null;
    console.log({
      billingPeriod,
      billingInterval,
      price,
      currency
    });
    const billingPeriodIsCustom = billingPeriod.includes('custom');

    let period = '';

    const interval =
      typeof billingInterval === 'string'
        ? parseInt(billingInterval, 10)
        : billingInterval;

    if (billingPeriod === 'custom_monthly') {
      period = interval === 1 ? 'month' : 'months';
    } else if (billingPeriod === 'custom_weekly') {
      period = interval === 1 ? 'week' : 'weeks';
    } else if (billingPeriod === 'monthly') {
      period = 'month';
    } else if (billingPeriod === 'weekly') {
      period = 'week';
    } else if (billingPeriod === 'yearly') {
      period = 'year';
    }
    const checkInterval = billingPeriodIsCustom ? interval : '';
    const infoText = `Customer is going to be billed ${price} ${currency} once every ${checkInterval} ${period}.`;
    if (billingPeriodIsCustom && (interval <= 0 || interval % 1 !== 0))
      return null;
    return (
      <div className="py-4">
        <div className="alert alert-info shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current flex-shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{infoText}</span>
          </div>
        </div>
      </div>
    );
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    toast.loading('Saving your product...');
    //  converts price string to number and multiplies by 100 to convert to cents
    // const price_in_cents = Number(data.price) * 100;
    // update here i am trying to avoid floating point errors
    const price_in_cents = Math.round(Number(data.price) * 100);

    if (user?.id) {
      try {
        const res = await axios.post<CreateStripeConnectProductRequest, any>(
          `/api/create-stripe-connect-product`,
          {
            product_name: data.product_name,
            price_in_cents,
            currency: data.currency,
            billing_period: formatBillingPeriod(data.billing_period),
            billing_interval: formatBillingInterval(data.billing_period),
            description: data.description,
            features: features
          }
        );

        console.log(res);
        toast.dismiss();
        toast.success('Product created');
      } catch (error) {
        toast.dismiss();
        toast.error('Something went wrong');
        console.log(error);
      }
    } else {
      toast.dismiss();
      toast.error('No user found');
    }
  };

  return (
    <div className="min-h-screen max-w-xl mx-auto flex flex-col safeAreaInset w-full">
      <Toaster />
      <div className="flex">
        <AppBarBackUniversal />
        <button
          onClick={handleSubmit(onSubmit)}
          className="flex ml-auto items-center px-4 gap-1 text-blue-500"
        >
          <CheckIcon height={18} width={18} />
          <p>Save</p>
        </button>
      </div>
      <div className="form-control w-full py-4">
        <label className="label">
          <span className="label-text font-semibold">
            Choose subscription name
          </span>
        </label>
        <input
          {...register('product_name', { required: false })}
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full"
        />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Product Description</span>
        </label>
        <textarea
          {...register('description')}
          className="textarea textarea-bordered"
          placeholder="Bio up to 140 characters"
        ></textarea>
      </div>
      <StringListGenerator strings={features} setStrings={setFeatuers} />

      <div className="form-control w-full py-4">
        <div className="flex gap-2">
          <div className="form-control w-full pb-4">
            <label className="label">
              <span className="label-text font-semibold">
                Choose your subscription price
              </span>
            </label>
            <input
              {...register('price', { required: false })}
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control w-full pb-4">
            <label className="label">
              <span className="label-text font-semibold">
                Choose the currency
              </span>
            </label>
            <select
              className="select select-bordered w-full mt-auto"
              {...register('currency', { required: false })}
            >
              <option value={'usd'}>$ - US Dollar</option>
              <option value={'gbp'}>£ - British Pound</option>
              <option value={'eur'}>€ - Euro</option>
            </select>
          </div>
        </div>
        <div className="form-control w-full pb-4">
          <label className="label">
            <span className="label-text font-semibold">
              How often you want to bill your customers?
            </span>
          </label>
          <select
            className="select select-bordered w-full"
            {...register('billing_period', { required: false })}
          >
            <option value={'monthly'}>Monthly</option>
            <option disabled value={'weekly'}>
              Weekly
            </option>
            <option disabled value={'yearly'}>
              Yearly
            </option>
            <option disabled value={'custom_weekly'}>
              Custom weekly
            </option>
            <option disabled value={'custom_monthly'}>
              Custom monthly
            </option>
          </select>
          {(billingPeriod === 'custom_monthly' ||
            billingPeriod === 'custom_weekly') && (
            <div className="form-control w-full pt-4">
              <label className="input-group">
                <span>Every</span>
                <input
                  type="text"
                  placeholder="10"
                  className="input input-bordered w-full"
                  {...register('billing_interval', { required: false })}
                />
                <span>
                  {billingPeriod === 'custom_monthly' ? 'months' : 'weeks'}
                </span>
              </label>
            </div>
          )}
          <RenderInformationText />
        </div>
      </div>
    </div>
  );
}

export default CreateSubscription;
