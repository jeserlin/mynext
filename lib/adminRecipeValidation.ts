import { z } from 'zod';

import type { RecipeType } from 'types/recipe';
import { recipeScalingSchema } from 'lib/recipeScalingSchema';

const maxMarkdownLength = 100000;
const maxListLines = 80;

export const allowedRecipeTypes = new Set<RecipeType>(['cooking', 'baking']);

export const slugify = (value = ''): string => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .replace(/-{2,}/g, '-');

export const parseLineList = (value = ''): string[] => value
  .split('\n')
  .map((item) => item.trim())
  .filter(Boolean);

const trimString = (maxLength: number) => z.string()
  .max(maxLength)
  .transform((value) => value.trim());

const optionalTrimString = (maxLength: number) => z.string()
  .max(maxLength)
  .default('')
  .transform((value) => value.trim());

const recipeTypeSchema = z.string()
  .transform((value) => value.trim().toLowerCase())
  .refine((value): value is RecipeType => allowedRecipeTypes.has(value as RecipeType), {
    message: '食譜類別必須是料理或烘焙',
  });

const optionalRecipeTypeSchema = z.string()
  .default('')
  .transform((value) => value.trim().toLowerCase())
  .refine((value) => !value || allowedRecipeTypes.has(value as RecipeType), {
    message: '原食譜類別必須是料理或烘焙',
  });

const isValidDate = (value: string): boolean => {
  if (!value) return true;

  const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch.map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year
      && date.getUTCMonth() === month - 1
      && date.getUTCDate() === day
    );
  }

  return !Number.isNaN(Date.parse(value));
};

const isSafeImagePath = (value: string): boolean => {
  if (!value) return true;
  if (value.startsWith('/') && !value.startsWith('//')) return true;

  try {
    const url = new URL(value.startsWith('//') ? `https:${value}` : value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

const lineListSchema = (maxLineLength: number, fieldName: string) => z.string()
  .max(maxLineLength * maxListLines)
  .default('')
  .superRefine((value, context) => {
    const lines = parseLineList(value);

    if (lines.length > maxListLines) {
      context.addIssue({
        code: 'custom',
        message: `${fieldName}最多可填寫 ${maxListLines} 行`,
      });
    }

    lines.forEach((line, index) => {
      if (line.length > maxLineLength) {
        context.addIssue({
          code: 'custom',
          message: `${fieldName}第 ${index + 1} 行過長`,
        });
      }
    });
  });

const imageLineListSchema = lineListSchema(300, '食譜照片')
  .superRefine((value, context) => {
    parseLineList(value).forEach((line, index) => {
      if (!isSafeImagePath(line)) {
        context.addIssue({
          code: 'custom',
          message: `食譜照片第 ${index + 1} 行必須是本機路徑或 http(s) 網址`,
        });
      }
    });
  });

const rawRecipeSchema = z.object({
  source: z.enum(['markdown', 'notion']).default('notion'),
  scaling: recipeScalingSchema.nullable().optional(),
  pageId: optionalTrimString(120),
  title: trimString(140).pipe(z.string().min(1, '請填寫食譜名稱')),
  slug: optionalTrimString(140),
  type: recipeTypeSchema,
  previousType: optionalRecipeTypeSchema,
  previousSlug: optionalTrimString(140).transform(slugify),
  desc: optionalTrimString(500),
  ingredients: lineListSchema(180, '材料'),
  labels: lineListSchema(80, '標籤'),
  coverImage: optionalTrimString(300).refine(isSafeImagePath, {
    message: '封面圖片必須是本機路徑或 http(s) 網址',
  }),
  gallery: imageLineListSchema,
  contentMarkdown: trimString(maxMarkdownLength).pipe(z.string().min(1, '請填寫食譜內容')),
  published: z.boolean().default(false),
  date: optionalTrimString(40).refine(isValidDate, {
    message: '請填寫有效的發布日期',
  }),
}).transform((recipe, context) => {
  const normalizedSlug = slugify(recipe.slug || recipe.title);

  if (!normalizedSlug) {
    context.addIssue({
      code: 'custom',
      message: '請填寫英文網址代稱，例如 bolognese-sauce',
      path: ['slug'],
    });
    return z.NEVER;
  }

  return {
    ...recipe,
    slug: normalizedSlug,
    date: recipe.date || new Date().toISOString(),
  };
});

export const saveRecipeSchema = rawRecipeSchema;
export type SaveRecipeInput = z.input<typeof saveRecipeSchema>;
export type SaveRecipe = z.output<typeof saveRecipeSchema>;

export const formatValidationError = (error: z.ZodError): string => (
  error.issues.map((issue) => issue.message).join('; ') || '食譜資料格式不正確'
);
