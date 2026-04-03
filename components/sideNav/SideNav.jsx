import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { menuList } from 'constants/common';

const SideNav = () => {
  const router = useRouter();
  const { route } = router;
  const parentRoute = route.split('/')[1];

  return (
    <aside className="hidden sm:flex flex-col w-[240px] flex-shrink-0 border-r border-base-200 min-h-screen bg-primary/30">
      <div className="fixed top-0 left-0 w-[240px] h-screen flex flex-col bg-primary/30">
        {/* Logo area */}
        <div className="flex items-center gap-3 px-6 h-16">
          <Image
            alt="jeserlin"
            src="/yuan.png"
            width="28"
            height="24"
            style={{ width: 28, height: 24 }}
          />
          <span className="text-primary-content font-normal text-xl" style={{ fontFamily: '"Gloria Hallelujah", cursive', WebkitTextStroke: '0.3px' }}>Jeserlin</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3">
          <ul className="p-0 flex flex-col gap-1" style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {menuList.map(({ image, text, path }) => {
              const isSelected = path === `/${parentRoute}`;
              return (
                <li key={text}>
                  <Link
                    href={path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary/20 text-base-content'
                        : 'text-gray-dark hover:bg-base-200 hover:text-base-content'
                    }`}
                  >
                    <span className={`transition-colors duration-200 ${isSelected ? 'text-secondary-content' : ''}`}>
                      {image()}
                    </span>
                    {text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default SideNav;
