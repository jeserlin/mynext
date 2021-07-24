/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import MainLayout from 'layouts/MainLayout';

import 'styles/globals.css';
import 'styles/a11y-dark.css';
import theme from 'theme';

const propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({}),
};

const defaultProps = {
  pageProps: {},
};

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ThemeProvider>
  );
}

MyApp.propTypes = propTypes;
MyApp.defaultProps = defaultProps;

export default MyApp;
