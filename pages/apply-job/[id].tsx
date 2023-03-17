import ReadOnlyEditor from '@/components/Editor/ReadOnlyEditor';
import LayoutNoBottomNav from '@/components/Layout/LayoutNoBottomNav';
import AppBarBackUniversal from '@/components/Navigation/AppBarBackUniversal';
import { formatPrice } from '@/utils/helpers';
import { useGetJob } from '@/utils/hooks/useGetJobs';
import { supabase } from '@/utils/supabase-client';
import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';

interface Inputs {
  title: string;
  price: number;
  currency: 'usd' | 'gbp' | 'eur';
  description: string;
}

function ApplyJob() {
  const router = useRouter();
  const { id } = router.query;
  const { data: job } = useGetJob(id as string);
  const { user } = useUser();

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
        .from('job-applications')
        .insert({
          job_id: Number(id),
          user_id: user.id,
          cover_letter: data.description,
          desired_price: price_in_cents
        })
        .select('id');
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
    <LayoutNoBottomNav>
      <Toaster />
      <AppBarBackUniversal />
      {job ? (
        <>
          <div className="p-2 flex flex-col items-baseline gap-4 border-b">
            <div className="flex items-center gap-2 w-full">
              <img
                src={job.created_by?.avatar_url}
                className="h-8 w-8 object-cover rounded-full"
                alt=""
              />
              <p>{job.created_by?.full_name}</p>
              <button
                onClick={handleSubmit(onSubmit)}
                className="bg-black ml-auto text-white h-8 px-4 rounded-full"
              >
                Submit
              </button>
            </div>
            <h1 className="text-xl">{job.title}</h1>
            <ReadOnlyEditor instructions={job.description} />
            <div className="bg-green-400 rounded-full mt-auto font-semibold text-sm flex justify-center items-center h-6 px-2">
              {formatPrice(job.amount, job.currency)}
            </div>
          </div>
          <div className="form-control w-full px-2">
            <label className="label">
              <span className="label-text font-semibold">
                Your cover letter
              </span>
            </label>
            <textarea
              {...register('description')}
              className="textarea textarea-bordered"
              placeholder="Quick intro about yourself and why you're the best fit for this job (140 characters)."
            ></textarea>
          </div>
          <div className="form-control w-full px-2">
            <label className="label">
              <span className="label-text font-semibold">
                Your desired price
              </span>
            </label>
            <input
              {...register('price', { required: false })}
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full"
            />
          </div>
        </>
      ) : null}
    </LayoutNoBottomNav>
  );
}

export default ApplyJob;

const getFormattedText = (text: string) => {
  return text.split('\n').map((text, index) => (
    <div key={index}>
      {text}
      <br />
    </div>
  ));
};
