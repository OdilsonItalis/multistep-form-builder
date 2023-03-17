import React, { useEffect } from 'react';
import { Chat } from 'stream-chat-react';
import { useState } from 'react';
import { useClient } from './hooks/useClient';
import axios from 'axios';
import { useGetPrivateUser } from './hooks/userHooks';
import NotificationProvider from '@/components/NotificationProvider';
import { useUser } from '@supabase/auth-helpers-react';

interface MyChatProviderProps {
  children: React.ReactNode;
}

function MyChatProvider({ children }: MyChatProviderProps) {
  const user = useUser();

  const { data } = useGetPrivateUser(user?.id);
  const [userToken, setUserToken] = useState<string | null>(null);

  const chatClient = useClient({
    apiKey: '8uv5akjjns3u',
    userId: user?.id,
    avatarUrl: data?.avatar_url,
    name: data?.full_name || user?.email,
    token: userToken
  });

  const handleGetToken = async () => {
    try {
      const res = await axios.post(`/api/get-stream-token`);
      const { token } = res.data;
      setUserToken(token);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (user) {
  //     handleGetToken();
  //   }
  // }, [user]);

  useEffect(() => {
    setUserToken(null); // reset userToken to null when user changes
    if (user) {
      handleGetToken();
    }
  }, [user]);

  return (
    <>
      {chatClient ? (
        <Chat client={chatClient} theme="str-chat__theme-light">
          <NotificationProvider />
          {children}
        </Chat>
      ) : (
        children
      )}
    </>
  );
}

export default MyChatProvider;
