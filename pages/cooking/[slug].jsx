/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import ErrorPage from 'next/error';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Box, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

import SeoHeader from 'components/seoHeader';
import GoBack from 'components/goBack';
import ScrollTop from 'components/scrollTop';
import PostHeader from 'components/postHeader';
import PostContent from 'components/postContent';
import markdownToHtml from 'lib/markdownToHtml';
import { getPostBySlug, getPostsByFolder } from 'lib/api';

const propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    content: PropTypes.string,
    coverImage: PropTypes.string,
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

const cookingMainPath = '/cooking';
const CookingPost = (props) => {
  const { post } = props;
  const classes = useStyles();

  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <SeoHeader
        title={`${post.title}`}
        description={post.desc}
      />
      <GoBack path={cookingMainPath} />
      <Box className={classes.root}>
        <PostHeader title={post.title} />
        <Grid container className={classes.contentBox}>
          <Grid item xs={12} md={8} className={classes.content}>
            <PostContent content={post.content} />
          </Grid>
          <Grid item xs={12} md={4} className={classes.image}>
            {post.coverImage && (
              <Image
                src={post.coverImage}
                layout="responsive"
                width="100"
                height="100"
              />
            )}
          </Grid>
        </Grid>
      </Box>
      <ScrollTop {...props} />
    </>
  );
};

export async function getStaticProps({ params }) {
  const post = getPostBySlug('cooking', params.slug, [
    'title',
    'desc',
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
