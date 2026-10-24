import type { PostSummary } from 'types/post';

export type RecipeType = 'baking' | 'cooking';

export interface RecipeSummary extends PostSummary {
  ingredient: string[];
  labels?: string[];
}

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
