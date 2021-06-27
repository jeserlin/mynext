import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Box, makeStyles, useTheme } from '@material-ui/core';

import Header from '../components/header';
import SideNav from '../components/sideNav';

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
    padding: theme.spacing(12),
  },
}));

const MainLayout = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up('sm'));
  const defaultIsOpen = !!isUpSm;

  // State
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onToggleMenu = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  return (
    <>
      <Header onClickMenuIcon={onToggleMenu} />
      <Box className={classes.root}>
        <SideNav open={isOpen} />
        <main className={classes.content}>
          {children}
        </main>
      </Box>
    </>
  );
};

MainLayout.propTypes = propTypes;
MainLayout.defaultProps = defaultProps;

export default MainLayout;
