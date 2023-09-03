import React from 'react';

import FaceIcon from '@mui/icons-material/Face';
import { ReactComponent as ImgCoding } from 'public/assets/bottomNav/coding.svg';
import { ReactComponent as ImgCooking } from 'public/assets/bottomNav/cooking.svg';
import { ReactComponent as ImgBaking } from 'public/assets/bottomNav/baking.svg';

export const menuList = [
  {
    image: () => (<ImgCoding />),
    text: 'Tech',
    path: '/tech',
  },
  {
    image: () => (<ImgCooking />),
    text: 'Cooking',
    path: '/cooking',
  },
  {
    image: () => (<ImgBaking />),
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
