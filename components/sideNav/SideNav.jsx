import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Drawer, List, ListItemButton, ListItemText,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import { menuList } from 'constants/common';
import { commonFontFamily2 } from 'theme/typography';

const propTypes = {
  open: PropTypes.bool,
};

const drawerWidth = 223;

const useStyles = makeStyles((theme) => ({
  drawer: {
    overflowY: 'auto',
    flexShrink: 0,
    width: drawerWidth,
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
  },
  drawerOpen: {
    width: drawerWidth,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: 0,
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
    },
  },
  drawerPaper: {
    zIndex: theme.zIndex.appBar - 1,
    borderRight: 0,
    color: theme.palette.primary.dark,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 2),
  },
  list: {
    marginTop: 84,
    borderRight: `1px solid ${theme.palette.primary.light}`,
  },
  listItem: {
    '&.Mui-selected': {
      color: theme.palette.primary.dark,
      backgroundColor: 'transparent',
      textDecoration: `${theme.palette.primary.main} wavy underline`,
    },
    '&.MuiListItem-button': {
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
    },
  },
  listText: {
    padding: theme.spacing(0, 0, 0, 2),
    '& > span': {
      fontFamily: commonFontFamily2,
    },
  },
}));

const SideNav = ({ open = true }) => {
  const classes = useStyles();

  const router = useRouter();
  const { route } = router;
  const parentRoute = route.split('/')[1];

  return (
    <>
      <Drawer
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx(classes.drawerPaper, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        variant="permanent"
      >
        <div className={classes.toolbar} />
        <div className={classes.list}>
          <List>
            {menuList.map(({ text, path }) => (
              <Link
                key={text}
                href={path}
              >
                <ListItemButton
                  selected={path === `/${parentRoute}`}
                  className={classes.listItem}
                >
                  <ListItemText
                    className={classes.listText}
                    primary={text}
                    component="a"
                  />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  );
};

SideNav.propTypes = propTypes;

export default SideNav;
