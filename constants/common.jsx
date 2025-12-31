import React from 'react';

import FaceIcon from '@mui/icons-material/Face';
import CodeIcon from '@mui/icons-material/Code';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CookieOutlinedIcon from '@mui/icons-material/CookieOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';

export const menuList = [
  {
    image: () => (<CodeIcon />),
    text: 'Learning',
    path: '/tech',
  },
  {
    image: () => (<RestaurantIcon />),
    text: 'Cooking',
    path: '/cooking',
  },
  {
    image: () => (<CookieOutlinedIcon />),
    text: 'Baking',
    path: '/baking',
  },
  {
    image: () => (<ChromeReaderModeOutlinedIcon />),
    text: 'Books',
    path: '/books',
  },
  {
    image: () => (<FaceIcon />),
    text: 'About me',
    path: '/about-me',
  },
];

export default {};
