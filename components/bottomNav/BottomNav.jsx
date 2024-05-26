import React from 'react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import {
  BottomNavigation, BottomNavigationAction,
} from '@mui/material';

import { menuList } from 'constants/common';

const PREFIX = 'BottomNav';

const classes = {
  actionItem: `${PREFIX}-actionItem`,
  selected: `${PREFIX}-selected`,
};

const StyledBottomNavigation = styled(BottomNavigation)((
  {
    theme,
  },
) => ({
  [`& .${classes.actionItem}`]: {
    '&.Mui-selected': {
      color: theme.palette.primary.dark,
    },
  },

  [`& .${classes.selected}`]: {
    color: theme.palette.primary.dark,
  },
}));

const BottomNav = () => {
  const router = useRouter();
  const { route } = router;
  const parentRoute = route.split('/')[1];

  const list = menuList.filter(({ path }) => path !== '/about-me');
  const onChangeNav = (event, newValue) => {
    router.push(newValue);
  };

  return (
    <StyledBottomNavigation
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
    </StyledBottomNavigation>
  );
};

export default BottomNav;
