const siteAssets = 'https://myblog-jeserlin.vercel.app/assets/';

export const recipeImageSrc = (image: string): string => (
  image.startsWith(siteAssets) ? `/assets/${image.slice(siteAssets.length)}` : image
);
