import { describe, expect, it } from 'vitest';

import { inheritRecipeScaling } from './recipeDefaults';

const scaling = { baseServings: 1, groups: [{ title: '食材', items: [{ name: '牛絞肉', amount: 320, unit: 'g' }] }] };

describe('legacy recipe scaling', () => {
  it('inherits original quantities for a legacy Notion recipe without duplicating its material section', () => {
    const recipe = { title: '肉醬', content: '### 材料\n- 牛絞肉 320g\n\n### 步驟\n1. 煮' };
    expect(inheritRecipeScaling(recipe, { scaling })).toEqual({ title: '肉醬', content: '### 步驟\n1. 煮', scaling });
    expect(recipe.content).toContain('### 材料');
  });

  it('preserves edited quantities and an explicit disable', () => {
    const edited = { scaling: { ...scaling, baseServings: 2 } };
    expect(inheritRecipeScaling(edited, { scaling })).toBe(edited);
    const disabled = { scalingDisabled: true, content: '### 材料\n- 牛絞肉 300g' };
    expect(inheritRecipeScaling(disabled, { scaling })).toBe(disabled);
    expect(inheritRecipeScaling({ title: '其他食譜' }, {})).toEqual({ title: '其他食譜' });
  });
});
