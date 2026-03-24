/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import MainLayout from 'layouts/MainLayout';
// import { DefaultSeo } from 'next-seo';

import 'styles/globals.css';
import 'styles/codepen-embed.css';
import 'styles/mermaid.css';
import 'styles/post-content.css';

const propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({}),
};

function MyApp({ Component, pageProps = {} }) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}

MyApp.propTypes = propTypes;

export default MyApp;
