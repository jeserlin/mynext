/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Typography } from '@material-ui/core';

import { getPostsByFolder } from '../../lib/api';

const propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
  })),
};

const defaultProps = {
  posts: [],
};

const Baking = ({ posts }) => (
  <>
    {posts.map(({ slug, title }) => (
      <Typography key={slug} color="textSecondary">
        <Link href={`/baking/${slug}`}>
          <a>{title}</a>
        </Link>
      </Typography>
    ))}
  </>
);

export async function getStaticProps() {
  const posts = getPostsByFolder({
    folder: 'baking',
    fields: ['slug', 'title'],
  });

  return {
    props: {
      posts,
    },
  };
}

Baking.propTypes = propTypes;
Baking.defaultProps = defaultProps;

export default Baking;
