import { describe, expect, it } from 'vitest';

import { parseServings, scaleIngredient, servingsFromIngredient } from './recipeScaling';

describe('recipe scaling', () => {
  it('scales a recipe from the available ingredient against its original amount', () => {
    const servings = servingsFromIngredient('300', 320, 1);
    expect(servings).toBe(0.9375);
    expect(scaleIngredient({ name: '豬絞肉', amount: 500, unit: 'g' }, servings!)).toBe('468.8 g');
    expect(scaleIngredient({ name: '番茄罐頭', amount: 400, unit: 'g' }, servings!)).toBe('375 g');
    expect(servingsFromIngredient('300', 320, 4)).toBe(3.75);
    expect(servingsFromIngredient('1/2', 2, 1)).toBe(0.25);
    for (const value of ['', '0', '-300', '1/0', 'abc', '32001']) {
      expect(servingsFromIngredient(value, 320, 1)).toBeNull();
    }
    expect(servingsFromIngredient('300', 0, 1)).toBeNull();
  });

  it('accepts decimals and fractions and rejects invalid servings', () => {
    expect(parseServings('0.5')).toBe(0.5);
    expect(parseServings(' 1 / 2 ')).toBe(0.5);
    for (const value of ['', '0', '-1', '1/0', 'abc', '101', '0.001']) {
      expect(parseServings(value)).toBeNull();
    }
  });

  it('scales quantities and ranges while preserving the original recipe', () => {
    const beef = { name: '牛絞肉', amount: 320, unit: 'g' };
    expect(scaleIngredient(beef, 2)).toBe('640 g');
    expect(scaleIngredient(beef, 0.5)).toBe('160 g');
    expect(scaleIngredient(beef, 1)).toBe('320 g');
    expect(beef.amount).toBe(320);
    expect(scaleIngredient({ name: '蒜頭', amount: 3, maxAmount: 4, unit: '個' }, 0.5)).toBe('1.5–2 個');
  });

  it('keeps qualitative amounts and does not round tiny quantities to zero', () => {
    expect(scaleIngredient({ name: '鹽', note: '適量' }, 3)).toBe('適量');
    expect(scaleIngredient({ name: '香料', amount: 0.001, unit: 'g' }, 0.01)).toBe('0.00001 g');
    expect(scaleIngredient({ name: '雞蛋', amount: 1, unit: '顆' }, 0.5)).toBe('0.5 顆');
  });
});
