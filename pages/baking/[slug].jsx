/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-danger */
import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { Box, Grid } from '@mui/material';

import SeoHeader from 'components/seoHeader';
import GoBack from 'components/goBack';
import ScrollTop from 'components/scrollTop';
import PostHeader from 'components/postHeader';
import PostContent from 'components/postContent';
import markdownToHtml from 'lib/markdownToHtml';
import { getPostBySlug, getPostsByFolder } from 'lib/api';

const PREFIX = 'BakingPost';

const classes = {
  root: `${PREFIX}-root`,
  contentBox: `${PREFIX}-contentBox`,
  content: `${PREFIX}-content`,
  image: `${PREFIX}-image`,
};

const Root = styled('div')((
  {
    theme,
  },
) => ({
  [`& .${classes.root}`]: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 10),
    },
  },

  [`& .${classes.contentBox}`]: {
    width: '100%',
  },

  [`& .${classes.content}`]: {
    order: 2,
    [theme.breakpoints.up('md')]: {
      order: 1,
    },
  },

  [`& .${classes.image}`]: {
    order: 1,
    [theme.breakpoints.up('md')]: {
      order: 2,
    },
    '& img': {
      borderRadius: theme.spacing(4),
    },
  },
}));

const propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    content: PropTypes.string,
    coverImage: PropTypes.string,
  }),
};

const bakingMainPath = '/baking';
const BakingPost = (props) => {
  const { post = {} } = props;

  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    (
      <Root>
        <SeoHeader
          title={`${post.title}`}
          description={post.desc}
        />
        <GoBack path={bakingMainPath} />
        <Box className={classes.root}>
          <PostHeader title={post.title} />
          <Grid container className={classes.contentBox}>
            <Grid item xs={12} sm={8} md={9} className={classes.content}>
              <PostContent content={post.content} />
            </Grid>
            <Grid item xs={12} sm={4} md={3} className={classes.image}>
              {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                loading="lazy"
              />
              )}
            </Grid>
          </Grid>
        </Box>
        <ScrollTop {...props} />
      </Root>
    )
  );
};

export async function getStaticProps({ params }) {
  const post = getPostBySlug('baking', params.slug, [
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
    folder: 'baking',
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

BakingPost.propTypes = propTypes;

export default BakingPost;
