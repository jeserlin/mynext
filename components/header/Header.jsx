import React from 'react';
import Image from 'next/image';
import { AppBar, Toolbar } from '@mui/material';

const Header = () => (
  <AppBar>
    <Toolbar>
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
    </Toolbar>
  </AppBar>
);

export default Header;
