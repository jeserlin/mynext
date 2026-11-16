import { describe, expect, it } from 'vitest';
import { recipeImageSrc } from './recipeImages';

describe('Notion recipe covers', () => {
  it('uses retained local assets for imported absolute website URLs', () => {
    expect(recipeImageSrc('https://myblog-jeserlin.vercel.app/assets/posts/cooking/bolognese_sauce.png')).toBe('/assets/posts/cooking/bolognese_sauce.png');
    expect(recipeImageSrc('https://media.publit.io/file/cover.png')).toBe('https://media.publit.io/file/cover.png');
  });
});
