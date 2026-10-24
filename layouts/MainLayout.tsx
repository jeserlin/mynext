import type { ReactNode } from 'react';

import Header from 'components/header';
import SideNav from 'components/sideNav';

export interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout = ({ children = null }: MainLayoutProps) => (
  <div>
    <Header />
    <div className="flex min-h-screen">
      <SideNav />
      <main className="w-full px-4 pb-10 sm:pb-10 sm:px-10 main-content">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  </div>
);

export default MainLayout;
