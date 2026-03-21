import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import { getPostsByFolder } from 'lib/api';

import SeoHeader from 'components/seoHeader';
import { formatDate } from 'lib/convertors';

const propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    coverImage: PropTypes.string,
  })),
};

const Tech = ({ posts = [] }) => (
  <div>
    <SeoHeader
      title="Tech"
      description="All about tech"
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map(({
        slug, title, coverImage, desc, date,
      }) => (
        <Link key={slug} href={`/tech/${slug}`}>
          <div className="flex w-full cursor-pointer">
            <div className="w-1/4">
              {coverImage && (
                <Image
                  alt="cover image"
                  src={coverImage}
                  width="100"
                  height="100"
                  sizes="100vw"
                  className="rounded-lg"
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                />
              )}
            </div>
            <div className="w-3/4 ml-4 p-4 rounded-lg bg-custom-light flex flex-col justify-between items-start transition-shadow duration-300 hover:shadow-lg">
              <div className="font-semibold text-text-primary mb-4">
                {title}
              </div>
              <div className="text-sm text-text-primary mb-2">
                {desc}
              </div>
              <div className="text-xs text-text-primary/60">
                {`更新時間: ${formatDate(date)}`}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export async function getStaticProps() {
  const posts = getPostsByFolder({
    folder: 'tech',
    fields: ['slug', 'title', 'coverImage', 'desc', 'date'],
  });

  const sortedPosts = _.sortBy(posts, ['date']).reverse();
  return {
    props: {
      posts: sortedPosts,
    },
  };
}

Tech.propTypes = propTypes;

export default Tech;
