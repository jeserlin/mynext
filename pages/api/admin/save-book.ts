import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import { getPostSlugs } from 'lib/api';
import { getErrorMessage } from 'lib/errors';
import { bookExistsInNotion, createBookInNotion, getBookForAdminFromNotion, updateBookInNotion } from 'lib/notionBooks';

const schema = z.object({
  pageId: z.uuid().optional(),
  isbn: z.string().trim().regex(/^(?:\d{10}|\d{13})$/, 'ISBN 必須為 10 或 13 位數字'),
  title: z.string().trim().min(1, '請填寫書名').max(200, '書名不可超過 200 字'),
  author: z.string().trim().min(1, '請填寫作者').max(200, '作者不可超過 200 字'),
  coverImage: z.union([z.literal(''), z.url().max(2000).refine((url) => /^https?:/.test(url), '封面連結請使用 HTTP(S) 網址')]),
  date: z.iso.date({ error: '請填寫有效的閱讀日期' }),
  content: z.string().max(20000),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAdminAuthorized(req.headers[adminHeaderName])) return res.status(401).json({ error: 'Unauthorized' });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || '書籍資料格式不正確' });

  const { pageId, ...book } = parsed.data;
  try {
    const existingBook = pageId ? await getBookForAdminFromNotion(pageId) : null;
    if (pageId && !existingBook) return res.status(404).json({ error: '找不到此書籍，請重新載入清單。' });
    if (getPostSlugs('books').includes(`${book.isbn}.md`)
      || (existingBook?.slug !== book.isbn && await bookExistsInNotion(book.isbn))) {
      return res.status(409).json({ error: '已有相同 ISBN 的書籍，請從現有書籍載入後編輯。' });
    }
    if (pageId) await updateBookInNotion(pageId, book);
    else await createBookInNotion(book);
    const status = pageId ? 200 : 201;
    try {
      await res.revalidate('/books');
      return res.status(status).json({ isbn: book.isbn, refreshed: true });
    } catch (error) {
      return res.status(status).json({
        isbn: book.isbn,
        refreshed: false,
        warning: getErrorMessage(error, 'Books page refresh failed'),
      });
    }
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error, '無法儲存書籍') });
  }
}
