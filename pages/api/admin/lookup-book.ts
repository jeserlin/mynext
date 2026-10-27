import type { NextApiRequest, NextApiResponse } from 'next';

import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import { getErrorMessage } from 'lib/errors';

interface GoogleBooksResponse {
  items?: Array<{ volumeInfo?: { title?: string; authors?: string[]; imageLinks?: { thumbnail?: string } } }>;
}
interface OpenLibraryEdition {
  title?: string;
  authors?: Array<{ key?: string }>;
  covers?: number[];
}
interface OpenLibraryAuthor { name?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAdminAuthorized(req.headers[adminHeaderName])) return res.status(401).json({ error: 'Unauthorized' });
  const isbn = String(req.query.isbn || '').replace(/[-\s]/g, '');
  if (!/^(?:\d{10}|\d{13})$/.test(isbn)) return res.status(400).json({ error: 'Enter a 10- or 13-digit ISBN' });

  try {
    if (process.env.GOOGLE_BOOKS_API_KEY) {
      const url = new URL('https://www.googleapis.com/books/v1/volumes');
      url.searchParams.set('q', `isbn:${isbn}`);
      url.searchParams.set('maxResults', '1');
      url.searchParams.set('key', process.env.GOOGLE_BOOKS_API_KEY);
      const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (response.ok) {
        const data = await response.json() as GoogleBooksResponse;
        const info = data.items?.[0]?.volumeInfo;
        if (info?.title) return res.status(200).json({
          isbn,
          title: info.title,
          author: info.authors?.join(', ') || '',
          coverImage: info.imageLinks?.thumbnail?.replace(/^http:/, 'https:') || '',
        });
      }
    }

    const editionResponse = await fetch(`https://openlibrary.org/isbn/${isbn}.json`, {
      signal: AbortSignal.timeout(8000),
    });
    if (editionResponse.status === 404) return res.status(404).json({ error: 'No book found for this ISBN. You can enter the details manually.' });
    if (!editionResponse.ok) throw new Error(`Book lookup failed (${editionResponse.status})`);
    const edition = await editionResponse.json() as OpenLibraryEdition;
    const authors = await Promise.all((edition.authors || []).slice(0, 5).map(async ({ key }) => {
      if (!key || !/^\/authors\/OL\w+A$/.test(key)) return '';
      const authorResponse = await fetch(`https://openlibrary.org${key}.json`, { signal: AbortSignal.timeout(8000) });
      if (!authorResponse.ok) return '';
      const author = await authorResponse.json() as OpenLibraryAuthor;
      return author.name || '';
    }));
    return res.status(200).json({
      isbn,
      title: edition.title || '',
      author: authors.filter(Boolean).join(', '),
      coverImage: edition.covers?.[0] ? `https://covers.openlibrary.org/b/id/${edition.covers[0]}-M.jpg` : '',
    });
  } catch (error) {
    return res.status(502).json({ error: getErrorMessage(error, 'Unable to look up ISBN') });
  }
}
