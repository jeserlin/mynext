import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ErrorPage from 'next/error';
import mermaid from 'mermaid';
import { useRouter } from 'next/router';

import SeoHeader from 'components/seoHeader';
import GoBack from 'components/goBack';
import ScrollTop from 'components/scrollTop';
import PostHeader from 'components/postHeader';
import PostContent from 'components/postContent';
import markdownToHtml from 'lib/markdownToHtml';
import { getPostBySlug, getPostsByFolder } from 'lib/api';
import { formatDate } from 'lib/convertors';
import { authorName } from 'constants/basicInfo';
import siteSeo from 'next-seo.config';

const propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    date: PropTypes.string,
    content: PropTypes.string,
  }),
};

const techMainPath = '/tech';
const siteUrl = siteSeo.openGraph.url.replace(/\/$/, '');

const TechPost = (props) => {
  const { post = {} } = props;

  useEffect(() => {
    mermaid.contentLoaded();
  });

  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <div>
      <SeoHeader
        title={`${post.title}`}
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
            <PostContent content={post.content} />
          </div>
        </div>
      </div>
      <ScrollTop {...props} />
    </div>
  );
};

export async function getStaticProps({ params }) {
  const post = getPostBySlug('tech', params.slug, [
    'title',
    'desc',
    'date',
    'slug',
    'content',
  ]);
  const content = await markdownToHtml(post.content || '');

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getPostsByFolder({
    folder: 'tech',
    fields: ['slug'],
  });

  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
}

TechPost.propTypes = propTypes;

export default TechPost;
