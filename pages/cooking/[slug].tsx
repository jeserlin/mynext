import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import RecipePostPage from 'components/recipePostPage';
import markdownToHtml from 'lib/markdownToHtml';
import { getRecipeBySlug, getRecipesByType } from 'lib/recipes';
import type { RecipePost } from 'types/recipe';

interface RecipeParams extends ParsedUrlQuery {
  slug: string;
}

interface CookingPostProps {
  post: RecipePost;
}

const cookingMainPath = '/recipes';

const CookingPost = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => (
  <RecipePostPage
    post={post}
    mainPath={cookingMainPath}
    recipeCategory="Cooking"
    type="cooking"
  />
);

export const getStaticProps: GetStaticProps<CookingPostProps, RecipeParams> = async ({ params }) => {
  const post = await getRecipeBySlug({
    type: 'cooking',
    slug: params!.slug,
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
  }) as RecipePost;
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
};

export const getStaticPaths: GetStaticPaths<RecipeParams> = async () => {
  const posts = await getRecipesByType({
    type: 'cooking',
    fields: ['slug'],
  }) as RecipePost[];

  return {
    paths: posts.flatMap((post) => (
      post.slug ? [{ params: { slug: post.slug } }] : []
    )),
    fallback: 'blocking',
  };
};

export default CookingPost;
