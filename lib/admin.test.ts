import { afterEach, describe, expect, it, vi } from 'vitest';

import { isAdminAuthorized } from './admin';

describe('isAdminAuthorized', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('denies access when the admin secret is not configured', () => {
    vi.stubEnv('ADMIN_SECRET', '');

    expect(isAdminAuthorized('anything')).toBe(false);
  });

  it('accepts only the configured admin secret', () => {
    vi.stubEnv('ADMIN_SECRET', 'correct-secret');

    expect(isAdminAuthorized('correct-secret')).toBe(true);
    expect(isAdminAuthorized('incorrect-secret')).toBe(false);
    expect(isAdminAuthorized(undefined)).toBe(false);
  });

  it('rejects repeated secret headers', () => {
    vi.stubEnv('ADMIN_SECRET', 'correct-secret');

    expect(isAdminAuthorized(['correct-secret'])).toBe(false);
  });
});
