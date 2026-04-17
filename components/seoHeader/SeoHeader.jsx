import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useRouter } from 'next/router';

import siteSeo from 'next-seo.config';

const propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  path: PropTypes.string,
  type: PropTypes.oneOf(['website', 'article']),
  publishedTime: PropTypes.string,
  jsonLd: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf(PropTypes.shape({})),
  ]),
};

const absoluteUrl = (url, siteUrl) => {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;
  return `${siteUrl}${url.startsWith('/') ? url : `/${url}`}`;
};

const SeoHeader = ({
  title = '',
  description = '',
  image = '',
  path = '',
  type = 'website',
  publishedTime = '',
  jsonLd = null,
}) => {
  const router = useRouter();
  const normalizedPath = (path || router.asPath || '/').split(/[?#]/)[0] || '/';
  const siteUrl = siteSeo.openGraph.url.replace(/\/$/, '');
  const canonicalUrl = `${siteUrl}${normalizedPath === '/' ? '' : normalizedPath}`;
  const pageTitle = title ? `${title} | ${siteSeo.defaultTitle}` : siteSeo.defaultTitle;
  const metaDescription = description || siteSeo.description;
  const defaultImage = siteSeo.openGraph.images?.[0]?.url || '';
  const imageUrl = absoluteUrl(image || defaultImage, siteUrl);
  const jsonLdItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content={siteSeo.openGraph.site_name} />
      <meta property="og:locale" content={siteSeo.openGraph.locale} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content={siteSeo.twitter.cardType} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />

      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      {jsonLdItems.map((item, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Head>
  );
};

SeoHeader.propTypes = propTypes;

export default SeoHeader;
