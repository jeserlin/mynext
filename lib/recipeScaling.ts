import type { ScalableIngredient } from 'types/recipe';

export const parseAmount = (value: string): number | null => {
  const text = value.trim();
  if (!/^\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)?$/.test(text)) return null;
  const [numerator, denominator = 1] = text.split('/').map(Number);
  const servings = numerator / denominator;
  return Number.isFinite(servings) && servings > 0 ? servings : null;
};

export const parseServings = (value: string): number | null => {
  const servings = parseAmount(value);
  return servings !== null && servings >= 0.01 && servings <= 100 ? servings : null;
};

export const servingsFromIngredient = (value: string, originalAmount: number, baseServings: number): number | null => {
  const amount = parseAmount(value);
  if (amount === null || originalAmount <= 0 || baseServings <= 0) return null;
  const servings = (amount / originalAmount) * baseServings;
  return Number.isFinite(servings) && servings >= 0.01 && servings <= 100 ? servings : null;
};

const formatAmount = (amount: number) => new Intl.NumberFormat('zh-TW', {
  maximumSignificantDigits: 4,
  useGrouping: false,
}).format(amount);

export const scaleIngredient = (ingredient: ScalableIngredient, factor: number): string => {
  if (ingredient.amount === undefined) return ingredient.note || '';
  const amount = formatAmount(ingredient.amount * factor);
  const range = ingredient.maxAmount === undefined
    ? amount
    : `${amount}–${formatAmount(ingredient.maxAmount * factor)}`;
  return `${range}${ingredient.unit ? ` ${ingredient.unit}` : ''}${ingredient.note ? `（${ingredient.note}）` : ''}`;
};
