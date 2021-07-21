/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import {
  Box, Grid, Typography, fade, makeStyles,
} from '@material-ui/core';

import { getPostsByFolder } from 'lib/api';

const propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    excerpt: PropTypes.string,
    coverImage: PropTypes.string,
  })),
};

const defaultProps = {
  posts: [],
};

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 10),
    },
  },
  post: {
    cursor: 'pointer',
    height: '100%',
    backgroundColor: fade(theme.palette.primary.main, 0.3),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(10),
      transition: 'padding .3s linear',
      '&:hover': {
        padding: theme.spacing(8),
      },
    },
  },
  postImage: {
    borderRadius: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      borderRadius: 0,
    },
  },
  postTitle: {
    cursor: 'pointer',
    width: 'calc(100% - 80px)',
    textAlign: 'center',
    margin: theme.spacing(0, 5),
    padding: theme.spacing(2),
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.dark,
  },
}));

const Baking = ({ posts }) => {
  const classes = useStyles();

  return (
    <>
      <Grid container spacing={10} className={classes.root}>
        {posts.map(({ slug, title, coverImage }) => (
          <Grid
            key={slug}
            item
            xs={12}
            md={6}
            lg={4}
            component={Box}
            position="relative"
          >
            <Link href={`/baking/${slug}`}>
              <a>
                <Box className={classes.post}>
                  {coverImage
                    ? (
                      <Image
                        src={coverImage}
                        layout="responsive"
                        width="100"
                        height="100"
                        className={classes.postImage}
                      />
                    )
                    : ''}
                </Box>
                <Box
                  position="absolute"
                  bottom={1}
                  className={classes.postTitle}
                >
                  <Typography>
                    {title}
                  </Typography>
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
    fields: ['slug', 'title', 'excerpt', 'coverImage'],
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
