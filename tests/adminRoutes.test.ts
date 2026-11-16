import type { NextApiRequest, NextApiResponse } from 'next';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import publitSignatureHandler from 'pages/api/admin/publit-signature';
import recipeHandler from 'pages/api/admin/recipe';
import recipesHandler from 'pages/api/admin/recipes';
import revalidateHandler from 'pages/api/admin/revalidate';
import saveBookHandler from 'pages/api/admin/save-book';
import saveRecipeHandler from 'pages/api/admin/save-recipe';
import uploadImageHandler from 'pages/api/admin/upload-image';
import { getPostBySlug, getPostSlugs } from 'lib/api';
import { createRecipeInNotion, getRecipeBySlugForAdminFromNotion } from 'lib/notion';

vi.mock('lib/api', () => ({
  getPostSlugs: vi.fn(() => []),
  getPostBySlug: vi.fn(),
  getPostsByFolder: vi.fn(() => []),
}));

vi.mock('lib/notion', () => ({
  createRecipeInNotion: vi.fn(),
  getRecipeBySlugForAdminFromNotion: vi.fn(),
  getRecipesForAdminFromNotion: vi.fn(() => []),
  recipeSlugExistsInNotion: vi.fn(() => false),
  updateRecipeInNotion: vi.fn(),
}));

vi.mock('lib/publit', () => ({
  publitBaseUrl: 'https://api.publit.io/v1',
  createPublitSignedQuery: vi.fn(() => ({
    api_key: 'test-key',
    api_timestamp: '1700000000',
    api_nonce: '21070000',
    api_signature: 'signature',
  })),
}));

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => unknown;

interface RouteDefinition {
  name: string;
  method: 'GET' | 'POST';
  handler: ApiHandler;
}

const routes: RouteDefinition[] = [
  { name: 'publit signature', method: 'POST', handler: publitSignatureHandler as ApiHandler },
  { name: 'recipe', method: 'GET', handler: recipeHandler as ApiHandler },
  { name: 'recipes', method: 'GET', handler: recipesHandler as ApiHandler },
  { name: 'revalidate', method: 'POST', handler: revalidateHandler as ApiHandler },
  { name: 'save recipe', method: 'POST', handler: saveRecipeHandler as ApiHandler },
  { name: 'save book', method: 'POST', handler: saveBookHandler as ApiHandler },
  { name: 'upload image', method: 'POST', handler: uploadImageHandler as ApiHandler },
];

const createRequest = ({
  method,
  authorized = false,
  body = {},
  query = {},
}: {
  method: string;
  authorized?: boolean;
  body?: unknown;
  query?: Record<string, string | string[]>;
}): NextApiRequest => ({
  method,
  body,
  query,
  headers: authorized ? { 'x-admin-secret': 'test-secret' } : {},
} as NextApiRequest);

const createResponse = () => {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
    revalidate: vi.fn().mockResolvedValue(undefined),
  };
  response.status.mockReturnValue(response);
  response.json.mockReturnValue(response);

  return response as unknown as NextApiResponse;
};

