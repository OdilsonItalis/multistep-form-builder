import PartnerPricingOptions from '@/components/PartnerPricingOptions';
import RealGagedProfileTabs from '@/components/Tabs/RealGagedProfileTabs';
import { useGetPublicUser } from '@/utils/hooks/userHooks';
import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';
import ArrowBack from 'public/icons/ArrowBack';
import VerifiedIcon from 'public/icons/VerifiedIcon';
import React from 'react';

function TestPartner() {
  const router = useRouter();
  const { user } = useUser();
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { id } = router.query;
  const { data: publicProfile } = useGetPublicUser(id as string | undefined);
  const [saved, setSaved] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen h-full">
      <div className="flex flex-col max-w-2xl mx-auto h-full flex-1">
        <div className="absolute cursor-pointer bg-gray-50/10 rounded-full w-8 justify-center items-center flex aspect-square left-1 top-1">
          <ArrowBack height={15} width={15} color={'#FFFF'} />
        </div>
        <img src="/model4.jpg" className="aspect-[3/1] object-cover" alt="" />
        <div className="flex pb-4">
          <img
            src="/model1.jpg"
            className="aspect-square object-cover rounded-full h-16 w-16 ring-2 ring-white -mt-7 ml-2"
            alt=""
          />
          <div className="flex justify-between w-full items-center">
            <div className="flex gap-1 items-center">
              <p className="font-semibold">{publicProfile?.full_name}</p>
              <VerifiedIcon />
            </div>
            <div className="flex items-center ml-auto pr-2 gap-2">
              <button className="text-sm text-white rounded-lg font-semibold px-2 bg-blue-400 h-6">
                Message
              </button>
              <button
                onClick={() => setSaved(!saved)}
                className="w-8 flex items-center justify-center"
              >
                {saved ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {/* <p className="bg-green-200 h-full flex-1">siuu1</p> */}
        <RealGagedProfileTabs />
      </div>
    </div>
  );
}

export default TestPartner;
