import { useAppSelector } from '@/utils/hooks/rtkhooks';
import { useUser } from '@supabase/auth-helpers-react';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import AuthModal from './Modals/AuthModal';

function GetPrivateUser() {
  const user = useUser();
  const authModalStatus = useAppSelector(
    (state) => state.modalState.authModalOpen
  );

  return (
    <>
      <AnimatePresence>{authModalStatus && <AuthModal />}</AnimatePresence>
    </>
  );
}

export default GetPrivateUser;
