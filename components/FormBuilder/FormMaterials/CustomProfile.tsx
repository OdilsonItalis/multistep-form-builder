import React from 'react';
import { FaCertificate, FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useGetPublicUser } from '@/utils/hooks/userHooks';
import { useGetPrivateUser } from '@/utils/hooks/userHooks';

const CustomProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: publicProfile } = useGetPublicUser(id as string | undefined);

  const { data: profile } = useGetPrivateUser(id as string);
  return (
    <div className="w-full py-6 flex flex-col items-center">
      <img
        src={profile?.avatar_url as string}
        className="w-[60px] h-[60px] rounded-full"
        alt="Profile Avatar"
      />
      <p className="text-[14px] font-medium flex items-center">
        {profile?.full_name}
        <span className="flex items-center justify-center relative ml-1">
          <FaCertificate className="text-[20px] text-sky-500" />
          <FaCheck className="text-[10px] text-white absolute" />
        </span>
      </p>
    </div>
  );
};

export default CustomProfile;
