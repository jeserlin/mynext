/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import {
  Box, Slide, makeStyles, useTheme,
} from '@material-ui/core';

import Header from '../components/header';
import SideNav from '../components/sideNav';
import BottomNav from '../components/bottomNav';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    paddingTop: theme.mixins.toolbar.minHeight,
  },
  content: {
    width: '100%',
    padding: theme.spacing(4),
    marginBottom: 56 * 2,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(12),
    },
  },
  bottomNav: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));

const MainLayout = ({ children }, props) => {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();

  const isUpSm = useMediaQuery(theme.breakpoints.up('sm'));
  const defaultIsOpen = !!isUpSm;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    threshold: 0,
  });

  return (
    <Box>
      <Header />
      <Box className={classes.root}>
        <SideNav open={defaultIsOpen} />
        <main className={classes.content}>
          {children}
        </main>
      </Box>
      <Slide direction="up" in={!trigger}>
        <Box className={classes.bottomNav}>
          <BottomNav />
        </Box>
      </Slide>
    </Box>
  );
};

MainLayout.propTypes = propTypes;
MainLayout.defaultProps = defaultProps;

export default MainLayout;
