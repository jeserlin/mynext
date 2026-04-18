import { adminHeaderName, isAdminAuthorized } from 'lib/admin';
import { getPostSlugs } from 'lib/api';
import {
  createRecipeInNotion,
  getRecipeBySlugForAdminFromNotion,
  recipeSlugExistsInNotion,
  updateRecipeInNotion,
} from 'lib/notion';

const allowedTypes = new Set(['cooking', 'baking']);

const slugify = (value = '') => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .replace(/-{2,}/g, '-');

const parseLineList = (value = '') => value
  .split('\n')
  .map((item) => item.trim())
  .filter(Boolean);

const getRevalidatePaths = ({ type, slug, previousPath }) => {
  const paths = [`/${type}`, `/${type}/${slug}`];

  if (previousPath && !paths.includes(previousPath)) {
    paths.push(previousPath);
  }

  return [...new Set(paths.filter(Boolean))];
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req.headers[adminHeaderName])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const {
      title = '',
      slug = '',
      pageId = '',
      type = '',
      previousType = '',
      previousSlug = '',
      desc = '',
      ingredients = '',
      labels = '',
      coverImage = '',
      gallery = '',
      contentMarkdown = '',
      published = false,
      date = '',
    } = req.body || {};

    const normalizedType = type.trim().toLowerCase();
    const normalizedTitle = title.trim();
    const normalizedSlug = slugify(slug || title);

    if (!normalizedTitle || !normalizedSlug || !allowedTypes.has(normalizedType)) {
      return res.status(400).json({ error: 'Title, slug, and type are required' });
    }

    if (!contentMarkdown.trim()) {
      return res.status(400).json({ error: 'Markdown content is required' });
    }

    const recipePayload = {
      title: normalizedTitle,
      slug: normalizedSlug,
      type: normalizedType,
      desc: desc.trim(),
      ingredient: parseLineList(ingredients),
      labels: parseLineList(labels),
      coverImage: coverImage.trim(),
      gallery: parseLineList(gallery),
      contentMarkdown: contentMarkdown.trim(),
      published,
      date: date || new Date().toISOString(),
    };

    let recipe = null;
    let previousPath = null;

    if (pageId) {
      const existingRecipe = await getRecipeBySlugForAdminFromNotion(normalizedType, normalizedSlug);

      if (existingRecipe && existingRecipe.id !== pageId) {
        return res.status(409).json({ error: 'Another Notion recipe already uses this slug' });
      }

      const markdownSlugExists = getPostSlugs(normalizedType)
        .some((item) => item.replace(/\.md$/, '') === normalizedSlug);
      if (markdownSlugExists && !(previousType === normalizedType && previousSlug === normalizedSlug)) {
        return res.status(409).json({ error: 'A markdown recipe with this slug already exists' });
      }

      recipe = await updateRecipeInNotion(pageId, recipePayload);
      if (previousType && previousSlug) {
        previousPath = `/${previousType}/${previousSlug}`;
      }
    } else {
      const slugExists = await recipeSlugExistsInNotion(normalizedType, normalizedSlug);
      if (slugExists) {
        return res.status(409).json({ error: 'A recipe with this slug already exists in Notion' });
      }

      const markdownSlugExists = getPostSlugs(normalizedType)
        .some((item) => item.replace(/\.md$/, '') === normalizedSlug);
      if (markdownSlugExists) {
        return res.status(409).json({ error: 'A markdown recipe with this slug already exists' });
      }

      recipe = await createRecipeInNotion(recipePayload);
    }

    const revalidatedPaths = getRevalidatePaths({
      type: normalizedType,
      slug: recipe.slug,
      previousPath,
    });

    let revalidationError = '';

    for (const path of revalidatedPaths) {
      try {
        await res.revalidate(path);
      } catch (error) {
        revalidationError = error.message || 'Revalidation failed';
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
    return res.status(500).json({ error: error.message || 'Unable to save recipe' });
  }
}
