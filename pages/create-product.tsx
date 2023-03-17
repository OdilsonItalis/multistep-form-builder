import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { supabase } from '@/utils/supabase-client';
import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';
import { changeAuthModalStatus } from '@/utils/features/modalStateSlice';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import toast, { Toaster } from 'react-hot-toast';
import ArrowBack from 'public/icons/ArrowBack';
import CheckIcon from 'public/icons/CheckIcon';
import StringListGenerator from '@/components/StringListGenerator';
import PlusIcon from 'public/icons/PlusIcon';
import CreateAddonModal from '@/components/Modals/CreateAddonModal';
import { formatPrice } from '@/utils/helpers';
import ExitIcon from 'public/icons/ExitIcon';

interface Inputs {
  description: string;
  price: number;
  currency: 'usd' | 'gbp' | 'eur';
  title: string;
}

export interface Location {
  latitude: number;
  longtitude: number;
  city: string;
  country: string;
}

export interface Addon {
  order_number: number;
  title: string;
  description: string;
  price: number;
  currency: 'usd' | 'gbp' | 'eur';
  multiple_quantity: boolean;
  selected: boolean;
  quantity: number;
}

export const getServerSideProps = withPageAuth();

function CreateProduct() {
  const { user, isLoading: userIsLoading } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<Inputs>();

  const [features, setFeatures] = useState<string[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);

  // TODO: this still needs to be double checked

  const onSubmit: SubmitHandler<Inputs> = async (data, event) => {
    if (!user) {
      changeAuthModalStatus(true);
      return;
    }
    // update here i am trying to avoid floating point errors
    toast.loading('Creating Invoice...');
    const price_in_cents = Math.round(Number(data.price) * 100);

    const { data: InnvoiceData, error } = await supabase
      .from('invoice_templates')
      .insert({
        user_id: user.id,
        description: data.description,
        unit_amount: price_in_cents,
        currency: data.currency,
        title: data.title,
        // @ts-expect-error
        add_ons: addons,
        features: features
      })
      .eq('id', user.id)
      .single();
    if (error) {
      toast.dismiss();
      toast.error('Something went wrong');
      console.log(error.message);
      return;
    }
    toast.dismiss();
    toast.success('Invoice Created');
  };

  const handleAddonDelete = () => {
    setAddons((prev) => {
      const newAddons = [...prev];
      newAddons.pop();
      return newAddons;
    });
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto w-full px-2 pb-20 relative p-2">
      <Toaster />
      <div className="flex flex-col w-full pb-4">
        <div className="flex w-full">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 justify-center items-center flex aspect-square"
          >
            <ArrowBack height={20} width={20} color={'#000000'} />
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            className="flex ml-auto items-center justify-center gap-1 text-blue-500 text-sm h-8 border border-blue-500 px-2 rounded"
          >
            <CheckIcon height={15} width={15} />
            <p>Create Invoice</p>
          </button>
        </div>
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          {...register('title', { required: false })}
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full"
        />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          {...register('description')}
          className="textarea textarea-bordered"
          placeholder="Add description..."
        ></textarea>
      </div>
      <StringListGenerator strings={features} setStrings={setFeatures} />
      <div className="form-control w-full">
        <div className="flex gap-2">
          <div className="form-control w-full pb-4">
            <label className="label">
              <span className="label-text">Invoice amount</span>
            </label>
            <input
              {...register('price', { required: false })}
              type="number"
              placeholder="Type here"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control w-full pb-4">
            <label className="label">
              <span className="label-text">Choose the currency</span>
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
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Add ons</span>
        </label>
      </div>
      <div className="flex flex-col gap-2">
        {addons.map((addon, index) => {
          return (
            <div
              key={addon.order_number}
              className="flex bg-gray-50 rounded-lg p-2 justify-between items-center"
            >
              <div className="flex flex-col">
                <p className="font-semibold text-sm">{addon.title}</p>
                <p className="text-xs">{addon.description}</p>
              </div>
              <p>{formatPrice(addon.price, addon.currency)}</p>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between">
        <button
          className="border px-4 rounded h-8 text-sm flex items-center justify-center gap-2 w-40 my-2"
          onClick={() => setOpen(true)}
        >
          <PlusIcon height={15} width={15} className="" />
          <p>Create Add on</p>
        </button>
        {addons.length > 0 && (
          <button
            className="border border-red-400 px-4 rounded h-8 text-sm text-red-400 flex items-center justify-center gap-2 w-40 my-2"
            onClick={handleAddonDelete}
          >
            <ExitIcon height={15} width={15} />
            <p>Remove Add on</p>
          </button>
        )}
      </div>
      <CreateAddonModal open={open} setOpen={setOpen} setAddons={setAddons} />
    </div>
  );
}

export default CreateProduct;
