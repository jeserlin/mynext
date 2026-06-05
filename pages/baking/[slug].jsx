import React from 'react';
import markdownToHtml from 'lib/markdownToHtml';
import { getRecipeBySlug, getRecipesByType } from 'lib/recipes';
import RecipePostPage from 'components/recipePostPage';

const bakingMainPath = '/baking';

const BakingPost = (props) => (
  <RecipePostPage
    {...props}
    mainPath={bakingMainPath}
    recipeCategory="Baking"
    type="baking"
  />
);

export async function getStaticProps({ params }) {
  const post = await getRecipeBySlug({
    type: 'baking',
    slug: params.slug,
    fields: [
    'title',
    'desc',
    'date',
    'slug',
    'content',
    'ogImage',
    'coverImage',
    'gallery',
    'ingredient',
  ],
  });
  const content = await markdownToHtml(post.content || '');

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const posts = await getRecipesByType({
    type: 'baking',
    fields: ['slug'],
  });

  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: 'blocking',
  };
}

export default BakingPost;
