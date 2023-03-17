import React, { useState } from 'react';
import AppBarBackUniversal from '@/components/Navigation/AppBarBackUniversal';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '@/utils/useUser';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import CheckIcon from 'public/icons/CheckIcon';
import { supabase } from '@/utils/supabase-client';
import SimpleEditor from '@/components/Editor/SimpleEditor';

interface Inputs {
  title: string;
  price: number;
  currency: 'usd' | 'gbp' | 'eur';
  description: string;
}

export const getServerSideProps = withPageAuth();

function CreateContract() {
  const { user, isLoading: userIsLoading } = useUser();

  const router = useRouter();
  // just test this loading state one more time
  const [loading, setLoading] = useState(false);

  const [instructions, setInstructions] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: {
      title: '',
      price: 0,
      description: ''
    }
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    toast.loading('Creating contract...');
    //  converts price string to number and multiplies by 100 to convert to cents
    // const price_in_cents = Number(data.price) * 100;
    // update here i am trying to avoid floating point errors
    const price_in_cents = Math.round(Number(data.price) * 100);

    if (user?.id) {
      const { data: contractInsertData, error } = await supabase
        .from('jobs')
        .insert({
          created_by: user.id,
          description: instructions,
          title: data.title,
          currency: data.currency,
          amount: price_in_cents
        });
      if (error) {
        toast.dismiss();
        toast.error(error.message);
        return;
      }
      if (contractInsertData) {
        toast.dismiss();
        toast.success('Contract created!');
      }
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
      <div className="form-control w-full py-4 px-2">
        <label className="label">
          <span className="label-text font-semibold">Title</span>
        </label>
        <input
          {...register('title', { required: false })}
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full"
        />
      </div>
      {/* <div className="form-control w-full px-2">
        <label className="label">
          <span className="label-text font-semibold">Description</span>
        </label>
        <textarea
          {...register('description')}
          className="textarea textarea-bordered"
          placeholder="Anything you want to add?"
        ></textarea>
      </div> */}
      <div className="form-control w-full px-2">
        <label className="label">
          <span className="label-text font-semibold">Description</span>
        </label>
        <SimpleEditor
          instructions={instructions}
          setInstructions={setInstructions}
        />
      </div>
      <div className="form-control w-full py-4 px-2">
        <div className="flex gap-2">
          <div className="form-control w-full pb-4">
            <label className="label">
              <span className="label-text font-semibold">
                Choose your budget
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
      </div>
    </div>
  );
}

export default CreateContract;
