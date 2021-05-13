import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';

import MainLayout from '../layouts/MainLayout';
import theme from '../styles/theme';

const Home = () => (
  <ThemeProvider theme={theme}>
    <MainLayout />
  </ThemeProvider>
);

export default Home;
