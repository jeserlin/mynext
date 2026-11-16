import { getPostBySlug, getPostSlugs, getPostsByFolder } from 'lib/api';
import type { NotionRecipe, RecipeType } from 'types/recipe';
import type { PostField } from 'types/post';

const fields: PostField[] = ['slug', 'title', 'desc', 'date', 'coverImage', 'gallery', 'ingredient', 'labels', 'content', 'scaling'];
export const isRecipeType = (type: string): type is RecipeType => type === 'cooking' || type === 'baking';

export const getMarkdownRecipeForAdmin = (type: string, slug: string): NotionRecipe | null => {
  if (!isRecipeType(type) || !getPostSlugs(type).includes(`${slug}.md`)) return null;
  return {
    ...getPostBySlug(type, slug, fields),
    id: `markdown:${type}:${slug}`,
    source: 'markdown',
    type,
    published: true,
  };
};

export const getMarkdownRecipesForAdmin = (type: string): NotionRecipe[] => (
  (type ? (isRecipeType(type) ? [type] : []) : ['cooking', 'baking']).flatMap((folder) => (
    getPostsByFolder({ folder, fields }).map((post) => ({
      ...post,
      id: `markdown:${folder}:${post.slug}`,
      source: 'markdown' as const,
      type: folder,
      published: true,
    }))
  ))
);
