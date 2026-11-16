import type { NextApiRequest, NextApiResponse } from 'next';

import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import { getErrorMessage } from 'lib/errors';
import { getRecipesForAdminFromNotion } from 'lib/notion';
import { getMarkdownRecipesForAdmin, isRecipeType } from 'lib/adminRecipes';
import { inheritRecipeScaling } from 'lib/recipeDefaults';
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

  if (!process.env.ADMIN_SECRET) {
    return res.status(503).json({ error: '本機尚未設定管理密鑰（ADMIN_SECRET），請完成設定並重新啟動開發伺服器。' });
  }

  if (!isAdminAuthorized(req.headers[adminHeaderName])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const type = getQueryString(req.query.type);
    if (type && !isRecipeType(type)) return res.status(400).json({ error: 'Invalid recipe type' });
    const notionRecipes = await getRecipesForAdminFromNotion(type);
    const recipesByPath = new Map(getMarkdownRecipesForAdmin(type).map((recipe) => [`${recipe.type}/${recipe.slug}`, recipe]));
    notionRecipes.forEach((recipe) => {
      const path = `${recipe.type}/${recipe.slug}`;
      recipesByPath.set(path, { ...inheritRecipeScaling(recipe, recipesByPath.get(path)), source: 'notion' });
    });
    const recipes = Array.from(recipesByPath.values());

    return res.status(200).json({ recipes });
  } catch (error) {
    return res.status(500).json({
      error: getErrorMessage(error, 'Unable to load recipes'),
    });
  }
}