describe('admin API route guards', () => {
  beforeEach(() => {
    vi.stubEnv('ADMIN_SECRET', 'test-secret');
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  routes.forEach(({ name, method, handler }) => {
    it(`${name} rejects unsupported methods`, async () => {
      const request = createRequest({
        method: method === 'GET' ? 'POST' : 'GET',
        authorized: true,
      });
      const response = createResponse();

      await handler(request, response);

      expect(response.status).toHaveBeenCalledWith(405);
      expect(response.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
    });

    it(`${name} rejects unauthorized requests`, async () => {
      const request = createRequest({ method });
      const response = createResponse();

      await handler(request, response);

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
  });
});

describe('admin API response contracts', () => {
  beforeEach(() => {
    vi.stubEnv('ADMIN_SECRET', 'test-secret');
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('returns a signed Publit.io query', () => {
    const request = createRequest({ method: 'POST', authorized: true });
    const response = createResponse();

    publitSignatureHandler(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
      api_key: 'test-key',
      api_signature: 'signature',
    }));
  });

  it('loads Markdown scaling data without exposing a writable Notion page id', async () => {
    vi.mocked(getPostSlugs).mockReturnValueOnce(['bolognese-sauce.md']);
    const scaling = { baseServings: 1, groups: [{ title: '食材', items: [{ name: '牛絞肉', amount: 320, unit: 'g' }] }] };
    vi.mocked(getPostBySlug).mockReturnValueOnce({ slug: 'bolognese-sauce', title: '肉醬', content: '### 步驟', scaling });
    const response = createResponse();
    await recipeHandler(createRequest({ method: 'GET', authorized: true, query: { type: 'cooking', slug: 'bolognese-sauce' } }), response);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ source: 'markdown', scaling }));
  });

  it('loads original scaling for an older Notion version at the same slug', async () => {
    const scaling = { baseServings: 1, groups: [{ title: '食材', items: [{ name: '牛絞肉', amount: 320, unit: 'g' }] }] };
    vi.mocked(getRecipeBySlugForAdminFromNotion).mockResolvedValueOnce({ id: 'notion-page', type: 'cooking', slug: 'bolognese-sauce', published: true });
    vi.mocked(getPostSlugs).mockReturnValueOnce(['bolognese-sauce.md']);
    vi.mocked(getPostBySlug).mockReturnValueOnce({ slug: 'bolognese-sauce', scaling });
    const response = createResponse();
    await recipeHandler(createRequest({ method: 'GET', authorized: true, query: { type: 'cooking', slug: 'bolognese-sauce' } }), response);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'notion-page', scaling }));
  });

  it('allows an explicit Markdown import and forwards validated scaling to Notion', async () => {
    vi.mocked(getPostSlugs).mockReturnValueOnce(['bolognese-sauce.md']).mockReturnValueOnce(['bolognese-sauce.md']);
    vi.mocked(getPostBySlug).mockReturnValueOnce({ slug: 'bolognese-sauce' });
    vi.mocked(createRecipeInNotion).mockResolvedValueOnce({ id: 'notion-page', type: 'cooking', slug: 'bolognese-sauce', published: true });
    const scaling = { baseServings: 1, groups: [{ title: '食材', items: [{ name: '牛絞肉', amount: 300, unit: 'g' }] }] };
    const response = createResponse();
    await saveRecipeHandler(createRequest({ method: 'POST', authorized: true, body: {
      title: '肉醬', slug: 'bolognese-sauce', type: 'cooking', source: 'markdown', previousType: 'cooking', previousSlug: 'bolognese-sauce', contentMarkdown: '### 步驟\n1. 煮', scaling,
    } }), response);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(createRecipeInNotion).toHaveBeenCalledWith(expect.objectContaining({ scaling }));
    expect(response.revalidate).toHaveBeenCalledWith('/recipes');
  });

  it('keeps duplicate Markdown protection for ordinary creation', async () => {
    vi.mocked(getPostSlugs).mockReturnValueOnce(['bolognese-sauce.md']);
    const response = createResponse();
    await saveRecipeHandler(createRequest({ method: 'POST', authorized: true, body: {
      title: '肉醬', slug: 'bolognese-sauce', type: 'cooking', contentMarkdown: '### 步驟',
    } }), response);
    expect(response.status).toHaveBeenCalledWith(409);
    expect(createRecipeInNotion).not.toHaveBeenCalled();
  });

  it('requires type and slug when loading a recipe', async () => {
    const request = createRequest({ method: 'GET', authorized: true });
    const response = createResponse();

    await recipeHandler(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: 'Type and slug are required' });
  });

  it('reports a missing admin configuration instead of an empty list', async () => {
    vi.stubEnv('ADMIN_SECRET', '');
    const response = createResponse();
    await recipesHandler(createRequest({ method: 'GET', authorized: true }), response);
    expect(response.status).toHaveBeenCalledWith(503);
    expect(response.json).toHaveBeenCalledWith({ error: expect.stringContaining('ADMIN_SECRET') });
  });

  it('rejects invalid recipe save payloads', async () => {
    const request = createRequest({
      method: 'POST',
      authorized: true,
      body: {
        title: '',
        type: 'cooking',
        contentMarkdown: '### Steps',
      },
    });
    const response = createResponse();

    await saveRecipeHandler(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.stringContaining('請填寫食譜名稱'),
    }));
  });

  it('requires at least one revalidation path', async () => {
    const request = createRequest({ method: 'POST', authorized: true });
    const response = createResponse();

    await revalidateHandler(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: 'Paths are required' });
  });

  it('deduplicates and revalidates requested paths', async () => {
    const request = createRequest({
      method: 'POST',
      authorized: true,
      body: { paths: ['/cooking', '/cooking', '/cooking/recipe'] },
    });
    const response = createResponse();

    await revalidateHandler(request, response);

    expect(response.revalidate).toHaveBeenCalledTimes(2);
    expect(response.revalidate).toHaveBeenNthCalledWith(1, '/cooking');
    expect(response.revalidate).toHaveBeenNthCalledWith(2, '/cooking/recipe');
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      revalidated: true,
      paths: ['/cooking', '/cooking/recipe'],
    });
  });
});
