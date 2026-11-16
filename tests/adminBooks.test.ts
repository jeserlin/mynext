import type { NextApiRequest, NextApiResponse } from 'next';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import booksHandler from 'pages/api/admin/books';
import saveBookHandler from 'pages/api/admin/save-book';
import { bookExistsInNotion, createBookInNotion, getBookForAdminFromNotion, getBooksForAdminFromNotion, updateBookInNotion } from 'lib/notionBooks';

vi.mock('lib/api', () => ({ getPostSlugs: vi.fn(() => []) }));
vi.mock('lib/notionBooks', () => ({
  bookExistsInNotion: vi.fn(), createBookInNotion: vi.fn(),
  getBookForAdminFromNotion: vi.fn(), getBooksForAdminFromNotion: vi.fn(), updateBookInNotion: vi.fn(),
}));
const pageId = '406ea919-6e46-80aa-9958-e44b3b8a2457';
const book = { isbn: '9786263143630', title: '小鳥', author: '小川洋子', date: '2025-11-01', content: '### 筆記\n\n原始文字', coverImage: '' };
const req = (body = {}, method = 'POST', authorized = true) => ({ method, body, headers: authorized ? { 'x-admin-secret': 'secret' } : {} }) as NextApiRequest;
const res = () => {
  const result = { status: vi.fn(), json: vi.fn(), revalidate: vi.fn().mockResolvedValue(undefined), setHeader: vi.fn() };
  result.status.mockReturnValue(result);
  return result as unknown as NextApiResponse;
};

describe('book administration', () => {
  beforeEach(() => { vi.stubEnv('ADMIN_SECRET', 'secret'); vi.mocked(bookExistsInNotion).mockResolvedValue(false); });
  afterEach(() => { vi.resetAllMocks(); vi.unstubAllEnvs(); });
  it('lists books without hiding Notion failures as an empty list', async () => {
    vi.mocked(getBooksForAdminFromNotion).mockRejectedValue(new Error('Notion unavailable'));
    const response = res(); await booksHandler(req({}, 'GET'), response);
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: 'Notion unavailable' });
  });
  it('guards list authentication and HTTP method', async () => {
    for (const [method, authorized, code] of [['GET', false, 401], ['POST', true, 405]] as const) {
      const response = res(); await booksHandler(req({}, method, authorized), response);
      expect(response.status).toHaveBeenCalledWith(code);
    }
    expect(getBooksForAdminFromNotion).not.toHaveBeenCalled();
  });
  it('reports missing admin configuration', async () => {
    vi.stubEnv('ADMIN_SECRET', ''); const response = res(); await booksHandler(req({}, 'GET'), response);
    expect(response.status).toHaveBeenCalledWith(503);
  });
  it('creates a new book', async () => {
    const response = res(); await saveBookHandler(req(book), response);
    expect(createBookInNotion).toHaveBeenCalledWith(book);
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.revalidate).toHaveBeenCalledWith('/books');
  });
  it('updates the original book without treating its own ISBN as a duplicate', async () => {
    vi.mocked(getBookForAdminFromNotion).mockResolvedValue({ id: pageId, slug: book.isbn, ...book });
    const response = res(); await saveBookHandler(req({ ...book, pageId }), response);
    expect(bookExistsInNotion).not.toHaveBeenCalled();
    expect(updateBookInNotion).toHaveBeenCalledWith(pageId, book);
    expect(createBookInNotion).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it('rejects changing an ISBN to another existing book', async () => {
    vi.mocked(getBookForAdminFromNotion).mockResolvedValue({ id: pageId, slug: '9786263582309', ...book });
    vi.mocked(bookExistsInNotion).mockResolvedValue(true);
    const response = res(); await saveBookHandler(req({ ...book, pageId }), response);
    expect(response.status).toHaveBeenCalledWith(409);
    expect(updateBookInNotion).not.toHaveBeenCalled();
  });
  it('rejects missing or foreign-database pages before updating', async () => {
    vi.mocked(getBookForAdminFromNotion).mockResolvedValue(null);
    const response = res(); await saveBookHandler(req({ ...book, pageId }), response);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(updateBookInNotion).not.toHaveBeenCalled();
  });
  it('rejects invalid page IDs', async () => {
    const response = res(); await saveBookHandler(req({ ...book, pageId: '../other' }), response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(getBookForAdminFromNotion).not.toHaveBeenCalled();
  });
  it('returns a saved warning if cache refresh fails', async () => {
    const response = res(); vi.mocked(response.revalidate).mockRejectedValue(new Error('refresh failed'));
    await saveBookHandler(req(book), response);
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ refreshed: false, warning: 'refresh failed' }));
  });
});
