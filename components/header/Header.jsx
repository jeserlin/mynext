import React from 'react';
import Image from 'next/image';

const Header = () => (
  <div className="navbar bg-primary text-primary-content sticky top-0 z-50 w-full shadow-primary-content shadow-md">
    <div className="flex-1">
      <Image
        alt="yuan"
        src="/yuan.png"
        width="30"
        height="26"
        style={{
          width: 30,
          height: 26,
        }}
      />
    </div>
  </div>
);

export default Header;
