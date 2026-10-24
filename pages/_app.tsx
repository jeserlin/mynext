import type { AppProps } from 'next/app';
import Script from 'next/script';

import MainLayout from 'layouts/MainLayout';

import 'styles/globals.css';
import 'styles/codepen-embed.css';
import 'styles/mermaid.css';
import 'styles/post-content.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
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

export default MyApp;
