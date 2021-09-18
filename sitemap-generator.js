/* eslint-disable import/extensions */
import { configureSitemap } from '@sergeymyssak/nextjs-sitemap';
import { getAllPosts } from './lib/api.js';

async function fetchDynamicPaths() {
  return getAllPosts().reduce((acc, cur) => {
    const { type, slug } = cur;
    acc.push(`/${type}/${slug}`);
    return acc;
  }, []);
}

async function getDynamicPaths() {
  const paths = await fetchDynamicPaths();

  return paths.map((path) => path);
}

getDynamicPaths().then((paths) => {
  const pagesDirectory = process.cwd();
  const Sitemap = configureSitemap({
    domains: [{ domain: 'myblog-jeserlin.vercel.app', defaultLocale: 'zh-TW' }],
    include: paths,
    exclude: ['/api/*', '/tech/*', '/baking/*', '/cooking/*'],
    excludeIndex: true,
    pagesConfig: {
      '/project/*': {
        priority: '0.5',
        changefreq: 'daily',
      },
    },
    trailingSlash: true,
    targetDirectory: `${pagesDirectory}/public`,
    pagesDirectory: `${pagesDirectory}/pages`,
  });

  Sitemap.generateSitemap();
});
