interface SiteSeoConfig {
  defaultTitle: string;
  titleTemplate: string;
  description: string;
  openGraph: {
    type: string;
    locale: string;
    description: string;
    url: string;
    site_name: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
  twitter: {
    handle: string;
    site: string;
    cardType: string;
  };
}

const siteSeo: SiteSeoConfig = {
  defaultTitle: 'Jeserlin',
  titleTemplate: '%s | Jeserlin',
  description: 'This is Jeserlin\'s blog',
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    description: 'This is Jeserlin\'s blog',
    url: 'https://myblog-jeserlin.vercel.app',
    site_name: 'Jeserlin',
    images: [
      {
        url: 'https://myblog-jeserlin.vercel.app/yuan.png',
        width: 200,
        height: 200,
        alt: 'Jeserlin',
      },
    ],
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
};

export default siteSeo;
