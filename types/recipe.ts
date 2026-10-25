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

export interface NotionRecipe extends RecipePost {
  id: string;
  type: string;
  published: boolean;
}

export interface NotionRecipeInput {
  title: string;
  slug: string;
  type: RecipeType;
  desc: string;
  ingredient: string[];
  labels: string[];
  coverImage: string;
  gallery: string[];
  contentMarkdown: string;
  published: boolean;
  date: string;
}
