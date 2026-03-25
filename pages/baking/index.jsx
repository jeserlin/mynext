import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import SeoHeader from 'components/seoHeader';
import { getPostsByFolder } from 'lib/api';

const propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    coverImage: PropTypes.string,
  })),
};

const Baking = ({ posts = [] }) => {
  const [loadedImgs, setLoadedImgs] = useState({});

  const handleImageLoad = (coverImage) => {
    setLoadedImgs((prev) => ({ ...prev, [coverImage]: true }));
  };

  return (
  <div>
    <SeoHeader
      title="Baking"
      description="All about baking"
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map(({
        slug, title, coverImage, ingredient,
      }) => (
        <Link key={slug} href={`/baking/${slug}`}>
          <div className="flex w-full cursor-pointer">
            <div className="w-1/4 relative">
              {coverImage && (
                <>
                  {!loadedImgs[coverImage] && (
                    <div className="absolute inset-0 skeleton rounded-lg" />
                  )}
                  <LazyLoadImage
                    className="rounded-lg w-full h-auto"
                    src={coverImage}
                    alt={title}
                    onLoad={() => handleImageLoad(coverImage)}
                  />
                </>
              )}
            </div>
            <div className="flex flex-col items-start transition-shadow  w-3/4 ml-4 p-4 rounded-lg bg-custom-light duration-300 hover:shadow-lg">
              <div className="font-semibold text-text-primary mb-4">
                {title}
              </div>
              <div className="text-sm text-text-primary">
                {`食材: ${ingredient.join(', ')}`}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
  );
};

export async function getStaticProps() {
  const posts = getPostsByFolder({
    folder: 'baking',
    fields: ['slug', 'date', 'title', 'coverImage', 'ingredient'],
  });

  return {
    props: {
      posts,
    },
  };
}

Baking.propTypes = propTypes;

export default Baking;
