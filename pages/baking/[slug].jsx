import React from 'react';
import PropTypes from 'prop-types';
import ErrorPage from 'next/error';
import Image from 'next/image';
import { useRouter } from 'next/router';

import SeoHeader from 'components/seoHeader';
import GoBack from 'components/goBack';
import ScrollTop from 'components/scrollTop';
import PostHeader from 'components/postHeader';
import PostContent from 'components/postContent';
import markdownToHtml from 'lib/markdownToHtml';
import { getPostBySlug, getPostsByFolder } from 'lib/api';

const propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    content: PropTypes.string,
    coverImage: PropTypes.string,
  }),
};

const bakingMainPath = '/baking';
const BakingPost = (props) => {
  const { post = {} } = props;

  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <div>
      <SeoHeader
        title={`${post.title}`}
        description={post.desc}
      />
      <GoBack path={bakingMainPath} />
      <div className="sm:px-10">
        <PostHeader title={post.title} />
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3 order-2 md:order-1">
            <PostContent content={post.content} />
          </div>
          <div className="w-full md:w-1/3 order-1 md:order-2">
            {post.coverImage && (
              <Image
                src={post.coverImage}
                alt={post.title}
                width={800}
                height={800}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="rounded-3xl w-full h-auto"
              />
            )}
          </div>
        </div>
      </div>
      <ScrollTop {...props} />
    </div>
  );
};

export async function getStaticProps({ params }) {
  const post = getPostBySlug('baking', params.slug, [
    'title',
    'desc',
    'date',
    'slug',
    'content',
    'ogImage',
    'coverImage',
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
    folder: 'baking',
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

BakingPost.propTypes = propTypes;

export default BakingPost;
