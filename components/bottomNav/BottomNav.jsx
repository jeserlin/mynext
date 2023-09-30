import React from 'react';
import { useRouter } from 'next/router';
import {
  BottomNavigation, BottomNavigationAction,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import { menuList } from 'constants/common';

const useStyles = makeStyles((theme) => ({
  actionItem: {
    '&.Mui-selected': {
      color: theme.palette.primary.dark,
    },
  },
  selected: {
    color: theme.palette.primary.dark,
  },
}));

const BottomNav = () => {
  const classes = useStyles();

  const router = useRouter();
  const { route } = router;
  const parentRoute = route.split('/')[1];

  const list = menuList.filter(({ path }) => path !== '/about-me');
  const onChangeNav = (event, newValue) => {
    router.push(newValue);
  };

  return (
    <BottomNavigation
      showLabels
      value={`/${parentRoute}`}
      onChange={onChangeNav}
    >
      {list.map(({ image, text, path }) => (
        <BottomNavigationAction
          key={text}
          value={path}
          label={text}
          icon={image()}
          classes={{
            root: classes.actionItem,
            selected: classes.selected,
          }}
        />
      ))}
    </BottomNavigation>
  );
};

export default BottomNav;
