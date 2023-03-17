import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import React from 'react';
import { useUser } from '@/utils/useUser';
import ShoppingListIcon from 'public/icons/ShoppingListIcon';
import SettingsIcon from 'public/icons/SettingsIcon';
import SearchIcon from 'public/icons/SearchIcon';
import BookmarkOutlinedIcon from 'public/icons/BookmarkOutlineIcon';
import MessagesIcon from 'public/icons/MessagesIcon';
import BriefcaseIcon from 'public/icons/BriefcaseIcon';
import FolderIcon from 'public/icons/FolderIcon';
import { useChatContext } from 'stream-chat-react';
import { toast, Toaster } from 'react-hot-toast';
import PlusIcon from 'public/icons/PlusIcon';

function SideMenu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useUser();

  const unreadMessages = useAppSelector(
    (state) => state.searchState.unreadMessages
  );

  const supabaseClient = useSupabaseClient();

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    router.push('/');
  };

  const currentPageIsDiary = router.pathname === '/';
  const currentPageIsDiscovery = router.pathname === '/discovery';
  const currentPageIsMyFavorites = router.pathname === '/saved';
  const currentPageIsSettings = router.pathname === '/settings';
  const currentPageIsMessages = router.pathname === '/messages';
  const currentPageIsMyJobs = router.pathname === '/myjobs';
  const currentPageIsPurchases = router.pathname === '/purchases';
  const currentPageIsCreateForm = router.pathname === '/create-form';
  const currentPageIsMyForms = router.pathname === '/my-forms';

  return (
    <div className="hidden md:flex md:flex-col md:pr-4 md:pl-4 pt-2">
      <img src="/realgaged-logo2.svg" alt="" className="h-10 w-10 m-2" />
      <div className="flex flex-col py-4 pr-4 gap-2">
        <div
          onClick={() => router.push(`/`)}
          className={`h-10 flex items-center gap-2 text-gray-400 w-full rounded-lg hover:bg-gray-100 px-2 cursor-pointer ${
            currentPageIsDiary && 'bg-gray-200 text-gray-600 font-semibold'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <p className="">Home</p>
        </div>
        <div
          onClick={() => router.push(`/discovery`)}
          className={`h-10 flex items-center gap-2 w-full rounded-lg hover:bg-gray-100 px-2 cursor-pointer text-gray-400 ${
            currentPageIsDiscovery && 'bg-gray-200 text-gray-600 font-semibold'
          }`}
        >
          <SearchIcon height={20} width={20} />
          <p className="">Search</p>
        </div>

        <div
          onClick={() => router.push(`/messages`)}
          className={`h-10 flex items-center gap-2 w-full rounded-lg hover:bg-gray-100 px-2 cursor-pointer text-gray-400 ${
            currentPageIsMessages && 'bg-gray-200 text-gray-600 font-semibold'
          }`}
        >
          <MessagesIcon height={20} width={20} />
          <p className="">Messages</p>
          {unreadMessages > 0 && (
            <p
              className={`bg-red-500 flex items-center justify-center text-white rounded-full text-xs font-semibold ${
                unreadMessages < 100 ? 'w-5 h-5' : 'p-1'
              }`}
            >
              {unreadMessages < 100 ? unreadMessages : '99+'}
            </p>
          )}
        </div>

        <div
          onClick={() => router.push(`/purchases`)}
          className={`h-10 flex items-center gap-2 w-full rounded-lg hover:bg-gray-100 px-2 cursor-pointer text-gray-400 ${
            currentPageIsPurchases && 'bg-gray-200 text-gray-600 font-semibold'
          }`}
        >
          <ShoppingListIcon height={20} width={20} />
          <p className="">Purchases</p>
        </div>
        <div
          onClick={() => router.push(`/create-product`)}
          className={`h-10 flex items-center gap-2 w-full rounded-lg hover:bg-gray-100 px-2 cursor-pointer text-gray-400 ${
            currentPageIsPurchases && 'bg-gray-200 text-gray-600 font-semibold'
          }`}
        >
          <PlusIcon height={20} width={20} />
          <p className="">Create product</p>
        </div>
        <div
          onClick={() => router.push(`/create-subscription`)}
          className={`h-10 flex items-center gap-2 w-full rounded-lg hover:bg-gray-100 px-2 cursor-pointer text-gray-400 ${
            currentPageIsPurchases && 'bg-gray-200 text-gray-600 font-semibold'
          }`}
        >
          <PlusIcon height={20} width={20} />
          <p className="">Create subscription</p>
        </div>
        <div
          onClick={() => router.push(`/${user?.id}/forms`)}
          className={`h-10 flex items-center gap-2 w-full rounded-lg hover:bg-gray-100 px-2 cursor-pointer text-gray-400 ${
            currentPageIsPurchases && 'bg-gray-200 text-gray-600 font-semibold'
          }`}
        >
          <PlusIcon height={20} width={20} />
          <p className="">Forms</p>
        </div>
        <div
          onClick={() => router.push(`/add-media`)}
          className={`h-10 flex items-center gap-2 w-full rounded-lg hover:bg-gray-100 px-2 cursor-pointer text-gray-400 ${
            currentPageIsPurchases && 'bg-gray-200 text-gray-600 font-semibold'
          }`}
        >
          <PlusIcon height={20} width={20} />
          <p className="">Add media</p>
        </div>

        {/* <div
          onClick={() => router.push(`/create-form`)}
          className={`h-10 flex items-center gap-2 w-full rounded-lg hover:bg-gray-100 px-2 cursor-pointer text-gray-400 ${
            currentPageIsCreateForm && 'bg-gray-200 text-gray-600 font-semibold'
          }`}
        >
          <PlusIcon height={20} width={20} />
          <p className="">Create New Form</p>
        </div>
        <div
          onClick={() => router.push(`/my-forms`)}
          className={`h-10 flex items-center gap-2 w-full rounded-lg hover:bg-gray-100 px-2 cursor-pointer text-gray-400 ${
            currentPageIsMyForms && 'bg-gray-200 text-gray-600 font-semibold'
          }`}
        >
          <ShoppingListIcon height={20} width={20} />
          <p className="">My Forms</p>
        </div> */}
        <div
          onClick={() => router.push(`/saved`)}
          className={`h-10 flex items-center gap-2 w-full rounded-lg hover:bg-gray-100 px-2 cursor-pointer text-gray-400 ${
            currentPageIsMyFavorites &&
            'bg-gray-200 text-gray-600 font-semibold'
          }`}
        >
          <BookmarkOutlinedIcon height={20} width={20} />
          <p className="text-gray-400">Saved</p>
        </div>
        <div
          onClick={() => router.push(`/settings`)}
          className={`h-10 flex items-center gap-2 w-full rounded-lg hover:bg-gray-100 px-2 cursor-pointer text-gray-400 ${
            currentPageIsSettings && 'bg-gray-200 text-gray-600 font-semibold'
          }`}
        >
          <SettingsIcon height={20} width={20} />
          <p className="">Settings</p>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
