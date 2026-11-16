import type { NextApiRequest, NextApiResponse } from 'next';

import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import { getErrorMessage } from 'lib/errors';
import { getBooksForAdminFromNotion } from 'lib/notionBooks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.ADMIN_SECRET) return res.status(503).json({ error: '尚未設定 ADMIN_SECRET，請完成設定並重新啟動伺服器。' });
  if (!isAdminAuthorized(req.headers[adminHeaderName])) return res.status(401).json({ error: '管理密鑰不正確，請重新輸入。' });
  res.setHeader('Cache-Control', 'no-store');
  try {
    const books = await getBooksForAdminFromNotion();
    return res.status(200).json({ books: books.sort((a, b) => b.date.localeCompare(a.date)) });
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error, '無法載入書籍清單') });
  }
}
