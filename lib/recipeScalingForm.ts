import { parseAmount, scaleIngredient } from 'lib/recipeScaling';
import { recipeScalingSchema } from 'lib/recipeScalingSchema';
import type { RecipeScaling } from 'types/recipe';

export interface IngredientDraft {
  name: string; amount: string; maxAmount: string; unit: string; note: string;
}
export interface ScalingDraft {
  baseServings: string;
  groups: Array<{ title: string; items: IngredientDraft[] }>;
}

export const emptyIngredient = (): IngredientDraft => ({ name: '', amount: '', maxAmount: '', unit: '', note: '' });
export const toScalingDraft = (scaling?: RecipeScaling): ScalingDraft => scaling ? {
  baseServings: String(scaling.baseServings),
  groups: scaling.groups.map((group) => ({
    title: group.title,
    items: group.items.map((item) => ({
      name: item.name, amount: item.amount === undefined ? '' : String(item.amount),
      maxAmount: item.maxAmount === undefined ? '' : String(item.maxAmount), unit: item.unit || '', note: item.note || '',
    })),
  })),
} : { baseServings: '1', groups: [{ title: '食材', items: [emptyIngredient()] }] };

export const fromScalingDraft = (draft: ScalingDraft): RecipeScaling => {
  const number = (value: string) => {
    const amount = parseAmount(value);
    if (amount === null) throw new Error('份量換算：請填寫大於零的有效數字或分數，例如 1/2。');
    return amount;
  };
  const result = recipeScalingSchema.safeParse({
    baseServings: number(draft.baseServings),
    groups: draft.groups.map((group) => ({
      title: group.title,
      items: group.items.map((item) => ({
        name: item.name,
        ...(item.amount.trim() ? { amount: number(item.amount) } : {}),
        ...(item.maxAmount.trim() ? { maxAmount: number(item.maxAmount) } : {}),
        unit: item.unit, note: item.note,
      })),
    })),
  });
  if (!result.success) throw new Error(`份量換算：${result.error.issues.map((issue) => issue.message).join('；')}`);
  return result.data;
};

// Replace only an explicitly named material section; keep every other section intact.
export const withoutMaterialSection = (markdown: string): string => {
  const lines = markdown.split('\n');
  const start = lines.findIndex((line) => /^(#{1,6})\s+材料\s*$/.test(line.trim()));
  if (start < 0) return markdown;
  const level = lines[start].trim().match(/^#+/)![0].length;
  const relativeEnd = lines.slice(start + 1).findIndex((line) => {
    const heading = line.match(/^(#{1,6})\s+/);
    return heading && heading[1].length <= level;
  });
  const end = relativeEnd < 0 ? lines.length : start + 1 + relativeEnd;
  return [...lines.slice(0, start), ...lines.slice(end)].join('\n').trim();
};

export const materialMarkdown = (scaling: RecipeScaling): string => [
  '### 材料',
  ...scaling.groups.map((group) => `#### ${group.title}\n\n${group.items.map((item) => `- ${item.name} ${scaleIngredient(item, 1)}`).join('\n')}`),
].join('\n\n');
