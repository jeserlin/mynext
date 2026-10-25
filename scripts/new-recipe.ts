#!/usr/bin/env node

const { existsSync, writeFileSync } = require('node:fs');
const path = require('node:path');

type RecipeFolder = 'cooking' | 'baking';

const VALID_FOLDERS = new Set<RecipeFolder>(['cooking', 'baking']);

const isRecipeFolder = (value: string | undefined): value is RecipeFolder => (
  typeof value === 'string' && VALID_FOLDERS.has(value as RecipeFolder)
);

const [, , folderArg, ...titleParts] = process.argv;
const title = titleParts.join(' ').trim();

if (!isRecipeFolder(folderArg) || !title) {
  console.error('Usage: npm run new-recipe -- <cooking|baking> "<recipe title>"');
  process.exit(1);
}

const slugify = (value: string) => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .replace(/-{2,}/g, '-');

const slug = slugify(title) || `recipe-${Date.now()}`;
const postsDir = path.join(process.cwd(), '_posts', folderArg);
const filePath = path.join(postsDir, `${slug}.md`);

if (existsSync(filePath)) {
  console.error(`Recipe already exists: ${filePath}`);
  process.exit(1);
}

const imagePath = `/assets/posts/${folderArg}/${slug}.png`;
const today = new Date().toISOString();

const template = `---
title: '${title}'
desc: '${title}'
type: '${folderArg}'
coverImage: '${imagePath}'
date: '${today}'
ingredient: [
  '食材1',
  '食材2'
]
labels: [
  'others'
]
gallery: [
]
---

### 材料

#### 食材

- 食材1 \`適量\`
- 食材2 \`適量\`

#### 調味料

- 調味料1 \`適量\`

### 步驟

1. 第一步
2. 第二步
`;

writeFileSync(filePath, template, 'utf8');

console.log(`Created ${filePath}`);
console.log(`Suggested cover image path: public${imagePath}`);
