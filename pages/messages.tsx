import { useUser } from '@/utils/useUser';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { useAppDispatch } from '@/utils/hooks/rtkhooks';
import { changeAuthModalStatus } from '@/utils/features/modalStateSlice';
import {
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  useChatContext,
  Window
} from 'stream-chat-react';
import LayoutNoBottomNav from '@/components/Layout/LayoutNoBottomNav';

function Index() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleAuthModalOpen = () => {
    dispatch(changeAuthModalStatus(true));
  };
  const [channel, setChannel] = useState<any>(null);

  const filters = { type: 'messaging', members: { $in: [user?.id] } };

  const sort = { last_message_at: -1 };

  useEffect(() => {
    // grab the affiliate cookie from url with query of aff
    const { aff } = router.query;
    if (aff) {
      setCookie(null, 'affiliate', aff as string, {
        // maxAge: 604800,
        // set cookie to expire in 28 days
        maxAge: 2419200,
        // path: '/',
        sameSite: 'strict'
      });
    }
  }, [router.query]);

  const { client } = useChatContext();

  console.log(client?.user?.total_unread_count);

  return (
    <LayoutNoBottomNav>
      <div className="flex h-full">
        {client && (
          <>
            <ChannelList
              // Preview={(props) => {
              //   console.log('props', props);
              //   return (
              //     <div
              //       onClick={() => {
              //         router.push(`/chat/${props.channel.id}`);
              //       }}
              //       className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-400 cursor-pointer hover:bg-gray-100"
              //     >
              //       <div className="flex items-center">
              //         <img
              //           src={props.channel.data.image}
              //           className="w-12 h-12 rounded-full"
              //         />
              //         <div className="ml-4">
              //           <p className="font-bold">{props.channel.data.name}</p>
              //           <p className="text-gray-500">
              //             {props.lastMessage?.text}
              //           </p>
              //           <p className="text-gray-500">
              //             {props.lastMessage?.user?.name}
              //           </p>
              //           <p className="text-gray-500">
              //             message is {props.lastMessage?.status}
              //           </p>
              //         </div>
              //       </div>
              //       <div className="flex items-center">
              //         <p className="text-gray-500">1:00 PM</p>
              //       </div>
              //     </div>
              //   );
              // }}
              filters={filters}
              sort={sort}
            />
            <Channel channel={channel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </>
        )}
      </div>
    </LayoutNoBottomNav>
  );
}

export default Index;
