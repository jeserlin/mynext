import React from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';
import { Box, Grid, Typography } from '@mui/material';
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
  postTitle: {
    ...theme.typography.subtitle1,
    color: theme.palette.primary.dark,
    marginBottom: theme.spacing(1),
  },
  author: {
    ...theme.typography.body2,
    color: theme.palette.primary.dark,
  },
  img: {
    width: 'auto',
    maxHeight: '200px',
  },
}));

const Books = ({ posts }) => {
  const classes = useStyles();
  return (
    <>
      <SeoHeader
        title="Books"
        description="All about books"
      />
      <Grid container alignItems="stretch" spacing={6}>
        {posts.map(({
          slug, coverImage, title, author,
        }) => (
          <Grid
            key={slug}
            item
            xs={6}
            md={4}
            lg={2}
            component={LazyLoad}
            once
            height="100%"
            throttle={60}
            offset={60}
          >
            <>
              <Box mb={2}>
                {coverImage && (
                  <img
                    src={`${coverImage}?w=164&h=164&fit=crop&auto=format`}
                    alt={title}
                    loading="lazy"
                    className={classes.img}
                  />
                )}
              </Box>
              <Typography className={classes.postTitle}>{title}</Typography>
              <Typography className={classes.author}>{author}</Typography>
            </>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export async function getStaticProps() {
  const posts = getPostsByFolder({
    folder: 'books',
    fields: ['slug', 'title', 'coverImage', 'author'],
  });

  return {
    props: {
      posts,
    },
  };
}

Books.propTypes = propTypes;
Books.defaultProps = defaultProps;

export default Books;
