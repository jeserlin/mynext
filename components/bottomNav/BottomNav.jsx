import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { menuList } from 'constants/common';

const BottomNav = () => {
  const router = useRouter();

  const list = menuList.filter(({ path }) => path !== '/about-me');
  const onChangeNav = (newValue) => {
    router.push(newValue);
  };

  return (
    <>
      <div className="btm-nav btm-nav-md">
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
    </>
  );
};

export default BottomNav;
