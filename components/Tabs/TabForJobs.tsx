import { formatPrice } from '@/utils/helpers';
import useGetJobs from '@/utils/hooks/useGetJobs';
import { useRouter } from 'next/router';
import CheckIcon from 'public/icons/CheckIcon';
import React from 'react';
import ReadOnlyEditor from '../Editor/ReadOnlyEditor';

function TabForJobs() {
  const { data, error } = useGetJobs();
  console.log(data);
  const router = useRouter();

  return (
    <div className="grid grid-cols-1  sm:grid-cols-2 gap-1 p-2">
      {data?.map((job) => {
        return (
          <div className="ring-1 ring-gray-200 rounded-lg p-2 shadow-lg flex flex-col items-baseline gap-4">
            <div className="flex items-center gap-2 w-full">
              <img
                src={job.created_by?.avatar_url}
                className="h-8 w-8 object-cover rounded-full"
                alt=""
              />
              <p>{job.created_by?.full_name}</p>
              {/* <button
                onClick={() => router.push(`/apply-job/${job.id}`)}
                className="bg-black ml-auto text-white h-8 px-4 rounded-full"
              >
                Apply
              </button> */}
              <button
                onClick={() => router.push(`/apply-job/${job.id}`)}
                className="text-indigo-600 rounded-lg px-4 flex gap-1 h-10 items-center ml-auto"
              >
                <CheckIcon height={16} width={16} className="flex-none" />
                <p>Apply</p>
              </button>
            </div>
            <h1 className="leading-5 font-semibold">{job.title}</h1>
            <div className="text-sm h-28 text-ellipsis overflow-hidden relative">
              <ReadOnlyEditor instructions={job.description} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white" />
            </div>
            <div className="bg-green-400 rounded-full mt-auto font-semibold text-sm flex justify-center items-center h-6 px-2">
              {formatPrice(job.amount, job.currency)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TabForJobs;

const getFormattedText = (text: string) => {
  return text.split('\n').map((text, index) => (
    <div key={index}>
      {text}
      <br />
    </div>
  ));
};
