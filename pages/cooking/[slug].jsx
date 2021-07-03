import React from 'react';
import PropTypes from 'prop-types';
import ErrorPage from 'next/error';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Grid, Typography, makeStyles } from '@material-ui/core';

import markdownToHtml from '../../lib/markdownToHtml';
import { getPostBySlug, getPostsByFolder } from '../../lib/api';

const propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    coverImage: PropTypes.string,
  }),
};

const defaultProps = {
  post: {},
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  content: {
    order: 2,
    [theme.breakpoints.up('md')]: {
      order: 1,
    },
  },
  image: {
    order: 1,
    [theme.breakpoints.up('md')]: {
      order: 2,
    },
    '& > * > img': {
      borderRadius: theme.spacing(4),
    },
  },
  markdown: {
    '& > h3': {
      ...theme.typography.h3,
      color: theme.palette.primary.dark,
    },
    '& > h4': {
      ...theme.typography.h4,
      color: theme.palette.secondary.dark,
    },
    '& > ul,li,ol': {
      ...theme.typography.body1,
      color: theme.palette.text.secondary,
      paddingBottom: theme.spacing(1.5),
    },
  },
}));

const CookingPost = ({ post }) => {
  const classes = useStyles();

  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Typography
        variant="h1"
        color="textSecondary"
        className={classes.title}
      >
        {post.title}
      </Typography>
      <Grid container className={classes.root}>
        <Grid item xs={12} md={8} className={classes.content}>
          <div
            className={classes.markdown}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Grid>
        <Grid item xs={12} md={4} className={classes.image}>
          {post.coverImage
            ? (
              <Image
                src={post.coverImage}
                layout="responsive"
                width="100"
                height="100"
              />
            )
            : ''}
        </Grid>
      </Grid>
    </>
  );
};

export async function getStaticProps({ params }) {
  const post = getPostBySlug('cooking', params.slug, [
    'title',
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
CookingPost.defaultProps = defaultProps;

export default CookingPost;
