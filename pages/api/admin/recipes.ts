import type { NextApiRequest, NextApiResponse } from 'next';

import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import { getErrorMessage } from 'lib/errors';
import { getRecipesForAdminFromNotion } from 'lib/notion';
import type { NotionRecipe } from 'types/recipe';

type RecipesResponse = { recipes: NotionRecipe[] } | { error: string };

const getQueryString = (value: string | string[] | undefined): string => (
  Array.isArray(value) ? value[0] || '' : value || ''
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RecipesResponse>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req.headers[adminHeaderName])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const type = getQueryString(req.query.type);
    const recipes = await getRecipesForAdminFromNotion(type);

    return res.status(200).json({ recipes });
  } catch (error) {
    return res.status(500).json({
      error: getErrorMessage(error, 'Unable to load recipes'),
    });
  }
}
