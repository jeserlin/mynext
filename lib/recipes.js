import { getPostBySlug, getPostsByFolder } from 'lib/api';
import { getPublishedRecipesByType, getRecipeBySlugFromNotion } from 'lib/notion';

const mergeRecipes = ({ markdownRecipes = [], notionRecipes = [] }) => {
  const recipeMap = new Map(markdownRecipes.map((recipe) => [recipe.slug, recipe]));

  notionRecipes.forEach((recipe) => {
    recipeMap.set(recipe.slug, recipe);
  });

  return Array.from(recipeMap.values())
    .sort((recipeA, recipeB) => (recipeA.date > recipeB.date ? -1 : 1));
};

export const getRecipesByType = async ({ type, fields = [] }) => {
  const markdownRecipes = getPostsByFolder({ folder: type, fields });
  const notionRecipes = await getPublishedRecipesByType(type);

  const filteredNotionRecipes = notionRecipes.map((recipe) => {
    if (!fields.length) {
      return recipe;
    }

    return fields.reduce((acc, field) => {
      if (recipe[field] !== undefined) {
        acc[field] = recipe[field];
      }
      return acc;
    }, {});
  });

  return mergeRecipes({ markdownRecipes, notionRecipes: filteredNotionRecipes });
};

export const getRecipeBySlug = async ({ type, slug, fields = [] }) => {
  const notionRecipe = await getRecipeBySlugFromNotion(type, slug);

  if (notionRecipe) {
    if (!fields.length) {
      return notionRecipe;
    }

    return fields.reduce((acc, field) => {
      if (field === 'slug') {
        acc.slug = notionRecipe.slug;
      } else if (notionRecipe[field] !== undefined) {
        acc[field] = notionRecipe[field];
      }
      return acc;
    }, {});
  }

  return getPostBySlug(type, slug, fields);
};
