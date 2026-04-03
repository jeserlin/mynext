import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';

import { menuList } from 'constants/common';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const parentRoute = router.route.split('/')[1];

  return (
    <>
      {/* Mobile header only */}
      <div className="sm:hidden fixed top-0 z-50 w-full bg-primary/30 backdrop-blur-md border-b border-base-200 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <Image
            alt="yuan"
            src="/yuan.png"
            width="24"
            height="21"
            style={{ width: 24, height: 21 }}
          />
          <span className="text-primary-content font-normal text-lg" style={{ fontFamily: '"Gloria Hallelujah", cursive', WebkitTextStroke: '0.3px' }}>Jeserlin</span>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg text-gray-dark hover:bg-base-200 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile slide-down menu */}
      <div
        className={`sm:hidden fixed top-14 left-0 right-0 z-40 bg-[#ede8e0] border-b border-base-200 transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-3 py-2">
          <ul className="flex flex-col gap-1" style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {menuList.map(({ image, text, path }) => {
              const isSelected = path === `/${parentRoute}`;
              return (
                <li key={text}>
                  <Link
                    href={path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
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

      {/* Overlay */}
      {menuOpen && (
        <div
          className="sm:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          onKeyDown={() => {}}
          role="presentation"
        />
      )}
    </>
  );
};

export default Header;
