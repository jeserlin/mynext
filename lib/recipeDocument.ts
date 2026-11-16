import matter from 'gray-matter';

import { recipeScalingSchema } from 'lib/recipeScalingSchema';
import type { RecipeScaling } from 'types/recipe';

export const readRecipeDocument = (markdown: string): { content: string; scaling?: RecipeScaling; scalingDisabled?: boolean } => {
  const parsed = matter(markdown);
  return {
    content: parsed.content,
    ...(parsed.data.scaling === null ? { scalingDisabled: true } : {}),
    ...(parsed.data.scaling ? { scaling: recipeScalingSchema.parse(parsed.data.scaling) } : {}),
  };
};

export const writeRecipeDocument = (markdown: string, scaling?: RecipeScaling | null): string => {
  const parsed = matter(markdown);
  const data = { ...parsed.data };
  if (scaling === null) data.scaling = null;
  else if (scaling !== undefined) data.scaling = recipeScalingSchema.parse(scaling);
  return Object.keys(data).length ? matter.stringify(parsed.content, data) : parsed.content;
};
