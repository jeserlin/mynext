import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import SeoHeader from 'components/seoHeader';
import GoBack from 'components/goBack';
import ScrollTop from 'components/scrollTop';
import PostHeader from 'components/postHeader';
import PostContent from 'components/postContent';
import markdownToHtml from 'lib/markdownToHtml';
import { getPostBySlug, getPostsByFolder } from 'lib/api';
import { authorName } from 'constants/basicInfo';
import siteSeo from 'next-seo.config';

const propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    content: PropTypes.string,
    coverImage: PropTypes.string,
    gallery: PropTypes.arrayOf(PropTypes.string),
    ingredient: PropTypes.arrayOf(PropTypes.string),
  }),
};

const cookingMainPath = '/cooking';
const siteUrl = siteSeo.openGraph.url.replace(/\/$/, '');
const CookingPost = (props) => {
  const { post = {} } = props;
  const [loadedImgs, setLoadedImgs] = useState({});

  const handleImageLoad = (image) => {
    setLoadedImgs((prev) => ({ ...prev, [image]: true }));
  };

  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  const images = post.gallery && post.gallery.length > 0
    ? [post.coverImage, ...post.gallery]
    : post.coverImage ? [post.coverImage] : [];
  const hasGallery = images.length > 0;

  return (
    <div>
      <SeoHeader
        title={`${post.title}`}
        description={post.desc}
        image={post.coverImage}
        path={`/cooking/${post.slug}`}
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
          recipeCategory: 'Cooking',
          recipeIngredient: post.ingredient || [],
        }}
      />
      <GoBack path={cookingMainPath} />
      <div className="sm:px-10">
        <PostHeader title={post.title} />
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3 order-2 md:order-1">
            <PostContent content={post.content} />
          </div>
          <div className="w-full md:w-1/3 order-1 md:order-2">
            {hasGallery && images.length === 1 ? (
              <div className="relative">
                {!loadedImgs[images[0]] && (
                  <div className="absolute inset-0 skeleton rounded-3xl" />
                )}
                <LazyLoadImage
                  className="rounded-3xl w-full h-auto"
                  src={images[0]}
                  alt={post.title}
                  onLoad={() => handleImageLoad(images[0])}
                />
              </div>
            ) : hasGallery && images.length > 1 ? (
              <div className="carousel w-full rounded-box group">
                {images.map((image, index) => {
                  const prevIndex = index === 0 ? images.length - 1 : index - 1;
                  const nextIndex = index === images.length - 1 ? 0 : index + 1;

                  return (
                    <div key={index} id={`slide${index}`} className="carousel-item relative w-full">
                      {!loadedImgs[image] && (
                        <div className="absolute inset-0 skeleton rounded-box" />
                      )}
                      <LazyLoadImage
                        className="w-full rounded-box"
                        src={image}
                        alt={`${post.title} - ${index + 1}`}
                        onLoad={() => handleImageLoad(image)}
                      />
                      <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={`#slide${prevIndex}`}
                          className="btn btn-circle"
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(`slide${prevIndex}`)?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'nearest',
                              inline: 'start'
                            });
                          }}
                        >
                          <ChevronLeft size={24} />
                        </a>
                        <a
                          href={`#slide${nextIndex}`}
                          className="btn btn-circle"
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(`slide${nextIndex}`)?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'nearest',
                              inline: 'start'
                            });
                          }}
                        >
                          <ChevronRight size={24} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <ScrollTop {...props} />
    </div>
  );
};

export async function getStaticProps({ params }) {
  const post = getPostBySlug('cooking', params.slug, [
    'title',
    'desc',
    'date',
    'slug',
    'content',
    'ogImage',
    'coverImage',
    'gallery',
    'ingredient',
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
    folder: 'cooking',
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

CookingPost.propTypes = propTypes;

export default CookingPost;
