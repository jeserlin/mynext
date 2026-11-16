import { withoutMaterialSection } from 'lib/recipeScalingForm';
import type { RecipePost } from 'types/recipe';

export const inheritRecipeScaling = <Recipe extends RecipePost>(recipe: Recipe, original?: RecipePost): Recipe => {
  if (recipe.scaling || recipe.scalingDisabled || !original?.scaling) return recipe;
  return {
    ...recipe,
    scaling: original.scaling,
    ...(recipe.content !== undefined ? { content: withoutMaterialSection(recipe.content) } : {}),
  };
};
