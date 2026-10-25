import type { NextApiRequest, NextApiResponse } from 'next';

import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import { getErrorMessage } from 'lib/errors';
import { getRecipeBySlugForAdminFromNotion } from 'lib/notion';
import type { NotionRecipe } from 'types/recipe';

type RecipeResponse = NotionRecipe | { error: string };

const getQueryString = (value: string | string[] | undefined): string => (
  Array.isArray(value) ? value[0] || '' : value || ''
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RecipeResponse>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req.headers[adminHeaderName])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const type = getQueryString(req.query.type);
    const slug = getQueryString(req.query.slug);

    if (!type || !slug) {
      return res.status(400).json({ error: 'Type and slug are required' });
    }

    const recipe = await getRecipeBySlugForAdminFromNotion(type, slug);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found in Notion' });
    }

    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json({
      error: getErrorMessage(error, 'Unable to load recipe'),
    });
  }
}
