import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { menuList } from 'constants/common';

const SideNav = () => {
  const router = useRouter();
  const { route } = router;
  const parentRoute = route.split('/')[1];

  return (
    <aside className="hidden sm:block w-[223px] flex-shrink-0 border-r border-[#ece7df] min-h-screen">
      <div className="fixed top-16 left-0 w-[223px] pt-4">
        <ul className="p-0" style={{ fontFamily: '"Indie Flower", cursive' }}>
          {menuList.map(({ text, path }) => {
            const isSelected = path === `/${parentRoute}`;
            return (
              <li key={text}>
                <Link
                  href={path}
                  className={`block text-base pl-8 pr-4 py-3 rounded-none hover:bg-custom-light ${
                    isSelected
                      ? 'text-primary-content underline decoration-wavy decoration-primary bg-transparent'
                      : 'text-primary-content'
                  }`}
                >
                  {text}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default SideNav;
