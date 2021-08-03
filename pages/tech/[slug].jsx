import React from 'react';
import PropTypes from 'prop-types';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import {
  Box, Grid, Typography, makeStyles,
} from '@material-ui/core';

import GoBack from 'components/goBack';
import PostHeader from 'components/postHeader';
import PostContent from 'components/postContent';
import markdownToHtml from 'lib/markdownToHtml';
import { getPostBySlug, getPostsByFolder } from 'lib/api';
import { formatDate } from 'lib/convertors';

const propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
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

const techMainPath = '/tech';

const TechPost = ({ post }) => {
  const classes = useStyles();

  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <GoBack path={techMainPath} />
      <Box className={classes.root}>
        <PostHeader title={post.title} />
        <Typography
          variant="caption"
          color="textSecondary"
          gutterBottom
        >
          {`更新時間: ${formatDate(post.date)}`}
        </Typography>
        <Grid container className={classes.contentBox}>
          <Grid item xs={12} md={8} className={classes.content}>
            <PostContent content={post.content} />
          </Grid>
        </Grid>
      </Box>
    </>
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
