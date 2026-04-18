import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import { getRecipesForAdminFromNotion } from 'lib/notion';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req.headers[adminHeaderName])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { type = '' } = req.query || {};
    const recipes = await getRecipesForAdminFromNotion(type);

    return res.status(200).json({ recipes });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to load recipes' });
  }
}
