import React from 'react';
import { useGetPrivateUser } from '@/utils/hooks/userHooks';
import { useRouter } from 'next/router';
import { useUser } from '@/utils/useUser';
import toast from 'react-hot-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { parseCookies, destroyCookie } from 'nookies';
import { postData } from '@/utils/helpers';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import CrownIcon from 'public/icons/CrownIcon';
import BasicLayout from '@/components/Layout/BasicLayout';
import LogoutIcon from 'public/icons/LogoutIcon';
import BriefcaseIcon from 'public/icons/BriefcaseIcon';

export const getServerSideProps = withPageAuth();

function Settings() {
  const { user, isLoading: userIsLoading } = useUser();
  const { data: profile } = useGetPrivateUser(user?.id);
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const [loading, setLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    router.push('/');
  };
  // just testing if I could destroy the cookies
  const destroyAffiliateCookie = () => {
    destroyCookie(null, 'affiliate', {
      path: '/'
    });
    // update cookies
    const cookies = parseCookies();
    console.log(cookies.affiliate);
  };

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link'
      });
      window.location.assign(url);
    } catch (error) {
      console.log(error);
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  return (
    <BasicLayout>
      <div className="flex flex-col h-full items-center max-w-xl mx-auto w-full pb-12">
        <div className="py-8 flex items-center">
          <img
            src={
              // TODO: when I get home, I need to add random color instead of red
              profile?.avatar_url
                ? `${profile.avatar_url}?v=${Date.now()}`
                : '/banner-placeholder.svg'
            }
            className={`w-24 h-24 rounded-full object-cover ${
              isLoading && `bg-red-400 blur-2xl`
            }}`}
            onLoad={() => {
              setIsLoading(false);
            }}
          />
        </div>
        <div className="grid grid-cols-1 w-full px-4 gap-2">
          <div
            onClick={() => router.push('/editprofile')}
            className="flex h-14 items-center gap-2 border flex-shrink-0 rounded-lg  hover:cursor-pointer hover:bg-gray-200"
          >
            <div className="flex justify-center w-12 flex-shrink-0">
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
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <p className="w-full  text-sm leading-4">Edit profile</p>
          </div>
          <div
            onClick={() => router.push('/partner-dashboard')}
            className="flex h-14 items-center gap-2 border flex-shrink-0 rounded-lg  hover:cursor-pointer hover:bg-gray-200"
          >
            <div className="flex justify-center w-12 flex-shrink-0">
              <BriefcaseIcon height={24} width={24} />
            </div>
            <p className="w-full  text-sm leading-4">
              My products and services
            </p>
          </div>
          <div
            onClick={() => router.push('/create-partner-account')}
            className="flex h-14 items-center gap-2 border flex-shrink-0 rounded-lg  hover:cursor-pointer hover:bg-gray-200"
          >
            <div className="flex justify-center w-12 flex-shrink-0">
              <BriefcaseIcon height={24} width={24} />
            </div>
            <p className="w-full  text-sm leading-4">Become a partner</p>
          </div>

          <div
            onClick={redirectToCustomerPortal}
            className="flex h-14 items-center gap-2 border flex-shrink-0 rounded-lg  hover:cursor-pointer hover:bg-gray-200"
            // className="flex h-14 items-center gap-2 border flex-shrink-0 rounded-lg  hover:cursor-pointer hover:bg-gray-200 border-[#FFD700]" i need this logic for non users to attract their attention, but not for the current users
          >
            <div className="flex justify-center w-12 flex-shrink-0">
              <CrownIcon height={22} width={22} color="#708090" />
            </div>
            <p className="w-full  text-sm leading-4">manage your memberships</p>
          </div>

          <div
            onClick={handleSignOut}
            className="flex h-14 items-center gap-2 border flex-shrink-0 rounded-lg  hover:cursor-pointer hover:bg-gray-200"
          >
            <div className="flex justify-center w-12 flex-shrink-0">
              <LogoutIcon height={20} width={20} />
            </div>
            <p className="w-full  text-sm leading-4">Sign out</p>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
}

export default Settings;
