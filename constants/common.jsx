import React from 'react';

import FaceIcon from '@material-ui/icons/Face';
import { ReactComponent as ImgCoding } from '../assets/bottomNav/coding.svg';
import { ReactComponent as ImgCooking } from '../assets/bottomNav/cooking.svg';
import { ReactComponent as ImgBaking } from '../assets/bottomNav/baking.svg';

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
