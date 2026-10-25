import type { NextApiRequest, NextApiResponse } from 'next';

import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import {
  formatValidationError,
  parseLineList,
  saveRecipeSchema,
} from 'lib/adminRecipeValidation';
import { getPostSlugs } from 'lib/api';
import { getErrorMessage } from 'lib/errors';
import {
  createRecipeInNotion,
  getRecipeBySlugForAdminFromNotion,
  recipeSlugExistsInNotion,
  updateRecipeInNotion,
} from 'lib/notion';
import type { NotionRecipe, NotionRecipeInput, RecipeType } from 'types/recipe';

interface RevalidatePathInput {
  type: RecipeType;
  slug: string;
  previousPath: string | null;
}

interface SavedRecipeResponse extends NotionRecipe {
  previousPath: string | null;
  revalidatedPaths: string[];
  revalidationError: string;
}

type SaveRecipeResponse = SavedRecipeResponse | { error: string };

const getRevalidatePaths = ({
  type,
  slug,
  previousPath,
}: RevalidatePathInput): string[] => {
  const paths = [`/${type}`, `/${type}/${slug}`];

  if (previousPath && !paths.includes(previousPath)) {
    paths.push(previousPath);
  }

  return [...new Set(paths.filter(Boolean))];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SaveRecipeResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req.headers[adminHeaderName])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const validationResult = saveRecipeSchema.safeParse(req.body || {});

    if (!validationResult.success) {
      return res.status(400).json({
        error: formatValidationError(validationResult.error),
      });
    }

    const {
      title,
      slug,
      pageId,
      type,
      previousType,
      previousSlug,
      desc,
      ingredients,
      labels,
      coverImage,
      gallery,
      contentMarkdown,
      published,
      date,
    } = validationResult.data;
    const recipeType = type as RecipeType;

    const recipePayload: NotionRecipeInput = {
      title,
      slug,
      type: recipeType,
      desc,
      ingredient: parseLineList(ingredients),
      labels: parseLineList(labels),
      coverImage,
      gallery: parseLineList(gallery),
      contentMarkdown,
      published,
      date,
    };

    let recipe: NotionRecipe;
    let previousPath: string | null = null;

    if (pageId) {
      const existingRecipe = await getRecipeBySlugForAdminFromNotion(recipeType, slug);

      if (existingRecipe && existingRecipe.id !== pageId) {
        return res.status(409).json({ error: 'Another Notion recipe already uses this slug' });
      }

      const markdownSlugExists = getPostSlugs(recipeType)
        .some((item) => item.replace(/\.md$/, '') === slug);
      if (markdownSlugExists && !(previousType === recipeType && previousSlug === slug)) {
        return res.status(409).json({ error: 'A markdown recipe with this slug already exists' });
      }

      recipe = await updateRecipeInNotion(pageId, recipePayload);
      if (previousType && previousSlug) {
        previousPath = `/${previousType}/${previousSlug}`;
      }
    } else {
      const slugExists = await recipeSlugExistsInNotion(recipeType, slug);
      if (slugExists) {
        return res.status(409).json({ error: 'A recipe with this slug already exists in Notion' });
      }

      const markdownSlugExists = getPostSlugs(recipeType)
        .some((item) => item.replace(/\.md$/, '') === slug);
      if (markdownSlugExists) {
        return res.status(409).json({ error: 'A markdown recipe with this slug already exists' });
      }

      recipe = await createRecipeInNotion(recipePayload);
    }

    const revalidatedPaths = getRevalidatePaths({
      type: recipeType,
      slug: recipe.slug || slug,
      previousPath,
    });

    let revalidationError = '';

    for (const path of revalidatedPaths) {
      try {
        await res.revalidate(path);
      } catch (error) {
        revalidationError = getErrorMessage(error, 'Revalidation failed');
        break;
      }
    }

    return res.status(200).json({
      ...recipe,
      previousPath,
      revalidatedPaths,
      revalidationError,
    });
  } catch (error) {
    return res.status(500).json({
      error: getErrorMessage(error, 'Unable to save recipe'),
    });
  }
}
