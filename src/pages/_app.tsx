import '../styles/main.css';
import '../styles/chrome-bug.css';
import { useEffect, useState } from 'react';
import React from 'react';
import { ToastProvider } from 'react-toast-notifications';

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { AppProps } from 'next/app';
import { MyUserContextProvider } from '../utils/useUser';
import type { Database } from 'types_db';
import { reduxWrapper } from '../store';

function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
      <SessionContextProvider supabaseClient={supabaseClient}>
        <MyUserContextProvider>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </MyUserContextProvider>
      </SessionContextProvider>
  );
}

export default reduxWrapper.withRedux(MyApp);
