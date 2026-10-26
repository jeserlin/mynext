import type { ReactNode } from 'react';
import {
  BookOpen,
  Code,
  UtensilsCrossed,
  User,
} from 'lucide-react';

export interface MenuItem {
  image: () => ReactNode;
  text: string;
  path: string;
}

export const menuList: MenuItem[] = [
  {
    image: () => <Code size={20} />,
    text: 'Learning',
    path: '/tech',
  },
  {
    image: () => <UtensilsCrossed size={20} />,
    text: 'Recipes',
    path: '/recipes',
  },
  {
    image: () => <BookOpen size={20} />,
    text: 'Books',
    path: '/books',
  },
  {
    image: () => <User size={20} />,
    text: 'About me',
    path: '/about-me',
  },
];

export const getParentPath = (route: string) => {
  const parentRoute = route.split('/')[1];
  if (parentRoute === 'cooking' || parentRoute === 'baking') return '/recipes';
  return parentRoute ? `/${parentRoute}` : '/';
};
