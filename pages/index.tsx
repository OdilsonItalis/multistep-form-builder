import { useUser } from '@/utils/useUser';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { useAppDispatch } from '@/utils/hooks/rtkhooks';
import { changeAuthModalStatus } from '@/utils/features/modalStateSlice';
import LayoutNoBottomNav from '@/components/Layout/LayoutNoBottomNav';
import Landingpage from '@/components/LandingPage';

function Index() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleAuthModalOpen = () => {
    dispatch(changeAuthModalStatus(true));
  };

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

  if (!user) {
    return <Landingpage />;
  }

  return (
    <LayoutNoBottomNav>
      <div className="flex justify-center items-center h-full">
        <h1 className="font-bold text-3xl">Home page</h1>
      </div>
    </LayoutNoBottomNav>
  );
}

export default Index;
