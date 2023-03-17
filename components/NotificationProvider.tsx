import { updateUnreadMessages } from '@/utils/features/searchStateSlice';
import { useAppDispatch } from '@/utils/hooks/rtkhooks';
import React, { useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Event } from 'stream-chat';
import { useChatContext } from 'stream-chat-react';
import { DefaultStreamChatGenerics } from 'stream-chat-react/dist/types/types';

function NotificationProvider() {
  const { client } = useChatContext();

  const dispatch = useAppDispatch();

  let soundFile = new Audio(
    'https://tyszadxvwfutwxikbyad.supabase.co/storage/v1/object/public/general/Incoming%20Message.mp3'
  );

  useEffect(() => {
    // initialize unread messages
    if (client) {
      const unreadMessages = client.user?.total_unread_count;
      if (unreadMessages)
        dispatch(updateUnreadMessages(unreadMessages as number));
    }
    const handleEvent = (event: Event<DefaultStreamChatGenerics>) => {
      if (event.total_unread_count !== undefined) {
        dispatch(updateUnreadMessages(event.total_unread_count));
      }

      if (event.type === 'message.new') {
        if (event.message?.user?.id === client?.user?.id) {
          return;
        }
        soundFile.play();

        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={event.message?.user?.image}
                      alt=""
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {event.message?.user?.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {event.message?.text}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          ),
          {
            position: 'bottom-right'
          }
        );
      }
    };

    client.on(handleEvent);

    return () => client.off(handleEvent);
  }, [client]);

  return <Toaster />;
}

export default NotificationProvider;
