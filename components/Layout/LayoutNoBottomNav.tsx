import React from 'react';
import SideMenu from './SideMenu';

function LayoutNoBottomNav({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-6xl mx-auto h-full avoidNotch">
      <SideMenu />
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default LayoutNoBottomNav;
