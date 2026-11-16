import { getPostBySlug, getPostSlugs, getPostsByFolder } from 'lib/api';
import { inheritRecipeScaling } from 'lib/recipeDefaults';
import { getPublishedRecipesByType, getRecipeBySlugFromNotion } from 'lib/notion';
import type { PostField } from 'types/post';
import type { RecipePost, RecipeType } from 'types/recipe';

interface RecipeCollection {
  markdownRecipes?: RecipePost[];
  notionRecipes?: RecipePost[];
}

const mergeRecipes = ({
  markdownRecipes = [],
  notionRecipes = [],
}: RecipeCollection): RecipePost[] => {
  const recipeMap = new Map(markdownRecipes.map((recipe) => [recipe.slug, recipe]));

  notionRecipes.forEach((recipe) => {
    recipeMap.set(recipe.slug, inheritRecipeScaling(recipe, recipeMap.get(recipe.slug)));
  });

  return Array.from(recipeMap.values())
    .sort((recipeA, recipeB) => ((recipeA.date || '') > (recipeB.date || '') ? -1 : 1));
};

interface RecipeQuery {
  type: RecipeType;
  fields?: PostField[];
}

interface RecipeSlugQuery extends RecipeQuery {
  slug: string;
}

const selectRecipeFields = (recipe: RecipePost, fields: PostField[]): RecipePost => {
  if (!fields.length) return recipe;

  const selected = fields.reduce<RecipePost>((selectedRecipe, field) => {
    if (recipe[field as keyof RecipePost] !== undefined) {
      Object.assign(selectedRecipe, { [field]: recipe[field as keyof RecipePost] });
    }
    return selectedRecipe;
  }, {});
  if (fields.includes('scaling') && recipe.scalingDisabled) selected.scalingDisabled = true;
  return selected;
};

export const getRecipesByType = async ({
  type,
  fields = [],
}: RecipeQuery): Promise<RecipePost[]> => {
  const markdownRecipes = getPostsByFolder({ folder: type, fields }) as RecipePost[];
  const notionRecipes = await getPublishedRecipesByType(type) as RecipePost[];
  const filteredNotionRecipes = notionRecipes.map((recipe) => selectRecipeFields(recipe, fields));

  return mergeRecipes({ markdownRecipes, notionRecipes: filteredNotionRecipes });
};

export const getRecipeBySlug = async ({
  type,
  slug,
  fields = [],
}: RecipeSlugQuery): Promise<RecipePost> => {
  const notionRecipe = await getRecipeBySlugFromNotion(type, slug) as RecipePost | null;

  if (notionRecipe) {
    const original = (!fields.length || fields.includes('scaling')) && getPostSlugs(type).includes(`${slug}.md`)
      ? getPostBySlug(type, slug, fields.length ? fields : ['scaling']) as RecipePost
      : undefined;
    return selectRecipeFields(inheritRecipeScaling(notionRecipe, original), fields);
  }

  return getPostSlugs(type).includes(`${slug}.md`)
    ? getPostBySlug(type, slug, fields) as RecipePost
    : {};
};
