import { useEffect } from 'react';
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import type { ParsedUrlQuery } from 'querystring';

import GoBack from 'components/goBack';
import PostContent from 'components/postContent';
import PostHeader from 'components/postHeader';
import ScrollTop from 'components/scrollTop';
import SeoHeader from 'components/seoHeader';
import { authorName } from 'constants/basicInfo';
import { getPostBySlug, getPostsByFolder } from 'lib/api';
import { formatDate } from 'lib/convertors';
import markdownToHtml from 'lib/markdownToHtml';
import type { PostDetail, PostSummary } from 'types/post';
import siteSeo from 'next-seo.config';

interface TechPostParams extends ParsedUrlQuery {
  slug: string;
}

interface TechPostProps {
  post: PostDetail;
}

const techMainPath = '/tech';
const siteUrl = siteSeo.openGraph.url.replace(/\/$/, '');

const TechPost = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => {
  useEffect(() => {
    const renderDiagrams = async () => {
      const { default: mermaid } = await import('mermaid');
      mermaid.initialize({ startOnLoad: false });
      await mermaid.run({
        querySelector: '.mermaid',
        suppressErrors: true,
      });
    };

    void renderDiagrams();
  }, [post.slug]);

  const router = useRouter();
  if (!router.isFallback && !post.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <div>
      <SeoHeader
        title={post.title}
        description={post.desc}
        path={`/tech/${post.slug}`}
        type="article"
        publishedTime={post.date}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.desc,
          datePublished: post.date,
          dateModified: post.date,
          mainEntityOfPage: `${siteUrl}/tech/${post.slug}`,
          author: {
            '@type': 'Person',
            name: authorName,
          },
          publisher: {
            '@type': 'Organization',
            name: siteSeo.defaultTitle,
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl}/yuan.png`,
            },
          },
        }}
      />
      <GoBack path={techMainPath} />
      <div className="sm:px-10">
        <PostHeader title={post.title} />
        <div className="text-sm text-gray-500 mb-10">
          {`更新時間: ${formatDate(post.date)}`}
        </div>
        <div className="w-full">
          <div className="w-full lg:w-5/6 xl:w-2/3">
            {post.slug === 'mobile-search-ux-notes' && (
              <section className="mb-8" aria-label="Interactive mobile search demo">
                <h2 className="mb-3 text-xl font-normal text-primary-content">Try the example</h2>
                <iframe
                  title="Mobile search and browser Back demo"
                  src="/demos/mobile-search/index.html"
                  loading="lazy"
                  className="h-[520px] w-full rounded-lg border border-[#e8ddd0] bg-white"
                />
                <a
                  href="/demos/mobile-search/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-secondary underline underline-offset-4"
                >
                  Open the demo in a new tab to test your browser Back button
                </a>
              </section>
            )}
            <PostContent content={post.content} />
          </div>
        </div>
      </div>
      <ScrollTop />
    </div>
  );
};

export const getStaticProps: GetStaticProps<TechPostProps, TechPostParams> = async ({ params }) => {
  const post = getPostBySlug('tech', params!.slug, [
    'title',
    'desc',
    'date',
    'slug',
    'content',
  ]) as PostDetail;
  const content = await markdownToHtml(post.content || '');

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths<TechPostParams> = async () => {
  const posts = getPostsByFolder({
    folder: 'tech',
    fields: ['slug'],
  }) as PostSummary[];

  return {
    paths: posts.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
};

export default TechPost;
