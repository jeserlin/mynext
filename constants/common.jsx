import React from 'react';

import FaceIcon from '@mui/icons-material/Face';
import CodeIcon from '@mui/icons-material/Code';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CookieOutlinedIcon from '@mui/icons-material/CookieOutlined';

export const menuList = [
  {
    image: () => (<CodeIcon />),
    text: 'Tech',
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
    image: () => (<FaceIcon />),
    text: 'About me',
    path: '/about-me',
  },
];

export default {};
