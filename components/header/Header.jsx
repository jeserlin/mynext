import React from 'react';
import Image from 'next/image';
import { AppBar, Toolbar } from '@mui/material';

const Header = () => (
  <AppBar>
    <Toolbar>
      <Image
        src="/yuan.png"
        width={30}
        height={26}
      />
    </Toolbar>
  </AppBar>
);

export default Header;
