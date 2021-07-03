import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const postFolderDirectory = (folder) => join(process.cwd(), `_posts/${folder}`);

export function getPostSlugs(folder) {
  return fs.readdirSync(postFolderDirectory(folder));
}

export function getPostBySlug(folder, slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postFolderDirectory(folder), `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }

    if (data[field]) {
      items[field] = data[field];
    }
  });

  return items;
}

export function getPostsByFolder({ folder, fields = [] }) {
  const slugs = getPostSlugs(folder);
  const posts = slugs
    .map((slug) => getPostBySlug(folder, slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
