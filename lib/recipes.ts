import { getPostBySlug, getPostsByFolder } from 'lib/api';
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
    recipeMap.set(recipe.slug, recipe);
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

  return fields.reduce<RecipePost>((selectedRecipe, field) => {
    if (recipe[field as keyof RecipePost] !== undefined) {
      Object.assign(selectedRecipe, { [field]: recipe[field as keyof RecipePost] });
    }
    return selectedRecipe;
  }, {});
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
    return selectRecipeFields(notionRecipe, fields);
  }

  return getPostBySlug(type, slug, fields) as RecipePost;
};
