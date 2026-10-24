import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

import type { PostField, PostRecord } from 'types/post';

const postDirectory = join(process.cwd(), '_posts');

const postFolderDirectory = (folder: string) => join(process.cwd(), `_posts/${folder}`);

export const getPostSlugs = (folder: string) => fs.readdirSync(postFolderDirectory(folder));

export const getPostBySlug = (
  folder: string,
  slug: string,
  fields: PostField[] = [],
): PostRecord => {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postFolderDirectory(folder), `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const items: PostRecord = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items.slug = realSlug;
    } else if (field === 'content') {
      items.content = content;
    } else if (data[field]) {
      const value = field === 'coverImage' && typeof data[field] === 'string'
        ? data[field].trim()
        : data[field];
      Object.assign(items, { [field]: value });
    }
  });

  return items;
};

interface GetPostsByFolderOptions {
  folder: string;
  fields?: PostField[];
}

export const getPostsByFolder = ({
  folder,
  fields = [],
}: GetPostsByFolderOptions): PostRecord[] => {
  const slugs = getPostSlugs(folder);

  return slugs
    .map((slug) => getPostBySlug(folder, slug, fields))
    .sort((postA, postB) => ((postA.date || '') > (postB.date || '') ? -1 : 1));
};

export const getAllPosts = (): PostRecord[] => {
  const fields: PostField[] = [
    'title',
    'date',
    'slug',
    'type',
    'coverImage',
  ];
  const folders = fs.readdirSync(postDirectory);

  return folders
    .flatMap((folder) => getPostsByFolder({ folder, fields }))
    .sort((postA, postB) => ((postA.date || '') > (postB.date || '') ? -1 : 1));
};
