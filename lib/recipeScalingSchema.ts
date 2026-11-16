import { z } from 'zod';

const positiveAmount = z.number({ error: '材料數量必須是有效數字' })
  .finite('材料數量必須是有限的數字').positive('材料數量必須大於零').max(1000000, '材料數量不可超過 1000000');
const ingredientSchema = z.object({
  name: z.string().trim().min(1, '請填寫材料名稱').max(180),
  amount: positiveAmount.optional(),
  maxAmount: positiveAmount.optional(),
  unit: z.string().trim().max(30).optional(),
  note: z.string().trim().max(180).optional(),
}).superRefine((item, context) => {
  if (item.amount === undefined && !item.note) {
    context.addIssue({ code: 'custom', message: `${item.name || '材料'}：請填寫數量或「適量」等文字` });
  }
  if (item.maxAmount !== undefined && (item.amount === undefined || item.maxAmount < item.amount)) {
    context.addIssue({ code: 'custom', message: `${item.name || '材料'}：範圍上限不能小於數量` });
  }
});

export const recipeScalingSchema = z.object({
  baseServings: z.number({ error: '請填寫有效的原配方份數' }).finite('原配方份數必須是有限的數字')
    .min(0.01, '原配方份數不可少於 0.01').max(100, '原配方份數不可超過 100'),
  groups: z.array(z.object({
    title: z.string().trim().min(1, '請填寫材料分組名稱').max(80),
    items: z.array(ingredientSchema).min(1, '每個分組至少需要一項材料').max(80),
  })).min(1, '至少需要一個材料分組').max(10),
}).superRefine((value, context) => {
  const items = value.groups.flatMap((group) => group.items);
  if (!items.some((item) => item.amount !== undefined && item.maxAmount === undefined)) {
    context.addIssue({ code: 'custom', message: '至少需要一項有明確數量的材料，才能依食材用量換算' });
  }
  if (items.length > 80) context.addIssue({ code: 'custom', message: '材料合計最多 80 項' });
  const names = items.map((item) => item.name);
  if (new Set(names).size !== names.length) context.addIssue({ code: 'custom', message: '材料名稱不能重複' });
  const titles = value.groups.map((group) => group.title);
  if (new Set(titles).size !== titles.length) context.addIssue({ code: 'custom', message: '分組名稱不能重複' });
});
