/* eslint-disable react/require-default-props */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Header from 'components/header';
import SideNav from 'components/sideNav';
import BottomNav from 'components/bottomNav';

const propTypes = {
  children: PropTypes.node,
};

const MainLayout = ({ children = null }) => {
  const [showBottomNav, setShowBottomNav] = useState(true);
  const lastScrollYRef = React.useRef(0);
  const ticking = React.useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const difference = Math.abs(currentScrollY - lastScrollYRef.current);

          // Only update if scrolled more than 5px to avoid tiny movements
          if (difference > 5) {
            // Scrolling down - hide nav
            if (currentScrollY > lastScrollYRef.current && currentScrollY > 50) {
              setShowBottomNav(false);
            }
            // Scrolling up - show nav
            else if (currentScrollY < lastScrollYRef.current) {
              setShowBottomNav(true);
            }

            lastScrollYRef.current = currentScrollY;
          }

          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <Header />
      <div className="flex min-h-screen">
        <SideNav />
        <main className="w-full px-4 pb-36 sm:pb-10 sm:px-10" style={{ paddingTop: '96px', paddingBottom: '100px' }}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <BottomNav showBottomNav={showBottomNav} />
    </div>
  );
};

MainLayout.propTypes = propTypes;

export default MainLayout;
