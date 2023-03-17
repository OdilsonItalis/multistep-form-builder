import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import BasicLayout from '@/components/Layout/BasicLayout';
import LayoutNoBottomNav from '@/components/Layout/LayoutNoBottomNav';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const getServerSideProps = withPageAuth();

function Saved() {
  const { user, isLoading: userIsLoading } = useUser();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const index = useAppSelector((state) => state.tabState.savedTabState);

  return (
    <LayoutNoBottomNav>
      <div className="flex justify-center items-center h-full">
        <h1 className="font-bold text-3xl">Saved users go here</h1>
      </div>
    </LayoutNoBottomNav>
  );
}

export default Saved;
