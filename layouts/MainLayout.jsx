/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import {
  Box, Container, Slide, useTheme,
} from '@mui/material';

import Header from 'components/header';
import SideNav from 'components/sideNav';
import BottomNav from 'components/bottomNav';

const PREFIX = 'MainLayout';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  bottomNav: `${PREFIX}-bottomNav`,
};

const StyledBox = styled(Box)((
  {
    theme,
  },
) => ({
  [`& .${classes.root}`]: {
    display: 'flex',
    minHeight: '100vh',
    paddingTop: theme.mixins.toolbar.minHeight,
  },

  [`& .${classes.content}`]: {
    width: '100%',
    padding: theme.spacing(4),
    marginBottom: 56 * 2,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(12, 8),
    },
  },

  [`& .${classes.bottomNav}`]: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));

const propTypes = {
  children: PropTypes.node,
};

const MainLayout = ({ children = null }, props) => {
  const { window } = props;

  const theme = useTheme();

  const isUpSm = useMediaQuery(theme.breakpoints.up('sm'));
  const defaultIsOpen = !!isUpSm;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    threshold: 0,
  });

  return (
    <StyledBox>
      <Header />
      <Box className={classes.root}>
        <SideNav open={defaultIsOpen} />
        <main className={classes.content}>
          <Container>
            {children}
          </Container>
        </main>
      </Box>
      <Slide direction="up" in={!trigger}>
        <Box className={classes.bottomNav}>
          <BottomNav />
        </Box>
      </Slide>
    </StyledBox>
  );
};

MainLayout.propTypes = propTypes;

export default MainLayout;
