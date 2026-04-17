import React from 'react';
import PropTypes from 'prop-types';
import Script from 'next/script';
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
    <>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-PQJDQCSC9J"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PQJDQCSC9J');
        `}
      </Script>
    </>
  );
}

MyApp.propTypes = propTypes;

export default MyApp;
