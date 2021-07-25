import React from 'react';
import PropTypes from 'prop-types';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { Box, Grid, makeStyles } from '@material-ui/core';

import PostHeader from 'components/postHeader';
import PostContent from 'components/postContent';
import markdownToHtml from 'lib/markdownToHtml';
import { getPostBySlug, getPostsByFolder } from 'lib/api';

const propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
  }),
};

const defaultProps = {
  post: {},
};

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 10),
    },
  },
  contentBox: {
    width: '100%',
  },
  content: {
    order: 2,
    [theme.breakpoints.up('md')]: {
      order: 1,
    },
  },
}));

const TechPost = ({ post }) => {
  const classes = useStyles();

  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Box className={classes.root}>
      <PostHeader title={post.title} />
      <Grid container className={classes.contentBox}>
        <Grid item xs={12} md={8} className={classes.content}>
          <PostContent content={post.content} />
        </Grid>
      </Grid>
    </Box>
  );
};

export async function getStaticProps({ params }) {
  const post = getPostBySlug('tech', params.slug, [
    'title',
    'date',
    'slug',
    'content',
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
    folder: 'tech',
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

TechPost.propTypes = propTypes;
TechPost.defaultProps = defaultProps;

export default TechPost;
