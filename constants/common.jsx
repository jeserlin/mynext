import React from 'react';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { ReactComponent as ImgCoding } from '../assets/bottomNav/coding.svg';
import { ReactComponent as ImgCooking } from '../assets/bottomNav/cooking.svg';
import { ReactComponent as ImgBaking } from '../assets/bottomNav/baking.svg';

export const menuList = [
  {
    image: () => (<AccountCircleIcon />),
    text: 'About me',
    path: '/about-me',
  },
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
];

export default {};
