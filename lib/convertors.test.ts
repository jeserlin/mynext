import { describe, expect, it } from 'vitest';

import { formatDate } from './convertors';

describe('formatDate', () => {
  it('formats dates as year/month/day', () => {
    expect(formatDate(new Date(2025, 0, 2, 12))).toBe('2025/01/02');
  });
});
