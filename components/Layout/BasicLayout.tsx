import React from 'react';
import BottomNav from '../BottomNav';
import SideMenu from './SideMenu';

function BasicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto h-full avoidNotch">
      <div className="flex h-full w-full">
        <SideMenu />
        <div className="flex-1 sm:border-x mx-auto">{children}</div>
      </div>
      <BottomNav />
    </div>
  );
}

export default BasicLayout;
