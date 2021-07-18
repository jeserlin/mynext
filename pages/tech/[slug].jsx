import React from 'react';
import PropTypes from 'prop-types';
import ErrorPage from 'next/error';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Grid, makeStyles } from '@material-ui/core';

import PostHeader from 'components/postHeader';
import PostContent from 'components/postContent';
import markdownToHtml from 'lib/markdownToHtml';
import { getPostBySlug, getPostsByFolder } from 'lib/api';

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
}));

const TechPost = ({ post }) => {
  const classes = useStyles();

  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <PostHeader title={post.title} />
      <Grid container className={classes.root}>
        <Grid item xs={12} md={8} className={classes.content}>
          <PostContent content={post.content} />
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
  const post = getPostBySlug('tech', params.slug, [
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
