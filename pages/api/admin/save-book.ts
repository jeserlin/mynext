import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import { getPostSlugs } from 'lib/api';
import { getErrorMessage } from 'lib/errors';
import { bookExistsInNotion, createBookInNotion } from 'lib/notionBooks';

const schema = z.object({
  isbn: z.string().trim().regex(/^(?:\d{10}|\d{13})$/, 'ISBN must be 10 or 13 digits'),
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().min(1).max(200),
  coverImage: z.union([z.literal(''), z.url().max(2000).refine((url) => /^https?:/.test(url), 'Use an HTTP(S) URL')]),
  date: z.iso.date(),
  content: z.string().max(20000),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAdminAuthorized(req.headers[adminHeaderName])) return res.status(401).json({ error: 'Unauthorized' });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid book' });

  const book = parsed.data;
  try {
    if (getPostSlugs('books').includes(`${book.isbn}.md`) || await bookExistsInNotion(book.isbn)) {
      return res.status(409).json({ error: 'A book with this ISBN already exists' });
    }
    await createBookInNotion(book);
    try {
      await res.revalidate('/books');
      return res.status(201).json({ isbn: book.isbn, refreshed: true });
    } catch (error) {
      return res.status(201).json({
        isbn: book.isbn,
        refreshed: false,
        warning: getErrorMessage(error, 'Books page refresh failed'),
      });
    }
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error, 'Unable to save book') });
  }
}
