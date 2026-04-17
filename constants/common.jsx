import React from 'react';

import {
  User, Code, UtensilsCrossed, Cookie, BookOpen,
} from 'lucide-react';

export const menuList = [
  {
    image: () => (<Code size={20} />),
    text: 'Learning',
    path: '/tech',
  },
  {
    image: () => (<UtensilsCrossed size={20} />),
    text: 'Cooking',
    path: '/cooking',
  },
  {
    image: () => (<Cookie size={20} />),
    text: 'Baking',
    path: '/baking',
  },
  {
    image: () => (<BookOpen size={20} />),
    text: 'Books',
    path: '/books',
  },
  {
    image: () => (<User size={20} />),
    text: 'About me',
    path: '/about-me',
  },
];
