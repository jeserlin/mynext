import type { BookPost } from 'types/book';

const notionVersion = '2022-06-28';

interface RichText { plain_text?: string }
interface NotionBookPage {
  id: string;
  properties?: Record<string, {
    title?: RichText[];
    rich_text?: RichText[];
    url?: string | null;
    date?: { start?: string } | null;
  }>;
}
interface QueryResponse { results?: NotionBookPage[]; has_more?: boolean; next_cursor?: string | null }

export interface NewBook {
  isbn: string;
  title: string;
  author: string;
  coverImage: string;
  date: string;
  content: string;
}

const configured = () => Boolean(process.env.NOTION_TOKEN && process.env.NOTION_BOOKS_DATABASE_ID);
const plainText = (value: RichText[] = []) => value.map((item) => item.plain_text || '').join('');
const richText = (value: string) => Array.from({ length: Math.ceil(value.length / 1900) }, (_, index) => ({
  type: 'text' as const,
  text: { content: value.slice(index * 1900, (index + 1) * 1900) },
}));

const request = async <Result>(path: string, options: RequestInit = {}): Promise<Result> => {
  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': notionVersion,
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error(`Notion request failed (${response.status}): ${await response.text()}`);
  return response.json() as Promise<Result>;
};

const fromPage = (page: NotionBookPage): BookPost => ({
  slug: plainText(page.properties?.ISBN?.rich_text),
  title: plainText(page.properties?.Name?.title),
  author: plainText(page.properties?.Author?.rich_text),
  coverImage: page.properties?.['Cover Image']?.url || '',
  date: page.properties?.['Read Date']?.date?.start || '',
  content: plainText(page.properties?.Notes?.rich_text),
});

export const getNotionBooks = async (): Promise<BookPost[]> => {
  if (!configured()) return [];
  try {
    const books: BookPost[] = [];
    let cursor: string | undefined;
    do {
      const data = await request<QueryResponse>(`/databases/${process.env.NOTION_BOOKS_DATABASE_ID}/query`, {
        method: 'POST',
        body: JSON.stringify({
          page_size: 100,
          ...(cursor ? { start_cursor: cursor } : {}),
        }),
      });
      books.push(...(data.results || []).map(fromPage));
      cursor = data.has_more ? data.next_cursor || undefined : undefined;
    } while (cursor);
    return books.filter((book) => book.slug && book.title && book.author && book.date);
  } catch (error) {
    console.warn('Notion books read fallback:', error);
    return [];
  }
};

export const bookExistsInNotion = async (isbn: string): Promise<boolean> => {
  if (!configured()) throw new Error('Notion books database is not configured');
  const data = await request<QueryResponse>(`/databases/${process.env.NOTION_BOOKS_DATABASE_ID}/query`, {
    method: 'POST',
    body: JSON.stringify({ filter: { property: 'ISBN', rich_text: { equals: isbn } }, page_size: 1 }),
  });
  return Boolean(data.results?.length);
};

export const createBookInNotion = async (book: NewBook): Promise<BookPost> => {
  if (!configured()) throw new Error('Notion books database is not configured');
  const page = await request<NotionBookPage>('/pages', {
    method: 'POST',
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_BOOKS_DATABASE_ID },
      properties: {
        Name: { title: richText(book.title) },
        ISBN: { rich_text: richText(book.isbn) },
        Author: { rich_text: richText(book.author) },
        'Cover Image': { url: book.coverImage || null },
        'Read Date': { date: { start: book.date } },
        Notes: { rich_text: richText(book.content) },
      },
    }),
  });
  return fromPage(page);
};
