import ErrorPage from 'next/error';
import { useRouter } from 'next/router';

import SeoHeader from 'components/seoHeader';
import GoBack from 'components/goBack';
import ScrollTop from 'components/scrollTop';
import PostHeader from 'components/postHeader';
import PostContent from 'components/postContent';
import RecipeGallery from 'components/recipeGallery';
import { authorName } from 'constants/basicInfo';
import type { RecipePost, RecipeType } from 'types/recipe';
import siteSeo from 'next-seo.config';

export interface RecipePostPageProps {
  mainPath: string;
  post?: RecipePost;
  recipeCategory: string;
  type: RecipeType;
}

const siteUrl = siteSeo.openGraph.url.replace(/\/$/, '');

const RecipePostPage = ({
  mainPath,
  post = {},
  recipeCategory,
  type,
}: RecipePostPageProps) => {
  const router = useRouter();

  if (!router.isFallback && !post.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <div>
      <SeoHeader
        title={post.title}
        description={post.desc}
        image={post.coverImage}
        path={`/${type}/${post.slug}`}
        type="article"
        publishedTime={post.date}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Recipe',
          name: post.title,
          description: post.desc,
          image: post.coverImage ? [`${siteUrl}${post.coverImage}`] : undefined,
          datePublished: post.date,
          author: {
            '@type': 'Person',
            name: authorName,
          },
          recipeCategory,
          recipeIngredient: post.ingredient || [],
        }}
      />
      <GoBack path={mainPath} />
      <div className="sm:px-10">
        <PostHeader title={post.title} />
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3 order-2 md:order-1">
            <PostContent content={post.content} />
          </div>
          <div className="w-full md:w-1/3 order-1 md:order-2">
            <RecipeGallery title={post.title || ''} coverImage={post.coverImage} gallery={post.gallery} />
          </div>
        </div>
      </div>
      <ScrollTop />
    </div>
  );
};

export default RecipePostPage;
