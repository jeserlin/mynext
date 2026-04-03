import React from 'react';
import PropTypes from 'prop-types';

import Header from 'components/header';
import SideNav from 'components/sideNav';

const propTypes = {
  children: PropTypes.node,
};

const MainLayout = ({ children = null }) => {
  return (
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
};

MainLayout.propTypes = propTypes;

export default MainLayout;
