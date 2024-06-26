import { configureSitemap } from '@sergeymyssak/nextjs-sitemap';
import { getAllPosts } from './lib/api';

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
    exclude: ['/api/*', '/tech/*', '/baking/*', '/cooking/*', '/404'],
    excludeIndex: true,
    pagesConfig: {
      '/pages/*': {
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
