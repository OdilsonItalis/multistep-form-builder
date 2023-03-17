import { changeSendInvoiceModalStatus } from '@/utils/features/modalStateSlice';
import { useAppDispatch } from '@/utils/hooks/rtkhooks';
import { useGetPublicUser } from '@/utils/hooks/userHooks';
import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';
import BookmarkOutlinedIcon from 'public/icons/BookmarkOutlineIcon';
import LocationPinIcon from 'public/icons/LocationPinIcon';
import VerifiedIcon from 'public/icons/VerifiedIcon';
import React from 'react';
import { toast } from 'react-hot-toast';
import { useChatContext } from 'stream-chat-react';

function ProfileSection() {
  const router = useRouter();
  const { user } = useUser();
  const { id } = router.query;
  const { data: publicProfile } = useGetPublicUser(id as string | undefined);
  const { client } = useChatContext();
  const dispatch = useAppDispatch();

  const handleChatCreate = async () => {
    if (!user || !publicProfile?.id) return;
    const channelInit = client?.channel('messaging', {
      members: [user.id, publicProfile.id]
    });
    const channel = await channelInit?.create();
    if (channel) toast.success('Chat created');
    router.push(`/messages`);
  };

  const handleShareClick = async () => {
    try {
      // if navigator.share is not supported, then copy the link to clipboard
      const url = `https://flexifact.com/${router.query.id}`;
      if (!navigator.share) {
        await navigator.clipboard.writeText(url);
        toast.success(
          'Link copied to clipboard, paste the link to your friends'
        );
        return;
      }
      await navigator.share({
        title: 'Flexifact',
        text: 'check this top rated fitness app, that helps you get in shape without restricting your diet',
        url
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSendInvoice = async () => {
    if (!user || !publicProfile?.id) return;
    dispatch(changeSendInvoiceModalStatus(true));
  };
  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full pb-4 flex-shrink-0">
      <div className="flex flex-col items-center gap-0">
        <img
          src={publicProfile?.avatar_url_320x320 || '/banner-placeholder.svg'}
          className="w-20 aspect-square rounded-full object-cover"
        />
        <div className="flex gap-1 items-center">
          <p className="font-semibold">{publicProfile?.full_name}</p>
          <VerifiedIcon />
        </div>
        <div className="flex gap-1 items-center">
          <LocationPinIcon height={20} width={20} />
          <p className="">Birmingham 🇬🇧</p>
        </div>
        <div className="flex gap-2 items-center justify-center py-2">
          <button
            onClick={handleChatCreate}
            className="bg-rose-500 h-8 font-semibold flex items-center justify-center px-2 text-white"
          >
            Message
          </button>
          {/* <button
          onClick={handleSendInvoice}
          className="bg-gray-100 h-8 px-2 font-semibold rounded-lg flex items-center justify-center"
        >
          Send Invoice
        </button> */}

          {/* <button
            onClick={handleShareClick}
            className="flex items-center justify-center h-10 w-10 my-auto"
          >
            <BookmarkOutlinedIcon height={20} width={20} />
          </button> */}
        </div>
      </div>
      <div className="max-w-xl text-base text-center leading-7 text-gray-700 lg:max-w-lg mx-auto">
        <p>
          Hi, I'm Jessica Lee! I'm a lifestyle influencer and content creator
          based in Los Angeles. I love to share my passion for fashion, beauty,
          travel, and wellness with my followers. Join me on my journey and
          let's create some amazing content together!
        </p>
      </div>
    </div>
  );
}

export default ProfileSection;
