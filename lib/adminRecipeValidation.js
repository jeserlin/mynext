import { z } from 'zod';

const maxMarkdownLength = 100000;
const maxListLines = 80;

export const allowedRecipeTypes = new Set(['cooking', 'baking']);

export const slugify = (value = '') => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .replace(/-{2,}/g, '-');

export const parseLineList = (value = '') => value
  .split('\n')
  .map((item) => item.trim())
  .filter(Boolean);

const trimString = (maxLength) => z.string()
  .max(maxLength)
  .transform((value) => value.trim());

const optionalTrimString = (maxLength) => z.string()
  .max(maxLength)
  .default('')
  .transform((value) => value.trim());

const recipeTypeSchema = z.string()
  .transform((value) => value.trim().toLowerCase())
  .refine((value) => allowedRecipeTypes.has(value), {
    message: 'Type must be cooking or baking',
  });

const optionalRecipeTypeSchema = z.string()
  .default('')
  .transform((value) => value.trim().toLowerCase())
  .refine((value) => !value || allowedRecipeTypes.has(value), {
    message: 'Previous type must be cooking or baking',
  });

const isValidDate = (value) => {
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

  if (!Number.isNaN(Date.parse(value))) return true;

  return false;
};

const isSafeImagePath = (value) => {
  if (!value) return true;
  if (value.startsWith('/') && !value.startsWith('//')) return true;

  try {
    const url = new URL(value.startsWith('//') ? `https:${value}` : value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch (error) {
    return false;
  }
};

const lineListSchema = (maxLineLength, fieldName) => z.string()
  .max(maxLineLength * maxListLines)
  .default('')
  .superRefine((value, context) => {
    const lines = parseLineList(value);

    if (lines.length > maxListLines) {
      context.addIssue({
        code: 'custom',
        message: `${fieldName} can include at most ${maxListLines} lines`,
      });
    }

    lines.forEach((line, index) => {
      if (line.length > maxLineLength) {
        context.addIssue({
          code: 'custom',
          message: `${fieldName} line ${index + 1} is too long`,
        });
      }
    });
  });

const imageLineListSchema = lineListSchema(300, 'Gallery')
  .superRefine((value, context) => {
    parseLineList(value).forEach((line, index) => {
      if (!isSafeImagePath(line)) {
        context.addIssue({
          code: 'custom',
          message: `Gallery line ${index + 1} must be a local path or http(s) URL`,
        });
      }
    });
  });

const rawRecipeSchema = z.object({
  pageId: optionalTrimString(120),
  title: trimString(140).pipe(z.string().min(1, 'Title is required')),
  slug: optionalTrimString(140),
  type: recipeTypeSchema,
  previousType: optionalRecipeTypeSchema,
  previousSlug: optionalTrimString(140).transform(slugify),
  desc: optionalTrimString(500),
  ingredients: lineListSchema(180, 'Ingredients'),
  labels: lineListSchema(80, 'Labels'),
  coverImage: optionalTrimString(300).refine(isSafeImagePath, {
    message: 'Cover image must be a local path or http(s) URL',
  }),
  gallery: imageLineListSchema,
  contentMarkdown: trimString(maxMarkdownLength).pipe(z.string().min(1, 'Markdown content is required')),
  published: z.boolean().default(false),
  date: optionalTrimString(40).refine(isValidDate, {
    message: 'Date must be a valid date',
  }),
}).transform((recipe, context) => {
  const normalizedSlug = slugify(recipe.slug || recipe.title);

  if (!normalizedSlug) {
    context.addIssue({
      code: 'custom',
      message: 'Slug is required',
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

export const formatValidationError = (error) => (
  error.issues?.map((issue) => issue.message).join('; ') || 'Invalid request body'
);
