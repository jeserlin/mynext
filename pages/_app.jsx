/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import MainLayout from 'layouts/MainLayout';
import { ThemeProvider } from '@mui/material/styles';
// import { DefaultSeo } from 'next-seo';

import 'styles/globals.css';
import 'styles/codepen-embed.css';
import 'styles/mermaid.css';
import 'styles/post-content.css';

import theme from 'theme';

const propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({}),
};

function MyApp({ Component, pageProps = {} }) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ThemeProvider>
    </>
  );
}

MyApp.propTypes = propTypes;

export default MyApp;
