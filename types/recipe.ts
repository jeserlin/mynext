import type { PostSummary } from 'types/post';

export type RecipeType = 'baking' | 'cooking';

export interface ScalableIngredient {
  name: string;
  amount?: number;
  maxAmount?: number;
  unit?: string;
  note?: string;
}

export interface RecipeScaling {
  baseServings: number;
  groups: Array<{ title: string; items: ScalableIngredient[] }>;
}

export interface RecipeSummary extends PostSummary {
  ingredient: string[];
  labels?: string[];
}

export interface RecipePost {
  scalingDisabled?: boolean;
  scaling?: RecipeScaling;
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
  source?: 'markdown' | 'notion';
  id: string;
  type: string;
  published: boolean;
}

export interface NotionRecipeInput {
  scaling?: RecipeScaling | null;
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
