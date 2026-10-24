export type RecipeType = 'baking' | 'cooking';

export interface RecipePost {
  slug?: string;
  title?: string;
  desc?: string;
  date?: string;
  content?: string;
  ogImage?: string;
  coverImage?: string;
  gallery?: string[];
  ingredient?: string[];
  labels?: string[];
}
