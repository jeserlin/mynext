#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');

const postsDirectory = path.join(process.cwd(), '_posts');
const markdown = new MarkdownIt();
const errors = [];
const postTypes = new Set(['baking', 'books', 'cooking', 'tech']);
const recipeTypes = new Set(['baking', 'cooking']);

const isNonEmptyTrimmedString = (value) => (
  typeof value === 'string' && value.length > 0 && value === value.trim()
);

const isValidDate = (value) => {
  if (typeof value !== 'string' || !value.trim()) return false;

  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnly) {
    const [, year, month, day] = dateOnly.map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return date.getUTCFullYear() === year
      && date.getUTCMonth() === month - 1
      && date.getUTCDate() === day;
  }

  return !Number.isNaN(Date.parse(value));
};

const validateImage = (value, file, field) => {
  if (typeof value !== 'string' || !value.trim()) {
    errors.push(`${file}: ${field} must be a non-empty string`);
    return;
  }

  if (value !== value.trim() || /[\u0000-\u001f\u007f]/.test(value)) {
    errors.push(`${file}: ${field} contains leading, trailing, or control whitespace`);
    return;
  }

  if (value.startsWith('/') && !value.startsWith('//')) {
    const publicPath = path.resolve(process.cwd(), 'public', `.${value}`);
    const publicDirectory = path.resolve(process.cwd(), 'public');

    if (!publicPath.startsWith(`${publicDirectory}${path.sep}`) || !fs.existsSync(publicPath)) {
      errors.push(`${file}: ${field} points to missing or unsafe public file ${value}`);
    }
    return;
  }

  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      errors.push(`${file}: ${field} must use http(s) or a local public path`);
    }
  } catch {
    errors.push(`${file}: ${field} must be a valid http(s) URL or local public path`);
  }
};

const validatePost = (folder, filename, slugs) => {
  const file = path.join('_posts', folder, filename);
  const slug = filename.slice(0, -'.md'.length);
  const fullPath = path.join(postsDirectory, folder, filename);
  let parsed;

  try {
    parsed = matter(fs.readFileSync(fullPath, 'utf8'));
  } catch (error) {
    errors.push(`${file}: cannot parse frontmatter (${error.message})`);
    return;
  }

  const { data, content } = parsed;

  if (!isNonEmptyTrimmedString(data.title)) {
    errors.push(`${file}: title is required and must not have surrounding whitespace`);
  }

  if (!isValidDate(data.date)) {
    errors.push(`${file}: date must be a valid date string`);
  }

  if (data.slug !== undefined && data.slug !== slug) {
    errors.push(`${file}: frontmatter slug must match filename slug "${slug}"`);
  }

  if (data.type !== undefined && data.type !== folder) {
    errors.push(`${file}: type must match its _posts/${folder} folder`);
  }

  if (folder === 'books' && !isNonEmptyTrimmedString(data.author)) {
    errors.push(`${file}: author is required and must not have surrounding whitespace`);
  }

  if (folder === 'tech' && data.type !== 'tech') {
    errors.push(`${file}: tech posts must declare type: tech`);
  }

  if (folder === 'baking' || folder === 'cooking') {
    if (!recipeTypes.has(data.type)) {
      errors.push(`${file}: recipe type must be cooking or baking`);
    }
    if (!Array.isArray(data.ingredient) || data.ingredient.length === 0
      || data.ingredient.some((item) => !isNonEmptyTrimmedString(item))) {
      errors.push(`${file}: ingredient must be a non-empty array of trimmed strings`);
    }
  }

  if (data.labels !== undefined
    && (!Array.isArray(data.labels) || data.labels.some((item) => !isNonEmptyTrimmedString(item)))) {
    errors.push(`${file}: labels must be an array of non-empty trimmed strings`);
  }

  if (data.gallery !== undefined
    && (!Array.isArray(data.gallery)
      || data.gallery.some((item) => typeof item !== 'string' || !item.trim()))) {
    errors.push(`${file}: gallery must be an array of non-empty image paths`);
  }

  validateImage(data.coverImage, file, 'coverImage');
  if (Array.isArray(data.gallery)) {
    data.gallery.forEach((image, index) => validateImage(image, file, `gallery[${index}]`));
  }

  if (slugs.has(slug)) {
    errors.push(`${file}: duplicate slug "${slug}" in _posts/${folder}`);
  } else {
    slugs.add(slug);
  }

  try {
    markdown.parse(content, {});
  } catch (error) {
    errors.push(`${file}: cannot parse Markdown (${error.message})`);
  }
};

if (!fs.existsSync(postsDirectory)) {
  console.error('Content validation failed: _posts directory does not exist');
  process.exit(1);
}

const folders = fs.readdirSync(postsDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

folders.forEach((folder) => {
  if (!postTypes.has(folder)) {
    errors.push(`_posts/${folder}: unknown post type folder`);
    return;
  }

  const folderPath = path.join(postsDirectory, folder);
  const files = fs.readdirSync(folderPath)
    .filter((filename) => filename.endsWith('.md'))
    .sort();
  const slugs = new Set();

  files.forEach((filename) => {
    if (!filename.slice(0, -'.md'.length) || filename.includes('..')) {
      errors.push(`_posts/${folder}/${filename}: filename has an invalid slug`);
      return;
    }
    validatePost(folder, filename, slugs);
  });
});

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} issue${errors.length === 1 ? '' : 's'}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const postCount = folders.reduce((count, folder) => (
  count + fs.readdirSync(path.join(postsDirectory, folder)).filter((filename) => filename.endsWith('.md')).length
), 0);

console.log(`Content validation passed for ${postCount} Markdown posts.`);
