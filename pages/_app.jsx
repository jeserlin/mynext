/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import MainLayout from 'layouts/MainLayout';
import { ThemeProvider } from '@material-ui/styles';
import { DefaultSeo } from 'next-seo';

import 'styles/globals.css';
import 'styles/a11y-dark.css';
import 'styles/mermaid.css';
import theme from 'theme';

import SEO from '../next-seo.config';

const propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({}),
};

const defaultProps = {
  pageProps: {},
};

function MyApp({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <ThemeProvider theme={theme}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ThemeProvider>
    </>
  );
}

MyApp.propTypes = propTypes;
MyApp.defaultProps = defaultProps;

export default MyApp;
