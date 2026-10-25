import { describe, expect, it } from 'vitest';

import { getErrorMessage } from './errors';

describe('getErrorMessage', () => {
  it('returns a useful Error message', () => {
    expect(getErrorMessage(new Error('Request failed'), 'Fallback')).toBe('Request failed');
  });

  it('uses the fallback for unknown or empty errors', () => {
    expect(getErrorMessage('Request failed', 'Fallback')).toBe('Fallback');
    expect(getErrorMessage(new Error(''), 'Fallback')).toBe('Fallback');
  });
});
