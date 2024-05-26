/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import LazyLoad from 'react-lazyload';
import { Box, Grid, Typography } from '@mui/material';

import SeoHeader from 'components/seoHeader';
import { getPostsByFolder } from 'lib/api';

const PREFIX = 'Cooking';

const classes = {
  post: `${PREFIX}-post`,
  coverImg: `${PREFIX}-coverImg`,
  postInfo: `${PREFIX}-postInfo`,
  postTitle: `${PREFIX}-postTitle`,
  postDesc: `${PREFIX}-postDesc`,
};

const Root = styled('div')((
  {
    theme,
  },
) => ({
  [`& .${classes.post}`]: {
    cursor: 'pointer',
    color: theme.palette.text.secondary,
    width: '100%',
    transitionDuration: '.3s',
    '&:hover': {
      boxShadow: theme.shadows[1],
    },
  },

  [`& .${classes.coverImg}`]: {
    width: '25%',
    '& > * > img': {
      borderRadius: theme.shape.borderRadius,
    },
  },

  [`& .${classes.postInfo}`]: {
    width: '75%',
    marginLeft: theme.spacing(2),
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  [`& .${classes.postTitle}`]: {
    ...theme.typography.subtitle1,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(4),
  },

  [`& .${classes.postDesc}`]: {
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
}));

const propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
  })),
};

const Cooking = ({ posts = [] }) => (
  (
    <Root>
      <SeoHeader
        title="Cooking"
        description="All about cooking"
      />
      <Grid container alignItems="stretch" spacing={6}>
        {posts.map(({
          slug, title, coverImage, ingredient,
        }) => (
          <Grid
            key={slug}
            item
            xs={12}
            md={6}
            component={LazyLoad}
            once
            height="100%"
            throttle={60}
            offset={60}
          >
            <Link href={`/cooking/${slug}`}>
              <Box display="flex" className={classes.post}>
                <Box className={classes.coverImg}>
                  {coverImage && (
                  <Image
                    alt="cover image"
                    src={coverImage}
                    width="100"
                    height="100"
                    sizes="100vw"
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                  )}
                </Box>
                <Box className={classes.postInfo}>
                  <Typography className={classes.postTitle}>{title}</Typography>
                  <Typography className={classes.postDesc}>
                    {`食材: ${ingredient.join(', ')}`}
                  </Typography>
                </Box>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Root>
  )
);

export async function getStaticProps() {
  const posts = getPostsByFolder({
    folder: 'cooking',
    fields: ['slug', 'title', 'labels', 'coverImage', 'ingredient'],
  });

  return {
    props: {
      posts,
    },
  };
}

Cooking.propTypes = propTypes;

export default Cooking;
