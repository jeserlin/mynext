import type { GetServerSideProps } from 'next';

import { getPostsByFolder } from 'lib/api';

const siteUrl = 'https://myblog-jeserlin.vercel.app';
const staticPaths = ['/', '/tech', '/baking', '/cooking', '/books', '/about-me'];
const postTypes = ['tech', 'baking', 'cooking'];

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

interface SitemapUrl {
  path: string;
  lastModified?: string;
}

const createUrl = ({ path, lastModified }: SitemapUrl) => {
  const lastModifiedTag = lastModified
    ? `\n    <lastmod>${new Date(lastModified).toISOString()}</lastmod>`
    : '';

  return `  <url>\n    <loc>${escapeXml(`${siteUrl}${path}`)}</loc>${lastModifiedTag}\n  </url>`;
};

const createSitemap = () => {
  const staticUrls = staticPaths.map((path) => createUrl({ path }));
  const postUrls = postTypes.flatMap((type) => (
    getPostsByFolder({ folder: type, fields: ['slug', 'date'] })
      .flatMap(({ slug, date }) => (
        slug ? [createUrl({ path: `/${type}/${slug}`, lastModified: date })] : []
      ))
  ));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls,
    ...postUrls,
    '</urlset>',
  ].join('\n');
};

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(createSitemap());
  res.end();

  return { props: {} };
};

export default Sitemap;
