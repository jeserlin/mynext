import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import { getRecipeBySlugForAdminFromNotion } from 'lib/notion';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req.headers[adminHeaderName])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { type = '', slug = '' } = req.query || {};

    if (!type || !slug) {
      return res.status(400).json({ error: 'Type and slug are required' });
    }

    const recipe = await getRecipeBySlugForAdminFromNotion(type, slug);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found in Notion' });
    }

    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to load recipe' });
  }
}
