import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { useState } from 'react';
import { Database } from 'types_db';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { MyUserContextProvider } from './useUser';
import MyChatProvider from './ChatProvider';

const queryClient = new QueryClient();

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabaseClient}>
          <MyUserContextProvider>
            <MyChatProvider>{children}</MyChatProvider>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </MyUserContextProvider>
        </SessionContextProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default AllProviders;
