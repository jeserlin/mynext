import { describe, expect, it } from 'vitest';

import {
  parseLineList,
  saveRecipeSchema,
  slugify,
} from './adminRecipeValidation';

const validRecipe = {
  title: 'Crème Brûlée',
  type: 'cooking',
  contentMarkdown: '### Steps\n\n1. Cook',
};

describe('recipe validation', () => {
  it('normalizes recipe slugs and types', () => {
    const recipe = saveRecipeSchema.parse({
      ...validRecipe,
      type: ' Cooking ',
    });

    expect(recipe.slug).toBe('creme-brulee');
    expect(recipe.type).toBe('cooking');
  });

  it('rejects unsafe image protocols', () => {
    const result = saveRecipeSchema.safeParse({
      ...validRecipe,
      coverImage: 'javascript:alert(1)',
    });

    expect(result.success).toBe(false);
  });

  it('rejects impossible calendar dates', () => {
    const result = saveRecipeSchema.safeParse({
      ...validRecipe,
      date: '2025-02-30',
    });

    expect(result.success).toBe(false);
  });

  it('rejects lists containing more than 80 entries', () => {
    const result = saveRecipeSchema.safeParse({
      ...validRecipe,
      ingredients: Array.from({ length: 81 }, (_, index) => `Ingredient ${index}`).join('\n'),
    });

    expect(result.success).toBe(false);
  });
});

describe('recipe text helpers', () => {
  it('creates URL-safe slugs', () => {
    expect(slugify('  Crème brûlée & Coffee  ')).toBe('creme-brulee-coffee');
  });

  it('trims list items and removes blank lines', () => {
    expect(parseLineList(' apples \n\n pears\n ')).toEqual(['apples', 'pears']);
  });
});
