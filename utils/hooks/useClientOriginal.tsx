// define and export `useClient` hook somewhere in your codebase
// or keep it in the `src/App.js`, up to you

import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';

// we'll use src/hooks/useClient.js path for this example
export const useClientOriginal = ({
  apiKey,
  userData
}: //   tokenOrProvider
{
  apiKey: string;
  userData: {
    id: string;
    name?: string;
    image?: string;
    role?: string;
  };
  //   tokenOrProvider: string | (() => Promise<string>);
}) => {
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    const client = new StreamChat(apiKey);
    // prevents application from setting stale client (user changed, for example)
    let didUserConnectInterrupt = false;

    const connectionPromise = client
      .connectUser(userData, client.devToken(userData.id))
      .then(() => {
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
  }, [apiKey, userData.id]);

  return chatClient;
};
