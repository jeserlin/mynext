import {
  Head, Html, Main, NextScript,
} from 'next/document';

const MyDocument = () => (
  <Html lang="en">
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#c69f79" />
      <meta name="google-site-verification" content="u3o7yoBytPdLTXnMSDaDS5s5JY87tP0fNtx2OeDeP1I" />
      <meta name="msapplication-TileColor" content="#e5d8cb" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans&family=Gloria+Hallelujah&display=swap" rel="stylesheet" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default MyDocument;
