import React from 'react';
import Image from 'next/image';
import {
  BottomNavigation, BottomNavigationAction, makeStyles,
} from '@material-ui/core';

import { menuList } from '../../constants/common';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));

const BottomNav = () => {
  const classes = useStyles();

  return (
    <BottomNavigation
      showLabels
      className={classes.root}
    >
      {menuList.map(({ imgPath, text }) => (
        <BottomNavigationAction
          key={text}
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
