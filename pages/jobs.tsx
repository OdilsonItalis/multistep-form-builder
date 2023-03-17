import ReadOnlyEditor from '@/components/Editor/ReadOnlyEditor';
import BasicLayout from '@/components/Layout/BasicLayout';
import { formatPrice } from '@/utils/helpers';
import { useGetMyJobs } from '@/utils/hooks/useGetJobs';
import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';
import ApplicationInIcon from 'public/icons/ApplicationInIcon';
import ChevronRightIcon from 'public/icons/ChevronRightIcon';
import EyesIcon from 'public/icons/EyesIcon';
import React from 'react';

function Jobs() {
  const { user } = useUser();
  const { data: myJobs } = useGetMyJobs(user?.id);
  const router = useRouter();
  return (
    <BasicLayout>
      <div className="p-2 flex flex-col gap-2">
        {myJobs?.map((job) => (
          <div className="ring-1 ring-gray-200 rounded-lg p-2 shadow-lg flex flex-col items-baseline gap-4">
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
                <button
                  onClick={() => router.push(`/job/${job.id}`)}
                  className="h-8 w-8 flex justify-center items-center"
                >
                  <ChevronRightIcon height={20} width={20} />
                </button>
              </div>
            </div>
            <h1 className="text-xl">{job.title}</h1>
            <div className="text-sm h-28 text-ellipsis overflow-hidden relative">
              <ReadOnlyEditor instructions={job.description} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white" />
            </div>
            <div className="bg-green-400 rounded-full mt-auto font-semibold text-sm flex justify-center items-center h-6 px-2">
              {formatPrice(job.amount, job.currency)}
            </div>
          </div>
        ))}
      </div>
    </BasicLayout>
  );
}

export default Jobs;

const getFormattedText = (text: string) => {
  return text.split('\n').map((text, index) => (
    <div key={index}>
      {text}
      <br />
    </div>
  ));
};
