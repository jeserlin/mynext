import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import {
  Drawer, List, ListItem, ListItemText, makeStyles,
} from '@material-ui/core';

const propTypes = {
  open: PropTypes.bool,
};

const defaultProps = {
  open: true,
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
    width: 60,
    [theme.breakpoints.up('sm')]: {
      width: 60,
    },
  },
  drawerPaper: {
    zIndex: theme.zIndex.appBar - 1,
    borderRight: 0,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary.dark,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 2),
  },
  list: {
    paddingTop: 64,
  },
}));

const SideNav = ({ open }) => {
  const classes = useStyles();

  return (
    <>
      <Drawer
        className={clsx({
          [classes.drawer]: true,
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerPaper]: true,
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        variant="permanent"
      >
        <div className={clsx('toolbarHeight', classes.toolbar)} />
        <div className={classes.list}>
          <List>
            <ListItem button>
              <ListItemText primary="Dashobard" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Data management" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Report" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </>
  );
};

SideNav.propTypes = propTypes;
SideNav.defaultProps = defaultProps;

export default SideNav;
