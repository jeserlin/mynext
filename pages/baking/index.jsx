/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import LazyLoad from 'react-lazyload';
import { Box, Grid, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import SeoHeader from 'components/seoHeader';
import { getPostsByFolder } from 'lib/api';

const propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    coverImage: PropTypes.string,
  })),
};

const defaultProps = {
  posts: [],
};

const useStyles = makeStyles((theme) => ({
  post: {
    cursor: 'pointer',
    color: theme.palette.text.secondary,
    width: '100%',
    transitionDuration: '.3s',
    '&:hover': {
      boxShadow: theme.shadows[1],
    },
  },
  coverImg: {
    width: '25%',
    '& img': {
      borderRadius: theme.shape.borderRadius,
    },
  },
  postInfo: {
    width: '75%',
    marginLeft: theme.spacing(2),
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  postTitle: {
    ...theme.typography.subtitle1,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(4),
  },
  postDesc: {
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
}));

const Baking = ({ posts }) => {
  const classes = useStyles();

  return (
    <>
      <SeoHeader
        title="Baking"
        description="All about baking"
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
            <Link href={`/baking/${slug}`}>
              <a>
                <Box display="flex" className={classes.post}>
                  <Box className={classes.coverImg}>
                    {coverImage && (
                      <img
                        src={coverImage}
                        alt={title}
                        loading="lazy"
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
              </a>
            </Link>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export async function getStaticProps() {
  const posts = getPostsByFolder({
    folder: 'baking',
    fields: ['slug', 'title', 'coverImage', 'ingredient'],
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
