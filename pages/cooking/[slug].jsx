import React from 'react';
import markdownToHtml from 'lib/markdownToHtml';
import { getRecipeBySlug, getRecipesByType } from 'lib/recipes';
import RecipePostPage from 'components/recipePostPage';

const cookingMainPath = '/cooking';

const CookingPost = (props) => (
  <RecipePostPage
    {...props}
    mainPath={cookingMainPath}
    recipeCategory="Cooking"
    type="cooking"
  />
);

export async function getStaticProps({ params }) {
  const post = await getRecipeBySlug({
    type: 'cooking',
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
    type: 'cooking',
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

export default CookingPost;
