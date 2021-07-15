import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  BottomNavigation, BottomNavigationAction,
} from '@material-ui/core';

import { menuList } from '../../constants/common';

const BottomNav = () => {
  const router = useRouter();
  const { route } = router;
  const parentRoute = route.split('/')[1];

  const onChangeNav = (event, newValue) => {
    router.push(newValue);
  };

  return (
    <BottomNavigation
      showLabels
      value={`/${parentRoute}`}
      onChange={onChangeNav}
    >
      {menuList.map(({ imgPath, text, path }) => (
        <BottomNavigationAction
          key={text}
          value={path}
          label={text}
          icon={(
            <Image
              src={imgPath}
              width={24}
              height={24}
            />
              )}
        />
      ))}
    </BottomNavigation>
  );
};

export default BottomNav;
