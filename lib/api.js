import _ from 'lodash';
import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const postDirectory = join(process.cwd(), '_posts');

const postFolderDirectory = (folder) => join(process.cwd(), `_posts/${folder}`);

export const getPostSlugs = (folder) => fs.readdirSync(postFolderDirectory(folder));

export const getPostBySlug = (folder, slug, fields = []) => {
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
};

export const getPostsByFolder = ({ folder, fields = [] }) => {
  const slugs = getPostSlugs(folder);
  const posts = slugs
    .map((slug) => getPostBySlug(folder, slug, fields))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
};

export const getAllPosts = () => {
  const fields = [
    'title',
    'date',
    'slug',
    'type',
    'coverImage',
  ];
  const folders = fs.readdirSync(postDirectory);
  const posts = folders
    .map((folder) => getPostsByFolder({ folder, fields }))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return _.flatten(posts);
};
