import { describe, expect, it } from 'vitest';
import { getPostSlugs, getPostsByFolder } from './api';

describe('retired local recipe directories', () => {
  it('returns empty collections when a content directory is absent', () => {
    expect(getPostSlugs('missing-content-folder')).toEqual([]);
    expect(getPostsByFolder({ folder: 'missing-content-folder', fields: ['slug'] })).toEqual([]);
  });
});
