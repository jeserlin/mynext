import { adminHeaderName, isAdminAuthorized } from 'lib/admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req.headers[adminHeaderName])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { paths = [] } = req.body || {};

    if (!Array.isArray(paths) || !paths.length) {
      return res.status(400).json({ error: 'Paths are required' });
    }

    const uniquePaths = [...new Set(paths.filter(Boolean))];

    for (const path of uniquePaths) {
      await res.revalidate(path);
    }

    return res.status(200).json({ revalidated: true, paths: uniquePaths });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Revalidation failed' });
  }
}
