import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { menuList } from 'constants/common';

const BottomNav = ({ showBottomNav = true }) => {
  const router = useRouter();

  const list = menuList.filter(({ path }) => path !== '/about-me');
  const onChangeNav = (newValue) => {
    router.push(newValue);
  };

  return (
    <div
      className={clsx(
        'btm-nav btm-nav-md sm:hidden z-50 transition-transform duration-300',
        showBottomNav ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      {list.map(({ image, text, path }) => (
        <button
          key={text}
          type="button"
          className={clsx('bg-white text-accent', {
            active: router.pathname === path,
          })}
          onClick={() => onChangeNav(path)}
        >
          {image()}
          <span className="text-xs">{text}</span>
        </button>
      ))}
    </div>
  );
};

BottomNav.propTypes = {
  showBottomNav: PropTypes.bool,
};

export default BottomNav;
