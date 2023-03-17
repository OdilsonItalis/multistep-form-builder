import { useRouter } from 'next/router';
import { useGetPrivateUser, useGetPublicUser } from '@/utils/hooks/userHooks';
import { useUser } from '@/utils/useUser';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import {
  changeAuthModalStatus,
  changeSendInvoiceModalStatus
} from '@/utils/features/modalStateSlice';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { setCookie } from 'nookies';
import { AnimatePresence } from 'framer-motion';
import SendInvoiceModal from '@/components/Modals/SendInvoiceModal';
import TopMenuNavigation from '@/components/TopMenuNavigation';
import PricingComponent from '@/components/PricingComponent';
import RealGagedPortfolioTab from '@/components/Tabs/RealGagedPortfolioTab';
import { Reviews } from '@/components/Reviews';
import ProfileSection from '@/components/PublicProfile/ProfileSection';

const LazyLayoutNoBottomNav = dynamic(
  () => import('@/components/Layout/LayoutNoBottomNav'),
  {
    ssr: false
  }
);

function Profile() {
  const router = useRouter();
  const { user } = useUser();
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { id } = router.query;
  const { data: publicProfile } = useGetPublicUser(id as string | undefined);
  const { data: privateUser } = useGetPrivateUser(user?.id);
  const isOwner = publicProfile?.id === privateUser?.id;
  const dispatch = useAppDispatch();

  const invoiceModalStatus = useAppSelector(
    (state) => state.modalState.sendInvoiceModalOpen
  );

  const getFormattedBio = () => {
    if (!publicProfile?.bio) return;
    return publicProfile.bio.split('\n').map((text, index) => (
      <React.Fragment key={index}>
        {text}
        <br />
      </React.Fragment>
    ));
  };

  useEffect(() => {
    // grab the affiliate cookie from url with query of aff

    if (publicProfile) {
      setCookie(null, 'affiliate', publicProfile.id as string, {
        // maxAge: 604800,
        // set cookie to expire in 28 days
        maxAge: 2419200,
        // path: '/',
        sameSite: 'strict'
      });
    }
  }, [router.query]);

  const currentPageIndex = useAppSelector(
    (state) => state.tabState.publicProfileTabState
  );

  return (
    <div className="flex flex-col h-full pb-12">
      <TopMenuNavigation />

      {publicProfile?.id && (
        <div className="w-full flex flex-col mx-auto">
          {/* <div className="p-2">{getFormattedBio()}</div> */}
          <AnimatePresence>
            {invoiceModalStatus && (
              <SendInvoiceModal public_user_id={publicProfile.id} />
            )}
          </AnimatePresence>
        </div>
      )}
      {/* <div className="fixed bottom-0 right-0 p-4 bg-white rounded-t-lg shadow-md border z-10 h-60 w-60">
        <p>some message component here</p>
      </div> */}

      {currentPageIndex === 1 ? (
        <div className="pb-20">
          <ProfileSection />
          <RealGagedPortfolioTab />
        </div>
      ) : null}
      {currentPageIndex === 2 ? <PricingComponent /> : null}
      {currentPageIndex === 3 ? <Reviews /> : null}
    </div>
  );
}

export default Profile;
