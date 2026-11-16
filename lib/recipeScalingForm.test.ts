import { describe, expect, it } from 'vitest';

import { fromScalingDraft, materialMarkdown, toScalingDraft, withoutMaterialSection } from './recipeScalingForm';

describe('scaling editor', () => {
  it('accepts fractional amounts, ranges, and qualitative notes without losing loaded values', () => {
    const draft = toScalingDraft({ baseServings: 2, groups: [{ title: '調味料', items: [
      { name: '糖', amount: 0.5, unit: '湯匙' }, { name: '蒜頭', amount: 3, maxAmount: 4, unit: '個' }, { name: '鹽', note: '適量' },
    ] }] });
    draft.groups[0].items[0].amount = '1/2';
    const saved = fromScalingDraft(draft);
    expect(saved.groups[0].items[0].amount).toBe(0.5);
    expect(saved.groups[0].items[1].maxAmount).toBe(4);
    expect(saved.groups[0].items[2].note).toBe('適量');
    expect(materialMarkdown(saved)).toContain('蒜頭 3–4 個');
  });

  it('rejects invalid base servings and reversed ranges', () => {
    const draft = toScalingDraft();
    expect(() => fromScalingDraft(draft)).toThrow();
    draft.groups[0].items[0] = { name: '蒜', amount: '4', maxAmount: '3', unit: '顆', note: '' };
    expect(() => fromScalingDraft(draft)).toThrow('上限');
  });

  it('removes only the material section and keeps steps and later notes', () => {
    expect(withoutMaterialSection('前言\n\n### 材料\n#### 食材\n- 舊材料\n\n### 步驟\n1. 煮\n### 備註\n冷藏')).toBe('前言\n\n### 步驟\n1. 煮\n### 備註\n冷藏');
    expect(withoutMaterialSection('### 步驟\n1. 煮')).toBe('### 步驟\n1. 煮');
  });
});
