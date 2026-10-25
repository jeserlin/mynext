import type { NextApiRequest, NextApiResponse } from 'next';

import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import { getErrorMessage } from 'lib/errors';

type RevalidateResponse =
  | { revalidated: true; paths: string[] }
  | { error: string };

const isStringArray = (value: unknown): value is string[] => (
  Array.isArray(value) && value.every((item) => typeof item === 'string')
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RevalidateResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req.headers[adminHeaderName])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const paths: unknown = req.body?.paths;

    if (!isStringArray(paths) || !paths.length) {
      return res.status(400).json({ error: 'Paths are required' });
    }

    const uniquePaths = [...new Set(paths.filter(Boolean))];

    for (const path of uniquePaths) {
      await res.revalidate(path);
    }

    return res.status(200).json({ revalidated: true, paths: uniquePaths });
  } catch (error) {
    return res.status(500).json({
      error: getErrorMessage(error, 'Revalidation failed'),
    });
  }
}
