import { changeAuthModalStatus } from '@/utils/features/modalStateSlice';
import { useAppDispatch } from '@/utils/hooks/rtkhooks';
import React from 'react';
import FooterLandingPage from './FooterLandingPage';
import LandingPageBanner from './LandingPageBanner';

function Landingpage() {
  const dispatch = useAppDispatch();

  const handleAuthModalOpen = () => {
    dispatch(changeAuthModalStatus(true));
  };

  const TopBar = () => {
    return (
      <div className="flex flex-shrink-0 items-center w-full sticky top-0 z-10 bg-white/50 avoidNotch">
        <div className="flex w-full items-center max-w-2xl mx-auto">
          <img src="/realgaged-logo2.svg" alt="" className="h-8 w-8" />
        </div>
      </div>
    );
  };

  return (
    <>
      <img
        src="/header-image.png"
        className="max-w-2xl mx-auto w-full"
        alt=""
      />
      <div className="flex-1 flex-col">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl text-center py-2 sm:py-6">
          Find{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-600">
            Top Talent
          </span>{' '}
          in your space
        </h1>
        <div className="flex flex-col gap-2 sm:gap-4 mx-auto max-w-xl text-left sm:text-lg py-4 text-sm px-2">
          <div className="flex gap-2 items-center leading-5">
            <p>✅</p>
            <p>
              <span className="font-semibold">Instant messaging</span> - chat to
              creators directly
            </p>
          </div>
          <div className="flex gap-2 items-center leading-5">
            <p>✅</p>
            <p>
              <span className="font-semibold"> Advanced filtering </span> - find
              the perfect creator that fits
              <span className="font-semibold"> your niche </span>
            </p>
          </div>
          <div className="flex gap-2 items-center leading-5">
            <p>✅</p>
            <p>
              <span className="font-semibold">FREE </span>
              to join and use
            </p>
          </div>
          <div className="flex gap-2 items-center leading-5">
            <p>✅</p>
            <p>
              <span className="font-semibold">Concierge service</span> - new to
              UGC? We will help you
              <span className="font-semibold">
                {' '}
                prospect, employ and manaage
              </span>{' '}
              creators
            </p>
          </div>
        </div>
        <div className="sm:mt-10 flex justify-center gap-x-6 px-2 sm:px-0">
          <button
            onClick={handleAuthModalOpen}
            className="my-4 h-14 max-auto font-semibold w-full rounded-lg bg-blue-600 text-white items-center max-w-xl flex justify-center"
          >
            <p>
              Get started for FREE now <span className="pl-2 text-xl">👉</span>
            </p>
          </button>
        </div>
        <FooterLandingPage />
      </div>
    </>
  );
}

export default Landingpage;
