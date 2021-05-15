import React, { useState } from 'react';
import { Box, makeStyles } from '@material-ui/core';

import Header from '../components/header';
import SideNav from '../components/sideNav';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    paddingTop: theme.mixins.toolbar.minHeight,
  },
}));

const MainLayout = () => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Header />
      <Box className={classes.root}>
        <SideNav open={isOpen} />
      </Box>
    </>
  );
};

export default MainLayout;
