import LayoutNoBottomNav from '@/components/Layout/LayoutNoBottomNav';
import AppBarBackUniversal from '@/components/Navigation/AppBarBackUniversal';
import { formatPrice } from '@/utils/helpers';
import useGetApplications from '@/utils/hooks/useGetApplications';
import { useGetJob } from '@/utils/hooks/useGetJobs';
import { supabase } from '@/utils/supabase-client';
import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';
import ApplicationInIcon from 'public/icons/ApplicationInIcon';
import EyesIcon from 'public/icons/EyesIcon';
import MessagesIcon from 'public/icons/MessagesIcon';
import TrashIcon from 'public/icons/TrashIcon';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';

function Job() {
  const router = useRouter();
  const { id } = router.query;
  const { data: job } = useGetJob(id as string);
  const { user } = useUser();
  const { data: applications } = useGetApplications(id as string);

  return (
    <LayoutNoBottomNav>
      <Toaster />
      <AppBarBackUniversal />
      {job ? (
        <div className="flex flex-col items-baseline gap-4 mb-4">
          <div className="flex items-center gap-2 w-full">
            <img
              src={job.created_by?.avatar_url}
              className="h-8 w-8 object-cover rounded-full"
              alt=""
            />
            <p>{job.created_by?.full_name}</p>
            <div className="ml-auto flex gap-2 h-8">
              <div className="flex gap-2 text-sm justify-center items-center flex-1 bg-gray-100 rounded-lg px-2">
                <ApplicationInIcon height={20} width={20} />
                <p>20</p>
              </div>
              {/* <div className="flex gap-2 text-sm justify-center items-center flex-1 bg-gray-100 rounded-lg px-2">
                <EyesIcon height={20} width={20} />
                <p>20</p>
            </div> */}
              <button className="flex gap-2 text-sm justify-center items-center bg-red-100 ring-1 ring-red-400 rounded-lg px-2">
                <TrashIcon height={20} width={20} />
                <p>Delete Job</p>
              </button>
            </div>
          </div>
          <h1 className="text-xl">{job.title}</h1>
          <p className="text-sm text-ellipsis overflow-hidden">
            {getFormattedText(job.description)}
          </p>
          <div className="bg-green-400 rounded-full mt-auto font-semibold text-sm flex justify-center items-center h-6 px-2">
            {formatPrice(job.amount, job.currency)}
          </div>
        </div>
      ) : null}
      <h1 className="text-xl font-semibold pb-4">Applications</h1>
      {applications?.map((application) => {
        return (
          <div className="flex flex-col ring-1 ring-gray-200 p-2 rounded-lg items-baseline gap-4">
            <div className="flex items-center gap-2 w-full">
              <img
                src={application.user_id?.avatar_url}
                className="h-8 w-8 object-cover rounded-full"
                alt=""
              />
              <p>{application.user_id?.full_name}</p>
              <div className="flex gap-2 text-sm justify-center items-center bg-gray-100 rounded-lg px-2 ml-auto h-8">
                <p>Desired rate</p>
                {formatPrice(application.desired_price, job?.currency || 'USD')}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 rounded-lg border h-8 px-2">
                <img
                  src="/instagram.svg"
                  className="h-5 w-5 object-contain"
                  alt=""
                />
                <p className="text-xs font-semibold">250k</p>
              </div>
              <div className="flex items-center gap-1 rounded-lg border h-8 px-2">
                <img
                  src="/tiktok-icon.svg"
                  className="h-5 w-5 object-contain"
                  alt=""
                />
                <p className="text-xs font-semibold">250k</p>
              </div>
              <div className="flex items-center gap-1 rounded-lg border h-8 px-2">
                <img
                  src="/youtube-icon.svg"
                  className="h-5 w-5 object-contain"
                  alt=""
                />
                <p className="text-xs font-semibold">250k</p>
              </div>
            </div>
            <p className="text-sm">{application.cover_letter}</p>
            <div className="ml-auto flex gap-2 h-8">
              <button className="flex gap-2 text-sm justify-center items-center border rounded-lg px-2">
                <MessagesIcon height={20} width={20} />
                <p>Message</p>
              </button>
              <button className="flex gap-2 text-sm justify-center items-center text-red-400 border border-red-400 rounded-lg px-2">
                <TrashIcon height={20} width={20} />
                <p>Reject</p>
              </button>
            </div>
          </div>
        );
      })}
    </LayoutNoBottomNav>
  );
}

export default Job;

const getFormattedText = (text: string) => {
  return text.split('\n').map((text, index) => (
    <div key={index}>
      {text}
      <br />
    </div>
  ));
};
