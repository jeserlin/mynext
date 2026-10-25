import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  createPublitSignedQuery,
  publitEnabled,
  uploadImageToPublit,
} from './publit';

const uploadOptions = {
  buffer: new ArrayBuffer(4),
  fileName: 'cover.png',
  mimeType: 'image/png',
};

const configurePublit = () => {
  vi.stubEnv('PUBLIT_API_KEY', 'test-key');
  vi.stubEnv('PUBLIT_API_SECRET', 'test-secret');
};

describe('Publit.io helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('requires both Publit.io credentials', () => {
    vi.stubEnv('PUBLIT_API_KEY', 'test-key');
    vi.stubEnv('PUBLIT_API_SECRET', '');
    expect(publitEnabled()).toBe(false);

    configurePublit();
    expect(publitEnabled()).toBe(true);
  });

  it('rejects signature requests when Publit.io is not configured', () => {
    vi.stubEnv('PUBLIT_API_KEY', '');
    vi.stubEnv('PUBLIT_API_SECRET', '');

    expect(() => createPublitSignedQuery()).toThrow('Publit.io is not configured');
  });

  it('creates a deterministic signed query', () => {
    configurePublit();
    vi.spyOn(Date, 'now').mockReturnValue(1700000000000);
    vi.spyOn(Math, 'random').mockReturnValue(0.123);

    expect(createPublitSignedQuery()).toEqual({
      api_key: 'test-key',
      api_timestamp: '1700000000',
      api_nonce: '21070000',
      api_signature: '0fcf458b1c08c2f4f3efebfd83e589724be5036c',
    });
  });

  it('returns the preferred URL from a successful upload', async () => {
    configurePublit();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      id: 'file-id',
      url_preview: 'https://media.publit.io/preview.png',
      url_download: 'https://media.publit.io/download.png',
    }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(uploadImageToPublit(uploadOptions)).resolves.toEqual({
      id: 'file-id',
      url: 'https://media.publit.io/preview.png',
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('https://api.publit.io/v1/files/create?'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('surfaces upload API errors', async () => {
    configurePublit();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: false,
      message: 'Invalid image',
    }), { status: 400 })));

    await expect(uploadImageToPublit(uploadOptions)).rejects.toThrow(
      'Publit.io upload failed: 400 Invalid image',
    );
  });

  it('rejects successful responses without an image URL', async () => {
    configurePublit();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      id: 'file-id',
    }), { status: 200 })));

    await expect(uploadImageToPublit(uploadOptions)).rejects.toThrow(
      'Publit.io upload succeeded but returned no usable URL',
    );
  });
});
