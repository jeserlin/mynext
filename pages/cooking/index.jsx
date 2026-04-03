import React, { useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import SeoHeader from 'components/seoHeader';
import { getPostsByFolder } from 'lib/api';

const All = 'All';

const propTypes = {
  labelList: PropTypes.arrayOf(PropTypes.string),
  posts: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    coverImage: PropTypes.string,
    ingredient: PropTypes.arrayOf(PropTypes.string),
    labels: PropTypes.arrayOf(PropTypes.string),
  })),
};

const Cooking = ({ labelList = [], posts = [] }) => {
  const [selectedLabel, setSelectedLabel] = useState(All);
  const [loadedImgs, setLoadedImgs] = useState({});

  const handleImageLoad = (coverImage) => {
    setLoadedImgs((prev) => ({ ...prev, [coverImage]: true }));
  };

  const onClickChip = (label) => {
    setSelectedLabel(label);
  };

  const filteredPosts = () => {
    if (selectedLabel === All) {
      return posts;
    }
    return _.filter(posts, ({ labels }) => labels?.includes(selectedLabel));
  };

  return (
    <div>
      <SeoHeader
        title="Cooking"
        description="All about cooking"
      />
      <div className="flex flex-row gap-2 mb-6">
        {labelList.map((label) => (
          <button
            key={label}
            type="button"
            className={`btn btn-sm btn-secondary rounded-lg hover:!text-white ${
              selectedLabel === label
                ? 'text-white'
                : 'btn-outline'
            }`}
            onClick={() => onClickChip(label)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts().map(({
          slug, title, coverImage, ingredient,
        }) => (
          <Link key={slug} href={`/cooking/${slug}`}>
            <div className="flex w-full cursor-pointer">
              <div className="w-1/4 flex-shrink-0">
                {coverImage && (
                  <div className="relative aspect-square">
                    {!loadedImgs[coverImage] && (
                      <div className="absolute inset-0 skeleton rounded-lg" />
                    )}
                    <LazyLoadImage
                      className={`rounded-lg w-full h-full object-cover ${!loadedImgs[coverImage] ? 'invisible' : ''}`}
                      src={coverImage}
                      alt={title}
                      onLoad={() => handleImageLoad(coverImage)}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start  w-3/4 ml-4 p-4 rounded-lg bg-custom-light transition-shadow duration-300 hover:shadow-lg">
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
    folder: 'cooking',
    fields: ['slug', 'title', 'labels', 'coverImage', 'ingredient'],
  });

  const labelList = _.chain(posts)
    .reduce((acc, { labels }) => {
      acc.push(...labels);
      return acc;
    }, [])
    .uniq()
    .partition((label) => label.toLowerCase() !== 'others')
    .thru(([nonOthers, others]) => [All, ..._.sortBy(nonOthers), ...others])
    .value();

  return {
    props: {
      labelList,
      posts,
    },
  };
}

Cooking.propTypes = propTypes;

export default Cooking;
