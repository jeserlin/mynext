import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getBookForAdminFromNotion, getBooksForAdminFromNotion, getNotionBooks, updateBookInNotion } from './notionBooks';

const databaseId = '406ea919-6e46-80aa-9958-e44b3b8a2457';
const page = { id: 'book-id', parent: { database_id: databaseId }, properties: {
  ISBN: { rich_text: [{ plain_text: '9786263143630' }] },
  Name: { title: [{ plain_text: '小鳥' }] }, Author: { rich_text: [{ plain_text: '小川洋子' }] },
  'Read Date': { date: { start: '2025-11-01' } }, Notes: { rich_text: [{ plain_text: '### 筆記\n\n  原文' }] },
} };
const fetchMock = vi.fn();
describe('Notion book storage', () => {
  beforeEach(() => {
    vi.stubEnv('NOTION_TOKEN', 'test-token'); vi.stubEnv('NOTION_BOOKS_DATABASE_ID', databaseId);
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => { vi.resetAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
  it('checks the page belongs to the books database', async () => {
    fetchMock.mockResolvedValueOnce(Response.json(page));
    expect(await getBookForAdminFromNotion('book-id')).toMatchObject({ id: 'book-id', slug: '9786263143630' });
    fetchMock.mockResolvedValueOnce(Response.json({ ...page, parent: { database_id: 'other-database' } }));
    expect(await getBookForAdminFromNotion('foreign-id')).toBeNull();
    fetchMock.mockResolvedValueOnce(Response.json({ ...page, archived: true }));
    expect(await getBookForAdminFromNotion('archived-id')).toBeNull();
  });
  it('paginates admin books and preserves raw notes', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ results: [page], has_more: true, next_cursor: 'next-page' }))
      .mockResolvedValueOnce(Response.json({ results: [], has_more: false }));
    const result = await getBooksForAdminFromNotion();
    expect(result[0].content).toBe('### 筆記\n\n  原文');
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).start_cursor).toBe('next-page');
  });
  it('splits long raw notes into valid rich text chunks on update', async () => {
    fetchMock.mockResolvedValueOnce(Response.json(page));
    const content = '### 筆記\n\n  ' + '中文`原文`\n'.repeat(600);
    await updateBookInNotion('book-id', { isbn: '9786263143630', title: '小鳥', author: '小川洋子', date: '2025-11-01', coverImage: '', content });
    const request = fetchMock.mock.calls[0][1];
    expect(request.method).toBe('PATCH');
    const properties = JSON.parse(request.body).properties;
    expect(properties.Notes.rich_text.map((item: { text: { content: string } }) => item.text.content).join('')).toBe(content);
    expect(properties.Notes.rich_text.every((item: { text: { content: string } }) => item.text.content.length <= 1900)).toBe(true);
  });
  it('keeps admin errors visible while retaining the public fallback', async () => {
    fetchMock.mockRejectedValue(new Error('offline'));
    await expect(getBooksForAdminFromNotion()).rejects.toThrow('offline');
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(await getNotionBooks()).toEqual([]);
    warning.mockRestore();
  });
});
