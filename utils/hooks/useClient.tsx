// define and export `useClient` hook somewhere in your codebase
// or keep it in the `src/App.js`, up to you

import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';

// we'll use src/hooks/useClient.js path for this example
export const useClient = ({
  apiKey,
  userId,
  name,
  avatarUrl,
  token
}: {
  apiKey: string;
  userId?: string;
  name?: string;
  avatarUrl?: string | null;
  token: string | null;
}) => {
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    if (!apiKey || !userId || !token) return;
    const client = new StreamChat(apiKey);
    // prevents application from setting stale client (user changed, for example)
    let didUserConnectInterrupt = false;

    console.log({
      userId,
      name,
      avatarUrl
    });

    const connectionPromise = client
      .connectUser(
        {
          id: userId,
          name,
          image: avatarUrl
        },
        token
      )
      .then(() => {
        // @ts-ignore
        if (!didUserConnectInterrupt) setChatClient(client);
      });

    return () => {
      didUserConnectInterrupt = true;
      setChatClient(null);
      // wait for connection to finish before initiating closing sequence
      connectionPromise
        .then(() => client.disconnectUser())
        .then(() => {
          console.log('connection closed');
        });
    };
  }, [apiKey, userId, token]);

  return chatClient;
};
